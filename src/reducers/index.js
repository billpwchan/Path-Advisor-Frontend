import { combineReducers } from 'redux';
import searchMapItem from './searchMapItem';
import mapItems from './mapItems';
import searchNearest from './searchNearest';
import searchShortestPath from './searchShortestPath';
import userActivities from './userActivities';
import legends from './legends';
import floors from './floors';
import overlay from './overlay';
import appSettings from './appSettings';
import nearestMapItem from './nearestMapItem';

export default combineReducers({
  appSettings,
  searchMapItem,
  mapItems,
  searchNearest,
  searchShortestPath,
  legends,
  floors,
  overlay,
  userActivities,
  nearestMapItem,
});
