import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isNil from 'lodash.isnil';
import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import TopPanel from '../TopPanel/TopPanel';
import allPlugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';
import { parseParams, build as buildUrl } from '../Router/Url';
import style from './Main.module.css';
import detectPlatform, { PLATFORM } from './detectPlatform';
import MobileOverlay from '../MobileOverlay/MobileOverlay';
import logger from './logger';
import { floorsPropType } from '../../reducers/floors';
import { legendsPropType } from '../../reducers/legends';
import { getInitDataAction } from '../../reducers/initData';
import { appSettingsPropType } from '../../reducers/appSettings';
import { pluginSettingsPropType } from '../../reducers/pluginSettings';
import FullScreenOverlay from '../FullScreenOverlay/FullScreenOverlay';
import Suggestion from '../Suggestion/Suggestion';

class Main extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    appSettingStore: appSettingsPropType.isRequired,
    floorStore: floorsPropType.isRequired,
    legendStore: legendsPropType.isRequired,
    pluginSettingsStore: pluginSettingsPropType.isRequired,
    getInitDataHandler: PropTypes.func.isRequired,
  };

  platform = detectPlatform();

  static defaultProps = {
    match: { params: {} },
  };

  componentDidMount() {
    this.props.getInitDataHandler();
  }

  componentDidUpdate() {
    const { appSettingStore, floorStore } = this.props;

    if (!appSettingStore.success || !floorStore.success) {
      return;
    }

    this.initPosition();
  }

  getUrlParams() {
    return parseParams(
      this.props.match.params,
      this.props.location.search,
      this.platform,
      this.props.floorStore.floors,
    );
  }

  linkTo = (arg1, method = 'push') => {
    const urlParams = this.getUrlParams();
    const params = typeof arg1 === 'function' ? arg1(urlParams) : arg1;

    const {
      appSettingStore: { defaultPosition, mobileDefaultPosition },
    } = this.props;

    const { level: defaultLevel } =
      this.platform === PLATFORM.MOBILE ? mobileDefaultPosition : defaultPosition;

    const newParams = {
      ...urlParams,
      level: !isNil(urlParams.level) ? urlParams.level : defaultLevel,
      ...params,
    };

    if (Object.keys(newParams).every(key => newParams[key] === urlParams[key])) {
      return;
    }

    this.props.history[method](buildUrl(newParams));
  };

  initPosition() {
    // init position from app settings if current position is not set
    const urlParams = this.getUrlParams();

    if (!urlParams.isFromNormalized) {
      this.linkTo(urlParams);
      return;
    }

    if (
      [urlParams.level, urlParams.x, urlParams.y, urlParams.floor].some(v => isNil(v)) &&
      !urlParams.search
    ) {
      const {
        appSettingStore: { defaultPosition, mobileDefaultPosition },
      } = this.props;

      if (!defaultPosition || !mobileDefaultPosition) {
        return;
      }

      const { floor, x, y, level } =
        this.platform === PLATFORM.MOBILE ? mobileDefaultPosition : defaultPosition;

      if ([floor, x, y, level].every(v => !isNil(v))) {
        this.linkTo({ floor, x, y, level }, 'replace');
      }
    }
  }

  hasQueryString() {
    return Boolean(this.props.location.search);
  }

  render() {
    const { appSettingStore, legendStore, floorStore, pluginSettingsStore } = this.props;

    if (!appSettingStore.success || !floorStore.success || !legendStore.success) {
      return null;
    }

    const isMobile = this.platform === PLATFORM.MOBILE;
    const urlParams = this.getUrlParams();
    const plugins = allPlugins.filter(plugin => {
      if (plugin.platform && !plugin.platform.includes(this.platform)) {
        return false;
      }

      if (!pluginSettingsStore.data[plugin.id]) {
        return true;
      }

      return !pluginSettingsStore.data[plugin.id].off;
    });

    return (
      <>
        {!isMobile ? (
          <div className={style.headerContainer}>
            <div className={style.header}>HKUST Path Advisor</div>
            <div className={style.social}>
              <iframe
                title="facebook"
                src="https://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fpathadvisor.ust.hk%2F&amp;send=false&amp;layout=button_count&amp;width=90&amp;show_faces=true&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21"
                scrolling="no"
                frameBorder="0"
                style={{ border: 'none', overflow: 'hidden', width: '90px', height: '21px' }}
              />
            </div>
          </div>
        ) : null}
        <div className={classnames(style.body, { [style.bodyMobile]: isMobile })}>
          {!isMobile ? (
            <PrimaryPanel
              {...urlParams}
              linkTo={this.linkTo}
              logger={logger(this.hasQueryString(), this.platform)}
            >
              {plugins.map(
                ({ id, PrimaryPanelPlugin, OverlayHeaderPlugin, OverlayContentPlugin }) => ({
                  id,
                  PrimaryPanelPlugin,
                  OverlayHeaderPlugin,
                  OverlayContentPlugin,
                }),
              )}
            </PrimaryPanel>
          ) : (
            <>
              <TopPanel
                {...urlParams}
                linkTo={this.linkTo}
                logger={logger(this.hasQueryString(), this.platform)}
              />
              <MobileOverlay>
                {plugins.map(({ id, MobileOverlayHeaderPlugin, MobileOverlayContentPlugin }) => ({
                  id,
                  MobileOverlayHeaderPlugin,
                  MobileOverlayContentPlugin,
                }))}
              </MobileOverlay>
              {urlParams.suggestion ? (
                <FullScreenOverlay
                  className={style.suggestionOverlayBody}
                  onCloseIconClick={() => {
                    this.linkTo({ suggestion: null });
                  }}
                >
                  <Suggestion
                    tab={urlParams.suggestion}
                    x={urlParams.suggestionX}
                    y={urlParams.suggestionY}
                    floor={urlParams.floor}
                    linkTo={this.linkTo}
                  />
                </FullScreenOverlay>
              ) : null}
            </>
          )}
          <MapCanvas {...urlParams} linkTo={this.linkTo} platform={this.platform}>
            {plugins.map(({ id, MapCanvasPlugin, MenuBarPlugin, name }) => ({
              id,
              MapCanvasPlugin,
              MenuBarPlugin,
              name,
            }))}
          </MapCanvas>
        </div>
      </>
    );
  }
}

export default connect(
  state => ({
    appSettingStore: state.appSettings,
    floorStore: state.floors,
    legendStore: state.legends,
    pluginSettingsStore: state.pluginSettings,
  }),
  dispatch => ({
    getInitDataHandler: () => {
      dispatch(getInitDataAction());
    },
  }),
)(Main);
