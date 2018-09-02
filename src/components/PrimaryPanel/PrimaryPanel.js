import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchArea from '../SearchArea/SearchArea';
import { getAutoCompleteAction } from '../../reducers/autoComplete';
import { searchShortestPathAction } from '../../reducers/searchShortestPath';
import { searchNearestAction } from '../../reducers/searchNearest';
import PanelOverlay from '../PanelOverlay/PanelOverlay';

class PrimaryPanel extends Component {
  state = {};

  render() {
    const {
      children,
      place,
      helloWorld,
      tests,
      getAutoCompleteAction,
      searchShortestPathAction,
      searchNearestAction,
      autoCompleteStore,
      history,
      displayOverlay,
      closeOverlayHandler,
    } = this.props;

    return (
      <div>
        {displayOverlay ? (
          <PanelOverlay
            closeOverlayHandler={closeOverlayHandler}
            headerElements={children.map(
              ({ pluginId, OverlayHeaderPlugin }) =>
                OverlayHeaderPlugin && (
                  <OverlayHeaderPlugin key={`header_${pluginId}`} name="Test Map Item" />
                ),
            )}
            contentElements={children.map(
              ({ pluginId, OverlayContentPlugin }) =>
                OverlayContentPlugin && (
                  <OverlayContentPlugin
                    key={`content_${pluginId}`}
                    name="Test Map Item"
                    photo="https://avatars2.githubusercontent.com/u/6147805"
                  />
                ),
            )}
          />
        ) : (
          <div>
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
                    <PrimaryPanelPlugin key={pluginId} helloWorld={helloWorld} place={place} />
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
