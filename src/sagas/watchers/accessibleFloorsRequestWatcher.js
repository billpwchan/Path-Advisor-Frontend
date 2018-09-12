import { put, takeLatest, call } from 'redux-saga/effects';
import fetchAccessibleFloorsRequest from '../requests/fetchAccessibleFloorsRequest';

import {
  GET_ACCESSIBLE_FLOORS,
  getAccessibleFloorsSuccessAction,
  getAccessibleFloorsFailureAction,
} from '../../reducers/accessibleFloors';

function* accessibleFloorRequestWorker({ payload: { floor, lift } }) {
  try {
    const { data } = yield call(fetchAccessibleFloorsRequest, floor, lift);
    yield put(getAccessibleFloorsSuccessAction(floor, lift, data));
  } catch (error) {
    console.error(error);
    yield put(getAccessibleFloorsFailureAction());
  }
}

export default function* mapItemsRequestWatcher() {
  yield takeLatest(GET_ACCESSIBLE_FLOORS, accessibleFloorRequestWorker);
}
