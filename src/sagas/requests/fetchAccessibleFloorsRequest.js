import axios from 'axios';
import { APIEndpoint } from '../../config/config';

export default function fetchAccessibleFloorsRequest(connectorId) {
  return axios.get(`${APIEndpoint()}/connectors/${connectorId}`).then(response => ({
    ...response,
    data: (response.data.data || { floorIds: [] }).floorIds,
  }));
}
