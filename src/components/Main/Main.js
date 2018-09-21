import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import get from 'lodash.get';
import getUrl from '../RouterManager/GetUrl';
import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';
import { getMapItemsAction } from '../../reducers/mapItems';
import { setSearchAreaInputAction } from '../../reducers/searchAreaInput';
import { openOverlayAction, closeOverlayAction } from '../../reducers/overlay';

class Main extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    appSettings: PropTypes.shape({}).isRequired,
    mapItemStore: PropTypes.shape({}).isRequired,
    legendStore: PropTypes.shape({}).isRequired,
    overlayStore: PropTypes.shape({}).isRequired,
    floorStore: PropTypes.shape({}).isRequired,
    searchShortestPathStore: PropTypes.shape({}).isRequired,
    searchNearestStore: PropTypes.shape({}).isRequired,
    searchAreaInputStore: PropTypes.shape({}).isRequired,
    openOverlayHandler: PropTypes.func.isRequired,
    closeOverlayHandler: PropTypes.func.isRequired,
    getMapItemsHandler: PropTypes.func.isRequired,
    setSearchAreaInputHandler: PropTypes.func.isRequired,
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

  linkTo = ({ floor, x, y, scale }) => {
    const currentScale = this.getUrlParams().scale;
    this.props.history.push(getUrl({ floor, x, y, scale: scale || currentScale }));
  };

  render() {
    const {
      appSettings,
      getMapItemsHandler,
      mapItemStore,
      legendStore,
      overlayStore,
      floorStore,
      closeOverlayHandler,
      openOverlayHandler,
      searchShortestPathStore,
      searchNearestStore,
      searchAreaInputStore,
      setSearchAreaInputHandler,
    } = this.props;

    return (
      <div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <PrimaryPanel
          {...this.getUrlParams()}
          overlayStore={overlayStore}
          floorStore={floorStore}
          legendStore={legendStore}
          appSettings={appSettings}
          closeOverlayHandler={closeOverlayHandler}
          searchShortestPathStore={searchShortestPathStore}
          searchNearestStore={searchNearestStore}
          searchAreaInputStore={searchAreaInputStore}
          setSearchAreaInputHandler={setSearchAreaInputHandler}
          linkTo={this.linkTo}
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
          appSettings={appSettings}
          getMapItemsHandler={getMapItemsHandler}
          mapItemStore={mapItemStore}
          legendStore={legendStore}
          openOverlayHandler={openOverlayHandler}
          searchShortestPathStore={searchShortestPathStore}
          searchNearestStore={searchNearestStore}
          searchAreaInputStore={searchAreaInputStore}
          linkTo={this.linkTo}
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
    floorStore: state.floors,
    searchShortestPathStore: state.searchShortestPath,
    searchNearestStore: state.searchNearest,
    searchAreaInputStore: state.searchAreaInput,
    appSettings: state.appSettings,
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
    setSearchAreaInputHandler: payload => {
      dispatch(setSearchAreaInputAction(payload));
    },
  }),
)(Main);
