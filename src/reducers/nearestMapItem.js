export const GET_NEAREST_MAP_ITEM = 'GET_NEAREST_MAP_ITEM';
export const GET_NEAREST_MAP_ITEM_SUCCESS = 'GET_NEAREST_MAP_ITEM_SUCCESS';
export const GET_NEAREST_MAP_ITEM_FAILURE = 'GET_NEAREST_MAP_ITEM_FAILURE';

/**
 * @param {string} floor
 * @param {number[]} coordinates
 * @return {object}
 */
export function getNearestMapItemAction(floor, coordinates) {
  return {
    type: GET_NEAREST_MAP_ITEM,
    payload: { floor, coordinates },
  };
}

export function getNearestMapItemSuccessAction(mapItem) {
  return {
    type: GET_NEAREST_MAP_ITEM_SUCCESS,
    payload: { mapItem },
  };
}

export function getNearestMapItemFailureAction() {
  return {
    type: GET_NEAREST_MAP_ITEM_FAILURE,
  };
}

const initialState = {
  loading: false,
  success: false,
  failure: false,
  mapItem: null,
};

const nearestMapItem = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_NEAREST_MAP_ITEM:
      return {
        ...initialState,
        loading: true,
      };
    case GET_NEAREST_MAP_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        mapItem: payload.mapItem,
      };
    case GET_NEAREST_MAP_ITEM_FAILURE:
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

export default nearestMapItem;
