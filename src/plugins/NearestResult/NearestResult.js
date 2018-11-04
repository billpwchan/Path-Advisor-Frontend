import React, { Component } from 'react';
import style from './NearestResult.module.css';
import Loading from '../Loading/Loading';

class NearestResult extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.searchNearestStore === this.props.searchNearestStore) {
      return;
    }

    const {
      searchNearestStore: { nearest },
      linkTo,
    } = this.props;

    if (nearest) {
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
    return `Floor ${floors[floor].name}, ${buildings[floors[floor].buildingId].name}`;
  }

  render() {
    console.log('NearestResult rendered');
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

      default:
        return null;
    }
  }
}

const id = 'nearestResult';
const PrimaryPanelPlugin = {
  Component: NearestResult,
  connect: ['searchNearestStore', 'floorStore', 'linkTo'],
};

export { id, PrimaryPanelPlugin };
