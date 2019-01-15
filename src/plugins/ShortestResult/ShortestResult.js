import React, { Component } from 'react';
import isNil from 'lodash.isnil';
import style from './ShortestResult.module.css';
import Loading from '../Loading/Loading';

// local store
const addedMapItemIds = new Set();
const clickListenerMapItemIds = new Set();

class ShortestResultPrimaryPanel extends Component {
  componentDidUpdate(prevProps) {
    const {
      searchShortestPathStore,
      searchNearestStore,
      linkTo,
      searchOptionsStore: { actionSource },
      x: currentX,
      y: currentY,
      floor: currentFloor,
      level: currentLevel,
    } = this.props;

    console.log('current', currentFloor, currentX, currentY, currentLevel);
    if (
      actionSource === 'EXTERNAL_LINK' &&
      [currentFloor, currentX, currentY, currentLevel].every(v => !isNil(v))
    ) {
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

function ShortestResultMapCanvas({
  setMapItems,
  removeMapItem,
  searchShortestPathStore,
  addMapItemClickListener,
  removeMapItemClickListener,
  linkTo,
  platform,
}) {
  const { paths = [] } = searchShortestPathStore;
  const lineStyle = {
    cap: 'round',
    strokeStyle: 'red',
    width: 3,
  };

  const mapItems = {};

  const LISTENER_ID = 'shortestResultConnector';

  addedMapItemIds.forEach(id => {
    removeMapItem(id);
  });

  addedMapItemIds.clear();

  clickListenerMapItemIds.forEach(id => {
    removeMapItemClickListener(LISTENER_ID, id);
  });

  clickListenerMapItemIds.clear();

  paths.forEach(({ floor, coordinates, id, photo }, i) => {
    if (!mapItems[floor]) {
      addedMapItemIds.add(`${floor}_line`);
      mapItems[floor] = {
        id: `${floor}_line`,
        floor,
        line: {
          ...lineStyle,
          coordinates: [coordinates],
        },
        zIndex: -1,
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

    if (platform === 'DESKTOP' && photo) {
      const img = new Image();
      img.addEventListener('load', () => {
        const PHOTO_ITEM_ID = `${id}_path_photo`;
        addedMapItemIds.add(PHOTO_ITEM_ID);

        const x = coordinates[0];
        const y = coordinates[1] + 20;

        const photoMapItem = {
          id: PHOTO_ITEM_ID,
          floor,
          x,
          y,
          image: img,
          zIndex: 1,
        };

        const CONTAINER_ITEM_ID = `${id}_path_photo_container`;
        addedMapItemIds.add(CONTAINER_ITEM_ID);

        const PADDING = 15;

        const containerTagItem = {
          id: CONTAINER_ITEM_ID,
          floor,
          x,
          y,
          offsetX: -PADDING,
          offsetY: -PADDING,
          rect: {
            color: 'rgba(0,0,0,0.6)',
            width: img.width + 2 * PADDING,
            height: img.height + 2 * PADDING,
          },
          zIndex: 1,
        };

        const CONTAINER_CLOSE_BUTTON_ITEM_ID = `${id}_path_photo_container_close_button`;
        const closeButtonItem = {
          id: CONTAINER_CLOSE_BUTTON_ITEM_ID,
          floor,
          x,
          y,
          textElement: {
            text: '×',
            style: '14px Verdana',
            color: 'white',
          },
          offsetX: img.width,
          offsetY: -PADDING,
          onClick: () => {
            [PHOTO_ITEM_ID, CONTAINER_ITEM_ID, CONTAINER_CLOSE_BUTTON_ITEM_ID].forEach(itemId => {
              removeMapItem(itemId);
              addedMapItemIds.delete(itemId);
            });
          },
          onMouseOver: () => {
            document.body.style.cursor = 'pointer';
          },
          onMouseOut: () => {
            document.body.style.cursor = 'auto';
          },
          zIndex: 1,
        };

        setMapItems([
          {
            ...containerTagItem,
          },
          {
            ...closeButtonItem,
          },
          {
            ...photoMapItem,
            opacity: 0.6,
            onMouseOver: () => {
              setMapItems([
                {
                  ...photoMapItem,
                  opacity: 1,
                },
              ]);
            },
            onMouseOut: () => {
              setMapItems([
                {
                  ...photoMapItem,
                  opacity: 0.6,
                },
              ]);
            },
          },
        ]);
      });

      img.src = photo;
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
    'searchOptionsStore',
    'x',
    'y',
    'level',
    'floor',
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
    'platform',
  ],
  Component: ShortestResultMapCanvas,
};

export { id, PrimaryPanelPlugin, MapCanvasPlugin };
