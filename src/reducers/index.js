import { combineReducers } from 'redux';
import accessibleFloors from './accessibleFloors';
import autoComplete from './autoComplete';
import mapItems from './mapItems';
import searchNearest from './searchNearest';
import searchShortestPath from './searchShortestPath';
import searchAreaInput from './searchAreaInput';
import legends from './legends';
import floors from './floors';
import overlay from './overlay';

export default combineReducers({
  accessibleFloors,
  autoComplete,
  mapItems,
  searchNearest,
  searchShortestPath,
  legends,
  floors,
  overlay,
  searchAreaInput,
});
