import throttle from 'lodash.throttle';

const MAP_TILE_WIDTH = 200;
const MAP_TILE_HEIGHT = 200;
const imageCaches = {};

/**
 * @typedef MapTileNumber
 * @property {number} x - coordinate x of the top left of this map tile number
 * @property {number} y - coordinate y of the top left of this map tile number
 */
/**
 * Given an coordinate, return the number of the map tile containing this coordinate
 * @param {number} x
 * @param {number} y
 * @return {MapTileNumber}
 */
function getMapTileNumber(x, y) {
  const tileX = Math.floor(x / MAP_TILE_WIDTH) * MAP_TILE_WIDTH;
  const tileY = Math.floor(y / MAP_TILE_HEIGHT) * MAP_TILE_HEIGHT;
  return {
    x: tileX,
    y: tileY,
  };
}

function getMapTileId(x, y, floor, level) {
  return `default_${floor}_${x}_${y}_${level}`;
}

/**
 * @param {string} id
 * @param {string} src
 */
function createImage(id, src) {
  if (!imageCaches[id]) {
    const img = new Image();
    img.src = src;
    imageCaches[id] = img;
  }

  return imageCaches[id];
}

function getMapTileUrl(APIEndpoint, x, y, floor, level) {
  return `${APIEndpoint()}/map_pixel.php?x=${x}&y=${y}&floor=${floor}&level=${level + 1}`;
}

function generateMapTiles(APIEndpoint, canvasOffsetX, canvasOffsetY, width, height, floor, level) {
  const mapTiles = [];
  const { x, y } = getMapTileNumber(canvasOffsetX, canvasOffsetY);

  let nextTileX = x;

  do {
    const xId = getMapTileId(nextTileX, y, floor, level);
    mapTiles.push({
      id: xId,
      floor,
      x: nextTileX,
      y,
      image: createImage(xId, getMapTileUrl(APIEndpoint, nextTileX, y, floor, level)),
    });

    let nextTileY = y;

    do {
      nextTileY += MAP_TILE_HEIGHT;
      const yId = getMapTileId(nextTileX, nextTileY, floor, level);
      mapTiles.push({
        id: yId,
        floor,
        x: nextTileX,
        y: nextTileY,
        image: createImage(yId, getMapTileUrl(APIEndpoint, nextTileX, nextTileY, floor, level)),
      });
    } while (nextTileY - y < height + MAP_TILE_HEIGHT);

    nextTileX += MAP_TILE_WIDTH;
  } while (nextTileX - x < width + MAP_TILE_WIDTH);

  return mapTiles;
}

let throttledAddMapTiles;

let prevLevel = null;

const MapTile = ({
  APIEndpoint,
  addMapTiles,
  removeAllMapTiles,
  width,
  height,
  floor,
  level,
  movingScreenLeftX,
  movingScreenTopY,
}) => {
  if (!throttledAddMapTiles) {
    throttledAddMapTiles = throttle((...args) => {
      const currentLevel = args[args.length - 1];
      if (prevLevel !== currentLevel) {
        removeAllMapTiles();
      }

      prevLevel = currentLevel;

      addMapTiles(generateMapTiles(...args));
    }, 100);
  }
  // Add map tiles while mouse moving to provide a better UX, but need to throttle the number of times triggering this listener
  throttledAddMapTiles(
    APIEndpoint,
    movingScreenLeftX,
    movingScreenTopY,
    width,
    height,
    floor,
    level,
  );

  return null;
};

const MapCanvasPlugin = {
  Component: MapTile,
  connect: [
    'APIEndpoint',
    'addMapTiles',
    'removeAllMapTiles',
    'width',
    'height',
    'floor',
    'level',
    'movingScreenLeftX',
    'movingScreenTopY',
  ],
};
const id = 'MAP_TILE';
export { id, MapCanvasPlugin };
