export const SEARCH_SHORTEST_PATH = 'SEARCH_SHORTEST_PATH';
export const SEARCH_SHORTEST_PATH_SUCCESS = 'SEARCH_SHORTEST_PATH_SUCCESS';
export const SEARCH_SHORTEST_PATH_FAILURE = 'SEARCH_SHORTEST_PATH_FAILURE';
export const CLEAR_SEARCH_SHORTEST_PATH_RESULT = 'CLEAR_SEARCH_SHORTEST_PATH_RESULT';
export const UPDATE_SEARCH_SHORTEST_PATH_SETTINGS = 'UPDATE_SEARCH_SHORTEST_PATH_SETTINGS';

export const SEARCH_MODES = {
  SHORTEST_TIME: 'SHORTEST_TIME',
  SHORTEST_DISTANCE: 'SHORTEST_DISTANCE',
  MIN_NO_OF_LIFTS: 'MIN_NO_OF_LIFTS',
};

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

export function updateSearchShortestPathSettingAction(noStairCase, noEscalator, searchMode) {
  return {
    type: UPDATE_SEARCH_SHORTEST_PATH_SETTINGS,
    payload: { noStairCase, noEscalator, searchMode },
  };
}

const initialResult = {
  loading: false,
  success: false,
  failure: false,
  paths: [],
};

const initialSettings = {
  settings: {
    noStairCase: true,
    noEscalator: false,
    searchMode: SEARCH_MODES.SHORTEST_TIME,
  },
};

const searchShortestPath = (
  state = { ...initialResult, ...initialSettings },
  { type, payload },
) => {
  switch (type) {
    case CLEAR_SEARCH_SHORTEST_PATH_RESULT:
      return {
        ...state,
        ...initialResult,
      };
    case UPDATE_SEARCH_SHORTEST_PATH_SETTINGS:
      return {
        ...state,
        settings: { ...payload },
      };
    case SEARCH_SHORTEST_PATH:
      return {
        ...state,
        ...initialResult,
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
