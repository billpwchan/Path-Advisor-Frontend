import { all } from 'redux-saga/effects';
import autoCompleteRequestWatcher from './watchers/autoCompleteRequestWatcher';
import mapItemsRequestWatcher from './watchers/mapItemsRequestWatcher';
import searchNearestRequestWatcher from './watchers/searchNearestRequestWatcher';
import searchShortestPathRequestWatcher from './watchers/searchShortestPathRequestWatcher';

export default function* rootSaga() {
  yield all([
    autoCompleteRequestWatcher(),
    mapItemsRequestWatcher(),
    searchNearestRequestWatcher(),
    searchShortestPathRequestWatcher(),
  ]);
}
