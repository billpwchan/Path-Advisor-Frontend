import PropTypes from 'prop-types';

export const SET_SEARCH_OPTIONS = 'SET_SEARCH_OPTIONS';

export const SEARCH_MODES = {
  SHORTEST_TIME: 'SHORTEST_TIME',
  SHORTEST_DISTANCE: 'SHORTEST_DISTANCE',
  MIN_NO_OF_LIFTS: 'MIN_NO_OF_LIFTS',
};

export const searchOptionsPropTypes = PropTypes.shape({
  sameFloor: PropTypes.bool,
  noStairCase: PropTypes.bool,
  noEscalator: PropTypes.bool,
  searchMode: PropTypes.string,
});

const initialState = {
  sameFloor: true,
  noStairCase: true,
  noEscalator: false,
  searchMode: SEARCH_MODES.SHORTEST_TIME,
};

export function setSearchOptionsAction(payload) {
  return {
    type: SET_SEARCH_OPTIONS,
    payload,
  };
}

const searchOptions = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SEARCH_OPTIONS:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export default searchOptions;
