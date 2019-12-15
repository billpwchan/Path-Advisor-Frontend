import PropTypes from 'prop-types';

export const SEARCH_MODES = {
  SHORTEST_TIME: 'SHORTEST_TIME',
  SHORTEST_DISTANCE: 'SHORTEST_DISTANCE',
  MIN_NO_OF_LIFTS: 'MIN_NO_OF_LIFTS',
};

export const ACTION_SOURCE = {
  EXTERNAL_LINK: 'EXTERNAL_LINK',
  BUTTON_CLICK: 'BUTTON_CLICK',
  DRAG_AND_DROP: 'DRAG_AND_DROP',
  CONTEXT_MENU: 'CONTEXT_MENU',
};

export const searchOptionsPropTypes = PropTypes.shape({
  sameFloor: PropTypes.bool,
  noStairCase: PropTypes.bool,
  noEscalator: PropTypes.bool,
  stepFreeAccess: PropTypes.bool,
  searchMode: PropTypes.string,
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
