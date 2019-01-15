import axios from 'axios';
import { APIEndpoint } from '../../config/config';

function searchNearestResponseWrapper(data) {
  const { from = {}, nearestItem = {} } = data;

  return {
    from: {
      coordinates: from.centerCoordinates,
      type: (from.tagIds || [])[0],
      name: from.name,
      // eslint-disable-next-line no-underscore-dangle
      id: from._id,
      floor: from.floorId,
    },
    nearest: {
      coordinates: nearestItem.centerCoordinates,
      type: (nearestItem.tagIds || [])[0],
      name: nearestItem.name,
      // eslint-disable-next-line no-underscore-dangle
      id: nearestItem._id,
      floor: nearestItem.floorId,
    },
  };
}

async function searchNearestRequest(name, nearestType, sameFloor, id) {
  const startNode = id
    ? `startId=${encodeURIComponent(id)}`
    : `startName=${encodeURIComponent(name)}`;
  const response = await axios.get(
    `${APIEndpoint()}/nearest-item?type=${encodeURIComponent(
      nearestType,
    )}&sameFloor=${sameFloor}&${startNode}`,
  );

  return {
    ...response,
    data: searchNearestResponseWrapper(response.data.data || {}),
  };
}

export default searchNearestRequest;
