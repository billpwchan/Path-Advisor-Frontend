import { combineReducers } from 'redux';
import autoComplete from './autoComplete';
import mapItems from './mapItems';
import searchNearest from './searchNearest';

export default combineReducers({
  autoComplete,
  mapItems,
  searchNearest,
});
