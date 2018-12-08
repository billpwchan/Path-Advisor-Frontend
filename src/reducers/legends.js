export const GET_LEGENDS = 'GET_LEGENDS';
export const GET_LEGENDS_SUCCESS = 'GET_LEGENDS_SUCCESS';
export const GET_LEGENDS_FAILURE = 'GET_LEGENDS_FAILURE';
export const UPDATE_LEGEND_DISPLAY = 'UPDATE_LEGEND_DISPLAY';

export function getLegendsAction() {
  return {
    type: GET_LEGENDS,
  };
}

export function getLegendsSuccessAction(legends) {
  return {
    type: GET_LEGENDS_SUCCESS,
    payload: { legends },
  };
}

export function getLegendsFailureAction() {
  return {
    type: GET_LEGENDS_FAILURE,
  };
}

export function updateLegendDisplayAction(legendType, display) {
  return {
    type: UPDATE_LEGEND_DISPLAY,
    payload: {
      legendType,
      display,
    },
  };
}

const initialState = {
  loading: false,
  failure: false,
  success: false,
  legends: {
    crossBuildingConnector: {
      display: true,
      name: 'Entrance / Exit',
      image: '/images/legends/door_open.png',
    },
    escalator: {
      display: true,
      name: 'Escalator',
      image: '/images/legends/esc.png',
    },
    lift: {
      display: true,
      name: 'Lift',
      image: '/images/legends/lift.png',
    },
    photo: {
      display: true,
      name: 'Photo',
      image: '/images/legends/photo.png',
    },
    restaurant: {
      display: true,
      name: 'Restaurant',
      image: '/images/legends/res.png',
    },
    maleToilet: {
      display: true,
      name: 'Male Toilet',
      image: '/images/legends/malewc.png',
    },
    femaleToilet: {
      display: true,
      name: 'Female Toilet',
      image: '/images/legends/femalewc.png',
    },
    stair: {
      display: true,
      name: 'Staircase',
      image: '/images/legends/stair.png',
    },
    expressStation: {
      display: true,
      name: 'Express Station',
      image: '/images/legends/express.png',
    },
    drinkingFountain: {
      display: true,
      name: 'Drinking Fountain',
      image: '/images/legends/fountain.png',
    },
    atm: {
      display: true,
      name: 'ATM',
      image: '/images/legends/atm.png',
    },
    mailbox: {
      display: true,
      name: 'Mailbox',
      image: '/images/legends/mail.png',
    },
    taxiStand: {
      display: true,
      name: 'Taxi Stand',
      image: '/images/legends/taxi.png',
    },
    virtualBarnWorkstation: {
      display: true,
      name: 'Virtual Barn Workstation',
      image: '/images/legends/sbarn.png',
    },
    satellitePrinter: {
      display: true,
      name: 'Satellite Printer',
      image: '/images/legends/printer.png',
    },
    liveView: {
      display: true,
      name: 'Live view video / snapshot',
      image: '/images/legends/live_view.png',
    },
  },
  legendIds: [
    'crossBuildingConnector',
    'escalator',
    'lift',
    'photo',
    'restaurant',
    'maleToilet',
    'femaleToilet',
    'stair',
    'expressStation',
    'drinkingFountain',
    'atm',
    'mailbox',
    'taxiStand',
    'virtualBarnWorkstation',
    'satellitePrinter',
    'liveView',
  ],
};

const legends = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_LEGENDS:
      return {
        ...initialState,
        loading: true,
      };
    case GET_LEGENDS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        failure: false,
        legends: payload.legends,
      };
    case GET_LEGENDS_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        failure: true,
      };
    case UPDATE_LEGEND_DISPLAY:
      return {
        ...state,
        legends: {
          ...state.legends,
          [payload.legendType]: {
            ...state.legends[payload.legendType],
            display: payload.display,
          },
        },
      };
    default:
      return state;
  }
};

export default legends;
