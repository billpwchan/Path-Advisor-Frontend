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
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  layers = [{ key: 'mapTiles', hidden: false }, { key: 'mapItems', hidden: false }];

  /**
   * @typedef FontElement
   * @property {string} size
   * @property {string} family
   * @property {string} color
   * @property {string} text
   */
  /**
   * @typedef canvasItem
   * @property {number} x
   * @property {number} y
   * @property {string} floor
   * @property {boolean} hidden
   * @property {string} type - oneOf ['text', 'image']
   * @property {HTMLImageElement|FontElement} data - data to render in canvas
   * @property {{}} others
   */
  /** @type {canvasItem[]} */
  mapTiles = [];

  /** @type {canvasItem[]} */
  mapItems = [];

  /** @type {number} - map coordinate x at top left concer of the canvas element */
  x = 0;

  /** @type {number} - map coordinate y at top left concer of the canvas element */
  y = 0;

  /** @type {string} - current floor displaying */
  floor = 'G';

  canvasItems = {
    mapTiles: this.mapTiles,
    mapItems: this.mapItems,
  };

  constructor(canvas, x = 0, y = 0, floor = 'G') {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas must be instance of HTMLCanvasElement');
    }
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.floor = floor;
  }

  getWidth() {
    return this.canvas.width;
  }

  getHeight() {
    return this.canvas.height;
  }

  /**
   * @param {canvasItem[]} mapTiles
   */
  async addMapTiles(mapTiles) {
    const asyncMapTiles = [];

    mapTiles.forEach(({ floor, x, y, hidden = false }) => {
      const data = createImage(getMapTileUrl(x, y));
      this.mapTiles.push({ floor, x, y, type: TYPE_IMG, hidden, data, others: {} });

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

    mapItems.forEach(({ floor, x, y, type, data, others = {}, hidden = false }) => {
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

      this.mapItems.push({ floor, x, y, type, data, others, hidden });
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

    this.layers.forEach(({ key, hidden: layerHidden }) => {
      if (layerHidden) {
        return;
      }
      // Render each canvas items in this layer
      this.canvasItems[key].forEach(({ floor, x, y, type, data, others, hidden }) => {
        if (hidden || floor !== this.floor) {
          return;
        }

        switch (type) {
          case TYPE_IMG:
            ctx.drawImage(data, x, y);
            break;
          case TYPE_TEXT: {
            const { size, color, family, text } = data;
            ctx.fillStyle = color;
            ctx.font = `${size} ${family}`;
            ctx.fillText(text, x, y);
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
    floor: 'G',
    x: 10,
    y: 20,
    type: 'text',
    data: { size: '12 px', family: 'Verdana', color: 'red', text: 'Hello world' },
  },
  {
    floor: 'G',
    x: 30,
    y: 40,
    type: 'image',
    data: img
  }
]);

img.src='http://pathadvisor.ust.hk/img/express.png';

 */
/**
 * var text_width = ctx.measureText("some text").width;
I used line height for text_height.


 */
