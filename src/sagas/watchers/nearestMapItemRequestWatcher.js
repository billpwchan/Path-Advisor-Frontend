import { put, takeLatest, call } from 'redux-saga/effects';
import fetchMapItemByCoorRequest from '../requests/fetchMapItemByCoorRequest';

import {
  GET_NEAREST_MAP_ITEM,
  getNearestMapItemFailureAction,
  getNearestMapItemSuccessAction,
} from '../../reducers/nearestMapItem';

function* nearestMapItemWorker({ payload: { floor, coordinates } }) {
  try {
    const { data } = yield call(fetchMapItemByCoorRequest, floor, coordinates);
    yield put(getNearestMapItemSuccessAction(data));
  } catch (error) {
    console.error(error);
    yield put(getNearestMapItemFailureAction());
  }
}

export default function* mapItemsRequestWatcher() {
  yield takeLatest(GET_NEAREST_MAP_ITEM, nearestMapItemWorker);
}
