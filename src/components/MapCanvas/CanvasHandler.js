import get from 'lodash.get';
import calculateTextDimension from './calculateTextDimension';
/**
 * @typedef TextElement
 * @property {string} size
 * @property {string} family
 * @property {string} color
 * @property {string} text
 * @property {number} maxLineWidth
 * @property {number} lineHeight
 * @property {array} lines
 */
/**
 * @typedef Circle
 * @property {number} radius
 * @property {string} color
 * @property {string} borderColor
 */
/**
 * @typedef Line
 * @property {array} coordinates
 * @property {string} color
 * @property {string} cap
 * @property {number} width
 */
/**
 * @typedef CanvasItem
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {number} renderedX
 * @property {number} renderedY
 * @property {?number} [width]
 * @property {?number} [height]
 * @property {string} floor
 * @property {boolean} [center]
 * @property {boolean} [hidden]
 * @property {HTMLImageElement} [image]
 * @property {TextElement} [textElement]
 * @property {Line} [line]
 * @property {mapItemListener} [onClick]
 * @property {mapItemListener} [onMouseOver]
 * @property {mapItemListener} [onMouseOut]
 * @property {Circle} [circle]
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
  const { width, height, renderedX: itemX, renderedY: itemY } = canvasItem;

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

  /** @type {Object.<string, Boolean>} - map items currently in mouse over event */
  mapItemsMouseOvering = {};

  /** @type {number} - map coordinate x at top left concer of the canvas element */
  x = 0;

  /** @type {number} - map coordinate y at top left concer of the canvas element */
  y = 0;

  /** @type {string} - current floor displaying */
  floor = null;

  /** @type {number} - current scale  */
  scale = 1;

  /** @type {function[]} - canvas mouse move listeners */
  mouseMoveListeners = [];

  /** @type {function[]} - canvas mouse up listeners */
  mouseUpListeners = [];

  /** @type {function[]} - canvas position changed listeners */
  positionChangeListeners = [];

  /** @typedef {Object.<string, mapItemListener[]>} listenerGroup */
  /** @type {Object.<string, listenerGroup>} - map items listeners grouped by id */
  mapItemListeners = {
    click: {},
    mouseover: {},
    mouseout: {},
  };

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
    ['click', 'mousemove'].forEach(event => this.setUpListener(event));
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
   * add map item listener
   * @param {string} event
   * @param {string} mapItemId
   * @param {mapItemListener} listener
   */
  addMapItemListener(event, mapItemId, listener) {
    if (!Object.keys(this.mapItemListeners).includes(event)) {
      throw new Error(`Event ${event} not supported`);
    }

    const listenersById = this.mapItemListeners[event];

    if (!listenersById[mapItemId]) {
      listenersById[mapItemId] = [];
    }

    listenersById[mapItemId].push(listener);
  }

  /**
   * remove map item click listener
   * @param {string} event
   * @param {string} mapItemId
   * @param {mapItemListener} listener
   * @return {boolean} True is removed otherwise false
   */
  removeMapItemListener(event, mapItemId, listener) {
    const mapItemListeners = this.mapItemListeners[event][mapItemId] || [];
    const listenerIndex = mapItemListeners.indexOf(listener);
    if (listenerIndex !== -1) {
      mapItemListeners.splice(listenerIndex, 1);
      return true;
    }
    return false;
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

      const mouseMoveListener = mouseDownEvent => {
        const { clientX: currentX, clientY: currentY } = mouseDownEvent;
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

  setUpListener(event) {
    this.getCanvas().addEventListener(event, e => {
      const { clientX, clientY } = e;
      const canvasCoordinate = this.canvas.getBoundingClientRect();
      const x = clientX - canvasCoordinate.left + this.x;
      const y = clientY - canvasCoordinate.top + this.y;

      this.mapItemIds.forEach(id => {
        let mapItemEvent;
        const itemHit = hitTest(x, y, this.mapItems[id]);

        switch (event) {
          case 'click':
            if (itemHit) mapItemEvent = event;
            break;
          case 'mousemove':
            if (itemHit && !this.mapItemsMouseOvering[id]) {
              mapItemEvent = 'mouseover';
              this.mapItemsMouseOvering[id] = true;
            } else if (!itemHit && this.mapItemsMouseOvering[id]) {
              mapItemEvent = 'mouseout';
              delete this.mapItemsMouseOvering[id];
            }
            break;
          default:
        }

        if (mapItemEvent) {
          console.log('mapItemEvent', mapItemEvent, id, this.mapItems[id]);
          (get(this.mapItemListeners[mapItemEvent], id) || []).forEach(listener => {
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
        renderedX: x,
        renderedY: y,
        width,
        height,
        hidden,
        image,
        others: {},
      };
      this.mapTileIds.push(id);

      this.mapTiles[id].width = image.width;
      this.mapTiles[id].height = image.height;

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
   * @param {string} mode - add or update map item
   */
  async setMapItems(mapItems) {
    const asyncMapItems = [];
    // use this set default value from existing map item, and therefore support updating a map item with partial information
    const getDefault = (id, prop, defaultValue) => get(this.mapItems[id], prop, defaultValue);

    mapItems.forEach(
      ({
        id,
        floor = getDefault(id, 'floor', null),
        x = getDefault(id, 'x', null),
        y = getDefault(id, 'y', null),
        width = getDefault(id, 'width', null),
        height = getDefault(id, 'height', null),
        image = getDefault(id, 'image', null),
        textElement = getDefault(id, 'textElement', null),
        circle = getDefault(id, 'circle', null),
        line = getDefault(id, 'line', null),
        others = getDefault(id, 'others', {}),
        center = getDefault(id, 'center', false),
        hidden = getDefault(id, 'hidden', false),
        onClick = getDefault(id, 'onClick', null),
        onMouseOver = getDefault(id, 'onMouseOver', null),
        onMouseOut = getDefault(id, 'onMouseOut', null),
      }) => {
        if (!id) {
          throw new Error('id is required for canvas item');
        } else if (!this.mapItems[id]) {
          this.mapItemIds.push(id);
        }

        this.mapItems[id] = {
          id,
          floor,
          x,
          y,
          renderedX: x,
          renderedY: y,
          width,
          height,
          image,
          textElement,
          line,
          circle,
          others,
          center,
          hidden,
        };

        if (onClick) {
          this.addMapItemListener('click', id, onClick);
        }

        if (onMouseOver) {
          this.addMapItemListener('mouseover', id, onMouseOver);
        }

        if (onMouseOut) {
          this.addMapItemListener('mouseout', id, onMouseOut);
        }

        if (image) {
          this.mapItems[id].width = image.width;
          this.mapItems[id].height = image.height;
        }

        if (textElement) {
          const { family, size, text, maxLineWidth } = textElement;
          const dimension = calculateTextDimension(family, size, text);
          this.mapItems[id].width = dimension.width;
          this.mapItems[id].height = dimension.height;
          this.mapItems[id].textElement.lineHeight = dimension.height;

          if (maxLineWidth && dimension.width > maxLineWidth) {
            const lines = [];

            let currentLine;
            let computedMaxLineWidth = 0;

            textElement.text.split(' ').forEach(word => {
              if (
                currentLine &&
                calculateTextDimension(family, size, currentLine.join(' ')).width +
                  calculateTextDimension(family, size, `${word} `).width <
                  maxLineWidth
              ) {
                currentLine.push(word);
              } else {
                currentLine = [word];
                lines.push(currentLine);
              }

              computedMaxLineWidth = Math.max(
                computedMaxLineWidth,
                calculateTextDimension(family, size, currentLine.join(' ')).width,
              );
            });

            this.mapItems[id].width = computedMaxLineWidth;
            this.mapItems[id].height = lines.length * dimension.height;
            this.mapItems[id].textElement.lines = lines;
          }
        }

        if (center) {
          this.mapItems[id].renderedX = x - this.mapItems[id].width / 2;
          this.mapItems[id].renderedY = y - this.mapItems[id].height / 2;
        }

        // async work after adding items
        if (imageNotLoaded(image)) {
          // wait for img data to load completely before rendering
          asyncMapItems.push(
            createImageLoadPromise(image)
              .then(() => {
                this.mapItems[id].width = image.width;
                this.mapItems[id].height = image.height;

                if (center) {
                  this.mapItems[id].renderedX = x - this.mapItems[id].width / 2;
                  this.mapItems[id].renderedY = y - this.mapItems[id].height / 2;
                }

                this.render();
              })
              .catch(err => {
                console.log(err);
              }),
          );
        }
      },
    );

    // render all sync map items first
    this.render();

    // only resolve if every async map items are loaded, to let the caller know the op is done.
    await Promise.all(asyncMapItems);

    return mapItems;
  }

  /**
   * @param {string} mapItemId
   * @returns {boolean} true if map item found and deleted, false otherwise
   */
  removeMapItem(mapItemId) {
    const index = this.mapItemIds.indexOf(mapItemId);

    if (index === -1) {
      return false;
    }

    this.mapItemIds.splice(index, 1);
    delete this.mapItems[mapItemId];

    return true;
  }

  inViewport(startX, startY, width, height) {
    const endX = startX + width;
    const endY = startY + height;

    return [[startX, startY], [startX, endY], [endX, startY], [endX, endY]].some(
      ([x, y]) =>
        this.x <= x &&
        x <= this.x + this.getWidth() &&
        this.y <= y &&
        y <= this.y + this.getHeight(),
    );
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
        ({
          floor,
          renderedX,
          renderedY,
          image,
          textElement,
          line,
          hidden,
          width,
          height,
          circle,
        }) => {
          if (
            hidden ||
            floor !== this.floor ||
            !this.inViewport(renderedX, renderedY, width, height)
          ) {
            return;
          }

          switch (true) {
            case Boolean(circle): {
              const { radius, color, borderColor } = circle;
              ctx.beginPath();
              ctx.arc(renderedX - this.x, renderedY - this.y, radius, 0, Math.PI * 2);
              if (color) {
                ctx.fillStyle = color;
                ctx.fill();
              }

              if (borderColor) {
                ctx.strokeStyle = borderColor;
                ctx.stroke();
              }
              break;
            }
            case Boolean(image):
              ctx.drawImage(image, renderedX - this.x, renderedY - this.y);
              break;
            case Boolean(textElement): {
              const { size, color, family, text, lines, lineHeight } = textElement;
              ctx.fillStyle = color;
              ctx.font = `${size} ${family}`;
              ctx.textBaseline = 'top';
              if (lines) {
                lines.forEach((textLine, i) => {
                  ctx.fillText(
                    textLine.join(' '),
                    renderedX - this.x,
                    renderedY + lineHeight * i - this.y,
                  );
                });
              } else {
                ctx.fillText(text, renderedX - this.x, renderedY - this.y);
              }

              break;
            }
            case Boolean(line):
              {
                const { color, width: lineWidth, cap, coordinates } = line;

                ctx.beginPath();

                coordinates.forEach(([x, y], i) => {
                  if (i === 0) {
                    ctx.moveTo(x, y);
                    return;
                  }
                  ctx.lineTo(x, y);
                });

                ctx.strokeStyle = color;
                ctx.lineCap = cap;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
              }
              break;

            default:
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
  helperProps = {
    addMapTiles: args => this.addMapTiles(args),
    setMapItems: args => this.setMapItems(args),
    updateMapTiles: (...args) => this.updateMapTiles(...args),
    updateLayers: (...args) => this.updateLayers(...args),
    updatePosition: (...args) => this.updatePosition(...args),
    updateDimenision: (...args) => this.updateDimenision(...args),
    addMapItemClickListener: (mapItemId, listener) =>
      this.addMapItemListener('click', mapItemId, listener),
    addMapItemMouseOverListener: (mapItemId, listener) =>
      this.addMapItemListener('mouseover', mapItemId, listener),
    addMapItemMouseOutListener: (mapItemId, listener) =>
      this.addMapItemListener('mouseout', mapItemId, listener),
  };

  getProps() {
    return this.helperProps;
  }
}

export default CanvasHandler;
