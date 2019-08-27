import axios from 'axios';
import { APIEndpoint } from '../../config/config';

export default function fetchMapItemsRequest(floor, [startX, startY], width, height) {
  return axios
    .get(
      `${APIEndpoint()}/floors/${encodeURIComponent(floor)}/nodes?boxCoordinates=${[
        startX,
        startY,
        startX + width,
        startY + height,
      ].join(',')}`,
    )
    .then(response => ({
      ...response,
      data: (response.data.data || []).map(
        ({
          _id,
          name,
          floorId,
          centerCoordinates,
          geoLocs,
          tagIds,
          url,
          others,
          connectorId,
          imageUrl,
          panoImageUrl,
        }) => ({
          id: _id,
          name,
          floor: floorId,
          coordinates: centerCoordinates,
          type: (tagIds || [])[0],
          photo: imageUrl || null,
          panorama: panoImageUrl || null,
          url,
          connectorId,
          geoLocs,
          others,
        }),
      ),
    }));
}
