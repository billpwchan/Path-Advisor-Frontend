import { put, takeLatest, call, all } from 'redux-saga/effects';
import fetchInitDataRequest from '../requests/fetchInitDataRequest';

import { GET_INIT_DATA } from '../../reducers/initData';
import { getFloorsSuccessAction, getFloorsFailureAction } from '../../reducers/floors';
import { getLegendsSuccessAction, getLegendsFailureAction } from '../../reducers/legends';
import { getSettingsSuccessAction, getSettingsFailureAction } from '../../reducers/appSettings';

function* fetchInitDataRequestWatcherWorker() {
  try {
    const {
      data: { floors, buildingIds, buildings, legends, legendIds, appSettings },
    } = yield call(fetchInitDataRequest);

    yield all([
      put(getFloorsSuccessAction({ floors, buildingIds, buildings })),
      put(getLegendsSuccessAction({ legends, legendIds })),
      put(getSettingsSuccessAction(appSettings)),
    ]);
  } catch (error) {
    console.error(error);
    yield all([
      put(getFloorsFailureAction()),
      put(getLegendsFailureAction()),
      put(getSettingsFailureAction()),
    ]);
  }
}

export default function* fetchInitDataRequestWatcher() {
  yield takeLatest(GET_INIT_DATA, fetchInitDataRequestWatcherWorker);
}
