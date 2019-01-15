import axios from 'axios';
import { APIEndpoint } from '../../config/config';

export default function searchMapItemRequest(keyword) {
  return axios.get(`${APIEndpoint()}/nodes?name=${encodeURIComponent(keyword)}`).then(response => ({
    ...response,
    data: (response.data.data || []).map(({ name, floorId, _id, tagIds, centerCoordinates }) => ({
      name,
      floor: floorId,
      coordinates: centerCoordinates,
      id: _id,
      type: (tagIds || [])[0],
    })),
  }));
}
