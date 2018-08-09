export const GET_AUTOCOMPLETE = 'GET_AUTOCOMPLETE';
export const GET_AUTOCOMPLETE_SUCCESS = 'GET_AUTOCOMPLETE_SUCCESS';
export const GET_AUTOCOMPLETE_FAILURE = 'GET_AUTOCOMPLETE_FAILURE';

export function getAutoCompleteAction(keyword) {
  return {
    type: GET_AUTOCOMPLETE,
    payload: { keyword },
  };
}

export function getAutoCompleteSuccessAction(suggestions) {
  return {
    type: GET_AUTOCOMPLETE_SUCCESS,
    payload: { suggestions },
  };
}

export function getAutoCompleteFailureAction() {
  return {
    type: GET_AUTOCOMPLETE_FAILURE,
  };
}

const initialState = {
  loading: false,
  failure: false,
  success: false,
  suggestions: [],
};

const autoComplete = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_AUTOCOMPLETE:
      return {
        ...initialState,
        loading: true,
      };
    case GET_AUTOCOMPLETE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        suggestions: payload.suggestions,
      };
    case GET_AUTOCOMPLETE_FAILURE:
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

export default autoComplete;
