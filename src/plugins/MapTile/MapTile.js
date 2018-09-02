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

function getMapTileId(x, y, floor) {
  return `default_${floor}_${x}_${y}`;
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

function getMapTileUrl(APIEndpoint, x, y, floor, scale) {
  return `${APIEndpoint()}/map_pixel.php?x=${x}&y=${y}&floor=${floor}&level=${scale}`;
}

function generateMapTiles({
  APIEndpoint,
  x: canvasOffsetX,
  y: canvasOffsetY,
  width,
  height,
  floor,
  scale,
}) {
  console.log('appendMapTiles');
  const mapTiles = [];
  const { x, y } = getMapTileNumber(canvasOffsetX, canvasOffsetY);

  let nextTileX = x;

  do {
    mapTiles.push({
      id: getMapTileId(nextTileX, y, floor),
      floor,
      x: nextTileX,
      y,
      image: createImage(getMapTileUrl(APIEndpoint, nextTileX, y, floor, scale)),
    });

    let nextTileY = y;

    do {
      nextTileY += MAP_TILE_HEIGHT;
      mapTiles.push({
        id: getMapTileId(nextTileX, nextTileY, floor),
        floor,
        x: nextTileX,
        y: nextTileY,
        image: createImage(getMapTileUrl(APIEndpoint, nextTileX, nextTileY, floor, scale)),
      });
    } while (nextTileY - y < height);

    nextTileX += MAP_TILE_WIDTH;
  } while (nextTileX - x < width);

  return mapTiles;
}

const pluginId = 'maptile';

const MapCanvasPlugin = ({
  APIEndpoint,
  addPositionChangeListener,
  addMouseUpListener,
  addMapTiles,
}) => {
  // Add map tiles while mouse moving to provide a better UX, but need to throttle the number of times triggering this listener
  addPositionChangeListener(
    throttle(canvasMoveEvent => {
      addMapTiles(generateMapTiles({ ...canvasMoveEvent, APIEndpoint }));
    }, 1000),
  );

  // Add map tiles right after a mouse up event, no throttling
  addMouseUpListener(canvasMoveEvent => {
    addMapTiles(generateMapTiles({ ...canvasMoveEvent, APIEndpoint }));
  });

  return null;
};

export { pluginId, MapCanvasPlugin };
