import React, { Component } from 'react';
import { connect } from 'react-redux';
import { openOverlayAction } from '../../reducers/overlay';
import { updateLegendDisplayAction } from '../../reducers/legends';
import { getNearestMapItemAction } from '../../reducers/nearestMapItem';
import { setSearchOptionsAction } from '../../reducers/searchOptions';

const paramStateMap = {
  legendStore: 'legends',
  mapItemStore: 'mapItems',
  floorStore: 'floors',
  searchNearestStore: 'searchNearest',
  searchShortestPathStore: 'searchShortestPath',
  searchOptionsStore: 'searchOptions',
  appSettingStore: 'appSettings',
  overlayStore: 'overlay',
  searchMapItemStore: 'searchMapItem',
  nearestMapItemStore: 'nearestMapItem',
};

const urlParams = ['place', 'from', 'to', 'via', 'x', 'y', 'level', 'floor'];
const canvasParams = [
  'canvas',
  'width',
  'height',
  'normalizedWidth',
  'normalizedHeight',
  'movingLeftX',
  'movingTopY',
  'movingScreenLeftX',
  'movingScreenTopY',
  'movingX',
  'movingY',
  'movingScaledX',
  'movingScaledY',
  'nextLevel',
  'previousLevel',
];

const paramDispatchMap = {
  openOverlayHandler: dispatch => (photo, url, name, others) => {
    dispatch(openOverlayAction(photo, url, name, others));
  },
  updateLegendDisplayHandler: dispatch => (legendType, display) => {
    dispatch(updateLegendDisplayAction(legendType, display));
  },
  getNearestMapItemHandler: dispatch => (floor, coordinates) => {
    dispatch(getNearestMapItemAction(floor, coordinates));
  },
  setSearchOptionsHandler: dispatch => payload => {
    dispatch(setSearchOptionsAction(payload));
  },
};

/* eslint no-param-reassign: [0] */
const ConnectedComponent = connectParams => PluginComponent => {
  if (!PluginComponent) {
    throw new Error(
      'You must wrap you plugin component in an object { Component: <Your plugin component>, connect: [<param1>, <param2>, ..., <paramN>] }',
    );
  }
  if (!Array.isArray(connectParams)) {
    throw new Error(
      'You must provide connect value in plugin object, if you do not wish to connect any param, pass empty array []',
    );
  }

  class ProxyComponent extends Component {
    shouldComponentUpdate(nextProps) {
      return connectParams.some(
        param =>
          (canvasParams.includes(param) || urlParams.includes(param) || paramStateMap[param]) &&
          this.props[param] !== nextProps[param],
      );
    }

    render() {
      return <PluginComponent {...this.props} />;
    }
  }

  return connect(
    state =>
      connectParams.reduce((connectedState, param) => {
        if (paramStateMap[param]) {
          connectedState[param] = state[paramStateMap[param]];
        }
        return connectedState;
      }, {}),
    dispatch =>
      connectParams.reduce((connectedDispatch, param) => {
        if (paramDispatchMap[param]) {
          connectedDispatch[param] = paramDispatchMap[param](dispatch);
        }
        return connectedDispatch;
      }, {}),
  )(ProxyComponent);
};

export default ConnectedComponent;
