import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchArea from '../SearchArea/SearchArea';
import { getAutoCompleteAction } from '../../reducers/autoComplete';
import {
  searchShortestPathAction,
  clearSearchShortestPathResultAction,
} from '../../reducers/searchShortestPath';
import { searchNearestAction, clearSearchNearestResultAction } from '../../reducers/searchNearest';
import PanelOverlay from '../PanelOverlay/PanelOverlay';
import Floor from '../Floor/Floor';

import style from './PrimaryPanel.module.css';

class PrimaryPanel extends Component {
  state = {
    selectedBuilding: 'academicBuilding',
  };

  selectBuildingAction = selectedBuilding => {
    this.setState({ selectedBuilding });
  };

  render() {
    const {
      appSettings,
      children,
      place,
      getAutoCompleteAction,
      searchShortestPathHandler,
      clearSearchShortestPathResultHandler,
      searchNearestHandler,
      clearSearchNearestResultHandler,
      autoCompleteStore,
      overlayStore,
      floorStore,
      legendStore,
      searchShortestPathStore,
      searchNearestStore,
      closeOverlayHandler,
      setSearchAreaInputHandler,
      searchAreaInputStore,
      x,
      y,
      scale,
      floor,
      linkTo,
    } = this.props;

    const { selectedBuilding } = this.state;

    return (
      <div className={style.body}>
        {overlayStore.open ? (
          <PanelOverlay
            closeOverlayHandler={closeOverlayHandler}
            headerElements={children.map(({ pluginId, OverlayHeaderPlugin }) => {
              const { photo, name, url, others } = overlayStore;
              return (
                OverlayHeaderPlugin && (
                  <OverlayHeaderPlugin
                    key={`header_${pluginId}`}
                    name={name}
                    photo={photo}
                    url={url}
                    others={others}
                  />
                )
              );
            })}
            contentElements={children.map(({ pluginId, OverlayContentPlugin }) => {
              const { photo, name, url, others } = overlayStore;
              return (
                OverlayContentPlugin && (
                  <OverlayContentPlugin
                    key={`content_${pluginId}`}
                    name={name}
                    photo={photo}
                    url={url}
                    others={others}
                  />
                )
              );
            })}
          />
        ) : (
          <div>
            <Floor
              selectedBuilding={selectedBuilding}
              selectBuildingAction={this.selectBuildingAction}
              buildingIds={floorStore.buildingIds}
              buildings={floorStore.buildings}
              floors={floorStore.floors}
              linkTo={linkTo}
              x={x}
              y={y}
              currentFloor={floor}
              scale={scale}
            />
            <SearchArea
              getAutoCompleteAction={getAutoCompleteAction}
              autoCompleteStore={autoCompleteStore}
              searchShortestPathHandler={searchShortestPathHandler}
              clearSearchShortestPathResultHandler={clearSearchShortestPathResultHandler}
              searchNearestHandler={searchNearestHandler}
              clearSearchNearestResultHandler={clearSearchNearestResultHandler}
              from={searchAreaInputStore.from}
              to={searchAreaInputStore.to}
              searchOptions={searchAreaInputStore.searchOptions}
              searchInputOrders={searchAreaInputStore.searchInputOrders}
              setSearchAreaInputHandler={setSearchAreaInputHandler}
              floorStore={floorStore}
              linkTo={linkTo}
            />
            <div>
              {children.map(
                ({ pluginId, PrimaryPanelPlugin }) =>
                  PrimaryPanelPlugin && (
                    <PrimaryPanelPlugin
                      appSettings={appSettings}
                      key={pluginId}
                      place={place}
                      legends={legendStore.legends}
                      legendIds={legendStore.legendIds}
                      searchShortestPathStore={searchShortestPathStore}
                      searchNearestStore={searchNearestStore}
                      searchAreaInputStore={searchAreaInputStore}
                      floorStore={floorStore}
                      linkTo={linkTo}
                    />
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    autoCompleteStore: state.autoComplete,
  }),
  dispatch => ({
    getAutoCompleteAction: keyword => {
      dispatch(getAutoCompleteAction(keyword));
    },
    searchShortestPathHandler: (from, to) => {
      dispatch(searchShortestPathAction(from, to));
    },
    clearSearchShortestPathResultHandler: () => {
      dispatch(clearSearchShortestPathResultAction());
    },
    searchNearestHandler: (floor, name, nearestType, sameFloor, id) => {
      dispatch(searchNearestAction(floor, name, nearestType, sameFloor, id));
    },
    clearSearchNearestResultHandler: () => {
      dispatch(clearSearchNearestResultAction());
    },
  }),
)(PrimaryPanel);

// export default withRouter(
//   connect(
//     null,
//     null,
//     null,
//     { withRef: true },
//   )(PrimaryPanel),
// );
