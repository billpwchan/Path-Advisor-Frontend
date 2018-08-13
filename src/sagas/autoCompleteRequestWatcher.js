import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import compact from 'lodash.compact';
import {
  GET_AUTOCOMPLETE,
  getAutoCompleteSuccessAction,
  getAutoCompleteFailureAction,
} from '../reducers/autoComplete';

function fetchAutoCompleteRequest(keyword) {
  return axios.get(
    `http://pathadvisor.ust.hk/phplib/keyword_suggestion.php?keyword=${encodeURIComponent(
      keyword,
    )}&floor=Overall`,
  );
}

// TO-DO: remove wrapper after backend api updated
function fetchAutoCompleteResponseWrapper(data) {
  if (typeof data !== 'string') {
    return [];
  }

  const mapItemStrings = compact(data.split('\n'));
  return mapItemStrings.map(mapItemString => {
    const mapItemValues = mapItemString.split(';');
    const coordinates = mapItemValues[2].split(',').map(v => parseInt(v, 10));
    return {
      name: mapItemValues[0],
      floor: mapItemValues[3],
      coordinates,
      id: mapItemValues[1],
      type: null,
    };
  });
}

function* autoCompleteRequestWorker({ payload: { keyword } }) {
  let response = {};

  try {
    response = yield call(fetchAutoCompleteRequest, keyword);
  } catch (error) {
    console.error(error);
    yield put(getAutoCompleteFailureAction());
    return;
  }

  yield put(getAutoCompleteSuccessAction(fetchAutoCompleteResponseWrapper(response.data)));
}

export default function* autoCompleteRequestWatcher() {
  yield takeLatest(GET_AUTOCOMPLETE, autoCompleteRequestWorker);
}
