import { combineReducers } from 'redux';
import autoComplete from './autoComplete';
import mapItems from './mapItems';

export default combineReducers({
  autoComplete,
  mapItems,
});
