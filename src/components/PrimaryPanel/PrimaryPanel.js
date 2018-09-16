import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchArea from '../SearchArea/SearchArea';
import { getAutoCompleteAction } from '../../reducers/autoComplete';
import { searchShortestPathAction } from '../../reducers/searchShortestPath';
import { searchNearestAction } from '../../reducers/searchNearest';
import PanelOverlay from '../PanelOverlay/PanelOverlay';
import Floor from '../Floor/Floor';

class PrimaryPanel extends Component {
  state = {
    selectedBuilding: 'academicBuilding',
  };

  selectBuildingAction = selectedBuilding => {
    this.setState({ selectedBuilding });
  };

  render() {
    const {
      children,
      place,
      getAutoCompleteAction,
      searchShortestPathAction,
      searchNearestAction,
      autoCompleteStore,
      overlayStore,
      floorStore,
      legendStore,
      history,
      closeOverlayHandler,
      x,
      y,
      scale,
      floor,
    } = this.props;

    const { selectedBuilding } = this.state;

    return (
      <div>
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
              linkTo={history.push}
              x={x}
              y={y}
              currentFloor={floor}
              scale={scale}
            />
            <SearchArea
              getAutoCompleteAction={getAutoCompleteAction}
              autoCompleteStore={autoCompleteStore}
              searchShortestPathAction={searchShortestPathAction}
              searchNearestAction={searchNearestAction}
              history={history}
            />
            <div>
              {children.map(
                ({ pluginId, PrimaryPanelPlugin }) =>
                  PrimaryPanelPlugin && (
                    <PrimaryPanelPlugin
                      key={pluginId}
                      place={place}
                      legends={legendStore.legends}
                      legendIds={legendStore.legendIds}
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

export default withRouter(
  connect(
    state => ({
      autoCompleteStore: state.autoComplete,
    }),
    dispatch => ({
      getAutoCompleteAction: keyword => {
        dispatch(getAutoCompleteAction(keyword));
      },
      searchShortestPathAction: (from, to) => {
        dispatch(searchShortestPathAction(from, to));
      },
      searchNearestAction: (floor, name, nearestType, sameFloor) => {
        dispatch(searchNearestAction(floor, name, nearestType, sameFloor));
      },
    }),
  )(PrimaryPanel),
);

// export default withRouter(
//   connect(
//     null,
//     null,
//     null,
//     { withRef: true },
//   )(PrimaryPanel),
// );
