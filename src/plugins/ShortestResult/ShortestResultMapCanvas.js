import { Component } from 'react';

// local store
const addedMapItemIds = new Set();
const clickListenerMapItemIds = new Set();

const DESTINATION_INDEX = -2;
const START_INDEX = -1;

let dragging = false;
let requestNearest = false;
let viaIndex = null;

const DEFAULT_TEXT_STYLE = {
  style: 'bold 10px arial',
  color: 'black',
};

function squaredDistance(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx ** 2 + dy ** 2;
}

function getClosetPointOnLine([x, y], a, b) {
  let point;

  if (b[0] - a[0] === 0) {
    point = [a[0], y];
  } else {
    const m = (b[1] - a[1]) / (b[0] - a[0]);
    const c = a[1] - m * a[0];
    const origin = [x, y];
    const xPoint = [x, m * x + c];
    const yPoint = [(y - c) / m, y];
    const xDist = squaredDistance(xPoint, origin);
    const yDist = squaredDistance(yPoint, origin);

    point = xDist < yDist ? xPoint : yPoint;
  }

  return point;
}

function getCircle(id, floor, x, y, others = {}) {
  return {
    id,
    floor,
    x,
    y,
    scalePosition: true,
    scaleDimension: false,
    center: true,
    circle: {
      radius: 8,
      color: others.color || '#ffffff',
      borderColor: others.borderColor || '#000000',
    },
    onDrag: others.onDrag,
    onDragEnd: others.onDragEnd,
    onMouseOver: others.onMouseOver,
    onMouseOut: others.onMouseOut,
  };
}

function getCircleId(suffix) {
  const CIRCLE_ID = 'shortestPathCircle';
  return [CIRCLE_ID, suffix].join('_');
}

const LISTENER_ID = 'shortestResultConnector';

class ShortestResultMapCanvas extends Component {
  componentDidUpdate(prevProps) {
    const { nearestMapItemStore, linkTo, floorStore } = this.props;
    if (
      !requestNearest ||
      prevProps.nearestMapItemStore === nearestMapItemStore ||
      !nearestMapItemStore.mapItem ||
      !nearestMapItemStore.mapItem.id
    ) {
      return;
    }

    requestNearest = false;

    const {
      mapItem: { id, name: _name, floor, coordinates },
    } = nearestMapItemStore;

    const { floors, buildings } = floorStore;
    const name =
      _name ||
      `(${coordinates[0]}, ${coordinates[1]}) - ${
        floors && floors[floor] && floors[floor].name
          ? `Floor ${floors[floor].name} - ${buildings[floors[floor].buildingId].name}`
          : buildings[floors[floor].buildingId].name
      }`;

    this.props.setSearchOptionsHandler({
      actionSource: 'DRAG_AND_DROP',
    });

    if (viaIndex === DESTINATION_INDEX || viaIndex === START_INDEX) {
      const direction = viaIndex === START_INDEX ? 'from' : 'to';
      this.props.linkTo({
        [direction]: {
          name,
          data: { type: 'id', id, floor, value: name, coordinates },
        },
      });

      viaIndex = null;
      return;
    }

    linkTo(currentUrlParams => {
      const via = [...(currentUrlParams.via || [])];

      via.splice(viaIndex == null ? via.length : viaIndex, 1, {
        name,
        data: { type: 'id', id, floor, value: name, coordinates },
      });

      viaIndex = null;

      return {
        ...currentUrlParams,
        via,
      };
    });
  }

  setMapItemsAndTrackId(mapItems) {
    mapItems.forEach(({ id }) => addedMapItemIds.add(id));
    this.props.setMapItems(mapItems);
  }

