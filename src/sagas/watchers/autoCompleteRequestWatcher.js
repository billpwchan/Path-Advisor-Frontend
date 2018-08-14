import { put, takeLatest, call } from 'redux-saga/effects';
import fetchAutoCompleteRequest from '../requests/fetchAutoCompleteRequest';

import {
  GET_AUTOCOMPLETE,
  getAutoCompleteSuccessAction,
  getAutoCompleteFailureAction,
} from '../../reducers/autoComplete';

function* autoCompleteRequestWorker({ payload: { keyword } }) {
  try {
    const { data } = yield call(fetchAutoCompleteRequest, keyword);
    yield put(getAutoCompleteSuccessAction(data));
  } catch (error) {
    console.error(error);
    yield put(getAutoCompleteFailureAction());
  }
}

export default function* autoCompleteRequestWatcher() {
  yield takeLatest(GET_AUTOCOMPLETE, autoCompleteRequestWorker);
}
