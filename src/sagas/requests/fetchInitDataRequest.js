import axios from 'axios';
import { APIEndpoint } from '../../config/config';

async function fetchInitDataRequest() {
  const response = await axios.get(`${APIEndpoint()}/init-data`);

  const { floors, buildingIds, buildings, tags, tagIds, settings } = response.data || {};

  return {
    ...response,
    data: {
      floors,
      buildingIds,
      buildings,
      legends: tagIds.reduce((acc, id) => {
        const { imageUrl, ...rest } = tags[id];
        acc[id] = { ...rest, image: imageUrl || undefined };
        return acc;
      }, {}),
      legendIds: tagIds,
      appSettings: settings,
    },
  };
}

export default fetchInitDataRequest;
