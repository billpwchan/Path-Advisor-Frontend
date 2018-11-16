import PropTypes from 'prop-types';

export const SEARCH_MAP_ITEM = 'SEARCH_MAP_ITEM';
export const SEARCH_MAP_ITEM_SUCCESS = 'SEARCH_MAP_ITEM_SUCCESS';
export const SEARCH_MAP_ITEM_FAILURE = 'SEARCH_MAP_ITEM_FAILURE';

export function searchMapItemAction(keyword) {
  return {
    type: SEARCH_MAP_ITEM,
    payload: { keyword },
  };
}

export function searchMapItemSuccessAction(suggestions) {
  return {
    type: SEARCH_MAP_ITEM_SUCCESS,
    payload: { suggestions },
  };
}

export function searchMapItemFailureAction() {
  return {
    type: SEARCH_MAP_ITEM_FAILURE,
  };
}

const initialState = {
  loading: false,
  failure: false,
  success: false,
  suggestions: [],
};

export const searchMapItemPropTypes = PropTypes.shape({
  loading: PropTypes.bool.isRequired,
  failure: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      floor: PropTypes.string.isRequired,
      coordinates: PropTypes.arrayOf(PropTypes.number),
      id: PropTypes.string.isRequired,
      type: PropTypes.string,
    }),
  ).isRequired,
});

const searchMapItem = (state = initialState, { type, payload }) => {
  switch (type) {
    case SEARCH_MAP_ITEM:
      return {
        ...initialState,
        loading: true,
      };
    case SEARCH_MAP_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        suggestions: payload.suggestions,
      };
    case SEARCH_MAP_ITEM_FAILURE:
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

export default searchMapItem;
