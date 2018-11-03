import PropTypes from 'prop-types';
import get from 'lodash.get';
import isNil from 'lodash.isnil';
import INPUT_TYPE from '../SearchArea/InputType';
import { nearestOptions } from '../SearchNearest/SearchNearest';
import { PLATFORM } from '../Main/detectPlatform';

const DEFAULT_INPUT = {
  name: '',
  data: {},
};

function formPlaceUrl(place) {
  const {
    data: { type, value, id, floor, coordinates },
  } = place;
  if (type === INPUT_TYPE.ID) {
    return `/${value};${id};${floor};${coordinates.join(',')}`;
  }
  return `/${value}`;
}

function placeHasContent(place) {
  return place && place.data && Object.values(INPUT_TYPE).includes(place.data.type);
}

function parsePlace(place) {
  if (!place) {
    return null;
  }

  const [name, id, floor, coordinates] = place.split(';');
  const [x, y] = coordinates
    ? coordinates
        .split(',')
        .map(v => Number.parseInt(v, 10))
        .map(v => (Number.isNaN(v) ? null : v))
    : [null, null];
  return [id, floor, x, y].every(v => !isNil(v))
    ? {
        name,
        data: {
          id,
          floor,
          value: name,
          type: INPUT_TYPE.ID,
          coordinates: [x, y],
        },
      }
    : { name, data: { type: INPUT_TYPE.KEYWORD, value: name } };
}

function parseParams(params, platform) {
  const {
    search,
    fromPlace,
    toPlace,
    fromNearestType,
    toNearestType,
    coordinatePath,
    floorPath,
  } = params;

  const coordinateString =
    (typeof coordinatePath === 'string' && get(coordinatePath.split('/'), 1)) || null;
  const floor = (typeof floorPath === 'string' && get(floorPath.split('/'), 1)) || undefined;
  const [x = undefined, y = undefined, level = undefined] = coordinateString
    ? coordinateString.split(',').map(v => parseInt(v, 10))
    : [];

  let from = parsePlace(fromPlace) ||
    Object.values(nearestOptions).find(({ data: { value } }) => value === fromNearestType) || {
      ...DEFAULT_INPUT,
    };

  let to = parsePlace(toPlace) ||
    Object.values(nearestOptions).find(({ data: { value } }) => value === toNearestType) || {
      ...DEFAULT_INPUT,
    };

  if (platform === PLATFORM.MOBILE && from && from.data && from.data.type === INPUT_TYPE.NEAREST) {
    [from, to] = [to, from];
  }

  const parsed = {
    from,
    to,
    x,
    y,
    level,
    floor,
    search: Boolean(search),
  };

  return parsed;
}

export const placePropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  data: PropTypes.shape({
    type: PropTypes.oneOf([INPUT_TYPE.ID, INPUT_TYPE.KEYWORD, INPUT_TYPE.NEAREST]).isRequired,
    value: PropTypes.string.isRequired,
    id: PropTypes.string,
    floor: PropTypes.string,
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
});

const propTypes = {
  from: placePropTypes,
  to: placePropTypes,
  x: PropTypes.number,
  y: PropTypes.number,
  level: PropTypes.number,
  floor: PropTypes.string,
  search: PropTypes.bool.isRequired,
};

function build({ floor, x, y, level, search = false, from = null, to = null }) {
  const position = `/floor/${floor}/at/${x},${y},${level}`;

  if (from && from.data.type === INPUT_TYPE.NEAREST && to && to.data.type === INPUT_TYPE.NEAREST) {
    // Malformed url. ignore all the place parameters
    return position;
  }

  const nearest =
    (to && to.data.type === INPUT_TYPE.NEAREST && `/nearest/${to.data.value}`) ||
    (from && from.data.type === INPUT_TYPE.NEAREST && `/nearest/${from.data.value}`) ||
    '';

  let fromPlace =
    from && from.data.type !== INPUT_TYPE.NEAREST && (placeHasContent(from) || placeHasContent(to))
      ? '/from'
      : '';
  if (fromPlace && placeHasContent(from)) {
    fromPlace += formPlaceUrl(from);
  }

  let toPlace =
    to && to.data.type !== INPUT_TYPE.NEAREST && (placeHasContent(from) || placeHasContent(to))
      ? '/to'
      : '';
  if (toPlace && placeHasContent(to)) {
    toPlace += formPlaceUrl(to);
  }

  return `${search ? '/search' : ''}${nearest}${fromPlace}${toPlace}${position}`;
}

export { parseParams, propTypes, build };
