import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PopUpMenu from '../PopUpMenu/PopUpMenu';
import style from './FloorTopPanelView.module.css';
import { floorsPropType } from '../../reducers/floors';

function addFloorSuffix(floor) {
  return !Number.isNaN(Number.parseInt(floor, 10)) || (floor && floor.length === 1)
    ? `${floor}/F`
    : floor;
}

function padArray(items, divider) {
  const itemCounts = divider - (items.length % divider);
  if (itemCounts === divider) {
    return items;
  }

  return [...items, ...Array(itemCounts)];
}

class FloorTopPanelView extends Component {
  static propTypes = {
    currentFloorId: PropTypes.string.isRequired,
    floorStore: floorsPropType.isRequired,
    selectedBuilding: PropTypes.string.isRequired,
    selectFloor: PropTypes.func.isRequired,
  };

  state = {
    shouldFloorPopUpMenuDisplay: false,
  };

  setFloorPopUpMenuDisplay = value => {
    this.setState({ shouldFloorPopUpMenuDisplay: value });
  };

  render() {
    const {
      floorStore: { buildings, floors },
      selectedBuilding,
      currentFloorId,
      selectFloor,
    } = this.props;

    const currentFloorName = floors[currentFloorId].name;
    const { floorIds } = buildings[selectedBuilding];
    const selectedIndex = floorIds.indexOf(currentFloorId);

    return (
      <>
        <button
          className={style.button}
          type="button"
          onClick={() => this.setFloorPopUpMenuDisplay(true)}
        >
          <div className="topPanel__tabLeft" />
          <div className={classnames('topPanel__tabSpace', style.content)}>
            <div className={classnames(style.text, { [style.noFloor]: !currentFloorName })}>
              {addFloorSuffix(currentFloorName)}
            </div>
          </div>
          <div className="topPanel__tabRight" />
        </button>
        {this.state.shouldFloorPopUpMenuDisplay && (
          <PopUpMenu
            className={style.menu}
            title="Floor"
            items={padArray(floorIds, 3).map(floorId => (
              <button
                type="button"
                key={floorId}
                className={style.selectFloorButton}
                onClick={floorId ? selectFloor(floorId) : undefined}
              >
                {floorId ? addFloorSuffix(floors[floorId].name) : null}
              </button>
            ))}
            selectedIndex={selectedIndex}
            onClose={() => this.setFloorPopUpMenuDisplay(false)}
          />
        )}
      </>
    );
  }
}

export default FloorTopPanelView;
