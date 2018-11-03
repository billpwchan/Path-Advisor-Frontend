import PropTypes from 'prop-types';

export const SET_SEARCH_AREA_INPUT = 'SET_SEARCH_AREA_INPUT';

export const SEARCH_MODES = {
  SHORTEST_TIME: 'SHORTEST_TIME',
  SHORTEST_DISTANCE: 'SHORTEST_DISTANCE',
  MIN_NO_OF_LIFTS: 'MIN_NO_OF_LIFTS',
};

export const searchAreaInputPropTypes = PropTypes.shape({
  searchOptions: PropTypes.shape({
    sameFloor: PropTypes.bool,
    noStairCase: PropTypes.bool,
    noEscalator: PropTypes.bool,
    searchMode: PropTypes.string,
  }),
});

const initialState = {
  searchOptions: {
    sameFloor: true,
    noStairCase: true,
    noEscalator: false,
    searchMode: SEARCH_MODES.SHORTEST_TIME,
  },
};

export function setSearchAreaInputAction(payload) {
  return {
    type: SET_SEARCH_AREA_INPUT,
    payload,
  };
}

const searchAreaInput = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SEARCH_AREA_INPUT:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export default searchAreaInput;
