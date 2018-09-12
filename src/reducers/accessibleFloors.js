export const GET_ACCESSIBLE_FLOORS = 'GET_ACCESSIBLE_FLOORS';
export const GET_ACCESSIBLE_FLOORS_SUCCESS = 'GET_ACCESSIBLE_FLOORS_SUCCESS';
export const GET_ACCESSIBLE_FLOORS_FAILURE = 'GET_ACCESSIBLE_FLOORS_FAILURE';

/**
 * @param {string} floor
 * @param {string} lift
 */
export function getAccessibleFloorsAction(floor, lift) {
  return {
    type: GET_ACCESSIBLE_FLOORS,
    payload: { floor, lift },
  };
}

export function getAccessibleFloorsSuccessAction(floor, lift, accessibleFloors) {
  return {
    type: GET_ACCESSIBLE_FLOORS_SUCCESS,
    payload: { accessibleFloors: { [`${floor}_${lift}`]: accessibleFloors } },
  };
}

export function getAccessibleFloorsFailureAction() {
  return {
    type: GET_ACCESSIBLE_FLOORS_FAILURE,
  };
}

const initialState = {
  loading: false,
  success: false,
  failure: false,
  accessibleFloors: {},
};

const accessibleFloors = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_ACCESSIBLE_FLOORS:
      return {
        ...initialState,
        loading: true,
      };
    case GET_ACCESSIBLE_FLOORS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        accessibleFloors: { ...state.accessibleFloors, ...payload.accessibleFloors },
      };
    case GET_ACCESSIBLE_FLOORS_FAILURE:
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

export default accessibleFloors;
