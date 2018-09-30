import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';
import { parseParams, build as buildUrl } from '../RouterManager/Url';
import style from './Main.module.css';

class Main extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    match: { params: {} },
  };

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

export default Main;
