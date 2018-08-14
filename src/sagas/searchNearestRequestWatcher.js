import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import get from 'lodash.get';
import {
  SEARCH_NEAREST,
  searchNearestSuccessAction,
  searchNearestFailureAction,
} from '../reducers/searchNearest';
import { APIEndpoint } from '../config/config';

function searchNearestRequest(floor, name, nearestType, sameFloor) {
  const sameFloorQS = sameFloor ? 'yes' : 'no';

  return axios.get(
    `${APIEndpoint()}/phplib/search.php?type=${nearestType}&same_floor=${sameFloorQS}&keyword=${name}&floor=${floor}`,
  );
}

// TO-DO: remove wrapper after backend api updated
function searchNearestResponseWrapper(data) {
  if (typeof data !== 'string') {
    return [];
  }

  const mapItemStrings = data.split('\n');
  const type = get(mapItemStrings, 0);

  const mapItemValues = get(mapItemStrings, 2, '')
    .trim()
    .split(';');

  const coordinates = get(mapItemValues, 2, '')
    .split(',')
    .map(v => parseInt(v, 10));

  return {
    from: {
      coordinates: null,
      type: null,
      name: mapItemValues[6],
      id: mapItemValues[4],
      floor: mapItemValues[5],
    },
    nearest: {
      coordinates,
      type,
      name: mapItemValues[0],
      id: mapItemValues[1],
      floor: mapItemValues[3],
    },
  };
}

function* searchNearestRequestWorker({ payload: { floor, name, nearestType, sameFloor } }) {
  let response = {};

  try {
    response = yield call(searchNearestRequest, floor, name, nearestType, sameFloor);
  } catch (error) {
    console.error(error);
    yield put(searchNearestFailureAction());
    return;
  }

  yield put(searchNearestSuccessAction(searchNearestResponseWrapper(response.data)));
}

export default function* searchNearestRequestWatcher() {
  yield takeLatest(SEARCH_NEAREST, searchNearestRequestWorker);
}

/**
lift
LIFT 25;p114;2544,898;3;p142;3;ROOM 3542
http://pathadvisor.ust.hk/phplib/search.php?keyword=ROOM%203542&floor=3&type=lift&same_floor=yes&d_roomId=p142&d_floor=3
*/
