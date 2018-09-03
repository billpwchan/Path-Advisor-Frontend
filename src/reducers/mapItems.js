export const GET_MAP_ITEMS = 'GET_MAP_ITEMS';
export const GET_MAP_ITEMS_SUCCESS = 'GET_MAP_ITEMS_SUCCESS';
export const GET_MAP_ITEMS_FAILURE = 'GET_MAP_ITEMS_FAILURE';

/**
 * @param {string} floor
 * @param {number[]} coordinates
 * @param {number[]} diagonalCoordinates
 * @return {object}
 */
export function getMapItemsAction(floor, coordinates, diagonalCoordinates) {
  return {
    type: GET_MAP_ITEMS,
    payload: { floor, coordinates, diagonalCoordinates },
  };
}

export function getMapItemsSuccessAction(mapItems) {
  return {
    type: GET_MAP_ITEMS_SUCCESS,
    payload: { mapItems },
  };
}

export function getMapItemsFailureAction() {
  return {
    type: GET_MAP_ITEMS_FAILURE,
  };
}

const initialState = {
  loading: false,
  success: false,
  failure: false,
  mapItems: [],
};

const mapItems = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_MAP_ITEMS:
      return {
        ...initialState,
        loading: true,
      };
    case GET_MAP_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        mapItems: payload.mapItems,
      };
    case GET_MAP_ITEMS_FAILURE:
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

export default mapItems;
