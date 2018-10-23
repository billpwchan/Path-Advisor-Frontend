import React, { Component } from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { floorsPropTypes } from '../../reducers/floors';

class Floor extends Component {
  static propTypes = {
    floorStore: floorsPropTypes,
    x: PropTypes.number,
    y: PropTypes.number,
    level: PropTypes.number,
    currentFloor: PropTypes.string,
    FloorView: PropTypes.func.isRequired,
    selectedBuilding: PropTypes.string.isRequired,
    linkTo: PropTypes.func.isRequired,
    selectBuildingAction: PropTypes.func.isRequired,
  };

  get currentBuilding() {
    return this.getFloorBuilding(this.props.currentFloor);
  }

  getFloorBuilding(floor) {
    return get(this.props.floorStore, `floors.${floor}.buildingId`);
  }

  selectFloor = floor => () => {
    const {
      x,
      y,
      level,
      linkTo,
      currentFloor,
      floorStore: { floors },
    } = this.props;

    const useSameCoordinates = () => {
      switch (this.currentBuilding) {
        // TO-DO: move this after db position normalized.
        case 'academicBuilding': {
          const mappableFloors = ['1', '2', '3', '4', '5', '6', '7'];
          return mappableFloors.includes(currentFloor) && mappableFloors.includes(floor);
        }
        default:
          return this.currentBuilding === this.getFloorBuilding(floor);
      }
    };

    if (useSameCoordinates()) {
      linkTo({ x, y, floor, level });
      return;
    }

    linkTo({
      x: floors[floor].defaultX,
      y: floors[floor].defaultY,
      floor,
      level: floors[floor].defaultLevel,
    });
  };

  selectBuilding = buildingId => () => {
    const {
      floorStore: { buildings },
      linkTo,
      floorStore: { floors },
      selectBuildingAction,
    } = this.props;
    if (buildings[buildingId].floorIds.length === 1) {
      const [floor] = buildings[buildingId].floorIds;

      linkTo({
        x: floors[floor].defaultX,
        y: floors[floor].defaultY,
        floor,
        level: floors[floor].defaultLevel,
      });
      return;
    }

    selectBuildingAction(buildingId);
  };

  render() {
    const { floorStore, selectedBuilding, FloorView } = this.props;
    return (
      <FloorView
        floorStore={floorStore}
        selectedBuilding={selectedBuilding}
        selectBuilding={this.selectBuilding}
        selectFloor={this.selectFloor}
      />
    );
  }
}

export default connect(state => ({
  floorStore: state.floors,
}))(Floor);
