import axios from 'axios';
import compact from 'lodash.compact';
import { APIEndpoint } from '../../config/config';

/*
http://localhost:8888/interface/phplib/get_map_data_2.php?node_ids=3;n614,3;n198,3;n197,3;n195,3;n1239,3;n194,3;n193,3;n1238,3;n1237,3;n192,3;n174,3;n173,3;n1215,3;n176,3;n175,3;n178,3;n179,3;n181,3;n585,1;n246,1;n101,1;n100,1;n99,1;n135,1;n98,1;n255,1;n478,1;n96,1;n97,1;n94,1;n93,1;n92,1;n576,1;n95,1;n474,1;n471,1;n470,1;n469,1;n468,1;n91,1;n90,1;n454,1;n450,G;n65,G;n282,G;n281,G;n280,G;n56,G;n59,G;n238,G;n241

p142;ROOM 3542;office;null;3;n614
p115;LIFT 26;lift;null;3;n585
p90;LIFT 26;lift;null;1;n246
p224;;;r335019480157099;1;n576
p180;ESCALATOR;escalator;null;1;n450
p20;ESCALATOR;escalator;null;G;n65
p83;;;r035268462961480;G;n280
p11;Atrium;;r510411671545744;G;n241

*/

function fetchNodeIdsToMapItemsRequestWrapper(data) {
  if (typeof data !== 'string') {
    return [];
  }

  const mapItemStrings = compact(data.split('\n'));
  return mapItemStrings.map(mapItemString => {
    const mapItemValues = mapItemString.split(';');
    return {
      id: mapItemValues[0],
      name: mapItemValues[1],
      type: mapItemValues[2],
      photo:
        mapItemValues[3] === 'null'
          ? null
          : `${APIEndpoint()}/map_image/${mapItemValues[4]}/${mapItemValues[3]}.jpg`,
      floor: mapItemValues[4],
      nodeId: mapItemValues[5],
    };
  });
}

/**
 * @typedef {object} node
 * @property {string} floor
 * @property {string} nodeId
 */
/**
 * @param {node[]} nodes
 */
export default function fetchNodeIdsToMapItemsRequest(nodes) {
  const nodeIds = nodes.map(({ floor, nodeId }) => `${floor};${nodeId}`).join(',');

  return axios
    .get(`${APIEndpoint()}/phplib/get_map_data_2.php?node_ids=${nodeIds}`)
    .then(response => ({
      ...response,
      data: fetchNodeIdsToMapItemsRequestWrapper(response.data),
    }));
}

window.fetchNodeIdsToMapItemsRequest = fetchNodeIdsToMapItemsRequest;
