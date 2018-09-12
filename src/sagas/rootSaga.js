import { all } from 'redux-saga/effects';
import autoCompleteRequestWatcher from './watchers/autoCompleteRequestWatcher';
import mapItemsRequestWatcher from './watchers/mapItemsRequestWatcher';
import searchNearestRequestWatcher from './watchers/searchNearestRequestWatcher';
import searchShortestPathRequestWatcher from './watchers/searchShortestPathRequestWatcher';
import accessibleFloorsRequestWatcher from './watchers/accessibleFloorsRequestWatcher';

export default function* rootSaga() {
  yield all([
    autoCompleteRequestWatcher(),
    mapItemsRequestWatcher(),
    searchNearestRequestWatcher(),
    searchShortestPathRequestWatcher(),
    accessibleFloorsRequestWatcher(),
  ]);
}
