import Axios from 'axios';

import { APIEndpoint } from '../../config/config';

/**
 * @typedef {Object} PanoInfo
 * @property {String} id
 * @property {Array<Integer>} coordinates Current coordinates
 * @property {Integer} westX
 * @property {String} url
 */

/**
 * Given a pair of coordinates on a floor, returns the nearest node with panoramic image to the location.
 * @param {String} floor Floor ID
 * @param {Array<Integer>} coordinates Current coordinates
 * @returns {Node} The information of the node.
 */
async function getPanoInfo(floor, [x, y]) {
  const nearestNodeResponse = await Axios.get(
    `${APIEndpoint()}/pano/floors/${encodeURIComponent(floor)}/node?nearCoordinates=${parseInt(x, 10)},${parseInt(y, 10)}`,
  );
  if (nearestNodeResponse.data.data === null) {
    return null;
  }
  const { _id, coordinates, panoImage, panoImageUrl } = nearestNodeResponse.data.data;
  const panoImageInfoResponse = await Axios.get(`${APIEndpoint()}/pano/images/${panoImage}/info`);
  const { westX } = panoImageInfoResponse.data.data;
  return {
    id: _id,
    coordinates,
    url: panoImageUrl,
    westX,
  };
}

/**
 * @typedef {Object} NextPano
 * @property {Array<Integer>} coordinates
 * @property {String} id
 */
/**
 * Given the current node with panoramic image, and the forward direction, returns the next node with panoramic image
 * @param {String} startId Current node ID
 * @param {Number} forwardAngle The angle facing forward
 */
async function getNextPano(startId, forwardAngle) {
  const nextNodeResponse = await Axios.get(
    `${APIEndpoint()}/pano/next?startId=${startId}&forwardAngle=${forwardAngle}`,
  );
  if (nextNodeResponse.data.data === null) {
    return null;
  }
  const { _id, coordinates } = nextNodeResponse.data.data;
  return {
    id: _id,
    coordinates,
  };
}

export { getPanoInfo, getNextPano };
