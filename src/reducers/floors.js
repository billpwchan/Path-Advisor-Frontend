export const GET_FLOORS = 'GET_FLOORS';
export const GET_FLOORS_SUCCESS = 'GET_FLOORS_SUCCESS';
export const GET_FLOORS_FAILURE = 'GET_FLOORS_FAILURE';

export function getFloorsAction() {
  return {
    type: GET_FLOORS,
  };
}

export function getFloorsSuccessAction(floors) {
  return {
    type: GET_FLOORS_SUCCESS,
    payload: { floors },
  };
}

export function getFloorsFailureAction() {
  return {
    type: GET_FLOORS_FAILURE,
  };
}

const initialState = {
  loading: false,
  failure: false,
  success: false,
  floors: {
    '1': {
      name: 'Floor 1',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4400,
      mapHeight: 3200,
      ratio: 0.1,
    },
    '2': {
      name: 'Floor 2',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4800,
      mapHeight: 3400,
      ratio: 0.1,
    },
    '3': {
      name: 'Floor 3',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4800,
      mapHeight: 3400,
      ratio: 0.1,
    },
    '4': {
      name: 'Floor 4',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4800,
      mapHeight: 3400,
      ratio: 0.1,
    },
    '5': {
      name: 'Floor 5',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4800,
      mapHeight: 3400,
      ratio: 0.1,
    },
    '6': {
      name: 'Floor 6',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4800,
      mapHeight: 3400,
      ratio: 0.1,
    },
    '7': {
      name: 'Floor 7',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4800,
      mapHeight: 3400,
      ratio: 0.1,
    },
    UC1: {
      name: 'Floor 1',
      buildingName: 'University Center',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    UCG: {
      name: 'Floor G',
      buildingName: 'University Center',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    IASG: {
      name: 'Floor G',
      buildingName: 'IAS',
      meterPerPixel: 0.0455,
      mapWidth: 1200,
      mapHeight: 1200,
      ratio: 0.1,
    },
    IAS1: {
      name: 'Floor 1',
      buildingName: 'IAS',
      meterPerPixel: 0.0455,
      mapWidth: 1200,
      mapHeight: 1200,
      ratio: 0.1,
    },
    IAS2: {
      name: 'Floor 2',
      buildingName: 'IAS',
      meterPerPixel: 0.0455,
      mapWidth: 1200,
      mapHeight: 1200,
      ratio: 0.1,
    },
    IAS3: {
      name: 'Floor 3',
      buildingName: 'IAS',
      meterPerPixel: 0.0455,
      mapWidth: 1200,
      mapHeight: 1200,
      ratio: 0.1,
    },
    IAS4: {
      name: 'Floor 4',
      buildingName: 'IAS',
      meterPerPixel: 0.0455,
      mapWidth: 1200,
      mapHeight: 1200,
      ratio: 0.1,
    },
    IAS5: {
      name: 'Floor 5',
      buildingName: 'IAS',
      meterPerPixel: 0.0455,
      mapWidth: 1200,
      mapHeight: 1200,
      ratio: 0.4,
    },
    NABG: {
      name: 'Floor G',
      buildingName: 'LSK',
      meterPerPixel: 0.0455,
      mapWidth: 2600,
      mapHeight: 1600,
      ratio: 0.1,
    },
    NAB1: {
      name: 'Floor 1',
      buildingName: 'LSK',
      meterPerPixel: 0.0455,
      mapWidth: 2600,
      mapHeight: 1600,
      ratio: 0.1,
    },
    NAB2: {
      name: 'Floor 2',
      buildingName: 'LSK',
      meterPerPixel: 0.0455,
      mapWidth: 2600,
      mapHeight: 1600,
      ratio: 0.1,
    },
    NAB3: {
      name: 'Floor 3',
      buildingName: 'LSK',
      meterPerPixel: 0.0455,
      mapWidth: 2600,
      mapHeight: 1600,
      ratio: 0.1,
    },
    NAB4: {
      name: 'Floor 4',
      buildingName: 'LSK',
      meterPerPixel: 0.0455,
      mapWidth: 2600,
      mapHeight: 1600,
      ratio: 0.1,
    },
    NAB5: {
      name: 'Floor 5',
      buildingName: 'LSK',
      meterPerPixel: 0.0455,
      mapWidth: 2600,
      mapHeight: 1600,
      ratio: 0.1,
    },
    NAB6: {
      name: 'Floor 6',
      buildingName: 'LSK',
      meterPerPixel: 0.0455,
      mapWidth: 2600,
      mapHeight: 1600,
      ratio: 0.1,
    },
    NAB7: {
      name: 'Floor 7',
      buildingName: 'LSK',
      meterPerPixel: 0.0455,
      mapWidth: 2600,
      mapHeight: 1600,
      ratio: 0.1,
    },
    CYTG: {
      name: 'Floor G',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    CYTUG: {
      name: 'Floor UG',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    CYT1: {
      name: 'Floor 1',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    CYT2: {
      name: 'Floor 2',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    CYT3: {
      name: 'Floor 3',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    CYT4: {
      name: 'Floor 4',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    CYT5: {
      name: 'Floor 5',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    CYT6: {
      name: 'Floor 6',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    CYT7: {
      name: 'Floor 7',
      buildingName: 'CYT',
      meterPerPixel: 0.0455,
      mapWidth: 2000,
      mapHeight: 1400,
      ratio: 0.15,
    },
    Overall: {
      name: '',
      buildingName: 'Campus Map',
      meterPerPixel: 0.413,
      mapWidth: 2200,
      mapHeight: 1800,
      ratio: 0.1,
    },
    G: {
      name: 'Floor G',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4800,
      mapHeight: 3400,
      ratio: 0.1,
    },
    LG1: {
      name: 'LG1',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 4400,
      mapHeight: 3200,
      ratio: 0.1,
    },
    LG3: {
      name: 'LG3',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 3400,
      mapHeight: 2600,
      ratio: 0.1,
    },
    LG4: {
      name: 'LG4',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 3200,
      mapHeight: 2400,
      ratio: 0.1,
    },
    LG5: {
      name: 'LG5',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 3200,
      mapHeight: 2400,
      ratio: 0.1,
    },
    LG7: {
      name: 'LG7',
      buildingName: 'Academic Building',
      meterPerPixel: 0.0455,
      mapWidth: 3200,
      mapHeight: 1600,
      ratio: 0.1,
    },
  },
  buildings: [
    { name: 'Campus Map', floorIds: ['Overall'] },
    { name: 'University Center', floorIds: ['UC1', 'UCG'] },
    {
      name: 'Academic Building',
      floorIds: ['7', '6', '5', '4', '3', '2', '1', 'G', 'LG1', 'LG3', 'LG4', 'LG5', 'LG7'],
    },
    {
      name: 'CYT',
      floorIds: ['CYT7', 'CYT6', 'CYT5', 'CYT4', 'CYT3', 'CYT2', 'CYT1', 'CYTUG', 'CYTG'],
    },
    {
      name: 'LSK',
      floorIds: ['NAB7', 'NAB6', 'NAB5', 'NAB4', 'NAB3', 'NAB2', 'NAB1', 'NABG'],
    },
    {
      name: 'IAS',
      floorIds: ['IAS5', 'IAS4', 'IAS3', 'IAS2', 'IAS1', 'IASG'],
    },
  ],
};

const floors = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_FLOORS:
      return {
        ...initialState,
        loading: true,
      };
    case GET_FLOORS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        floors: payload.floors,
      };
    case GET_FLOORS_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        failure: true,
      };
    default:
      return state;
  }
};

export default floors;
