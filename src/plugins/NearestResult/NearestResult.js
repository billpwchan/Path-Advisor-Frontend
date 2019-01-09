import React, { Component } from 'react';
import isNil from 'lodash.isnil';
import style from './NearestResult.module.css';
import Loading from '../Loading/Loading';

class NearestResult extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.searchNearestStore === this.props.searchNearestStore) {
      return;
    }

    const {
      searchNearestStore: { nearest },
      searchOptionsStore: { actionSource },
      linkTo,
      floor,
      x,
      y,
      level,
    } = this.props;

    if (nearest && (actionSource !== 'EXTERNAL_LINK' || [floor, x, y, level].some(v => isNil(v)))) {
      linkTo(
        {
          x: nearest.coordinates[0],
          y: nearest.coordinates[1],
          floor: nearest.floor,
        },
        'replace',
      );
    }
  }

  getBuildingAndFloorText(floor) {
    const {
      floorStore: { floors, buildings },
    } = this.props;

    return floors[floor].name
      ? `Floor ${floors[floor].name}, ${buildings[floors[floor].buildingId].name}`
      : buildings[floors[floor].buildingId].name;
  }

  render() {
    const { searchNearestStore, linkTo } = this.props;

    const searchNearestHead = <div className={style.head}>Search result</div>;
    switch (true) {
      case searchNearestStore.loading:
        return (
          <div className={style.body}>
            {searchNearestHead}
            <div className={style.content}>
              <Loading text="Please wait..." />
            </div>
          </div>
        );

      case searchNearestStore.success: {
        const { from, nearest } = searchNearestStore;

        return (
          <div className={style.body}>
            {searchNearestHead}
            <div className={style.content}>
              <div className={style.head}>
                Nearest {nearest.type} from {from.name} ({this.getBuildingAndFloorText(from.floor)})
              </div>
              <div>
                <button
                  className={style.link}
                  type="button"
                  onClick={() =>
                    linkTo({
                      x: nearest.coordinates[0],
                      y: nearest.coordinates[1],
                      floor: nearest.floor,
                    })
                  }
                >
                  {nearest.name} ({this.getBuildingAndFloorText(nearest.floor)})
                </button>
              </div>
            </div>
          </div>
        );
      }

      case searchNearestStore.failure: {
        return (
          <div className={style.body}>
            {searchNearestHead}
            <div className={style.content}>Sorry, no result found.</div>
          </div>
        );
      }

      default:
        return null;
    }
  }
}

const id = 'nearestResult';
const PrimaryPanelPlugin = {
  Component: NearestResult,
  connect: [
    'searchNearestStore',
    'floorStore',
    'linkTo',
    'searchOptionsStore',
    'x',
    'y',
    'level',
    'floor',
  ],
};

export { id, PrimaryPanelPlugin };
