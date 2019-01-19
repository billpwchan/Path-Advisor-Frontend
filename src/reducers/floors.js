import PropTypes from 'prop-types';

export const GET_FLOORS = 'GET_FLOORS';
export const GET_FLOORS_SUCCESS = 'GET_FLOORS_SUCCESS';
export const GET_FLOORS_FAILURE = 'GET_FLOORS_FAILURE';

export function getFloorsAction() {
  return {
    type: GET_FLOORS,
  };
}

export function getFloorsSuccessAction({ floors, buildingIds, buildings }) {
  return {
    type: GET_FLOORS_SUCCESS,
    payload: { floors, buildingIds, buildings },
  };
}

export function getFloorsFailureAction() {
  return {
    type: GET_FLOORS_FAILURE,
  };
}

const initialState = {
  loading: false,
  failure: false,
  success: false,
};

export const floorsPropType = PropTypes.shape({
  loading: PropTypes.bool.isRequired,
  failure: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  buildingIds: PropTypes.arrayOf(PropTypes.string),
  floors: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
      buildingId: PropTypes.string.isRequired,
      meterPerPixel: PropTypes.number.isRequired,
      mapWidth: PropTypes.number.isRequired,
      mapHeight: PropTypes.number.isRequired,
      ratio: PropTypes.number.isRequired,
      defaultX: PropTypes.number.isRequired,
      defaultY: PropTypes.number.isRequired,
      defaultLevel: PropTypes.number.isRequired,
      mobileDefaultX: PropTypes.number.isRequired,
      mobileDefaultY: PropTypes.number.isRequired,
      mobileDefaultLevel: PropTypes.number.isRequired,
    }),
  ),
  buildings: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      floorIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ),
});

const floors = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_FLOORS:
      return {
        ...initialState,
        loading: true,
      };
    case GET_FLOORS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        floors: payload.floors,
        buildingIds: payload.buildingIds,
        buildings: payload.buildings,
      };
    case GET_FLOORS_FAILURE:
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

export default floors;
