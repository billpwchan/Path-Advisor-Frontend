import React, { Component } from 'react';
import pick from 'lodash.pick';
import { connect } from 'react-redux';
import SearchArea from '../SearchArea/SearchArea';
import { getAutoCompleteAction } from '../../reducers/autoComplete';
import {
  searchShortestPathAction,
  updateSearchShortestPathSettingAction,
  clearSearchShortestPathResultAction,
} from '../../reducers/searchShortestPath';
import { searchNearestAction, clearSearchNearestResultAction } from '../../reducers/searchNearest';
import PanelOverlay from '../PanelOverlay/PanelOverlay';
import Floor from '../Floor/Floor';
import getConnectedComponent from '../ConnectedComponent/getConnectedComponent';

import style from './PrimaryPanel.module.css';

class PrimaryPanel extends Component {
  state = {
    selectedBuilding: 'academicBuilding',
    displayAdvancedSearch: false,
  };

  selectBuildingAction = selectedBuilding => {
    this.setState({ selectedBuilding });
  };

  displayAdvancedSearch = displayAdvancedSearch => () => {
    this.setState({ displayAdvancedSearch });
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
      updateSearchShortestPathSettingHandler,
      x,
      y,
      scale,
      floor,
      linkTo,
      fromPlace,
      toPlace,
      mapItemType,
    } = this.props;

    const { selectedBuilding, displayAdvancedSearch } = this.state;

    const urlParams = {
      place,
      fromPlace,
      toPlace,
      mapItemType,
      x,
      y,
      scale,
      floor,
    };

    const renderTab = () => {
      switch (overlayStore.open) {
        case true:
          return (
            <PanelOverlay
              closeOverlayHandler={closeOverlayHandler}
              headerElements={children.map(({ id, OverlayHeaderPlugin }) => {
                const { photo, name, url, others } = overlayStore;
                return (
                  OverlayHeaderPlugin && (
                    <OverlayHeaderPlugin
                      key={`header_${id}`}
                      name={name}
                      photo={photo}
                      url={url}
                      others={others}
                    />
                  )
                );
              })}
              contentElements={children.map(({ id, OverlayContentPlugin }) => {
                const { photo, name, url, others } = overlayStore;
                return (
                  OverlayContentPlugin && (
                    <OverlayContentPlugin
                      key={`content_${id}`}
                      name={name}
                      photo={photo}
                      url={url}
                      others={others}
                    />
                  )
                );
              })}
            />
          );

        default:
          return (
            <div>
              <div className={style.tab}>
                <button
                  type="button"
                  className={style.tabButton}
                  onClick={this.displayAdvancedSearch(false)}
                >
                  Path advisor
                </button>
                <button
                  type="button"
                  className={style.tabButton}
                  onClick={this.displayAdvancedSearch(true)}
                >
                  Advanced Search
                </button>
              </div>

              {displayAdvancedSearch ? null : (
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
              )}
              <SearchArea
                displayAdvancedSearch={displayAdvancedSearch}
                getAutoCompleteAction={getAutoCompleteAction}
                autoCompleteStore={autoCompleteStore}
                searchShortestPathHandler={searchShortestPathHandler}
                clearSearchShortestPathResultHandler={clearSearchShortestPathResultHandler}
                searchShortestPathStore={searchShortestPathStore}
                updateSearchShortestPathSettingHandler={updateSearchShortestPathSettingHandler}
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

              {children.map(({ id, PrimaryPanelPlugin }) => {
                if (!PrimaryPanelPlugin) {
                  return null;
                }

                const PluginComponent = getConnectedComponent(
                  `primaryPanel_${id}`,
                  PrimaryPanelPlugin.connect,
                  PrimaryPanelPlugin.Component,
                );

                return (
                  <PluginComponent
                    key={id}
                    {...pick({ ...urlParams, linkTo }, PrimaryPanelPlugin.connect)}
                  />
                );
              })}
            </div>
          );
      }
    };

    return <div className={style.body}>{renderTab()}</div>;
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
    updateSearchShortestPathSettingHandler: (noStairCase, noEscalator, searchMode) => {
      dispatch(updateSearchShortestPathSettingAction(noStairCase, noEscalator, searchMode));
    },
    clearSearchNearestResultHandler: () => {
      dispatch(clearSearchNearestResultAction());
    },
  }),
)(PrimaryPanel);
