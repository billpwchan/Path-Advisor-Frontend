import axios from 'axios';
import { APIEndpoint } from '../../config/config';

function responseWrapper(floor, x, y, data) {
  const [resultType, nodeId, name] = data.split(';');
  return {
    name: resultType === 'area' ? name : null,
    floor,
    coordinates: [x, y],
    id: null,
    type: null,
    nodeId,
  };
}

async function fetchMapItemByCoorRequest(floor, x, y) {
  const response = await axios.get(
    `${APIEndpoint()}/phplib/get_map_data_2.php?floor=${floor}&coorX=${x}&coorY=${y}`,
  );

  return {
    ...response,
    data: responseWrapper(floor, x, y, response.data),
  };
}

export default fetchMapItemByCoorRequest;
