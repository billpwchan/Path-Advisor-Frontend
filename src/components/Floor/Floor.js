import React, { Component } from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import style from './Floor.module.css';

class Floor extends Component {
  static propTypes = {
    floorStore: PropTypes.shape({
      buildingIds: PropTypes.arrayOf(PropTypes.string),
      floors: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          buildingId: PropTypes.string.isRequired,
          meterPerPixel: PropTypes.number.isRequired,
          mapWidth: PropTypes.number.isRequired,
          mapHeight: PropTypes.number.isRequired,
          ratio: PropTypes.number.isRequired,
          defaultX: PropTypes.number.isRequired,
          defaultY: PropTypes.number.isRequired,
          defaultScale: PropTypes.number.isRequired,
        }),
      ),
      buildings: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          floorIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
      ),
    }),
    x: PropTypes.number,
    y: PropTypes.number,
    scale: PropTypes.number,
    currentFloor: PropTypes.string,
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
      scale,
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
      linkTo({ x, y, floor, scale });
      return;
    }

    linkTo({
      x: floors[floor].defaultX,
      y: floors[floor].defaultY,
      floor,
      scale: floors[floor].defaultScale,
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
        scale: floors[floor].defaultScale,
      });
      return;
    }

    selectBuildingAction(buildingId);
  };

  render() {
    const {
      floorStore: { buildingIds, buildings, floors },
      selectedBuilding,
    } = this.props;
    return (
      <div className={style.body}>
        <ul className={style.buildingList}>
          {buildingIds.map(buildingId => (
            <li
              key={buildingId}
              className={classnames({ [style.selected]: buildingId === selectedBuilding })}
            >
              <button
                type="button"
                className={style.buildingButton}
                onClick={this.selectBuilding(buildingId)}
              >
                {buildings[buildingId].name}
              </button>
            </li>
          ))}
        </ul>
        <ul className={style.floorList}>
          {buildings[selectedBuilding].floorIds.map(floorId => (
            <li key={floorId}>
              <button
                type="button"
                className={style.floorButton}
                onClick={this.selectFloor(floorId)}
              >
                {floors[floorId].name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(state => ({
  floorStore: state.floors,
}))(Floor);
