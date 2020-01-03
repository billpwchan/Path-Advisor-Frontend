import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import style from './PluginTogglePanel.module.css';
import { pluginSettingsPropType, updatePluginSettingsAction } from '../../reducers/pluginSettings';

function PluginTogglePanel({
  platform,
  pluginSettingsStore,
  updatePluginSettingsHandler,
  closed,
  onClose,
}) {
  if (closed) {
    return null;
  }

  return (
    <div className={style.body}>
      <button type="button" className={style.closeButton} onClick={onClose}>
        <span role="img" aria-label="remove">
          ×
        </span>
      </button>
      <div className={style.clear} />
      <div className={style.title}>Plugins</div>
      <ul className={style.pluginList}>
        {pluginSettingsStore.ids.map(id => {
          const platformSupported = (pluginSettingsStore.data[id].platform || []).includes(
            platform,
          );

          return (
            <li key={id}>
              {!platformSupported ? <em>Not supported on {platform.toLowerCase()}</em> : null}
              <label>
                <Switch
                  disabled={!platformSupported}
                  checked={platformSupported && !pluginSettingsStore.data[id].off}
                  onChange={checked => {
                    updatePluginSettingsHandler(id, {
                      off: !checked,
                    });
                  }}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={14}
                  width={30}
                  className={style.switch}
                />
                <span>{pluginSettingsStore.data[id].name || id}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

PluginTogglePanel.propTypes = {
  platform: PropTypes.string.isRequired,
  updatePluginSettingsHandler: PropTypes.func.isRequired,
  pluginSettingsStore: pluginSettingsPropType.isRequired,
  closed: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    pluginSettingsStore: state.pluginSettings,
  }),
  dispatch => ({
    updatePluginSettingsHandler: (id, settings) => {
      dispatch(updatePluginSettingsAction(id, settings));
    },
  }),
)(PluginTogglePanel);
