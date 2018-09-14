import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Floor.module.css';
import getUrl from '../RouterManager/GetUrl';

class Floor extends Component {
  static propTypes = {
    buildingIds: PropTypes.arrayOf(PropTypes.string),
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    currentFloor: PropTypes.string.isRequired,
    selectedBuilding: PropTypes.string.isRequired,
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
        floors: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ),
    linkTo: PropTypes.func.isRequired,
    selectBuildingAction: PropTypes.func.isRequired,
  };

  get currentBuilding() {
    return this.getFloorBuilding(this.props.currentFloor);
  }

  getFloorBuilding(floor) {
    return this.props.floors[floor].buildingId;
  }

  selectFloor = floor => () => {
    const { x, y, scale, linkTo, currentFloor, floors } = this.props;

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
      linkTo(getUrl({ x, y, floor, scale }));
      return;
    }

    linkTo(
      getUrl({
        x: floors[floor].defaultX,
        y: floors[floor].defaultY,
        floor,
        scale: floors[floor].defaultScale,
      }),
    );
  };

  selectBuilding = buildingId => () => {
    const { buildings, linkTo, floors, selectBuildingAction } = this.props;
    if (buildings[buildingId].floorIds.length === 1) {
      const [floor] = buildings[buildingId].floorIds;

      linkTo(
        getUrl({
          x: floors[floor].defaultX,
          y: floors[floor].defaultY,
          floor,
          scale: floors[floor].defaultScale,
        }),
      );
      return;
    }

    selectBuildingAction(buildingId);
  };

  render() {
    const { buildingIds, buildings, floors, selectedBuilding } = this.props;
    return (
      <div>
        <ul className={styles.buildingList}>
          {buildingIds.map(buildingId => (
            <li
              key={buildingId}
              className={classnames({ [styles.selected]: buildingId === selectedBuilding })}
            >
              <button
                type="button"
                className={styles.buildingButton}
                onClick={this.selectBuilding(buildingId)}
              >
                {buildings[buildingId].name}
              </button>
            </li>
          ))}
        </ul>
        <ul className={styles.floorList}>
          {buildings[selectedBuilding].floorIds.map(floorId => (
            <li key={floorId}>
              <button
                type="button"
                className={styles.floorButton}
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

export default Floor;
