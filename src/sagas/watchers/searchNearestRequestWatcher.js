import { put, takeLatest, call } from 'redux-saga/effects';
import searchNearestRequest from '../requests/searchNearestRequest';
import {
  SEARCH_NEAREST,
  searchNearestSuccessAction,
  searchNearestFailureAction,
} from '../../reducers/searchNearest';

import { searchShortestPathAction } from '../../reducers/searchShortestPath';

function* searchNearestRequestWorker({ payload: { name, nearestType, sameFloor, id } }) {
  try {
    const {
      data: { from, nearest },
    } = yield call(searchNearestRequest, name, nearestType, sameFloor, id);

    if (!nearest.id) {
      yield put(searchNearestFailureAction());
      return;
    }

    yield put(searchNearestSuccessAction(from, nearest));

    const { id: fromId, floor: fromFloor } = from;
    const { id: nearestId, floor: nearestFloor } = nearest;

    yield put(
      searchShortestPathAction(
        { id: fromId, floor: fromFloor },
        { id: nearestId, floor: nearestFloor },
      ),
    );
  } catch (error) {
    console.error(error);
    yield put(searchNearestFailureAction());
  }
}

export default function* searchNearestRequestWatcher() {
  yield takeLatest(SEARCH_NEAREST, searchNearestRequestWorker);
}
