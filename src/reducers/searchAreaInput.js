export const SET_SEARCH_AREA_INPUT = 'SET_SEARCH_AREA_INPUT';

const initialState = {
  from: { name: '' },
  to: { name: '' },
  searchOptions: { sameFloor: false },
  searchInputOrders: ['SearchInput', 'SearchNearest'],
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
