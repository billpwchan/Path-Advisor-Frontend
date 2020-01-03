import PropTypes from 'prop-types';

export const SEARCH_NEAREST = 'SEARCH_NEAREST';
export const SEARCH_NEAREST_SUCCESS = 'SEARCH_NEAREST_SUCCESS';
export const SEARCH_NEAREST_FAILURE = 'SEARCH_NEAREST_FAILURE';
export const CLEAR_SEARCH_NEAREST_RESULT = 'CLEAR_SEARCH_NEAREST_RESULT';

/**
 * @typedef searchOptions
 * @property {boolean} [noStairCase]
 * @property {boolean} [noEscalator]
 * @property {boolean} [stepFreeAccess]
 * @property {string} [searchMode]
 */
/**
 * @param {string} floor
 * @param {string} name
 * @param {string} nearestType
 * @param {boolean} sameFloor
 * @param {string} id
 * @param {searchOptions} searchOptions
 */
export function searchNearestAction(floor, name, nearestType, sameFloor, id, searchOptions) {
  return {
    type: SEARCH_NEAREST,
    payload: { floor, name, nearestType, sameFloor, id, searchOptions },
  };
}

export function searchNearestSuccessAction(from, nearest) {
  return {
    type: SEARCH_NEAREST_SUCCESS,
    payload: { from, nearest },
  };
}

export function searchNearestFailureAction() {
  return {
    type: SEARCH_NEAREST_FAILURE,
  };
}

export function clearSearchNearestResultAction() {
  return {
    type: CLEAR_SEARCH_NEAREST_RESULT,
  };
}

const initialState = {
  loading: false,
  success: false,
  failure: false,
  nearest: null,
  from: null,
};

export const searchNearestPropType = PropTypes.shape({
  loading: PropTypes.bool.isRequired,
  failure: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  nearest: PropTypes.shape({
    name: PropTypes.string.isRequired,
    floor: PropTypes.string.isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.number),
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
  }),
  from: PropTypes.shape({
    name: PropTypes.string.isRequired,
    floor: PropTypes.string.isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.number),
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
  }),
});

const searchNearest = (state = initialState, { type, payload }) => {
  switch (type) {
    case CLEAR_SEARCH_NEAREST_RESULT:
      return {
        ...initialState,
      };
    case SEARCH_NEAREST:
      return {
        ...initialState,
        loading: true,
      };
    case SEARCH_NEAREST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        from: { ...payload.from },
        nearest: { ...payload.nearest },
      };
    case SEARCH_NEAREST_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        failure: true,
      };
    default:
      return state;
  }
};

export default searchNearest;
