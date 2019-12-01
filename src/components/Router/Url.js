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
import { TABS as SUGGESTION_TABS } from '../Suggestion/constants';

function formPlacePath(place) {
  const {
    data: { type, value = '', id, floor, coordinates },
  } = place;
  if (type === INPUT_TYPE.ID) {
    return `${value};${id};${floor};${coordinates.join(',')}`;
  }
  return `${value}`;
}

function parsePlace(place) {
  if (!place) {
    return null;
  }

  // TO-DO: remove legacy check after analytics shows no user is using it anymore
  const legacyIdPattern = /^[n|p][0-9]{1,3}$/;
  const [name, id, floor, coordinates] = place.split(';');
  const [x, y] = coordinates
    ? coordinates
        .split(',')
        .map(v => Number.parseInt(v, 10))
        .map(v => (Number.isNaN(v) ? null : v))
    : [null, null];
  return [id, floor, x, y].every(v => !isNil(v)) && !legacyIdPattern.test(id)
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

// TO-DO: Remove normalized checking and url once analytics shows no users use unnormalized coordinates
function parseCoordinates(coordinatePath, floor, floorData) {
  if (typeof coordinatePath !== 'string') {
    return { isNormalized: true };
  }

  const coordinateParts = coordinatePath.split('/');

  if (coordinateParts.length !== 2 && coordinateParts.length !== 3) {
    throw new Error('Unexpected coordinate path format');
  }

  const isNormalized = coordinateParts.length === 3;
  const coordinateString = coordinatePath.split('/')[coordinateParts.length - 1];

  let [x, y, level] = coordinateString.split(',').map(v => parseInt(v, 10));

  if (floor && !isNormalized) {
    x += floorData[floor].startX;
    y += floorData[floor].startY;
  }

  return { x, y, level, isNormalized };
}

function parseParams(params, query, platform, floorData) {
  const queryParams = qs.parse(query);

  const {
    fromPlace,
    toPlace,
    viaPlaces,
    fromNearestType,
    toNearestType,
    coordinatePath,
    floorPath,
    suggestionPath,
    suggestionCoordinatePath,
  } = params;

  let { search } = params;

  const floor = (typeof floorPath === 'string' && get(floorPath.split('/'), 1)) || undefined;
  const { x, y, level, isNormalized } = parseCoordinates(coordinatePath, floor, floorData);

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

  const suggestion = get((suggestionPath || '').split('/'), 1);
  const suggestionCoordinatesString = get((suggestionCoordinatePath || '').split('/'), 1);

  const [suggestionX = null, suggestionY = null] = suggestionCoordinatesString
    ? suggestionCoordinatesString.split(',').map(v => parseFloat(v))
    : [];

  let via = [];
  if (viaPlaces === 'via') {
    via = [{ ...EMPTY_INPUT }];
  } else {
    const viaPathPlaces = (viaPlaces || '').split('/')[1] || '';

    via = viaPathPlaces
      ? viaPathPlaces.split('|').map(place => parsePlace(place) || { ...EMPTY_INPUT })
      : [];
  }

  const parsed = {
    from,
    to,
    x,
    y,
    via: via.length ? via : null,
    level,
    floor,
    search: Boolean(search),
    suggestion,
    suggestionX,
    suggestionY,
    isFromNormalized: isNormalized,
  };

  return parsed;
}

export const placePropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  data: PropTypes.shape({
    type: PropTypes.oneOf([INPUT_TYPE.ID, INPUT_TYPE.KEYWORD, INPUT_TYPE.NEAREST]),
    value: PropTypes.string,
    id: PropTypes.string,
    floor: PropTypes.string,
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
});

const propTypes = {
  from: placePropType,
  to: placePropType,
  via: PropTypes.arrayOf(placePropType),
  x: PropTypes.number,
  y: PropTypes.number,
  level: PropTypes.number,
  floor: PropTypes.string,
  search: PropTypes.bool.isRequired,
  suggestion: PropTypes.oneOf(Object.values(SUGGESTION_TABS)),
  suggestionX: PropTypes.number,
  suggestionY: PropTypes.number,
};

function build({
  floor,
  x,
  y,
  level,
  search = false,
  from = null,
  to = null,
  suggestion = null,
  suggestionX = null,
  suggestionY = null,
  via = null,
}) {
  const position = `/floor/${floor}/at/normalized/${x},${y},${level}`;

  if (from && from.data.type === INPUT_TYPE.NEAREST && to && to.data.type === INPUT_TYPE.NEAREST) {
    // Malformed url. ignore all the place parameters
    return position;
  }

  const nearest =
    (to && to.data.type === INPUT_TYPE.NEAREST && `/nearest/${to.data.value}`) ||
    (from && from.data.type === INPUT_TYPE.NEAREST && `/nearest/${from.data.value}`) ||
    '';

  let fromPlace =
    (from && from.data.type) !== INPUT_TYPE.NEAREST &&
    (inputHasContent(from) || inputHasContent(to) || (Array.isArray(via) ? via : []).length)
      ? '/from'
      : '';
  if (fromPlace && inputHasContent(from)) {
    fromPlace += `/${formPlacePath(from)}`;
  }

  let toPlace =
    (to && to.data.type) !== INPUT_TYPE.NEAREST &&
    (inputHasContent(from) || inputHasContent(to) || (Array.isArray(via) ? via : []).length)
      ? '/to'
      : '';
  if (toPlace && inputHasContent(to)) {
    toPlace += `/${formPlacePath(to)}`;
  }

  const searchUrl = inputHasContent(from) && inputHasContent(to) && search ? '/search' : '';

  let suggestionUrl = '';

  if (suggestion) {
    suggestionUrl = `/suggestion/${suggestion}`;
    if (suggestionX !== null && suggestionY !== null) {
      suggestionUrl += `/at/${suggestionX},${suggestionY}`;
    }
  }

  let viaUrl = '';
  if (Array.isArray(via) && via.length) {
    const viaPlaces =
      Array.isArray(via) && via.length && via.map(place => formPlacePath(place)).join('|');
    viaUrl += viaPlaces ? `/via/${viaPlaces}` : `/via`;
  }

  return `${searchUrl}${nearest}${fromPlace}${toPlace}${viaUrl}${position}${suggestionUrl}`;
}

export { parseParams, propTypes, build };
