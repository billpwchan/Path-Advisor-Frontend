import axios from 'axios';
import get from 'lodash.get';
import searchMapItemRequest from './searchMapItemRequest';
import { APIEndpoint } from '../../config/config';

/**
 * Helper to get processed node id and floor from keyword
 */
async function getIdFloorfromKeyword(keyword) {
  const { data } = await searchMapItemRequest(keyword);
  const { id } = get(data, 0, {});
  return { id };
}

/**
 * @typedef searchSearchInput
 * @property {string} [keyword]
 * @property {string} [id]
 * @property {string} [floor]
 */

/**
 * @typedef searchSetting
 * @property {boolean} [noStairCase]
 * @property {boolean} [noEscalator]
 * @property {string} [searchMode]
 */
/**
 *
 * @param {searchSearchInput} inputFrom
 * @param {searchSearchInput} inputTo
 * @param {searchSetting} settings
 */
async function searchShortestPathRequest(inputFrom = {}, inputTo = {}, settings = {}) {
  const inputs = [inputFrom, inputTo];

  const [from, to] = await Promise.all(
    inputs.map(async ({ keyword, id }) => {
      if (id) {
        return { id };
      }

      return getIdFloorfromKeyword(keyword);
    }),
  );

  if (!from.id || !to.id) {
    throw new Error('Invalid start or end point input');
  }

  const { noStairCase, noEscalator, searchMode } = settings;

  const response = await axios.get(
    `${APIEndpoint()}/shortest-path?fromId=${from.id}&toId=${
      to.id
    }&mode=${searchMode}&noStairCase=${noStairCase}&noEscalator=${noEscalator}`,
  );

  return {
    ...response,
    data: (response.data.data || []).map(
      ({ _id, floorId, distance, coordinates, name, tagIds, imageUrl }) => ({
        id: _id,
        floor: floorId,
        name,
        coordinates,
        distance,
        type: (tagIds || [])[0],
        photo: imageUrl,
      }),
    ),
  };
}

export default searchShortestPathRequest;
