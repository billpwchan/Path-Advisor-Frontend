import { all } from 'redux-saga/effects';
import autoCompleteRequestWatcher from './autoCompleteRequestWatcher';
import mapItemsRequest from './mapItemsRequest';

export default function* rootSaga() {
  yield all([autoCompleteRequestWatcher(), mapItemsRequest()]);
}
