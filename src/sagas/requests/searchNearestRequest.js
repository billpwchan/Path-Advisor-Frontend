import axios from 'axios';
import get from 'lodash.get';
import { APIEndpoint } from '../../config/config';

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

export default function searchNearestRequest(floor, name, nearestType, sameFloor) {
  const sameFloorQS = sameFloor ? 'yes' : 'no';

  return axios
    .get(
      `${APIEndpoint()}/phplib/search.php?type=${nearestType}&same_floor=${sameFloorQS}&keyword=${name}&floor=${floor}`,
    )
    .then(response => ({
      ...response,
      data: searchNearestResponseWrapper(response.data),
    }));
}
