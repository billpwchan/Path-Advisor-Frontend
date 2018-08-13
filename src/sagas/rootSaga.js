import { all } from 'redux-saga/effects';
import autoCompleteRequestWatcher from './autoCompleteRequestWatcher';
import mapItemsRequestWatcher from './mapItemsRequestWatcher';
import searchNearestRequestWatcher from './searchNearestRequestWatcher';

export default function* rootSaga() {
  yield all([
    autoCompleteRequestWatcher(),
    mapItemsRequestWatcher(),
    searchNearestRequestWatcher(),
  ]);
}
