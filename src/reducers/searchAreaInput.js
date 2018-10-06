export const SET_SEARCH_AREA_INPUT = 'SET_SEARCH_AREA_INPUT';

export const SEARCH_MODES = {
  SHORTEST_TIME: 'SHORTEST_TIME',
  SHORTEST_DISTANCE: 'SHORTEST_DISTANCE',
  MIN_NO_OF_LIFTS: 'MIN_NO_OF_LIFTS',
};

const initialState = {
  from: { name: '', data: {} },
  to: { name: '', data: {} },
  searchOptions: {
    sameFloor: false,
    noStairCase: true,
    noEscalator: false,
    searchMode: SEARCH_MODES.SHORTEST_TIME,
  },
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
