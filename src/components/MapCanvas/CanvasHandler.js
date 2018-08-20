import calculateTextDimension from './calculateTextDimension';
/**
 * @typedef TextElement
 * @property {string} size
 * @property {string} family
 * @property {string} color
 * @property {string} text
 */
/**
 * @typedef CanvasItem
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {?number} width
 * @property {?number} height
 * @property {string} floor
 * @property {boolean} hidden
 * @property {HTMLImageElement} [image]
 * @property {TextElement} [textElement]
 * @property {Object} others - additional data for plugins to attach
 */

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

/**
 * Test a point inside a rect or not
 * @param {number} x - point coordinate x
 * @param {number} y - point coordinate y
 * @param {CanvasItem} canvasItem
 * @return {boolean}
 */
function hitTest(x, y, canvasItem) {
  const { width, height, x: itemX, y: itemY } = canvasItem;

  const xInRange = x >= itemX && x <= itemX + width;
  const yInRange = y >= itemY && y <= itemY + height;

  return xInRange && yInRange;
}

class CanvasHandler {
  layers = {
    mapTiles: { id: 'mapTiles', hidden: false },
    mapItems: { id: 'mapItems', hidden: false },
  };

  // left to right rendering
  layerIds = ['mapTiles', 'mapItems'];

  /** @type {Object.<string, CanvasItem>} - map tiles dict */
  mapTiles = {};

  mapTileIds = [];

  /** @type {Object.<string, CanvasItem>} - map items dict */
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
    this.setUpClickListener();
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

  setUpClickListener() {
    this.canvas.addEventListener('click', e => {
      const { clientX, clientY } = e;
      const canvasCoordinate = this.canvas.getBoundingClientRect();
      const x = clientX - canvasCoordinate.left + this.x;
      const y = clientY - canvasCoordinate.top + this.y;

      this.mapItemIds.forEach(id => {
        if (hitTest(x, y, this.mapItems[id])) {
          console.log('Hit', id, this.mapItems[id]);
        }
      });
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
   * @param {CanvasItem[]} mapTiles
   */
  async addMapTiles(mapTiles) {
    const asyncMapTiles = [];

    mapTiles.forEach(({ id, floor, x, y, width = null, height = null, hidden = false }) => {
      if (!id) {
        throw new Error('id is required for canvas item');
      }
      const image = createImage(getMapTileUrl(x, y));
      this.mapTiles[id] = {
        id,
        floor,
        x,
        y,
        width,
        height,
        hidden,
        image,
        others: {},
      };
      this.mapTileIds.push(id);

      asyncMapTiles.push(
        createImageLoadPromise(image)
          .then(() => {
            this.render();
            this.mapTiles[id].width = image.width;
            this.mapTiles[id].height = image.height;
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
   * @param {CanvasItem[]} mapItems
   */
  async addMapItems(mapItems) {
    const asyncMapItems = [];

    mapItems.forEach(
      ({
        id,
        floor,
        x,
        y,
        width = null,
        height = null,
        image = null,
        textElement = null,
        others = {},
        hidden = false,
      }) => {
        if (!id) {
          throw new Error('id is required for canvas item');
        }

        this.mapItems[id] = { id, floor, x, y, width, height, image, textElement, others, hidden };
        this.mapItemIds.push(id);

        // async work after adding items

        // function instead of expression to avoid access of property of a null obj, image can be null
        const imageLoaded = () => image.complete && image.naturalWidth && image.naturalHeight;

        // item is an image and image is load yet loaded
        if (image && !imageLoaded()) {
          // wait for img data to load completely before rendering
          asyncMapItems.push(
            createImageLoadPromise(image)
              .then(() => {
                this.render();
                this.mapItems[id].width = image.width;
                this.mapItems[id].height = image.height;
              })
              .catch(err => {
                console.log(err);
              }),
          );
        }

        if (textElement) {
          const dimension = calculateTextDimension(textElement);
          this.mapItems[id].width = dimension.width;
          this.mapItems[id].height = dimension.height;
        }
      },
    );

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
      this.getCanvasItems(key).forEach(({ floor, x, y, image, textElement, hidden }) => {
        if (hidden || floor !== this.floor) {
          return;
        }

        switch (true) {
          case Boolean(image):
            ctx.drawImage(image, x - this.x, y - this.y);
            break;
          case Boolean(textElement): {
            const { size, color, family, text } = textElement;
            ctx.fillStyle = color;
            ctx.font = `${size} ${family}`;
            ctx.textBaseline = 'top';
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
