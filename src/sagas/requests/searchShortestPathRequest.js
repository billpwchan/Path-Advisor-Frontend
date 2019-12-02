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
 * @param {searchSearchInput[]} inputVia
 * @param {searchSetting} settings
 */
async function searchShortestPathRequest(
  inputFrom = {},
  inputTo = {},
  inputVia = [],
  settings = {},
) {
  const inputs = [inputFrom, inputTo, ...inputVia];

  const [from, to, ...via] = await Promise.all(
    inputs.map(async ({ keyword, id }) => {
      if (id) {
        return { id };
      }

      return getIdFloorfromKeyword(keyword);
    }),
  );

  if (!from.id || !to.id || via.some(({ id }) => !id)) {
    throw new Error('Invalid start, via or end point input');
  }

  const { noStairCase, noEscalator, searchMode } = settings;

  const viaParam = via.length ? `&viaIds[]=${via.map(({ id }) => id).join('&viaIds[]=')}` : '';
  const response = await axios.get(
    `${APIEndpoint()}/shortest-path?fromId=${from.id}&toId=${
      to.id
    }${viaParam}&mode=${searchMode}&noStairCase=${noStairCase}&noEscalator=${noEscalator}`,
  );

  return {
    ...response,
    data: (response.data.data || []).map(
      ({ _id, floorId, distance, coordinates, name, tagIds, imageUrl, panoImageUrl }) => ({
        id: _id,
        floor: floorId,
        name,
        coordinates,
        distance,
        type: (tagIds || [])[0],
        photo: imageUrl,
        panorama: panoImageUrl,
      }),
    ),
  };
}

export default searchShortestPathRequest;
