import axios from 'axios';
import compact from 'lodash.compact';
import get from 'lodash.get';
import { APIEndpoint } from '../../config/config';

// TO-DO: remove after backend api updated
function toCamelCase(term) {
  return term
    .split(' ')
    .map(
      (word, i) =>
        i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.substr(1).toLowerCase(),
    )
    .join('');
}

function prependHttp(url) {
  if (typeof url !== 'string') {
    return url;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `http://${url}`;
  }

  return url;
}

// TO-DO: remove wrapper after backend api updated
function fetchMapItemsResponseWrapper(data, floor) {
  if (typeof data !== 'string') {
    return [];
  }

  const mapItemStrings = compact(data.split('\n'));
  return mapItemStrings.map(mapItemString => {
    const mapItemValues = mapItemString.split(';');
    const coordinates = get(mapItemValues, 0, '')
      .split(',')
      .map(v => parseInt(v, 10));
    return {
      name: mapItemValues[1] === 'null' ? '' : mapItemValues[1],
      floor,
      coordinates,
      id: mapItemValues[5],
      type: toCamelCase(mapItemValues[2]),
      photo:
        mapItemValues[3] === 'null'
          ? null
          : `${APIEndpoint()}/map_image/${floor}/${mapItemValues[3]}.jpg`,
      url: mapItemValues[4] === 'null' ? null : prependHttp(mapItemValues[4]),
      others: null,
    };
  });
}

export default function fetchMapItemsRequest(floor, coordinates, width, height) {
  const [startX, startY] = coordinates;

  return axios
    .get(
      `${APIEndpoint()}/phplib/get_map_data_2.php?floor=${encodeURIComponent(
        floor,
      )}&MapCoorX=${startX}&MapCoorY=${startY}&offsetX=${width}&offsetY=${height}`,
    )
    .then(response => ({
      ...response,
      data: fetchMapItemsResponseWrapper(response.data, floor),
    }));
}

/*

Example response
1844,1572;STAIR SC04;stair;null;null;p77
1934,1571;ROOM 1100;classroom;null;null;p78
2347,1540;STAIR SC15;stair;null;null;p79
1816,1372;ESCALATOR;escalator;null;null;p175
1816,1412;ESCALATOR;escalator;null;null;p176
1841,1485;STAIR;stair;null;null;p177
2022,1580;VIRTUAL BARN WORKSTATION;virtual barn workstation;null;null;p180
2043,1580;VIRTUAL BARN WORKSTATION;virtual barn workstation;null;null;p181
2069,1575;BANK OF CHINA ATM;ATM;r012787110528388;null;p182
2089,1578;HANG SENG ATM;ATM;null;null;p183
2123,1366;EXPRESS STATION;express station;null;null;p184
2122,1567;VIRTUAL BARN WORKSTATION;virtual barn workstation;null;null;p185
2049,1295;Academic Records and Registration, Academic Registry;office;r290828283746267;null;p214
2260,1480;;;r335019480157099;null;p220

*/
