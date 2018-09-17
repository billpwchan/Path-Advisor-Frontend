import axios from 'axios';
import get from 'lodash.get';
import { APIEndpoint } from '../../config/config';

function fetchIdToNodeIdRequestWrapper(data, { floor }) {
  if (typeof data !== 'string') {
    return { nodeId: null, floor };
  }

  const mapItemStrings = data.split('\n');
  const nodeId = get(mapItemStrings, 0);

  return {
    nodeId,
    floor,
  };
}

export default function fetchIdToNodeIdRequest(floor, id) {
  return axios
    .get(`${APIEndpoint()}/phplib/get_map_data_2.php?floor=${floor}&room=${id}`)
    .then(response => ({
      ...response,
      data: fetchIdToNodeIdRequestWrapper(response.data, { floor, id }),
    }));
}
