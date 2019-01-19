import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './FloorPrimaryPanelView.module.css';
import { floorsPropType } from '../../reducers/floors';

const FloorPrimaryPanelView = ({
  floorStore: { buildingIds, buildings, floors },
  selectedBuilding,
  selectBuilding,
  selectFloor,
}) => (
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
            onClick={selectBuilding(buildingId)}
          >
            {buildings[buildingId].name}
          </button>
        </li>
      ))}
    </ul>
    <ul className={style.floorList}>
      {buildings[selectedBuilding].floorIds.map(floorId => (
        <li key={floorId}>
          <button type="button" className={style.floorButton} onClick={selectFloor(floorId)}>
            {floors[floorId].name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

FloorPrimaryPanelView.propTypes = {
  floorStore: floorsPropType.isRequired,
  selectedBuilding: PropTypes.string.isRequired,
  selectBuilding: PropTypes.func.isRequired,
  selectFloor: PropTypes.func.isRequired,
};

export default FloorPrimaryPanelView;
