import { put, takeLatest, call } from 'redux-saga/effects';
import fetchMapItemsRequest from '../requests/fetchMapItemsRequest';

import {
  GET_MAP_ITEMS,
  getMapItemsSuccessAction,
  getMapItemsFailureAction,
} from '../../reducers/mapItems';

function* mapItemsRequestWorker({ payload: { floor, coordinates, diagonalCoordinates } }) {
  try {
    const { data } = yield call(fetchMapItemsRequest, floor, coordinates, diagonalCoordinates);
    yield put(getMapItemsSuccessAction(data));
  } catch (error) {
    console.error(error);
    yield put(getMapItemsFailureAction());
  }
}

export default function* mapItemsRequestWatcher() {
  yield takeLatest(GET_MAP_ITEMS, mapItemsRequestWorker);
}
