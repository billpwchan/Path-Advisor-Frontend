import { put, takeLatest, call } from 'redux-saga/effects';
import searchMapItemRequest from '../requests/searchMapItemRequest';

import {
  SEARCH_MAP_ITEM,
  searchMapItemSuccessAction,
  searchMapItemFailureAction,
} from '../../reducers/searchMapItem';

function* searchMapItemRequestWorker({ payload: { keyword } }) {
  try {
    const { data } = yield call(searchMapItemRequest, keyword);
    yield put(searchMapItemSuccessAction(data));
  } catch (error) {
    console.error(error);
    yield put(searchMapItemFailureAction());
  }
}

export default function* searchMapItemRequestWatcher() {
  yield takeLatest(SEARCH_MAP_ITEM, searchMapItemRequestWorker);
}
