import PropTypes from 'prop-types';
import get from 'lodash.get';
import isNil from 'lodash.isnil';
import qs from 'query-string';
import {
  TYPE as INPUT_TYPE,
  hasContent as inputHasContent,
  EMPTY as EMPTY_INPUT,
} from '../SearchArea/Input';
import { nearestOptions } from '../SearchNearest/SearchNearest';
import { PLATFORM } from '../Main/detectPlatform';

function formPlaceUrl(place) {
  const {
    data: { type, value, id, floor, coordinates },
  } = place;
  if (type === INPUT_TYPE.ID) {
    return `/${value};${id};${floor};${coordinates.join(',')}`;
  }
  return `/${value}`;
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

function parseParams(params, query, platform) {
  const queryParams = qs.parse(query);

  const { fromPlace, toPlace, fromNearestType, toNearestType, coordinatePath, floorPath } = params;

  let { search } = params;

  const coordinateString =
    (typeof coordinatePath === 'string' && get(coordinatePath.split('/'), 1)) || null;
  const floor = (typeof floorPath === 'string' && get(floorPath.split('/'), 1)) || undefined;
  const [x = undefined, y = undefined, level = undefined] = coordinateString
    ? coordinateString.split(',').map(v => parseInt(v, 10))
    : [];

  let fromNearest = Object.values(nearestOptions).find(
    ({ data: { value } }) => value === fromNearestType,
  );
  fromNearest = fromNearest ? { ...fromNearest } : null;

  let from = parsePlace(fromPlace) ||
    fromNearest || {
      ...EMPTY_INPUT,
    };

  let toNearest = Object.values(nearestOptions).find(
    ({ data: { value } }) => value === toNearestType,
  );
  toNearest = toNearest ? { ...toNearest } : null;

  let to = parsePlace(toPlace) ||
    toNearest || {
      ...EMPTY_INPUT,
    };

  if (queryParams.roomno) {
    to = { ...nearestOptions.lift };
    from = {
      name: queryParams.roomno,
      data: { type: INPUT_TYPE.KEYWORD, value: queryParams.roomno },
    };
    search = true;
  } else if (
    platform === PLATFORM.MOBILE &&
    from &&
    from.data &&
    from.data.type === INPUT_TYPE.NEAREST
  ) {
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

  console.log('param parsed', parsed);
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
    from && from.data.type !== INPUT_TYPE.NEAREST && (inputHasContent(from) || inputHasContent(to))
      ? '/from'
      : '';
  if (fromPlace && inputHasContent(from)) {
    fromPlace += formPlaceUrl(from);
  }

  let toPlace =
    to && to.data.type !== INPUT_TYPE.NEAREST && (inputHasContent(from) || inputHasContent(to))
      ? '/to'
      : '';
  if (toPlace && inputHasContent(to)) {
    toPlace += formPlaceUrl(to);
  }

  const searchUrl = inputHasContent(from) && inputHasContent(to) && search ? '/search' : '';
  return `${searchUrl}${nearest}${fromPlace}${toPlace}${position}`;
}

export { parseParams, propTypes, build };
