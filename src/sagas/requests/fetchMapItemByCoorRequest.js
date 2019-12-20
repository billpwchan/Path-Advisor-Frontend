import axios from 'axios';
import { APIEndpoint } from '../../config/config';

async function fetchMapItemByCoorRequest(floor, [x, y]) {
  const response = await axios.get(
    `${APIEndpoint()}/floors/${floor}/node?nearCoordinates=${x},${y}`,
  );

  const { _id, name, floorId, centerCoordinates, coordinates, tagIds, connectorId } =
    response.data.data || {};
  return {
    ...response,
    data: {
      id: _id,
      name,
      floor: floorId,
      coordinates: centerCoordinates || coordinates,
      type: (tagIds || [])[0],
      connectorId,
    },
  };
}

export default fetchMapItemByCoorRequest;
