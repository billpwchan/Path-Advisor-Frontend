import { put, takeLatest, call } from 'redux-saga/effects';
import searchNearestRequest from '../requests/searchNearestRequest';
import {
  SEARCH_NEAREST,
  searchNearestSuccessAction,
  searchNearestFailureAction,
} from '../../reducers/searchNearest';

function* searchNearestRequestWorker({
  payload: { name, nearestType, sameFloor, id, searchOptions },
}) {
  try {
    const { noStairCase, noEscalator, searchMode, stepFreeAccess } = searchOptions;

    const {
      data: { from, nearest },
    } = yield call(searchNearestRequest, name, nearestType, sameFloor, id, {
      noStairCase,
      noEscalator,
      searchMode,
      stepFreeAccess,
    });

    if (!nearest.id) {
      yield put(searchNearestFailureAction());
      return;
    }

    yield put(searchNearestSuccessAction(from, nearest));
  } catch (error) {
    console.error(error);
    yield put(searchNearestFailureAction());
  }
}

export default function* searchNearestRequestWatcher() {
  yield takeLatest(SEARCH_NEAREST, searchNearestRequestWorker);
}
