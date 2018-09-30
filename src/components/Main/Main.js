import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isNil from 'lodash.isnil';
import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';
import { parseParams, build as buildUrl } from '../Router/Url';
import style from './Main.module.css';

class Main extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    appSettingStore: PropTypes.shape({
      defaultPosition: PropTypes.shape({
        floor: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        scale: PropTypes.number.isRequired,
      }).isRequired,
    }),
  };

  static defaultProps = {
    match: { params: {} },
  };

  constructor(props) {
    super(props);
    this.initPosition();
  }

  componentDidMount() {
    this.initPosition();
  }

  componentDidUpdate() {
    this.initPosition();
  }

  get urlParams() {
    return parseParams(this.props.match.params);
  }

  linkTo = ({ floor, x, y, scale = this.urlParams.scale }) => {
    const { scale: currentScale, x: currentX, y: currentY, floor: currentFloor } = this.urlParams;

    const isNewPosition =
      floor !== currentFloor || x !== currentX || y !== currentY || scale !== currentScale;

    if (isNewPosition) {
      this.props.history.push(buildUrl({ floor, x, y, scale }));
    }
  };

  initPosition() {
    // init position from app settings if current position is not set
    if (
      [this.urlParams.scale, this.urlParams.x, this.urlParams.y, this.urlParams.floor].some(v =>
        isNil(v),
      )
    ) {
      const {
        appSettingStore: {
          defaultPosition: { floor, x, y, scale },
        },
      } = this.props;
      if ([floor, x, y, scale].every(v => !isNil(v))) {
        this.linkTo({ floor, x, y, scale });
      }
    }
  }

  render() {
    return (
      <div className={style.body}>
        <div className={style.header}>HKUST Path Advisor</div>
        <PrimaryPanel {...this.urlParams} linkTo={this.linkTo}>
          {plugins.map(({ id, PrimaryPanelPlugin, OverlayHeaderPlugin, OverlayContentPlugin }) => ({
            id,
            PrimaryPanelPlugin,
            OverlayHeaderPlugin,
            OverlayContentPlugin,
          }))}
        </PrimaryPanel>
        <MapCanvas {...this.urlParams} linkTo={this.linkTo}>
          {plugins.map(({ id, MapCanvasPlugin }) => ({
            id,
            MapCanvasPlugin,
          }))}
        </MapCanvas>
      </div>
    );
  }
}

export default connect(state => ({ appSettingStore: state.appSettings }))(Main);