  render() {
    const {
      removeMapItem,
      searchShortestPathStore,
      addMapItemClickListener,
      removeMapItemClickListener,
      linkTo,
      getNearestMapItemHandler,
      via,
    } = this.props;

    const viaById = (via || []).reduce((agg, place, index) => {
      const {
        data: { id },
      } = place;
      return {
        ...agg,
        [id]: { index },
      };
    }, {});

    const { paths = [] } = searchShortestPathStore;
    const lineStyle = {
      cap: 'round',
      strokeStyle: 'red',
      width: 4,
    };

    const mapItems = [];

    addedMapItemIds.forEach(id => {
      removeMapItem(id);
    });

    addedMapItemIds.clear();

    clickListenerMapItemIds.forEach(id => {
      removeMapItemClickListener(LISTENER_ID, id);
    });

    clickListenerMapItemIds.clear();

    paths.forEach(({ floor, coordinates, id }, i) => {
      const prevPath = i === 0 ? null : paths[i - 1];

      // Draw shortest path line
      if (prevPath && prevPath.floor === floor) {
        mapItems.push({
          id: `${floor}_${i}_line`,
          floor,
          line: {
            ...lineStyle,
            coordinates: [prevPath.coordinates, coordinates],
          },
          onMouseMove: ({ mouse: { mapX, mapY } }) => {
            if (dragging) {
              return;
            }
            document.body.style.cursor = 'grab';

            const [x, y] = getClosetPointOnLine([mapX, mapY], prevPath.coordinates, coordinates);

            this.setMapItemsAndTrackId([
              getCircle(getCircleId(), floor, x, y, {
                onDrag: e => {
                  dragging = true;
                  document.body.style.cursor = 'grab';
                  this.setMapItemsAndTrackId([{ id: e.id, x: e.mouse.mapX, y: e.mouse.mapY }]);
                },
                onDragEnd: e => {
                  document.body.style.cursor = 'auto';
                  dragging = false;
                  requestNearest = true;
                  getNearestMapItemHandler(floor, [e.mouse.mapX, e.mouse.mapY]);
                },
              }),
            ]);
          },
          onMouseOver: () => {
            document.body.style.cursor = 'grab';
          },
          onMouseOut: () => {
            if (dragging) {
              return;
            }
            document.body.style.cursor = 'auto';
            removeMapItem(getCircleId());
          },
          zIndex: -1,
        });
      }

      if (viaById[id]) {
        const [x, y] = coordinates;
        const { index } = viaById[id];

        mapItems.push(
          getCircle(getCircleId(index), floor, x, y, {
            onDrag: e => {
              e.stopPropagation();
              document.body.style.cursor = 'grab';
              this.setMapItemsAndTrackId([{ id: e.id, x: e.mouse.mapX, y: e.mouse.mapY }]);
            },
            onDragEnd: e => {
              document.body.style.cursor = 'auto';
              requestNearest = true;
              viaIndex = index;
              getNearestMapItemHandler(floor, [e.mouse.mapX, e.mouse.mapY]);
            },
            onMouseOver: () => {
              document.body.style.cursor = 'grab';
            },
            onMouseOut: () => {
              document.body.style.cursor = 'auto';
            },
          }),
        );

        mapItems.push({
          id: getCircleId(`text_${index}`),
          floor,
          x,
          y,
          center: true,
          zIndex: 1,
          onDrag: e => {
            this.setMapItemsAndTrackId([{ id: e.id, x: e.mouse.mapX, y: e.mouse.mapY }]);
          },
          textElement: {
            ...DEFAULT_TEXT_STYLE,
            text: String.fromCharCode(65 + index),
          },
        });
      }
      // Add click listener to connector to follow the path to go up/down floor
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
      [
        { color: '#FFB6C1', directionIndex: START_INDEX, node: paths[0] },
        { color: '#32CD32', directionIndex: DESTINATION_INDEX, node: paths[paths.length - 1] },
      ].forEach(({ directionIndex, color, node }) => {
        const {
          floor,
          coordinates: [x, y],
        } = node;
        mapItems.push(
          getCircle(getCircleId(directionIndex), floor, x, y, {
            color,
            onDrag: e => {
              e.stopPropagation();
              document.body.style.cursor = 'grab';
              this.setMapItemsAndTrackId([{ id: e.id, x: e.mouse.mapX, y: e.mouse.mapY }]);
            },
            onDragEnd: e => {
              document.body.style.cursor = 'auto';
              requestNearest = true;
              viaIndex = directionIndex;
              getNearestMapItemHandler(floor, [e.mouse.mapX, e.mouse.mapY]);
            },
          }),
        );
      });

      this.setMapItemsAndTrackId(mapItems);
    }

    return null;
  }
}

export default {
  connect: [
    'floorStore',
    'setMapItems',
    'removeMapItem',
    'searchShortestPathStore',
    'addMapItemClickListener',
    'removeMapItemClickListener',
    'linkTo',
    'getNearestMapItemHandler',
    'nearestMapItemStore',
    'via',
    'setSearchOptionsHandler',
  ],
  Component: ShortestResultMapCanvas,
};
