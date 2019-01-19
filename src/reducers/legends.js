import PropTypes from 'prop-types';

export const GET_LEGENDS = 'GET_LEGENDS';
export const GET_LEGENDS_SUCCESS = 'GET_LEGENDS_SUCCESS';
export const GET_LEGENDS_FAILURE = 'GET_LEGENDS_FAILURE';
export const UPDATE_LEGEND_DISPLAY = 'UPDATE_LEGEND_DISPLAY';

export function getLegendsAction() {
  return {
    type: GET_LEGENDS,
  };
}

export function getLegendsSuccessAction({ legends: _legends, legendIds }) {
  const legends = { ..._legends };

  Object.keys(legends).forEach(key => {
    legends[key].display = true;
  });

  return {
    type: GET_LEGENDS_SUCCESS,
    payload: { legends, legendIds },
  };
}

export function getLegendsFailureAction() {
  return {
    type: GET_LEGENDS_FAILURE,
  };
}

export function updateLegendDisplayAction(legendType, display) {
  return {
    type: UPDATE_LEGEND_DISPLAY,
    payload: {
      legendType,
      display,
    },
  };
}

const initialState = {
  loading: false,
  failure: false,
  success: false,
};

const legends = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_LEGENDS:
      return {
        ...initialState,
        loading: true,
      };
    case GET_LEGENDS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        legends: payload.legends,
        legendIds: payload.legendIds,
      };
    case GET_LEGENDS_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        failure: true,
      };
    case UPDATE_LEGEND_DISPLAY:
      return {
        ...state,
        legends: {
          ...state.legends,
          [payload.legendType]: {
            ...state.legends[payload.legendType],
            display: payload.display,
          },
        },
      };
    default:
      return state;
  }
};

export const legendsPropType = PropTypes.shape({
  loading: PropTypes.bool.isRequired,
  failure: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  legendIds: PropTypes.arrayOf(PropTypes.string),
  legends: PropTypes.objectOf(
    PropTypes.shape({
      display: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
    }),
  ),
});

export default legends;
