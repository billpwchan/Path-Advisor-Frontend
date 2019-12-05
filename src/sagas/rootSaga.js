import { all } from 'redux-saga/effects';
import searchMapItemRequestWatcher from './watchers/searchMapItemRequestWatcher';
import mapItemsRequestWatcher from './watchers/mapItemsRequestWatcher';
import searchNearestRequestWatcher from './watchers/searchNearestRequestWatcher';
import searchShortestPathRequestWatcher from './watchers/searchShortestPathRequestWatcher';
import fetchInitDataRequestWatcher from './watchers/fetchInitDataRequestWatcher';
import nearestMapItemRequestWatcher from './watchers/nearestMapItemRequestWatcher';

export default function* rootSaga() {
  yield all([
    searchMapItemRequestWatcher(),
    mapItemsRequestWatcher(),
    searchNearestRequestWatcher(),
    searchShortestPathRequestWatcher(),
    fetchInitDataRequestWatcher(),
    nearestMapItemRequestWatcher(),
  ]);
}
