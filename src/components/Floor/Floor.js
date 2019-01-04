import React, { Component } from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { floorsPropTypes } from '../../reducers/floors';
import { PLATFORM } from '../Main/detectPlatform';

class Floor extends Component {
  static propTypes = {
    platform: PropTypes.oneOf(Object.values(PLATFORM)),
    floorStore: floorsPropTypes,
    x: PropTypes.number,
    y: PropTypes.number,
    level: PropTypes.number,
    currentFloorId: PropTypes.string,
    FloorView: PropTypes.func.isRequired,
    selectedBuilding: PropTypes.string.isRequired,
    linkTo: PropTypes.func.isRequired,
    selectBuildingAction: PropTypes.func,
  };

  get currentBuilding() {
    return this.getFloorBuilding(this.props.currentFloorId);
  }

  getDefaultFloorPosition(floor) {
    const {
      floorStore: { floors },
      platform,
    } = this.props;
    const floorData = floors[floor];

    return platform === PLATFORM.MOBILE
      ? [floorData.mobileDefaultX, floorData.mobileDefaultY, floorData.mobileDefaultLevel]
      : [floorData.defaultX, floorData.defaultY, floorData.defaultLevel];
  }

  getFloorBuilding(floor) {
    return get(this.props.floorStore, `floors.${floor}.buildingId`);
  }

  selectFloor = floor => () => {
    const { x, y, level, linkTo, currentFloorId } = this.props;

    const useSameCoordinates = () => {
      switch (this.currentBuilding) {
        // TO-DO: remove this after db position is normalized.
        case 'academicBuilding': {
          const mappableFloors = ['1', '2', '3', '4', '5', '6', '7'];
          return mappableFloors.includes(currentFloorId) && mappableFloors.includes(floor);
        }
        default:
          return this.currentBuilding === this.getFloorBuilding(floor);
      }
    };

    if (useSameCoordinates()) {
      linkTo({ x, y, floor, level });
      return;
    }

    const [defaultX, defaultY, defaultLevel] = this.getDefaultFloorPosition(floor);

    linkTo({
      x: defaultX,
      y: defaultY,
      floor,
      level: defaultLevel,
    });
    
  };

  selectBuilding = buildingId => () => {
    const {
      floorStore: { buildings },
      linkTo,
      selectBuildingAction,
    } = this.props;
    if (buildings[buildingId].floorIds.length === 1) {
      const [floor] = buildings[buildingId].floorIds;

      const [defaultX, defaultY, defaultLevel] = this.getDefaultFloorPosition(floor);

      linkTo({
        x: defaultX,
        y: defaultY,
        floor,
        level: defaultLevel,
      });
      return;
    }

    if (selectBuildingAction) {
      selectBuildingAction(buildingId);
    }
  };

  render() {
    const { floorStore, selectedBuilding, currentFloorId, FloorView } = this.props;
    return (
      <FloorView
        floorStore={floorStore}
        selectedBuilding={selectedBuilding}
        selectBuilding={this.selectBuilding}
        selectFloor={this.selectFloor}
        currentFloorId={currentFloorId}
      />
    );
  }
}

export default connect(state => ({
  floorStore: state.floors,
}))(Floor);
