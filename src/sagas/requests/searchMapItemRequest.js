import axios from 'axios';
import compact from 'lodash.compact';
import get from 'lodash.get';
import { APIEndpoint } from '../../config/config';

// TO-DO: remove wrapper after backend api updated
function searchMapItemResponseWrapper(data) {
  if (typeof data !== 'string') {
    return [];
  }

  const mapItemStrings = compact(data.split('\n'));
  return mapItemStrings.map(mapItemString => {
    const mapItemValues = mapItemString.split(';');
    const coordinates = get(mapItemValues, 2, '')
      .split(',')
      .map(v => parseInt(v, 10));
    return {
      name: mapItemValues[0],
      floor: mapItemValues[3],
      coordinates,
      id: mapItemValues[1],
      type: null,
    };
  });
}

export default function searchMapItemRequest(keyword) {
  return axios
    .get(
      `${APIEndpoint()}/phplib/keyword_suggestion.php?keyword=${encodeURIComponent(
        keyword,
      )}&floor=Overall`,
    )
    .then(response => ({
      ...response,
      data: searchMapItemResponseWrapper(response.data),
    }));
}
