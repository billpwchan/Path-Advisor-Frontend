import React, { Component } from 'react';
import pick from 'lodash.pick';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchArea from '../SearchArea/SearchArea';
import SearchPrimaryPanelView from '../SearchPrimaryPanelView/SearchPrimaryPanelView';
import FloorPrimaryPanelView from '../FloorPrimaryPanelView/FloorPrimaryPanelView';
import PanelOverlay from '../PanelOverlay/PanelOverlay';
import Floor from '../Floor/Floor';
import getConnectedComponent from '../ConnectedComponent/getConnectedComponent';

import style from './PrimaryPanel.module.css';
import { closeOverlayAction } from '../../reducers/overlay';
import { propTypes as urlPropTypes } from '../Router/Url';

class PrimaryPanel extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    overlayStore: PropTypes.shape({}).isRequired,
    closeOverlayHandler: PropTypes.func.isRequired,
    linkTo: PropTypes.func.isRequired,
    logger: PropTypes.func.isRequired,
    ...urlPropTypes,
  };

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
      children,
      overlayStore,
      closeOverlayHandler,
      x,
      y,
      level,
      floor,
      linkTo,
      logger,
    } = this.props;

    const { selectedBuilding, displayAdvancedSearch } = this.state;

    const urlParams = pick(this.props, ['from', 'to', 'x', 'y', 'level', 'floor', 'search']);

    return (
      <div className={style.body}>
        {overlayStore.open ? (
          <PanelOverlay
            closeOverlayHandler={closeOverlayHandler}
            headerElements={children.map(({ id, OverlayHeaderPlugin }) => {
              if (!OverlayHeaderPlugin || !OverlayHeaderPlugin.Component) {
                return null;
              }
              const { photo, name, url, others } = overlayStore;
              return (
                <OverlayHeaderPlugin.Component
                  key={`header_${id}`}
                  name={name}
                  photo={photo}
                  url={url}
                  others={others}
                />
              );
            })}
            contentElements={children.map(({ id, OverlayContentPlugin }) => {
              if (!OverlayContentPlugin || !OverlayContentPlugin.Component) {
                return null;
              }
              const { photo, name, url, others } = overlayStore;
              return (
                <OverlayContentPlugin.Component
                  key={`content_${id}`}
                  name={name}
                  photo={photo}
                  url={url}
                  others={others}
                />
              );
            })}
          />
        ) : null}
        <div style={{ display: overlayStore.open ? 'none' : '' }}>
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
              linkTo={linkTo}
              x={x}
              y={y}
              currentFloorId={floor}
              level={level}
              FloorView={FloorPrimaryPanelView}
            />
          )}
          <SearchArea
            from={urlParams.from}
            to={urlParams.to}
            search={urlParams.search}
            displayAdvancedSearch={displayAdvancedSearch}
            linkTo={linkTo}
            SearchView={SearchPrimaryPanelView}
            logger={logger}
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
      </div>
    );
  }
}

export default connect(
  state => ({
    overlayStore: state.overlay,
  }),
  dispatch => ({
    closeOverlayHandler: () => {
      dispatch(closeOverlayAction());
    },
  }),
)(PrimaryPanel);
