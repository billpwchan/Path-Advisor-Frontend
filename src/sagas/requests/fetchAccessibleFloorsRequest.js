import axios from 'axios';
import compact from 'lodash.compact';
import { APIEndpoint } from '../../config/config';

function fetchAccessibleFoorsResponseWrapper(data) {
  return compact(data.split('\n'));
}

export default function fetchAccessibleFoorsRequest(floor, lift) {
  return axios
    .get(
      `${APIEndpoint()}/phplib/get_accessible_floor_show.php?floor=${encodeURIComponent(
        floor,
      )}&lift=${encodeURIComponent(lift)}`,
    )
    .then(response => ({
      ...response,
      data: fetchAccessibleFoorsResponseWrapper(response.data),
    }));
}
