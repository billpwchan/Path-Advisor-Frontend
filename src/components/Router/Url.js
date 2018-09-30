import PropTypes from 'prop-types';
import get from 'lodash.get';

function parseParams(params) {
  const { place, fromPlace, toPlace, mapItemType, coordinatePath, floorPath } = params;

  const coordinateString =
    (typeof coordinatePath === 'string' && get(coordinatePath.split('/'), 1)) || null;
  const floor = (typeof floorPath === 'string' && get(floorPath.split('/'), 1)) || undefined;
  const [x = undefined, y = undefined, scale = undefined] = coordinateString
    ? coordinateString.split(',').map(v => parseInt(v, 10))
    : [];

  return {
    place,
    fromPlace,
    toPlace,
    mapItemType,
    x,
    y,
    scale,
    floor,
  };
}

const propTypes = {
  place: PropTypes.string,
  fromPlace: PropTypes.string,
  toPlace: PropTypes.string,
  mapItemType: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  scale: PropTypes.number,
  floor: PropTypes.string,
};

function build({ floor, x, y, scale }) {
  return `/floor/${floor}/at/${x},${y},${scale}`;
}

export { parseParams, propTypes, build };
