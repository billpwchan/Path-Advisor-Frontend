import get from 'lodash.get';
import calculateTextDimension from './calculateTextDimension';

const DEFAULT_LISTENER_ID = 'default';
const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;
/**
 * @typedef TextElement
 * @property {string} style
 * @property {number} [strokeWidth]
 * @property {string} [strokeStyle]
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
 * @property {string} [strokeStyle]
 * @property {string} [cap]
 * @property {number} [width]
 */
/**
 * @typedef Shape
 * @property {array} coordinates
 * @property {string} [fillStyle]
 * @property {string} [strokeStyle]
 * @property {string} [cap]
 * @property {number} [width]
 */
/**
 * @typedef Rect
 * @property {number} width
 * @property {number} height
 * @property {string} color
 * @property {string} borderColor
 */
/**
 * @typedef CanvasItem
 * @property {string} id
 * @property {number} x
 * @property {number} y
 * @property {number} renderedX
 * @property {number} renderedY
 * @property {number} width
 * @property {number} height
 * @property {number} hitX
 * @property {number} hitY
 * @property {number} hitWidth
 * @property {number} hitHeight
 * @property {string} floor
 * @property {boolean} [scalePosition]
 * @property {boolean} [scaleDimension]
 * @property {boolean} [center]
 * @property {boolean} [hidden]
 * @property {HTMLImageElement} [image]
 * @property {TextElement} [textElement]
 * @property {Line} [line]
 * @property {Shape} [shape]
 * @property {mapItemListener} [onClick]
 * @property {mapItemListener} [onMouseOver]
 * @property {mapItemListener} [onMouseOut]
 * @property {Circle} [circle]
 * @property {Rect} [rect]
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
 * @param {number} hitX - object coordinate x
 * @param {number} hitY - object coordinate y
 * @param {number} hitWidth - object width
 * @param {number} hitHeight - object height
 * @return {boolean}
 */
function hitTest(x, y, hitX, hitY, hitWidth, hitHeight) {
  const xInRange = x >= hitX && x <= hitX + hitWidth;
  const yInRange = y >= hitY && y <= hitY + hitHeight;

  return xInRange && yInRange;
}

function imageNotLoaded(image) {
  return (
    image instanceof HTMLImageElement &&
    !(image.complete && image.naturalWidth && image.naturalHeight)
  );
}

