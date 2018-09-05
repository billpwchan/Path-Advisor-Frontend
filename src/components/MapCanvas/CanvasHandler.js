import get from 'lodash.get';
import calculateTextDimension from './calculateTextDimension';
/**
 * @typedef TextElement
 * @property {string} size
 * @property {string} family
 * @property {string} color
 * @property {string} text
 */
/**
 * @typedef CircleElement
 * @property {number} radius
 * @property {string} color
 * @property {string} borderColor
 */
/**
 * @typedef CanvasItem
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {?number} [width]
 * @property {?number} [height]
 * @property {string} floor
 * @property {boolean} [hidden]
 * @property {HTMLImageElement} [image]
 * @property {TextElement} [textElement]
 * @property {mapItemListener} [onClick]
 * @property {CircleElement} [circle]
 * @property {Object} [others] - additional data for plugins to attach
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

function imageNotLoaded(image) {
  return (
    image instanceof HTMLImageElement &&
    !(image.complete && image.naturalWidth && image.naturalHeight)
  );
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
  floor = null;

  /** @type {number} - current scale  */
  scale = 1;

  /** @type {function[]} - Custom mouse move listeners */
  mouseMoveListeners = [];

  /** @type {function[]} - Custom mouse up listeners */
  mouseUpListeners = [];

  /** @type {function[]} - map position changed listeners */
  positionChangeListeners = [];

  /** @type {Object.<string, function[]>} - map items click listeners grouped by id */
  mapItemsClickListeners = {};

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

  constructor(x, y, width, height, floor, scale) {
    this.canvas = document.createElement('canvas');
    this.updateDimenision(width, height);
    this.updatePosition(x, y, floor, scale);
    this.setUpDragAndDropListener();
    this.setUpClickListener();
  }

  updateDimenision(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }

  updatePosition(x, y, floor = this.floor, scale = this.scale) {
    console.log('Update position called', x, y);
    if (this.x === x && this.y === y && this.floor === floor && this.scale === scale) {
      console.log('no op');
      return;
    }

    this.x = x;
    this.y = y;
    this.floor = floor;
    this.scale = scale;

    this.render();

    this.positionChangeListeners.forEach(listener => {
      listener(this.getListenerParamObject());
    });
  }

  /**
   * @typedef CanvasEvent
   * @property {number} x
   * @property {number} y
   * @property {number} endX
   * @property {number} endY
   * @property {number} scale
   * @property {number} width
   * @property {number} height
   * @property {number} floor
   */

  /**
   * @callback canvasListener
   * @param {CanvasEvent} event
   */

  /**
   * @callback mapItemListener
   * @param {CanvasItem} event
   */

  /**
   * add user defined mousemove listeners
   * @param {canvasListener} listener
   */
  addMouseMoveListener(listener) {
    this.mouseMoveListeners.push(listener);
  }

  /**
   * remove a user defined mousemove listeners
   * @param {function} listener
   * @return {boolean} True is removed otherwise false
   */
  removeMouseMoveListener(listener) {
    const listenerIndex = this.mouseMoveListeners.indexOf(listener);
    if (listenerIndex !== -1) {
      this.mouseMoveListeners.splice(listenerIndex, 1);
    }

    return listenerIndex !== -1;
  }

  /**
   * add user defined mouseup listeners
   * @param {canvasListener} listener
   */
  addMouseUpListener(listener) {
    this.mouseUpListeners.push(listener);
  }

  /**
   * remove a user defined mouseup listeners
   * @param {function} listener
   * @return {boolean} True is removed otherwise false
   */
  removeMouseUpListener(listener) {
    const listenerIndex = this.mouseUpListeners.indexOf(listener);
    if (listenerIndex !== -1) {
      this.mouseUpListeners.splice(listenerIndex, 1);
    }

    return listenerIndex !== -1;
  }

  /**
   * add user defined position change listeners
   * @param {canvasListener} listener
   */
  addPositionChangeListener(listener) {
    this.positionChangeListeners.push(listener);
  }

  /**
   * remove a user defined position change listener
   * @param {function} listener
   * @return {boolean} True is removed otherwise false
   */
  removePositionChangeListener(listener) {
    const listenerIndex = this.positionChangeListeners.indexOf(listener);
    if (listenerIndex !== -1) {
      this.positionChangeListeners.splice(listenerIndex, 1);
    }

    return listenerIndex !== -1;
  }

  /**
   * add map item click listener
   * @param {string} mapItemId
   * @param {mapItemListener} listener
   */
  addMapItemClickListener(mapItemId, listener) {
    if (!this.mapItemsClickListeners[mapItemId]) {
      this.mapItemsClickListeners[mapItemId] = [];
    }

    this.mapItemsClickListeners[mapItemId].push(listener);
  }

  /**
   * remove map item click listener
   * @param {string} mapItemId
   * @param {function} listener
   * @return {boolean} True is removed otherwise false
   */
  removeMapItemClickListener(mapItemId, listener) {
    const mapItemsClickListener = get(this.mapItemsClickListeners, mapItemId, []);
    const listenerIndex = mapItemsClickListener.indexOf(listener);
    if (listenerIndex !== -1) {
      mapItemsClickListener.splice(listenerIndex, 1);
    }

    return listenerIndex !== -1;
  }

  getListenerParamObject() {
    return {
      x: this.x,
      y: this.y,
      scale: this.scale,
      width: this.getWidth(),
      height: this.getHeight(),
      floor: this.floor,
      endX: this.x + this.getWidth(),
      endY: this.y + this.getHeight(),
    };
  }

  setUpDragAndDropListener() {
    document.addEventListener('mousedown', e => {
      const { clientX: downX, clientY: downY, target } = e;

      if (target !== this.getCanvas()) {
        return;
      }

      const { x: prevX, y: prevY } = this;

      const mouseMoveListener = e => {
        const { clientX: currentX, clientY: currentY } = e;
        const newX = prevX + downX - currentX;
        const newY = prevY + downY - currentY;
        this.updatePosition(newX, newY);

        this.mouseMoveListeners.forEach(listener => {
          listener(this.getListenerParamObject());
        });
      };

      const mouseUpListener = () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
        this.mouseUpListeners.forEach(listener => {
          listener(this.getListenerParamObject());
        });
      };

      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);
    });
  }

  setUpClickListener() {
    this.getCanvas().addEventListener('click', e => {
      const { clientX, clientY } = e;
      const canvasCoordinate = this.canvas.getBoundingClientRect();
      const x = clientX - canvasCoordinate.left + this.x;
      const y = clientY - canvasCoordinate.top + this.y;

      this.mapItemIds.forEach(id => {
        if (hitTest(x, y, this.mapItems[id])) {
          console.log('Hit', id, this.mapItems[id]);

          get(this.mapItemsClickListeners, id, []).forEach(listener => {
            listener({ ...this.mapItems[id] });
          });
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

    mapTiles.forEach(({ id, floor, x, y, image, width = null, height = null, hidden = false }) => {
      if (!id) {
        throw new Error('id is required for canvas item');
      } else if (this.mapTiles[id]) {
        return;
      }

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

      if (imageNotLoaded(image)) {
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
      }
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
        circle = null,
        others = {},
        hidden = false,
        onClick = null,
      }) => {
        if (!id) {
          throw new Error('id is required for canvas item');
        } else if (this.mapItems[id]) {
          return;
        }

        this.mapItems[id] = {
          id,
          floor,
          x,
          y,
          width,
          height,
          image,
          textElement,
          circle,
          others,
          hidden,
        };
        this.mapItemIds.push(id);

        if (onClick) {
          this.addMapItemClickListener(id, onClick);
        }
        // async work after adding items

        if (imageNotLoaded(image)) {
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

  render = () => {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.getWidth(), this.getHeight());

    this.layerIds.forEach(key => {
      if (this.layers[key].hidden) {
        return;
      }
      // Render each canvas items in this layer
      this.getCanvasItems(key).forEach(
        ({ floor, x, y, image, textElement, hidden, width, height, circle }) => {
          if (hidden || floor !== this.floor) {
            return;
          }

          if (circle) {
            const { radius, color, borderColor } = circle;
            ctx.beginPath();
            ctx.arc(x - this.x, y - this.y, radius, 0, Math.PI * 2);
            if (color) {
              ctx.fillStyle = color;
              ctx.fill();
            }

            if (borderColor) {
              ctx.strokeStyle = borderColor;
              ctx.stroke();
            }
          }

          if (image) {
            ctx.drawImage(image, x - this.x, y - this.y);
          }

          if (textElement) {
            const { size, color, family, text } = textElement;
            ctx.fillStyle = color;
            ctx.font = `${size} ${family}`;
            ctx.textBaseline = 'top';
            ctx.fillText(text, x - width / 2 - this.x, y - height / 2 - this.y);
          }
        },
      );
    });
  };

  /**
   * @return {HTMLCanvasElement}
   */
  getCanvas() {
    return this.canvas;
  }

  /**
   * Helper function to export these to pass via props to react component
   */
  getProps() {
    return {
      addMouseMoveListener: (...args) => this.addMouseMoveListener(...args),
      removeMouseMoveListener: (...args) => this.removeMouseMoveListener(...args),
      addMouseUpListener: (...args) => this.addMouseUpListener(...args),
      removeMouseUpListener: (...args) => this.removeMouseUpListener(...args),
      addPositionChangeListener: (...args) => this.addPositionChangeListener(...args),
      removePositionChangeListener: (...args) => this.removePositionChangeListener(...args),
      width: () => this.getWidth(),
      height: () => this.getHeight(),
      scale: () => this.scale,
      addMapTiles: (...args) => this.addMapTiles(...args),
      addMapItems: (...args) => this.addMapItems(...args),
      updateMapTiles: (...args) => this.updateMapTiles(...args),
      updateMapItems: (...args) => this.updateMapItems(...args),
      updateLayers: (...args) => this.updateLayers(...args),
      updatePosition: (...args) => this.updatePosition(...args),
      updateDimenision: (...args) => this.updateDimenision(...args),
      addMapItemClickListener: (...args) => this.addMapItemClickListener(...args),
      removeMapItemClickListener: (...args) => this.removeMapItemClickListener(...args),
    };
  }
}

export default CanvasHandler;
