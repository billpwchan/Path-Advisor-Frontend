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

/**
 * @typedef searchOptions
 * @property {boolean} [noStairCase]
 * @property {boolean} [noEscalator]
 * @property {boolean} [stepFreeAccess]
 * @property {string} [searchMode]
 */

/**
 * @param {searchOptions} searchOptions
 */
async function searchNearestRequest(name, nearestType, sameFloor, id, searchOptions) {
  const { searchMode, noEscalator, noStairCase, stepFreeAccess } = searchOptions;

  const params = {
    type: nearestType,
    sameFloor,
    mode: searchMode,
    noStairCase,
    noEscalator,
    stepFreeAccess,
    ...(id ? { startId: id } : { startName: name }),
  };

  const qs = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const response = await axios.get(`${APIEndpoint()}/nearest-item?${qs}`);

  return {
    ...response,
    data: searchNearestResponseWrapper(response.data.data || {}),
  };
}

export default searchNearestRequest;
