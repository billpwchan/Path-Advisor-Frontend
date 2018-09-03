import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import get from 'lodash.get';

import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';
import { getMapItemsAction } from '../../reducers/mapItems';

class Main extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    mapItemStore: PropTypes.shape({}).isRequired,
    getMapItemsHandler: PropTypes.func.isRequired,
  };

  static defaultProps = {
    match: { params: {} },
  };

  state = {
    displayOverlay: true,
  };

  getUrlParams() {
    const {
      match: {
        params: { place, fromPlace, toPlace, mapItemType, coordinatePath, floorPath },
      },
    } = this.props;

    const coordinateString =
      (typeof coordinatePath === 'string' && get(coordinatePath.split('/'), 1)) || null;
    const floor = (typeof floorPath === 'string' && get(floorPath.split('/'), 1)) || undefined;
    const [x = undefined, y = undefined, scale = undefined] = coordinateString
      ? coordinateString.split(',').map(v => parseInt(v, 10))
      : [];

    return {
      place,
      fromPlace,
      toPlace,
      mapItemType,
      x,
      y,
      scale,
      floor,
    };
  }

  closeOverlayHandler = () => {
    this.setState({
      displayOverlay: false,
    });
  };

  render() {
    const { displayOverlay } = this.state;
    const { getMapItemsHandler, mapItemStore } = this.props;

    return (
      <div>
        <Link to="/place/room2345">About</Link>
        <PrimaryPanel
          {...this.getUrlParams()}
          displayOverlay={displayOverlay}
          closeOverlayHandler={this.closeOverlayHandler}
        >
          {plugins.map(
            ({ pluginId, PrimaryPanelPlugin, OverlayHeaderPlugin, OverlayContentPlugin }) => ({
              pluginId,
              PrimaryPanelPlugin,
              OverlayHeaderPlugin,
              OverlayContentPlugin,
            }),
          )}
        </PrimaryPanel>
        <MapCanvas
          {...this.getUrlParams()}
          getMapItemsHandler={getMapItemsHandler}
          mapItemStore={mapItemStore}
        >
          {plugins.map(({ pluginId, MapCanvasPlugin }) => ({
            pluginId,
            MapCanvasPlugin,
          }))}
        </MapCanvas>
      </div>
    );
  }
}

export default connect(
  state => ({
    mapItemStore: state.mapItems,
  }),
  dispatch => ({
    getMapItemsHandler: (floor, [startX, startY], [endX, endY]) => {
      dispatch(getMapItemsAction(floor, [startX, startY], [endX, endY]));
    },
  }),
)(Main);
