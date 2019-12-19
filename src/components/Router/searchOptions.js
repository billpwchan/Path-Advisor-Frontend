import PropTypes from 'prop-types';

export const SEARCH_MODES = {
  SHORTEST_TIME: 'SHORTEST_TIME',
  SHORTEST_DISTANCE: 'SHORTEST_DISTANCE',
  MIN_NO_OF_LIFTS: 'MIN_NO_OF_LIFTS',
};

export const searchOptionsPropType = PropTypes.shape({
  sameFloor: PropTypes.bool.isRequired,
  noStairCase: PropTypes.bool.isRequired,
  noEscalator: PropTypes.bool.isRequired,
  stepFreeAccess: PropTypes.bool.isRequired,
  searchMode: PropTypes.string.isRequired,
});

// default should not be changed once made public as it affect URL behavior
// (i.e. URL without search option params will be assumed having the following default)
export const defaultSearchOptions = {
  sameFloor: true,
  noStairCase: true,
  noEscalator: false,
  stepFreeAccess: false,
  searchMode: SEARCH_MODES.SHORTEST_TIME,
};
