export const GET_LEGENDS = 'GET_LEGENDS';
export const GET_LEGENDS_SUCCESS = 'GET_LEGENDS_SUCCESS';
export const GET_LEGENDS_FAILURE = 'GET_LEGENDS_FAILURE';

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

const initialState = {
  loading: false,
  failure: false,
  success: false,
  legends: {
    crossBuildingConnector: { name: 'Entrance / Exit', image: '/images/legends/door_open.png' },
    escalator: { name: 'Escalator', image: '/images/legends/esc.png' },
    lift: { name: 'Lift', image: '/images/legends/lift.png' },
    photo: { name: 'Photo', image: '/images/legends/photo.png' },
    restaurant: { name: 'Restaurant', image: '/images/legends/res.png' },
    maleToilet: { name: 'Male Toilet', image: '/images/legends/malewc.png' },
    femaleToilet: { name: 'Female Toilet', image: '/images/legends/femalewc.png' },
    stair: { name: 'Staircase', image: '/images/legends/stair.png' },
    expressStation: { name: 'Express Station', image: '/images/legends/express.png' },
    drinkingFountain: { name: 'Drinking Fountain', image: '/images/legends/fountain.png' },
    atm: { name: 'ATM', image: '/images/legends/atm.png' },
    mailbox: { name: 'Mailbox', image: '/images/legends/mail.png' },
    taxiStand: { name: 'Taxi Stand', image: '/images/legends/taxi.png' },
    virtualBarnWorkstation: {
      name: 'Virtual Barn Workstation',
      image: '/images/legends/sbarn.png',
    },
    satellitePrinter: { name: 'Satellite Printer', image: '/images/legends/printer.png' },
    video: { name: 'Live view video', image: '/images/legends/video.png' },
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
    'video',
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
    default:
      return state;
  }
};

export default legends;
