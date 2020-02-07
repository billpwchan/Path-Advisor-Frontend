import React, { Component } from 'react';

import style from './ShortestResult.module.css';
import Loading from '../Loading/Loading';
import MapCanvasPlugin from './ShortestResultMapCanvas';

class ShortestResultPrimaryPanel extends Component {
  componentDidUpdate(prevProps) {
    const {
      searchShortestPathStore,
      searchNearestStore,
      linkTo,
      searchOptionsStore: { actionSource },
    } = this.props;

    if (actionSource !== 'BUTTON_CLICK') {
      return;
    }

    if (searchShortestPathStore === prevProps.searchShortestPathStore) {
      return;
    }

    // only do auto focus to start point if user is not searching for a nearest item
    if (searchNearestStore.nearest !== null) {
      return;
    }

    const { paths } = searchShortestPathStore;
    if (!paths.length) {
      return;
    }

    const [
      {
        floor,
        coordinates: [x, y],
      },
    ] = paths;

    linkTo(
      {
        floor,
        x,
        y,
      },
      'replace',
    );
  }

  render() {
    const {
      appSettingStore,
      searchShortestPathStore,
      floorStore: { floors, buildings },
      linkTo,
      via,
    } = this.props;

    const distanceToMinutes = distance => {
      const { minutesPerMeter } = appSettingStore;
      return Math.ceil(distance * minutesPerMeter);
    };

    const getBuildingAndFloorText = floor =>
      floors[floor].name
        ? `Floor ${floors[floor].name}, ${buildings[floors[floor].buildingId].name}`
        : buildings[floors[floor].buildingId].name;

    const formNameFromCoordinate = place => `(${place.coordinates.join(', ')})`;

    const { paths = [] } = searchShortestPathStore;

    let [currentFloorFirstPath] = paths;
    let [currentFloorLastPath] = paths;
    let currentFloorDistance = 0;
    let totalDistance = 0;
    const instructions = [];

    const viaIds = new Set((via || []).map(({ data: { id } }) => id));

    paths.forEach(path => {
      if (path.floor !== currentFloorFirstPath.floor) {
        instructions.push({
          floor: currentFloorLastPath.floor,
          from: currentFloorFirstPath,
          to: currentFloorLastPath,
          distance: currentFloorDistance,
          nextFloor: path.floor,
        });
        currentFloorFirstPath = path;
        currentFloorDistance = 0;
      } else if (viaIds.has(path.id)) {
        instructions.push({
          floor: path.floor,
          from: currentFloorFirstPath,
          to: path,
          distance: currentFloorDistance,
          nextFloor: path.floor,
        });
        currentFloorFirstPath = path;
        currentFloorDistance = 0;
      } else {
        currentFloorLastPath = path;
      }

      currentFloorDistance += path.distance;
      totalDistance += path.distance;
    });

    if (currentFloorLastPath) {
      instructions.push({
        floor: currentFloorLastPath.floor,
        from: currentFloorFirstPath,
        to: currentFloorLastPath,
        distance: currentFloorDistance,
        nextFloor: null,
      });
    }

    const shortestPathHead = <div className={style.head}>Direction</div>;

    switch (true) {
      case searchShortestPathStore.loading:
        return (
          <div className={style.body}>
            {shortestPathHead}
            <div className={style.content}>
              <Loading text="Please wait..." />
            </div>
          </div>
        );
      case searchShortestPathStore.success: {
        return (
          <div className={style.body}>
            {shortestPathHead}
            <div className={style.content}>
              {instructions.map(({ floor, nextFloor, from, to, distance }, i) => (
                <div key={i}>
                  {(instructions[i - 1] || {}).floor !== floor ? (
                    <div className={style.floorTitle}>{getBuildingAndFloorText(floor)}</div>
                  ) : null}
                  <div className={style.row}>
                    <div className={style.instructionCol}>
                      <button
                        type="button"
                        className={style.link}
                        onClick={() => {
                          const mapItem = nextFloor ? from : to;
                          linkTo({
                            x: mapItem.coordinates[0],
                            y: mapItem.coordinates[1],
                            floor: mapItem.floor,
                          });
                        }}
                      >
                        From {from.name || formNameFromCoordinate(from)} to{' '}
                        {to.name || formNameFromCoordinate(to)}
                      </button>
                      {nextFloor && (
                        <button
                          type="button"
                          className={style.link}
                          onClick={() => {
                            linkTo({
                              x: to.coordinates[0],
                              y: to.coordinates[1],
                              floor: to.floor,
                            });
                          }}
                        >
                          {to.type === 'lift'
                            ? `Take ${to.name} to floor ${floors[nextFloor].name}`
                            : null}
                        </button>
                      )}
                    </div>
                    <div className={style.timeCol}>
                      <div>
                        ({Math.round(distance)}
                        m)
                      </div>
                      <div>~{distanceToMinutes(distance)} min</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className={style.totalTime}>
                Total estimated time: {distanceToMinutes(totalDistance)} min
              </div>
            </div>
          </div>
        );
      }

      case searchShortestPathStore.failure: {
        return (
          <div className={style.body}>
            {shortestPathHead}
            <div className={style.content}>Sorry, no result found.</div>
          </div>
        );
      }
      default:
        return null;
    }
  }
}

const id = 'shortestResult';
const core = true;
const PrimaryPanelPlugin = {
  connect: [
    'appSettingStore',
    'searchShortestPathStore',
    'searchNearestStore',
    'floorStore',
    'linkTo',
    'searchOptionsStore',
    'via',
  ],
  Component: ShortestResultPrimaryPanel,
};

export { id, core, PrimaryPanelPlugin, MapCanvasPlugin };
