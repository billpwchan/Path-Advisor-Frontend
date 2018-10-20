import React, { Component } from 'react';
import style from './ShortestResult.module.css';
import Loading from '../../components/Loading/Loading';

// local store
const pathIds = new Set();
const clickListenerMapItemIds = new Set();

class ShortestResultPrimaryPanel extends Component {
  componentDidUpdate(prevProps) {
    const { searchShortestPathStore, searchNearestStore, linkTo } = this.props;

    if (searchShortestPathStore === prevProps.searchShortestPathStore) {
      return;
    }

    // only do auto focus to start point if user is not search for nearest item
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

    linkTo({
      floor,
      x,
      y,
    });
  }

  render() {
    const {
      appSettingStore,
      searchShortestPathStore,
      floorStore: { floors, buildings },
      linkTo,
    } = this.props;
    const distanceToMinutes = distance => {
      const { meterPerPixel, minutesPerMeter } = appSettingStore;
      return Math.ceil(distance * meterPerPixel * minutesPerMeter);
    };

    const getBuildingAndFloorText = floor =>
      `Floor ${floors[floor].name}, ${buildings[floors[floor].buildingId].name}`;

    const { paths = [] } = searchShortestPathStore;

    let [currentFloorFirstPath] = paths;
    let [currentFloorLastPath] = paths;
    let currentFloorDistance = 0;
    let totalDistance = 0;
    const instructions = [];

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
            {shortestPathHead}{' '}
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
              {instructions.map(({ floor, nextFloor, from, to, distance }) => (
                <div key={floor}>
                  <div className={style.floorTitle}>{getBuildingAndFloorText(floor)}</div>
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
                        From {from.name} to {to.name}
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
                          Take {to.name} to floor {floors[nextFloor].name}
                        </button>
                      )}
                    </div>
                    <div className={style.timeCol}>
                      <div>
                        ({Math.round(distance * appSettingStore.meterPerPixel)}
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
      default:
        return null;
    }
  }
}

function ShortestResultMapCanvas({
  setMapItems,
  removeMapItem,
  searchShortestPathStore,
  addMapItemClickListener,
  removeMapItemClickListener,
  linkTo,
}) {
  const { paths = [] } = searchShortestPathStore;
  const lineStyle = {
    cap: 'round',
    strokeStyle: 'red',
    width: 3,
  };

  const mapItems = {};

  const LISTENER_ID = 'shortestResultConnector';

  pathIds.forEach(id => {
    removeMapItem(id);
  });

  pathIds.clear();

  clickListenerMapItemIds.forEach(id => {
    removeMapItemClickListener(LISTENER_ID, id);
  });

  clickListenerMapItemIds.clear();

  paths.forEach(({ floor, coordinates, id }, i) => {
    if (!mapItems[floor]) {
      pathIds.add(`${floor}_line`);
      mapItems[floor] = {
        id: `${floor}_line`,
        floor,
        line: {
          ...lineStyle,
          coordinates: [coordinates],
        },
      };
    } else {
      mapItems[floor].line.coordinates.push(coordinates);
    }

    const prevPath = i === 0 ? null : paths[i - 1];
    if (prevPath && prevPath.floor !== floor) {
      addMapItemClickListener(
        LISTENER_ID,
        `${floor}_${id}`,
        () => {
          linkTo({
            x: prevPath.coordinates[0],
            y: prevPath.coordinates[1],
            floor: prevPath.floor,
          });
          return false;
        },
        true,
      );
      addMapItemClickListener(
        LISTENER_ID,
        `${prevPath.floor}_${prevPath.id}`,
        () => {
          linkTo({
            x: coordinates[0],
            y: coordinates[1],
            floor,
          });
          return false;
        },
        true,
      );

      clickListenerMapItemIds.add(`${floor}_${id}`);
      clickListenerMapItemIds.add(`${prevPath.floor}_${prevPath.id}`);
    }
  });

  if (paths.length) {
    setMapItems(Object.values(mapItems));
  }

  return null;
}

const id = 'shortestResult';
const PrimaryPanelPlugin = {
  connect: [
    'appSettingStore',
    'searchShortestPathStore',
    'searchNearestStore',
    'floorStore',
    'linkTo',
  ],
  Component: ShortestResultPrimaryPanel,
};

const MapCanvasPlugin = {
  connect: [
    'setMapItems',
    'removeMapItem',
    'searchShortestPathStore',
    'addMapItemClickListener',
    'removeMapItemClickListener',
    'linkTo',
  ],
  Component: ShortestResultMapCanvas,
};

export { id, PrimaryPanelPlugin, MapCanvasPlugin };
