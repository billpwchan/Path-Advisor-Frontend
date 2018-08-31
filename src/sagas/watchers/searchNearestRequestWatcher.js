import { put, takeLatest, call } from 'redux-saga/effects';
import searchNearestRequest from '../requests/searchNearestRequest';
import {
  SEARCH_NEAREST,
  searchNearestSuccessAction,
  searchNearestFailureAction,
} from '../../reducers/searchNearest';

import { searchShortestPathAction } from '../../reducers/searchShortestPath';

function* searchNearestRequestWorker({ payload: { floor, name, nearestType, sameFloor } }) {
  try {
    const { data } = yield call(searchNearestRequest, floor, name, nearestType, sameFloor);
    yield put(searchNearestSuccessAction(data));

    const {
      from: { id: fromId, floor: fromFloor },
      nearest: { id: nearestId, floor: nearestFloor },
    } = data;

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

/**
lift
LIFT 25;p114;2544,898;3;p142;3;ROOM 3542
http://pathadvisor.ust.hk/phplib/search.php?keyword=ROOM%203542&floor=3&type=lift&same_floor=yes&d_roomId=p142&d_floor=3
*/
