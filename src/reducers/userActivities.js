import PropTypes from 'prop-types';

export const SET_USER_ACTIVITIES = 'SET_USER_ACTIVITIES';

export const ACTION_SOURCE = {
  EXTERNAL_LINK: 'EXTERNAL_LINK',
  BUTTON_CLICK: 'BUTTON_CLICK',
  DRAG_AND_DROP: 'DRAG_AND_DROP',
  CONTEXT_MENU: 'CONTEXT_MENU',
};

export const userActivitiesPropType = PropTypes.shape({
  actionSource: PropTypes.string,
});

const initialState = {
  actionSource: ACTION_SOURCE.EXTERNAL_LINK,
};

export function setUserActivitiesAction(payload) {
  return {
    type: SET_USER_ACTIVITIES,
    payload,
  };
}

const userActivities = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER_ACTIVITIES:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export default userActivities;
