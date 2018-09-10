import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import get from 'lodash.get';

import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';
import { getMapItemsAction } from '../../reducers/mapItems';
import { openOverlayAction, closeOverlayAction } from '../../reducers/overlay';

class Main extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    mapItemStore: PropTypes.shape({}).isRequired,
    legendStore: PropTypes.shape({}).isRequired,
    overlayStore: PropTypes.shape({}).isRequired,
    openOverlayHandler: PropTypes.func.isRequired,
    closeOverlayHandler: PropTypes.func.isRequired,
    getMapItemsHandler: PropTypes.func.isRequired,
  };

  static defaultProps = {
    match: { params: {} },
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

  render() {
    const {
      getMapItemsHandler,
      mapItemStore,
      legendStore,
      overlayStore,
      closeOverlayHandler,
      openOverlayHandler,
    } = this.props;

    return (
      <div>
        <Link to="/place/room2345">About</Link>
        <PrimaryPanel
          {...this.getUrlParams()}
          overlayStore={overlayStore}
          closeOverlayHandler={closeOverlayHandler}
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
          legendStore={legendStore}
          openOverlayHandler={openOverlayHandler}
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
    legendStore: state.legends,
    overlayStore: state.overlay,
  }),
  dispatch => ({
    getMapItemsHandler: (floor, [startX, startY], width, height) => {
      dispatch(getMapItemsAction(floor, [startX, startY], width, height));
    },
    openOverlayHandler: (photo, url, name, others) => {
      dispatch(openOverlayAction(photo, url, name, others));
    },
    closeOverlayHandler: () => {
      dispatch(closeOverlayAction());
    },
  }),
)(Main);
