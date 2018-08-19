import compact from 'lodash.compact';

const TYPE_IMG = 'image';
const TYPE_TEXT = 'text';

/**
 * Create a promise and resolve when image is loaded
 * @param {HTMLImageElement} img
 * @return {Promise<HTMLImageElement>} Loaded image element
 */
async function createImageLoadPromise(img) {
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => {
      resolve(img);
    });

    img.addEventListener('error', () => {
      reject(img);
    });
  });
}

/**
 * @param {string} src
 * @return {HTMLImageElement} Loaded image element
 */
function createImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

function getMapTileUrl(x, y) {
  return 'http://pathadvisor.ust.hk/map_pixel.php?x=2000&y=1000&floor=G&level=2&lineString=';
}

class CanvasHandler {
  layers = {
    mapTiles: { id: 'mapTiles', hidden: false },
    mapItems: { id: 'mapItems', hidden: false },
  };

  // left to right rendering
  layerIds = ['mapTiles', 'mapItems'];

  /**
   * @typedef FontElement
   * @property {string} size
   * @property {string} family
   * @property {string} color
   * @property {string} text
   */
  /**
   * @typedef canvasItem
   * @property {string} id
   * @property {number} x
   * @property {number} y
   * @property {string} floor
   * @property {boolean} hidden
   * @property {string} type - oneOf ['text', 'image']
   * @property {HTMLImageElement|FontElement} data - data to render in canvas
   * @property {{}} others
   */

  mapTiles = {};

  mapTileIds = [];

  mapItems = {};

  mapItemIds = [];

  /** @type {number} - map coordinate x at top left concer of the canvas element */
  x = 0;

  /** @type {number} - map coordinate y at top left concer of the canvas element */
  y = 0;

  /** @type {string} - current floor displaying */
  floor = 'G';

  getCanvasItems(key) {
    switch (key) {
      case 'mapTiles':
        return this.mapTileIds.map(id => this.mapTiles[id]);
      case 'mapItems':
        return this.mapItemIds.map(id => this.mapItems[id]);
      default:
        return [];
    }
  }

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas, x = 0, y = 0, floor = 'G') {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas must be instance of HTMLCanvasElement');
    }
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.floor = floor;

    this.setUpDragAndDropListener();
  }

  setUpDragAndDropListener() {
    this.canvas.addEventListener('mousedown', e => {
      const { clientX: downX, clientY: downY } = e;
      const { x: prevX, y: prevY } = this;

      const mouseMoveListener = e => {
        const { clientX: currentX, clientY: currentY } = e;
        this.x = prevX + downX - currentX;
        this.y = prevY + downY - currentY;

        this.render();
      };

      const mouseUpListener = () => {
        this.canvas.removeEventListener('mousemove', mouseMoveListener);
        this.canvas.removeEventListener('mouseup', mouseUpListener);
      };

      this.canvas.addEventListener('mousemove', mouseMoveListener);
      this.canvas.addEventListener('mouseup', mouseUpListener);
    });
  }

  getWidth() {
    return this.canvas.width;
  }

  getHeight() {
    return this.canvas.height;
  }

  updateLayers(layers) {
    Object.keys(layers).forEach(layerId => {
      const { id, hidden } = layers[layerId];
      this.layers[layerId] = { id, hidden };
    });

    this.render();
  }

  updateMapTiles(mapTiles) {
    Object.keys(mapTiles).forEach(id => {
      this.mapTiles[id] = mapTiles[id];
    });

    this.render();
  }

  updateMapItems(mapItems) {
    Object.keys(mapItems).forEach(id => {
      this.mapItems[id] = mapItems[id];
    });

    this.render();
  }

  /**
   * @param {canvasItem[]} mapTiles
   */
  async addMapTiles(mapTiles) {
    const asyncMapTiles = [];

    mapTiles.forEach(({ id, floor, x, y, hidden = false }) => {
      if (!id) {
        throw new Error('id is required for canvas item');
      }
      const data = createImage(getMapTileUrl(x, y));
      this.mapTiles[id] = { id, floor, x, y, type: TYPE_IMG, hidden, data, others: {} };
      this.mapTileIds.push(id);

      asyncMapTiles.push(
        createImageLoadPromise(data)
          .then(() => {
            this.render();
          })
          .catch(err => {
            console.log(err);
          }),
      );
    });

    await Promise.all(asyncMapTiles);
    return mapTiles;
  }

  /**
   * @param {canvasItem[]} mapItems
   */
  async addMapItems(mapItems) {
    const asyncMapItems = [];

    mapItems.forEach(({ id, floor, x, y, type, data, others = {}, hidden = false }) => {
      if (!id) {
        throw new Error('id is required for canvas item');
      }
      // data is ready to be rendered
      const imgLoaded = data.complete && data.naturalWidth && data.naturalHeight;

      if (data instanceof HTMLImageElement && !imgLoaded) {
        // wait for img data to load completely before rendering
        asyncMapItems.push(
          createImageLoadPromise(data)
            .then(() => {
              this.render();
            })
            .catch(err => {
              console.log(err);
            }),
        );
      }

      this.mapItems[id] = { id, floor, x, y, type, data, others, hidden };
      this.mapItemIds.push(id);
    });

    // render all sync map items first
    this.render();

    // only resolve if every async map items are loaded, to let the caller know the op is done.
    await Promise.all(asyncMapItems);

    return mapItems;
  }

  init() {
    // this.refresh =
    //   window.requestAnimationFrame ||
    //   window.webkitRequestAnimationFrame ||
    //   window.mozRequestAnimationFrame ||
    //   (callback => {
    //     window.setTimeout(callback, 1000 / 60);
    //   });
    // this.refresh(this.render);
  }

  render = () => {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.getWidth(), this.getHeight());

    this.layerIds.forEach(key => {
      if (this.layers[key].hidden) {
        return;
      }
      // Render each canvas items in this layer
      this.getCanvasItems(key).forEach(({ floor, x, y, type, data, hidden }) => {
        if (hidden || floor !== this.floor) {
          return;
        }

        switch (type) {
          case TYPE_IMG:
            ctx.drawImage(data, x - this.x, y - this.y);
            break;
          case TYPE_TEXT: {
            const { size, color, family, text } = data;
            ctx.fillStyle = color;
            ctx.font = `${size} ${family}`;
            ctx.fillText(text, x - this.x, y - this.y);
            break;
          }
          default:
        }
      });
    });
  };
}

export default CanvasHandler;
/**
 *
img = new Image();
canvasHandler.addMapItems([
  {
    id: 1,
    floor: 'G',
    x: 10,
    y: 20,
    type: 'text',
    data: { size: '12 px', family: 'Verdana', color: 'red', text: 'Hello world' },
  },
  {
    id: 2,
    floor: 'G',
    x: 30,
    y: 40,
    type: 'image',
    data: img
  }
]);

img.src='http://pathadvisor.ust.hk/img/express.png';

canvasHandler.addMapTiles([{ id: 3, floor:'G', x: 10, y :200}])

 */
/**
 * var text_width = ctx.measureText("some text").width;
I used line height for text_height.


 */
