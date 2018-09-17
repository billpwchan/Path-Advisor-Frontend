import axios from 'axios';
import get from 'lodash.get';

import { APIEndpoint } from '../../config/config';
import fetchAutoCompleteRequest from './fetchAutoCompleteRequest';

// TO-DO: remove wrapper after backend api updated
async function searchNearestResponseWrapper(name, data) {
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

  const {
    data: [mapItem],
  } = await fetchAutoCompleteRequest(name);

  const { coordinates: fromCoordinates, type: fromType } = mapItem || {
    coordinates: null,
    type: null,
  };

  return {
    from: {
      coordinates: fromCoordinates,
      type: fromType,
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

async function searchNearestRequest(floor, name, nearestType, sameFloor) {
  const sameFloorQS = sameFloor ? 'yes' : 'no';

  const response = await axios.get(
    `${APIEndpoint()}/phplib/search.php?type=${nearestType}&same_floor=${sameFloorQS}&keyword=${name}&floor=${floor}`,
  );

  return {
    ...response,
    data: await searchNearestResponseWrapper(name, response.data),
  };
}

export default searchNearestRequest;
