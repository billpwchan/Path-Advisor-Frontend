import PropTypes from 'prop-types';

export const GET_SETTINGS = 'GET_SETTINGS';
export const GET_SETTINGS_SUCCESS = 'GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAILURE = 'GET_SETTINGS_FAILURE';

export function getSettingsAction() {
  return {
    type: GET_SETTINGS,
  };
}

export function getSettingsSuccessAction(settings) {
  return {
    type: GET_SETTINGS_SUCCESS,
    payload: settings,
  };
}

export function getSettingsFailureAction() {
  return {
    type: GET_SETTINGS_FAILURE,
  };
}

const initialState = {
  loading: false,
  failure: false,
  success: false,
};

export const appSettingsPropType = PropTypes.shape({
  success: PropTypes.bool.isRequired,
  failure: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  defaultPosition: PropTypes.shape({
    floor: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
  }),
  mobileDefaultPosition: PropTypes.shape({
    floor: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
  }),
  minutesPerMeter: PropTypes.number,
  highestLevel: PropTypes.number,
  lowestLevel: PropTypes.number,
  levelToScale: PropTypes.arrayOf(PropTypes.number),
});

const appSettings = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_SETTINGS:
      return {
        ...initialState,
        loading: true,
      };
    case GET_SETTINGS_SUCCESS:
      return {
        ...state,
        ...payload,
        loading: false,
        success: true,
        failure: false,
      };
    case GET_SETTINGS_FAILURE:
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

export default appSettings;
