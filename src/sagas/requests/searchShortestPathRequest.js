import axios from 'axios';
import get from 'lodash.get';
import compact from 'lodash.compact';
import fetchAutoCompleteRequest from './fetchAutoCompleteRequest';
import fetchIdToNodeIdRequest from './fetchIdToNodeIdRequest';
import fetchNodeIdsToMapItemsRequest from './fetchNodeIdsToMapItemsRequest';
import { SearchAPIEndpoint } from '../../config/config';

/*
  DEBUG: start_id1350
  DEBUG: end_id3830
  G;2157,1268;241;29
  G;2157,1239;238;39
  G;2157,1200;59;49
  G;2206,1200;56;242
  G;2448,1200;280;39
 */
// TO-DO: remove wrapper after backend api revamped
async function searchShortestPathResponseWrapper(data) {
  if (typeof data !== 'string') {
    return [];
  }

  const mapItemStrings = compact(data.split('\n'));
  const path = compact(
    mapItemStrings.map(mapItemString => {
      if (mapItemString.startsWith('DEBUG:')) {
        return null;
      }
      const mapItemValues = mapItemString.split(';');

      return {
        floor: mapItemValues[0],
        coordinates: get(mapItemValues, 1, '')
          .split(',')
          .map(v => parseInt(v, 10)),
        nodeId: `n${mapItemValues[2]}`,
        distance: parseInt(mapItemValues[3], 10),
      };
    }),
  );

  const { data: mapItemData } = await fetchNodeIdsToMapItemsRequest(path);
  let mapItemDataIndex = 0;

  return path
    .map(node => {
      if (
        mapItemDataIndex < mapItemData.length &&
        node.nodeId === mapItemData[mapItemDataIndex].nodeId
      ) {
        const nodeWithInfo = {
          ...node,
          ...mapItemData[mapItemDataIndex],
        };

        mapItemDataIndex += 1;

        return nodeWithInfo;
      }

      return { ...node };
    })
    .reverse();
}

/**
 * Helper to get processed node id and floor from keyword
 */
async function getNodeIdFloorfromKeyword(keyword) {
  const { data } = await fetchAutoCompleteRequest(keyword);
  const { id, floor } = get(data, 0, {});
  const {
    data: { nodeId },
  } = await fetchIdToNodeIdRequest(floor, id);
  return { nodeId, floor };
}

/**
 * @typedef searchSearchInput
 * @property {string} keyword
 * @property {string} nodeId
 * @property {string} id
 * @property {string} floor
 */
/**
 *
 * @param {searchSearchInput} inputFrom
 * @param {searchSearchInput} inputTo
 */
async function searchShortestPathRequest(inputFrom = {}, inputTo = {}) {
  const inputs = [inputFrom, inputTo];

  const [from, to] = await Promise.all(
    inputs.map(async ({ nodeId, keyword, id, floor }) => {
      if (nodeId && floor) {
        return { nodeId, floor };
      }

      if (id && floor) {
        const {
          data: { nodeId },
        } = await fetchIdToNodeIdRequest(floor, id);
        return { nodeId, floor };
      }

      return getNodeIdFloorfromKeyword(keyword);
    }),
  );

  console.log(from, to);

  if (!from.floor || !from.nodeId || !to.floor || !to.nodeId) {
    throw new Error('Invalid start or end point input');
  }

  from.nodeId = from.nodeId.substr(1);
  to.nodeId = to.nodeId.substr(1);

  const response = await axios.get(
    `${SearchAPIEndpoint()}/cgi-bin/find_path_new.cgi?mins_per_pixel=0.000546&get_distance_array=NO&start_id=${
      from.nodeId
    }&start_floor=${from.floor}&end_id=${to.nodeId}&end_floor=${
      to.floor
    }&no_stair_mode=ON&no_escalator_mode=OFF&shortest_time_mode=ON&shortest_distance_mode=OFF&less_lift_mode=OFF&range=ALL`,
  );

  return {
    ...response,
    data: await searchShortestPathResponseWrapper(response.data),
  };
}

export default searchShortestPathRequest;
