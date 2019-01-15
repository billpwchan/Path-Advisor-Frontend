export const SEARCH_NEAREST = 'SEARCH_NEAREST';
export const SEARCH_NEAREST_SUCCESS = 'SEARCH_NEAREST_SUCCESS';
export const SEARCH_NEAREST_FAILURE = 'SEARCH_NEAREST_FAILURE';
export const CLEAR_SEARCH_NEAREST_RESULT = 'CLEAR_SEARCH_NEAREST_RESULT';
/**
 * @param {string} floor
 * @param {string} name
 * @param {string} nearestType
 * @param {boolean} sameFloor
 * @param {string} id
 */
export function searchNearestAction(floor, name, nearestType, sameFloor, id) {
  return {
    type: SEARCH_NEAREST,
    payload: { floor, name, nearestType, sameFloor, id },
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
