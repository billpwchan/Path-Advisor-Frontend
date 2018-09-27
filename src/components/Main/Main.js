import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import get from 'lodash.get';
import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';
import MapCanvas from '../MapCanvas/MapCanvas';
import { getMapItemsAction } from '../../reducers/mapItems';
import { setSearchAreaInputAction } from '../../reducers/searchAreaInput';
import { openOverlayAction, closeOverlayAction } from '../../reducers/overlay';
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
      <div className={style.body}>
        <div className={style.header}>HKUST Path Advisor</div>
        <PrimaryPanel
          {...this.urlParams}
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
          {plugins.map(({ id, PrimaryPanelPlugin, OverlayHeaderPlugin, OverlayContentPlugin }) => ({
            id,
            PrimaryPanelPlugin,
            OverlayHeaderPlugin,
            OverlayContentPlugin,
          }))}
        </PrimaryPanel>
        <MapCanvas
          {...this.urlParams}
          appSettings={appSettings}
          floorStore={floorStore}
          getMapItemsHandler={getMapItemsHandler}
          mapItemStore={mapItemStore}
          legendStore={legendStore}
          openOverlayHandler={openOverlayHandler}
          searchShortestPathStore={searchShortestPathStore}
          searchNearestStore={searchNearestStore}
          searchAreaInputStore={searchAreaInputStore}
          linkTo={this.linkTo}
        >
          {plugins.map(({ id, MapCanvasPlugin }) => ({
            id,
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
