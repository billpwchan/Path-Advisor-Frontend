import PropTypes from 'prop-types';
import plugins from '../plugins';
import { PLATFORM } from '../components/Main/detectPlatform';

export const UPDATE_PLUGIN_SETTINGS = 'UPDATE_PLUGIN_SETTINGS';

export function updatePluginSettingsAction(id, settings) {
  return {
    type: UPDATE_PLUGIN_SETTINGS,
    payload: {
      id,
      settings,
    },
  };
}

const nonCorePlugins = plugins.filter(({ core = false }) => !core);

const initialState = {
  ids: nonCorePlugins.map(({ id }) => id),
  data: nonCorePlugins.reduce(
    (agg, { id, defaultOff = true, name, platform = Object.values(PLATFORM) }) => ({
      ...agg,
      [id]: { off: defaultOff, name, platform },
    }),
    {},
  ),
};

const pluginSettings = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_PLUGIN_SETTINGS:
      return {
        ...state,
        data: {
          ...state.data,
          [payload.id]: {
            ...state.data[payload.id],
            ...payload.settings,
          },
        },
      };
    default:
      return state;
  }
};

export const pluginSettingsPropType = PropTypes.shape({
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.objectOf(
    PropTypes.shape({
      off: PropTypes.bool,
    }),
  ).isRequired,
});

export default pluginSettings;
