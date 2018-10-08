import throttle from 'lodash.throttle';

const MAP_TILE_WIDTH = 200;
const MAP_TILE_HEIGHT = 200;

/**
 * @typedef MapTileNumber
 * @property {number} x - coordinate x of the top left concer of this map tile number
 * @property {number} y - coordinate y of the top left concer of this map tile number
 */
/**
 * Given an coordindate, return the number of the map tile containing this coordinate
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
 * @param {string} src
 * @return {HTMLImageElement} Loaded image element
 */
function createImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

function getMapTileUrl(APIEndpoint, x, y, floor, level) {
  return `${APIEndpoint()}/map_pixel.php?x=${x}&y=${y}&floor=${floor}&level=${level}`;
}

function generateMapTiles(APIEndpoint, canvasOffsetX, canvasOffsetY, width, height, floor, level) {
  const mapTiles = [];
  const { x, y } = getMapTileNumber(canvasOffsetX, canvasOffsetY);

  let nextTileX = x;

  do {
    mapTiles.push({
      id: getMapTileId(nextTileX, y, floor, level),
      floor,
      x: nextTileX,
      y,
      image: createImage(getMapTileUrl(APIEndpoint, nextTileX, y, floor, level)),
    });

    let nextTileY = y;

    do {
      nextTileY += MAP_TILE_HEIGHT;
      mapTiles.push({
        id: getMapTileId(nextTileX, nextTileY, floor),
        floor,
        x: nextTileX,
        y: nextTileY,
        image: createImage(getMapTileUrl(APIEndpoint, nextTileX, nextTileY, floor, level)),
      });
    } while (nextTileY - y < height + MAP_TILE_HEIGHT);

    nextTileX += MAP_TILE_WIDTH;
  } while (nextTileX - x < width + MAP_TILE_WIDTH);

  return mapTiles;
}

let throttledAddMapTiles;

const MapTile = ({
  APIEndpoint,
  addMapTiles,
  width,
  height,
  floor,
  level,
  movingLeftX,
  movingTopY,
}) => {
  if (!throttledAddMapTiles) {
    throttledAddMapTiles = throttle((...args) => {
      addMapTiles(generateMapTiles(...args));
    }, 100);
  }
  // Add map tiles while mouse moving to provide a better UX, but need to throttle the number of times triggering this listener
  throttledAddMapTiles(APIEndpoint, movingLeftX, movingTopY, width, height, floor, level);

  return null;
};

const MapCanvasPlugin = {
  Component: MapTile,
  connect: [
    'APIEndpoint',
    'addMapTiles',
    'width',
    'height',
    'floor',
    'level',
    'movingLeftX',
    'movingTopY',
  ],
};
const id = 'maptile';
export { id, MapCanvasPlugin };
