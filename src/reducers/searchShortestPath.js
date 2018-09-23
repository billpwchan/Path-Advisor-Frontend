export const SEARCH_SHORTEST_PATH = 'SEARCH_SHORTEST_PATH';
export const SEARCH_SHORTEST_PATH_SUCCESS = 'SEARCH_SHORTEST_PATH_SUCCESS';
export const SEARCH_SHORTEST_PATH_FAILURE = 'SEARCH_SHORTEST_PATH_FAILURE';
export const CLEAR_SEARCH_SHORTEST_PATH_RESULT = 'CLEAR_SEARCH_SHORTEST_PATH_RESULT';
/**
 * @typedef {object} requestNode
 * @property {string} [nodeId]
 * @property {string} [floor]
 * @property {string} [keyword]
 * @property {string} [id]
 */
/**
 * @param {requestNode} [from]
 * @param {requestNode} [to]
 */
export function searchShortestPathAction(from, to) {
  return {
    type: SEARCH_SHORTEST_PATH,
    payload: { from, to },
  };
}

export function searchShortestPathSuccessAction(paths) {
  return {
    type: SEARCH_SHORTEST_PATH_SUCCESS,
    payload: { paths },
  };
}

export function searchShortestPathFailureAction() {
  return {
    type: SEARCH_SHORTEST_PATH_FAILURE,
  };
}

export function clearSearchShortestPathResultAction() {
  return {
    type: CLEAR_SEARCH_SHORTEST_PATH_RESULT,
  };
}

const initialState = {
  loading: false,
  success: false,
  failure: false,
  paths: [],
};

const searchShortestPath = (state = initialState, { type, payload }) => {
  switch (type) {
    case CLEAR_SEARCH_SHORTEST_PATH_RESULT:
      return {
        ...initialState,
      };
    case SEARCH_SHORTEST_PATH:
      return {
        ...initialState,
        loading: true,
      };
    case SEARCH_SHORTEST_PATH_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        paths: [...payload.paths],
      };
    case SEARCH_SHORTEST_PATH_FAILURE:
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

export default searchShortestPath;
