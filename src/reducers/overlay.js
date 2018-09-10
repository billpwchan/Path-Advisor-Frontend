export const OPEN_OVERLAY = 'OPEN_OVERLAY';
export const CLOSE_OVERLAY = 'CLOSE_OVERLAY';

const initalState = {
  open: false,
  photo: null,
  url: null,
  name: null,
  others: {},
};

/**
 * @param {string} name
 * @param {string} photo
 * @param {string} url
 * @param {object} others
 */
export function openOverlayAction(name, photo, url, others) {
  return {
    type: OPEN_OVERLAY,
    payload: {
      photo,
      url,
      name,
      others,
    },
  };
}

export function closeOverlayAction() {
  return {
    type: CLOSE_OVERLAY,
  };
}

const overlay = (state = initalState, { type, payload }) => {
  switch (type) {
    case OPEN_OVERLAY:
      return {
        ...initalState,
        open: true,
        photo: payload.photo,
        url: payload.url,
        name: payload.name,
        others: { ...payload.others },
      };
    case CLOSE_OVERLAY:
      return {
        ...initalState,
        open: false,
      };
    default:
      return state;
  }
};

export default overlay;
