import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isNil from 'lodash.isnil';
import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import TopPanel from '../TopPanel/TopPanel';
import plugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';
import { parseParams, build as buildUrl } from '../Router/Url';
import style from './Main.module.css';
import detectPlatform, { PLATFORM } from './detectPlatform';
import MobileOverlay from '../MobileOverlay/MobileOverlay';

class Main extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    appSettingStore: PropTypes.shape({
      success: PropTypes.bool.isRequired,
      defaultPosition: PropTypes.shape({
        floor: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        level: PropTypes.number.isRequired,
      }).isRequired,
    }),
  };

  static defaultProps = {
    match: { params: {} },
  };

  constructor(props) {
    super(props);
    this.initPosition();

    this.state = {
      initSearch: !!this.props.match.params.search,
    };
  }

  componentDidMount() {
    this.initPosition();
  }

  componentDidUpdate() {
    this.initPosition();
  }

  getUrlParams(platform) {
    return parseParams(this.props.match.params, platform);
  }

  updateInitSearch = initSearch => {
    this.setState({ initSearch });
  };

  linkTo = (params, method) => {
    const {
      level: currentLevel,
      x: currentX,
      y: currentY,
      floor: currentFloor,
      from: currentFrom,
      to: currentTo,
      search: currentSearch,
    } = this.getUrlParams(detectPlatform());
    const {
      floor = currentFloor,
      x = currentX,
      y = currentY,
      level = currentLevel,
      from = currentFrom,
      to = currentTo,
      search = currentSearch,
    } = params;

    const isNewPosition =
      floor !== currentFloor || x !== currentX || y !== currentY || level !== currentLevel;

    const opt = method || (isNewPosition ? 'push' : 'replace');
    this.props.history[opt](buildUrl({ floor, x, y, level, search, from, to }));
  };

  initPosition() {
    const platform = detectPlatform();

    // init position from app settings if current position is not set
    const urlParams = this.getUrlParams(platform);
    if ([urlParams.level, urlParams.x, urlParams.y, urlParams.floor].some(v => isNil(v))) {
      const {
        appSettingStore: { defaultPosition, mobileDefaultPosition },
      } = this.props;

      const { floor, x, y, level } =
        platform === PLATFORM.MOBILE ? mobileDefaultPosition : defaultPosition;

      if ([floor, x, y, level].every(v => !isNil(v))) {
        this.linkTo({ floor, x, y, level }, 'replace');
      }
    }
  }

  render() {
    const platform = detectPlatform();
    const isMobile = platform === PLATFORM.MOBILE;
    const urlParams = this.getUrlParams(platform);

    return (
      <>
        {!isMobile ? (
          <div className={style.headerContainer}>
            <div className={style.header}>HKUST Path Advisor</div>
            <div className={style.social}>
              <iframe
                title="facebook"
                src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fpathadvisor.ust.hk%2F&amp;send=false&amp;layout=button_count&amp;width=90&amp;show_faces=true&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21"
                scrolling="no"
                frameBorder="0"
                style={{ border: 'none', overflow: 'hidden', width: '90px', height: '21px' }}
                allowTransparency
              />
            </div>
          </div>
        ) : null}
        <div className={classnames(style.body, { [style.bodyMobile]: isMobile })}>
          {!isMobile ? (
            <PrimaryPanel
              {...urlParams}
              linkTo={this.linkTo}
              initSearch={this.state.initSearch}
              updateInitSearch={this.updateInitSearch}
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
                initSearch={this.state.initSearch}
                updateInitSearch={this.updateInitSearch}
              />
              <MobileOverlay>
                {plugins.map(({ id, MobileOverlayHeaderPlugin, MobileOverlayContentPlugin }) => ({
                  id,
                  MobileOverlayHeaderPlugin,
                  MobileOverlayContentPlugin,
                }))}
              </MobileOverlay>
            </>
          )}
          {this.props.appSettingStore.success && (
            <MapCanvas {...urlParams} linkTo={this.linkTo} platform={detectPlatform()}>
              {plugins.map(({ id, MapCanvasPlugin }) => ({
                id,
                MapCanvasPlugin,
              }))}
            </MapCanvas>
          )}
        </div>
      </>
    );
  }
}

export default connect(state => ({ appSettingStore: state.appSettings }))(Main);
