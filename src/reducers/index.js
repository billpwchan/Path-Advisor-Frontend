import { combineReducers } from 'redux';
import autoComplete from './autoComplete';
import mapItems from './mapItems';
import searchNearest from './searchNearest';
import searchShortestPath from './searchShortestPath';
import legends from './legends';
import floors from './floors';
import overlay from './overlay';

export default combineReducers({
  autoComplete,
  mapItems,
  searchNearest,
  searchShortestPath,
  legends,
  floors,
  overlay,
});
