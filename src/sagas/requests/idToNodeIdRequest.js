import axios from 'axios';
import get from 'lodash.get';
import { APIEndpoint } from '../../config/config';

export default function idToNodeIdRequest(floor, id) {
  function idToNodeIdRequestWrapper(data) {
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

  return axios
    .get(`${APIEndpoint()}/phplib/get_map_data_2.php?floor=${floor}&room=${id}`)
    .then(({ data }) => idToNodeIdRequestWrapper(data));
}
