import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import compact from 'lodash.compact';
import {
  GET_MAP_ITEMS,
  getMapItemsSuccessAction,
  getMapItemsFailureAction,
} from '../reducers/mapItems';

function fetchMapItemsRequest(floor, coordinates, offsetCoordinates) {
  const [startX, startY] = coordinates;
  const [offsetX, offsetY] = offsetCoordinates;

  return axios.get(
    `http://pathadvisor.ust.hk/phplib/get_map_data_2.php?floor=${encodeURIComponent(
      floor,
    )}&MapCoorX=${startX}&MapCoorY=${startY}&offsetX=${offsetX}&offsetY=${offsetY}`,
  );
}

/*
1844,1572;STAIR SC04;stair;null;null;p77
1934,1571;ROOM 1100;classroom;null;null;p78
2347,1540;STAIR SC15;stair;null;null;p79
1816,1372;ESCALATOR;escalator;null;null;p175
1816,1412;ESCALATOR;escalator;null;null;p176
1841,1485;STAIR;stair;null;null;p177
2022,1580;VIRTUAL BARN WORKSTATION;virtual barn workstation;null;null;p180
2043,1580;VIRTUAL BARN WORKSTATION;virtual barn workstation;null;null;p181
2069,1575;BANK OF CHINA ATM;ATM;r012787110528388;null;p182
2089,1578;HANG SENG ATM;ATM;null;null;p183
2123,1366;EXPRESS STATION;express station;null;null;p184
2122,1567;VIRTUAL BARN WORKSTATION;virtual barn workstation;null;null;p185
2049,1295;Academic Records and Registration, Academic Registry;office;r290828283746267;null;p214
2260,1480;;;r335019480157099;null;p220

*/
// TO-DO: remove wrapper after backend api updated
function fetchMapItemsResponseWrapper(data) {
  if (typeof data !== 'string') {
    return [];
  }

  const mapItemStrings = compact(data.split('\n'));
  return mapItemStrings.map(mapItemString => {
    const mapItemValues = mapItemString.split(';');
    const coordinates = mapItemValues[0].split(',').map(v => parseInt(v, 10));
    return {
      name: mapItemValues[1],
      floor: null,
      coordinates,
      id: mapItemValues[5],
      type: mapItemValues[2],
      plugin_photo: mapItemValues[3],
      plugin_url: mapItemValues[4],
    };
  });
}

function* mapItemsRequestWorker({ payload: { floor, coordinates, offsetCoordinates } }) {
  let response = {};

  try {
    response = yield call(fetchMapItemsRequest, floor, coordinates, offsetCoordinates);
  } catch (error) {
    console.error(error);
    yield put(getMapItemsFailureAction());
  }

  yield put(getMapItemsSuccessAction(fetchMapItemsResponseWrapper(response.data)));
}

export default function* mapItemsRequestWatcher() {
  yield takeLatest(GET_MAP_ITEMS, mapItemsRequestWorker);
}
