import { delay } from 'redux-saga';
import { put, takeLatest, all } from 'redux-saga/effects';

function* getAutoComplete({ payload: { keyword } }) {
  console.log('request keyword', keyword);
  yield delay(2000);
  yield put({
    type: 'GET_AUTOCOMPLETE_REQUEST_SUCCESS',
    payload: [{ name: 'Cafe', floor: '1', coordinates: [1, 1], id: 'p12', type: null }],
  });
}

function* watchGetAutoCompleteRequest() {
  yield takeLatest('GET_AUTOCOMPLETE_REQUEST', getAutoComplete);
}

export default function* rootSaga() {
  yield all([watchGetAutoCompleteRequest()]);
}