function setCanvasItemHitArea(canvasItem) {
  [
    { target: 'hitX', replace: 'renderedX' },
    { target: 'hitY', replace: 'renderedY' },
    { target: 'hitWidth', replace: 'width' },
    { target: 'hitHeight', replace: 'height' },
  ].forEach(({ target, replace }) => {
    if (canvasItem[target] === null) {
      /* eslint no-param-reassign: [0] */
      canvasItem[target] = canvasItem[replace];
    }
  });
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

  /** @type {number} - map coordinate x at then center of the canvas element */
  x = 0;

  /** @type {number} - map coordinate y at then center of the canvas element */
  y = 0;

  /** @type {string} - current floor displaying */
  floor = null;

  /** @type {number} - current level  */
  level = 0;

  levelToScale = [];

  /** @type {function[]} - canvas mouse move listeners */
  mouseMoveListeners = [];

  /** @type {function[]} - canvas mouse up listeners */
  mouseUpListeners = [];

  /** @type {function[]} - canvas wheel listeners */
  wheelListeners = [];

  /** @type {function[]} - canvas position changed listeners */
  positionChangeListeners = [];

  /** @typedef {Object.<string, Object.<string, mapItemListener>>} listenerGroup */
  /** @type {Object.<string, listenerGroup>} - map items listeners grouped by id */
  mapItemListeners = {
    click: {},
    mouseover: {},
    mouseout: {},
  };

  /** @type {Object.<string, Object.<string, string[]>>} */
  mapItemListenerIds = {
    click: {},
    mouseover: {},
    mouseout: {},
  };

  width = 0;

  height = 0;

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

  constructor() {
    this.canvas = document.createElement('canvas');
    this.setUpCanvasListeners();
    ['click', 'mousemove'].forEach(event => this.setUpListener(event));
  }

  updateDimension(width, height, levelToScale) {
    this.canvas.width = width * DEVICE_PIXEL_RATIO;
    this.canvas.height = height * DEVICE_PIXEL_RATIO;
    this.width = width;
    this.height = height;
    this.levelToScale = levelToScale;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    const ctx = this.canvas.getContext('2d');
    ctx.setTransform(DEVICE_PIXEL_RATIO, 0, 0, DEVICE_PIXEL_RATIO, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.oImageSmoothingEnabled = false;
    this.render();
  }

  updatePosition(x, y, floor = this.floor, level = this.level) {
    if (this.x === x && this.y === y && this.floor === floor && this.level === level) {
      console.log('no op');
      return;
    }

    this.x = x;
    this.y = y;
    this.floor = floor;
    this.level = level;

    this.render();

    this.positionChangeListeners.forEach(listener => {
      listener(this.getListenerParamObject());
    });
  }

  /**
   * @typedef CanvasEvent
   * @property {number} x
   * @property {number} y
   * @property {number} leftX
   * @property {number} topY
   * @property {number} rightX
   * @property {number} bottomY
   * @property {number} level
   * @property {number} width
   * @property {number} height
   * @property {number} floor
   * @property {number} scaledX
   * @property {number} scaledY
   * @property {number} scaledWidth
   * @property {number} scaledHeight
   * @property {number} screenLeftX
   * @property {number} screenTopY
   * @property {number} screenRightX
   * @property {number} screenBottomY
   * @property {number} wheelDelta
   * @property {number} nextLevel
   * @property {number} previousLevel
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
   * add user defined wheel listeners
   * @param {canvasListener} listener
   */
  addWheelListener(listener) {
    this.wheelListeners.push(listener);
  }

  /**
   * remove a user defined wheel listeners
   * @param {function} listener
   * @return {boolean} True is removed otherwise false
   */
  removeWheelListener(listener) {
    const listenerIndex = this.wheelListeners.indexOf(listener);
    if (listenerIndex !== -1) {
      this.wheelListeners.splice(listenerIndex, 1);
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
   * @param {string} id listener id
   * @param {string} mapItemId
   * @param {mapItemListener} listener
   * @param {boolean} [isPrepend]
   */
  addMapItemListener(event, id, mapItemId, listener, isPrepend = false) {
    if (!Object.keys(this.mapItemListeners).includes(event)) {
      throw new Error(`Event ${event} not supported`);
    }

    const listeners = this.mapItemListeners[event];
    const listenerIds = this.mapItemListenerIds[event];

    if (!listeners[mapItemId]) {
      listeners[mapItemId] = {};
      listenerIds[mapItemId] = [];
    }

    const isNew = !listeners[mapItemId][id];
    listeners[mapItemId][id] = listener;

    if (!isNew) {
      return;
    }

    if (isPrepend) {
      listenerIds[mapItemId].unshift(id);
      return;
    }

    listenerIds[mapItemId].push(id);
  }

  /**
   * remove map item listener
   * @param {string} event
   * @param {string} id
   * @param {string} mapItemId
   * @return {boolean} True is removed otherwise false
   */
  removeMapItemListener(event, id, mapItemId) {
    const mapItemListenerIds = this.mapItemListenerIds[event][mapItemId] || [];
    const listenerIndex = mapItemListenerIds.indexOf(id);
    if (listenerIndex !== -1) {
      mapItemListenerIds.splice(listenerIndex, 1);
      delete this.mapItemListeners[event][mapItemId][id];
      return true;
    }
    return false;
  }

  getListenerParamObject(props = {}) {
    return {
      nextLevel: this.getNextLevel(),
      previousLevel: this.getPreviousLevel(),
      level: this.level,
      width: this.getWidth(),
      height: this.getHeight(),
      scaledWidth: this.getScaledWidth(),
      scaledHeight: this.getScaledHeight(),
      floor: this.floor,
      x: this.x,
      y: this.y,
      leftX: this.getLeftX(),
      topY: this.getTopY(),
      rightX: this.getRightX(),
      bottomY: this.getBottomY(),
      screenLeftX: this.getScreenLeftX(),
      screenRightX: this.getScreenRightX(),
      screenTopY: this.getScreenTopY(),
      screenBottomY: this.getScreenBottomY(),
      ...props,
    };
  }

  setUpCanvasListeners() {
    document.addEventListener('mousedown', e => {
      const { clientX: downX, clientY: downY, target } = e;

      if (target !== this.getCanvas()) {
        return;
      }

      const { x: prevX, y: prevY } = this;

      const mouseMoveListener = mouseDownEvent => {
        const { clientX: currentX, clientY: currentY } = mouseDownEvent;
        const newX = prevX + this.normalizeCoordinate(downX - currentX);
        const newY = prevY + this.normalizeCoordinate(downY - currentY);
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

    this.canvas.addEventListener('wheel', e => {
      this.wheelListeners.forEach(listener => {
        const wheelDelta = Math.sign(e.wheelDelta);
        listener(this.getListenerParamObject({ wheelDelta }));
      });
    });
  }

  getNextLevel() {
    const previousLevel = this.level - 1;
    const minLevel = 0;
    return previousLevel > minLevel ? previousLevel : minLevel;
  }

  getPreviousLevel() {
    const nextLevel = this.level + 1;
    const maxLevel = this.levelToScale.length - 1;
    return nextLevel > maxLevel ? maxLevel : nextLevel;
  }

  setUpListener(event) {
    this.getCanvas().addEventListener(event, e => {
      const { clientX, clientY } = e;
      const canvasCoordinate = this.canvas.getBoundingClientRect();
      const x = clientX - canvasCoordinate.left + this.getScreenLeftX();
      const y = clientY - canvasCoordinate.top + this.getScreenTopY();

      this.mapItemIds.forEach(id => {
        const mapItem = this.mapItems[id];
        if (mapItem.floor !== this.floor) {
          return;
        }

        let mapItemEvent;
        const { hitX, hitY, hitWidth, hitHeight, scaleDimension, scalePosition } = mapItem;

        const itemHit = hitTest(
          x,
          y,
          scalePosition ? this.scaleCoordinate(hitX) : hitX,
          scalePosition ? this.scaleCoordinate(hitY) : hitY,
          scaleDimension ? this.scaleCoordinate(hitWidth) : hitWidth,
          scaleDimension ? this.scaleCoordinate(hitHeight) : hitHeight,
        );

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
          (get(this.mapItemListenerIds[mapItemEvent], id) || []).some(
            listenerId =>
              this.mapItemListeners[mapItemEvent][id][listenerId]({ ...this.mapItems[id] }) ===
              false,
          );
        }
      });
    });
  }

  scaleCoordinate(v) {
    return Math.round(v * this.levelToScale[this.level]);
  }

  // get coordinate value in zoom level=1 coordinate space
  normalizeCoordinate(v) {
    return Math.round(v / this.levelToScale[this.level]);
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getScaledWidth() {
    return this.normalizeCoordinate(this.width);
  }

  getScaledHeight() {
    return this.normalizeCoordinate(this.height);
  }

  getScaledX() {
    return this.scaleCoordinate(this.x);
  }

  getScaledY() {
    return this.scaleCoordinate(this.y);
  }

  getLeftX() {
    return this.x - this.getScaledWidth() / 2;
  }

  getTopY() {
    return this.y - this.getScaledHeight() / 2;
  }

  getRightX() {
    return this.x + this.getScaledWidth() / 2;
  }

  getBottomY() {
    return this.y + this.getScaledHeight() / 2;
  }

  getScreenLeftX() {
    return this.getScaledX() - this.getWidth() / 2;
  }

  getScreenTopY() {
    return this.getScaledY() - this.getHeight() / 2;
  }

  getScreenRightX() {
    return this.getScaledX() + this.getWidth() / 2;
  }

  getScreenBottomY() {
    return this.getScaledY() + this.getHeight() / 2;
  }

  /**
   * @param {CanvasItem[]} mapTiles
   */
  async addMapTiles(mapTiles) {
    const asyncMapTiles = [];

    mapTiles.forEach(
      ({
        id,
        floor,
        x,
        y,
        image,
        width = null,
        height = null,
        hidden = false,
        scalePosition = false,
        scaleDimension = false,
      }) => {
        if (!id) {
          throw new Error('id is required for canvas item');
        } else if (this.mapTiles[id]) {
          return;
        }

        const mapTile = {
          id,
          floor,
          x,
          y,
          renderedX: x,
          renderedY: y,
          width,
          height,
          hitX: x,
          hitY: y,
          hitWidth: null,
          hitHeight: null,
          hidden,
          image,
          scaleDimension,
          scalePosition,
          others: {},
        };

        this.mapTiles[id] = mapTile;
        this.mapTileIds.push(id);

        if (imageNotLoaded(image)) {
          asyncMapTiles.push(
            createImageLoadPromise(image)
              .then(() => {
                mapTile.width = image.width;
                mapTile.height = image.height;
                setCanvasItemHitArea(mapTile);
                this.render();
              })
              .catch(err => {
                console.log(err);
              }),
          );
        } else {
          mapTile.width = image.width;
          mapTile.height = image.height;
          setCanvasItemHitArea(mapTile);
        }

        this.render();
      },
    );

    await Promise.all(asyncMapTiles);
    return mapTiles;
  }

  removeAllMapTiles() {
    this.mapTileIds = [];
    this.mapTiles = {};
  }

  /**
   * @param {CanvasItem[]} mapItems
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
        rect = getDefault(id, 'rect', null),
        line = getDefault(id, 'line', null),
        shape = getDefault(id, 'shape', null),
        others = getDefault(id, 'others', {}),
        center = getDefault(id, 'center', false),
        hidden = getDefault(id, 'hidden', false),
        onClick = getDefault(id, 'onClick', null),
        onMouseOver = getDefault(id, 'onMouseOver', null),
        onMouseOut = getDefault(id, 'onMouseOut', null),
        hitX = getDefault(id, 'hitX', null),
        hitY = getDefault(id, 'hitY', null),
        hitWidth = getDefault(id, 'hitWidth', null),
        hitHeight = getDefault(id, 'hitHeight', null),
        scalePosition = getDefault(id, 'scalePosition', true),
        scaleDimension = getDefault(id, 'scaleDimension', false),
      }) => {
        if (!id) {
          throw new Error('id is required for canvas item');
        } else if (!this.mapItems[id]) {
          this.mapItemIds.push(id);
        }

        const mapItem = {
          id,
          floor,
          x,
          y,
          renderedX: x,
          renderedY: y,
          hitX,
          hitY,
          hitWidth,
          hitHeight,
          scalePosition,
          scaleDimension,
          width,
          height,
          image,
          textElement,
          line,
          shape,
          circle,
          rect,
          others,
          center,
          hidden,
        };

        this.mapItems[id] = mapItem;

        if (onClick) {
          this.addMapItemListener('click', DEFAULT_LISTENER_ID, id, onClick);
        }

        if (onMouseOver) {
          this.addMapItemListener('mouseover', DEFAULT_LISTENER_ID, id, onMouseOver);
        }

        if (onMouseOut) {
          this.addMapItemListener('mouseout', DEFAULT_LISTENER_ID, id, onMouseOut);
        }

        switch (true) {
          case Boolean(textElement): {
            const { style, text, maxLineWidth } = textElement;
            const dimension = calculateTextDimension(style, text);
            mapItem.width = dimension.width;
            mapItem.height = dimension.height;
            mapItem.textElement.lineHeight = dimension.height;

            if (maxLineWidth && dimension.width > maxLineWidth) {
              const lines = [];

              let currentLine;
              let computedMaxLineWidth = 0;

              textElement.text.split(' ').forEach(word => {
                if (
                  currentLine &&
                  calculateTextDimension(style, currentLine.join(' ')).width +
                    calculateTextDimension(style, `${word} `).width <
                    maxLineWidth
                ) {
                  currentLine.push(word);
                } else {
                  currentLine = [word];
                  lines.push(currentLine);
                }

                computedMaxLineWidth = Math.max(
                  computedMaxLineWidth,
                  calculateTextDimension(style, currentLine.join(' ')).width,
                );
              });

              mapItem.width = computedMaxLineWidth;
              mapItem.height = lines.length * dimension.height;
              mapItem.textElement.lines = lines;
            }
            break;
          }
          case Boolean(line): {
            const { coordinates } = line;
            const coorXs = coordinates.map(([v]) => v);
            const coorYs = coordinates.map(([, v]) => v);
            const minX = Math.min(...coorXs);
            const minY = Math.min(...coorYs);
            const maxX = Math.max(...coorXs);
            const maxY = Math.max(...coorYs);
            mapItem.x = minX;
            mapItem.renderedX = minX;
            mapItem.y = minY;
            mapItem.renderedY = minY;
            mapItem.width = maxX - minX + line.width;
            mapItem.height = maxY - minY + line.width;
            break;
          }
          case Boolean(shape): {
            const { coordinates } = shape;
            const coorXs = coordinates.map(([v]) => v);
            const coorYs = coordinates.map(([, v]) => v);
            const minX = Math.min(...coorXs);
            const minY = Math.min(...coorYs);
            const maxX = Math.max(...coorXs);
            const maxY = Math.max(...coorYs);
            mapItem.width = maxX - minX + (shape.width || 0);
            mapItem.height = maxY - minY + (shape.width || 0);
            break;
          }
          case Boolean(image): {
            // extra async work for unloaded image
            if (imageNotLoaded(image)) {
              // wait for img data to load completely before rendering
              asyncMapItems.push(
                createImageLoadPromise(image)
                  .then(() => {
                    mapItem.width = mapItem.width ? mapItem.width : image.width;
                    mapItem.height = mapItem.height ? mapItem.height : image.height;

                    if (center) {
                      mapItem.renderedX = x - mapItem.width / 2;
                      mapItem.renderedY = y - mapItem.height / 2;
                    }

                    setCanvasItemHitArea(mapItem);

                    this.render();
                  })
                  .catch(err => {
                    console.log(err);
                  }),
              );
              break;
            }

            mapItem.width = mapItem.width ? mapItem.width : image.width;
            mapItem.height = mapItem.height ? mapItem.height : image.height;

            break;
          }
          case Boolean(circle): {
            mapItem.width = circle.radius * 2;
            mapItem.height = circle.radius * 2;
            break;
          }
          case Boolean(rect): {
            mapItem.width = rect.width;
            mapItem.height = rect.height;
            break;
          }
          default:
        }

        if (center) {
          mapItem.renderedX = mapItem.x - mapItem.width / 2;
          mapItem.renderedY = mapItem.y - mapItem.height / 2;
        }

        setCanvasItemHitArea(mapItem);
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

    this.render();

    return true;
  }

  inViewport(leftX, topY, width, height) {
    const rightX = leftX + width;
    const bottomY = topY + height;

    const screenLeftX = this.getScreenLeftX();
    const screenRightX = this.getScreenRightX();
    const screenTopY = this.getScreenTopY();
    const screenBottomY = this.getScreenBottomY();

    const xInRange =
      [leftX, rightX].some(x => screenLeftX <= x && x <= screenRightX) ||
      (leftX < screenLeftX && screenRightX < rightX);

    const yInRange =
      [topY, bottomY].some(y => screenTopY <= y && y <= screenBottomY) ||
      (topY < screenTopY && screenBottomY < bottomY);

    return xInRange && yInRange;
  }

  render = () => {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const screenLeftX = this.getScreenLeftX();
    const screenTopY = this.getScreenTopY();

    this.layerIds.forEach(key => {
      if (this.layers[key].hidden) {
        return;
      }
      // Render each canvas items in this layer
      this.getCanvasItems(key).forEach(
        ({
          x,
          y,
          floor,
          renderedX,
          renderedY,
          image,
          textElement,
          line,
          shape,
          hidden,
          circle,
          rect,
          width,
          height,
          scalePosition,
          scaleDimension,
        }) => {
          const scaledRenderedX = scalePosition ? this.scaleCoordinate(renderedX) : renderedX;
          const scaledRenderedY = scalePosition ? this.scaleCoordinate(renderedY) : renderedY;
          const scaledWidth = scaleDimension ? this.scaleCoordinate(width) : width;
          const scaledHeight = scaleDimension ? this.scaleCoordinate(height) : height;
          if (
            hidden ||
            floor !== this.floor ||
            !this.inViewport(scaledRenderedX, scaledRenderedY, scaledWidth, scaledHeight)
          ) {
            return;
          }

          switch (true) {
            case Boolean(circle): {
              const { radius, color, borderColor } = circle;
              ctx.beginPath();
              ctx.arc(
                scaledRenderedX - screenLeftX + scaledWidth / 2,
                scaledRenderedY - screenTopY + scaledHeight / 2,
                radius,
                0,
                Math.PI * 2,
              );
              ctx.lineWidth = 1;
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
            case Boolean(rect): {
              const { color, borderColor } = rect;
              if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(
                  scaledRenderedX - screenLeftX,
                  scaledRenderedY - screenTopY,
                  scaledWidth,
                  scaledHeight,
                );
              }

              if (borderColor) {
                ctx.strokeStyle = borderColor;
                ctx.strokeRect(
                  scaledRenderedX - screenLeftX,
                  scaledRenderedY - screenTopY,
                  scaledWidth,
                  scaledHeight,
                );
              }
              break;
            }
            case Boolean(image):
              ctx.drawImage(
                image,
                scaledRenderedX - screenLeftX,
                scaledRenderedY - screenTopY,
                width,
                height,
              );
              break;
            case Boolean(textElement): {
              const {
                style,
                color,
                text,
                lines,
                lineHeight,
                strokeWidth,
                strokeStyle,
              } = textElement;
              ctx.fillStyle = color;
              ctx.font = style;
              ctx.textBaseline = 'top';
              if (lines) {
                lines.forEach((textLine, i) => {
                  ctx.fillText(
                    textLine.join(' '),
                    scaledRenderedX - screenLeftX,
                    scaledRenderedY + lineHeight * i - screenTopY,
                  );
                });
              } else {
                ctx.fillText(text, scaledRenderedX - screenLeftX, scaledRenderedY - screenTopY);
              }

              if (strokeWidth && strokeStyle) {
                ctx.strokeStyle = strokeStyle;
                ctx.lineWidth = strokeWidth;
                ctx.strokeText(text, scaledRenderedX - screenLeftX, scaledRenderedY - screenTopY);
              }

              break;
            }
            case Boolean(line):
              {
                const { strokeStyle, width: lineWidth, cap, coordinates } = line;

                ctx.beginPath();

                coordinates.forEach(([lineX, lineY], i) => {
                  const op = i === 0 ? 'moveTo' : 'lineTo';
                  const scaledX = scalePosition ? this.scaleCoordinate(lineX) : lineX;
                  const scaledY = scalePosition ? this.scaleCoordinate(lineY) : lineY;
                  ctx[op](scaledX - screenLeftX, scaledY - screenTopY);
                });

                if (strokeStyle) {
                  ctx.lineCap = cap;
                  ctx.lineWidth = lineWidth;
                  ctx.strokeStyle = strokeStyle;
                  ctx.stroke();
                }
              }
              break;
            case Boolean(shape):
              {
                const { strokeStyle, fillStyle, width: lineWidth, cap, coordinates } = shape;

                ctx.beginPath();

                coordinates.forEach(([lineX, lineY], i) => {
                  const op = i === 0 ? 'moveTo' : 'lineTo';
                  const scaledX = scaleDimension ? this.scaleCoordinate(lineX) : lineX;
                  const scaledY = scaleDimension ? this.scaleCoordinate(lineY) : lineY;
                  ctx[op](
                    scaledX - screenLeftX + scaledRenderedX,
                    scaledY - screenTopY + scaledRenderedY,
                  );
                });

                if (fillStyle) {
                  ctx.fillStyle = fillStyle;
                  ctx.fill();
                }

                if (strokeStyle) {
                  ctx.lineCap = cap;
                  ctx.lineWidth = lineWidth;
                  ctx.strokeStyle = strokeStyle;
                  ctx.stroke();
                }
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
    removeMapItem: args => this.removeMapItem(args),
    removeAllMapTiles: () => this.removeAllMapTiles(),
    updateDimension: (...args) => this.updateDimension(...args),
    calculateTextDimension,
    // map item listeners
    addMapItemClickListener: (id, mapItemId, listener, isPrepend) =>
      this.addMapItemListener('click', id, mapItemId, listener, isPrepend),
    addMapItemMouseOverListener: (id, mapItemId, listener, isPrepend) =>
      this.addMapItemListener('mouseover', id, mapItemId, listener, isPrepend),
    addMapItemMouseOutListener: (id, mapItemId, listener, isPrepend) =>
      this.addMapItemListener('mouseout', id, mapItemId, listener, isPrepend),
    removeMapItemClickListener: (id, mapItemId) =>
      this.removeMapItemListener('click', id, mapItemId),
    removeMapItemMouseOverListener: (id, mapItemId) =>
      this.removeMapItemListener('mouseover', id, mapItemId),
    removeMapItemMouseOutListener: (id, mapItemId) =>
      this.removeMapItemListener('mouseout', id, mapItemId),
  };

  getProps() {
    return this.helperProps;
  }
}

export default CanvasHandler;
