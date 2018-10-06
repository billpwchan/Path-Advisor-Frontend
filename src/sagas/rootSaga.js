import { all } from 'redux-saga/effects';
import searchMapItemRequestWatcher from './watchers/searchMapItemRequestWatcher';
import mapItemsRequestWatcher from './watchers/mapItemsRequestWatcher';
import searchNearestRequestWatcher from './watchers/searchNearestRequestWatcher';
import searchShortestPathRequestWatcher from './watchers/searchShortestPathRequestWatcher';

export default function* rootSaga() {
  yield all([
    searchMapItemRequestWatcher(),
    mapItemsRequestWatcher(),
    searchNearestRequestWatcher(),
    searchShortestPathRequestWatcher(),
  ]);
}
