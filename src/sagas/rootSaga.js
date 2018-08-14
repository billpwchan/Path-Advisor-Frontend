import { all } from 'redux-saga/effects';
import autoCompleteRequestWatcher from './watchers/autoCompleteRequestWatcher';
import mapItemsRequestWatcher from './watchers/mapItemsRequestWatcher';
import searchNearestRequestWatcher from './watchers/searchNearestRequestWatcher';

import fetchIdToNodeIdRequest from './requests/fetchIdToNodeIdRequest';
import fetchNodeIdsToIdsRequest from './requests/fetchNodeIdsToIdsRequest';

export default function* rootSaga() {
  yield all([
    autoCompleteRequestWatcher(),
    mapItemsRequestWatcher(),
    searchNearestRequestWatcher(),
  ]);
}
