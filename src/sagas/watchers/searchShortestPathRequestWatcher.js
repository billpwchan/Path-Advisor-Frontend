import { put, takeLatest, call, select } from 'redux-saga/effects';
import searchShortestPathRequest from '../requests/searchShortestPathRequest';
import {
  SEARCH_SHORTEST_PATH,
  searchShortestPathSuccessAction,
  searchShortestPathFailureAction,
} from '../../reducers/searchShortestPath';

function* searchShortestPathRequestWorker({
  payload: {
    from: { keyword: fromKeyword, nodeId: fromNodeId, floor: fromFloor, id: fromId },
    to: { keyword: toKeyword, nodeId: toNodeId, floor: toFloor, id: toId },
  },
}) {
  try {
    const { settings } = yield select(state => state.searchShortestPath);

    const { data } = yield call(
      searchShortestPathRequest,
      { keyword: fromKeyword, nodeId: fromNodeId, floor: fromFloor, id: fromId },
      { keyword: toKeyword, nodeId: toNodeId, floor: toFloor, id: toId },
      settings,
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
