import { put, takeLatest, call } from 'redux-saga/effects';
import searchShortestPathRequest from '../requests/searchShortestPathRequest';
import {
  SEARCH_SHORTEST_PATH,
  searchShortestPathSuccessAction,
  searchShortestPathFailureAction,
} from '../../reducers/searchShortestPath';

function* searchShortestPathRequestWorker({
  payload: {
    from: { keyword: fromKeyword, nodeId: fromNodeId, floor: fromFloor },
    to: { keyword: toKeyword, nodeId: toNodeId, floor: toFloor },
  },
}) {
  try {
    const { data } = yield call(
      searchShortestPathRequest,
      { keyword: fromKeyword, nodeId: fromNodeId, floor: fromFloor },
      { keyword: toKeyword, nodeId: toNodeId, floor: toFloor },
    );
    yield put(searchShortestPathSuccessAction(data));
  } catch (error) {
    console.error(error);
    yield put(searchShortestPathFailureAction());
  }
}

export default function* searchShortestPathRequestWatcher() {
  yield takeLatest(SEARCH_SHORTEST_PATH, searchShortestPathRequestWorker);
}
