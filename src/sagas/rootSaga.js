import { all } from 'redux-saga/effects';
import autoCompleteRequestWatcher from './autoCompleteRequestWatcher';

export default function* rootSaga() {
  yield all([autoCompleteRequestWatcher()]);
}
