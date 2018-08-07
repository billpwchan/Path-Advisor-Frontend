import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import get from 'lodash.get';

import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';

class Main extends Component {
  primaryPanelRef = createRef();

  static defaultProps = {
    match: { params: {} },
  };

  state = {};

  getUrlParams() {
    const {
      match: {
        params: { place, fromPlace, toPlace, mapItemType, coordinatePath, floorPath },
      },
    } = this.props;

    const coordinateString =
      typeof coordinatePath === 'string' && get(coordinatePath.split('/'), 1);
    const floor = typeof floorPath === 'string' && get(floorPath.split('/'), 1);
    const coordinate = typeof coordinateString === 'string' && coordinateString.split(',');

    return { place, fromPlace, toPlace, mapItemType, coordinate, floor };
  }

  render() {
    console.log('Main.js', this.props.match);

    return (
      <div>
        <Link to="/place/room2345">About</Link>
        <PrimaryPanel {...this.getUrlParams()}>
          {plugins.map(({ pluginId, PrimaryPanelPlugin }) => ({
            pluginId,
            PrimaryPanelPlugin,
          }))}
        </PrimaryPanel>
        <MapCanvas {...this.getUrlParams()}>
          {plugins.map(({ pluginId, MapCanvasPlugin }) => ({
            pluginId,
            MapCanvasPlugin,
          }))}
        </MapCanvas>
      </div>
    );
  }
}

Main.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
};

export default connect(state => ({
  mappedTest: state.mapItems.test,
}))(Main);
