import { all } from 'redux-saga/effects';
import autoCompleteRequestWatcher from './watchers/autoCompleteRequestWatcher';
import mapItemsRequestWatcher from './watchers/mapItemsRequestWatcher';
import searchNearestRequestWatcher from './watchers/searchNearestRequestWatcher';

import idToNodeRequest from './requests/idToNodeIdRequest';

export default function* rootSaga() {
  yield all([
    autoCompleteRequestWatcher(),
    mapItemsRequestWatcher(),
    searchNearestRequestWatcher(),
  ]);
}
