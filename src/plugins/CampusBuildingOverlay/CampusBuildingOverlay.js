import { Component } from 'react';
import throttle from 'lodash.throttle';

const DEFAULT_COLOR = 'transparent';
const MOUSEOVER_COLOR = 'rgba(173,216,230,0.7)';
const CAMPUS_FLOOR_ID = 'Overall';

const overlays = [
  ['academicBuildingOverlay', 873, 403, 300, 700, 'G'],
  ['CYTOverlay', 970, 1090, 110, 110, 'CYTG'],
  ['LSKOverlay', 1158, 1344, 140, 200, 'LSKG'],
  ['IASOverlay', 1408, 1485, 110, 110, 'IASG'],
  ['UCOverlay', 1196, 973, 120, 120, 'UCG'],
];

function rectHitTest(rect, clientCoordinate) {
  const [x, y, width, height] = rect;
  const [clientMapX, clientMapY] = clientCoordinate;

  return x <= clientMapX && clientMapX <= x + width && y <= clientMapY && clientMapY <= y + height;
}

class CampusBuildingOverlay extends Component {
  componentDidMount() {
    overlays.forEach(([overlayId, x, y, width, height, floor]) => {
      this.props.addWheelListener(
        throttle(
          ({
            clientMapX,
            clientMapY,
            wheelDelta,
            floor: currentFloor,
            nextLevel,
            previousLevel,
            level,
          }) => {
            const {
              floorStore: { floors },
              linkTo,
              appSettingStore: { lowestLevel, highestLevel },
            } = this.props;

            const currentBuildingId = floors[currentFloor].buildingId;
            const buildingId = floors[floor].buildingId;

            if (wheelDelta > 0 && currentBuildingId === buildingId && level === previousLevel) {
              // zoom out to campus map
              const {
                [CAMPUS_FLOOR_ID]: { defaultX, defaultY },
              } = floors;
              linkTo({ x: defaultX, y: defaultY, level: lowestLevel, floor: CAMPUS_FLOOR_ID });
              return;
            }

            const inRect = rectHitTest([x, y, width, height], [clientMapX, clientMapY]);

            if (
              inRect &&
              wheelDelta < 0 &&
              currentFloor === CAMPUS_FLOOR_ID &&
              level === nextLevel
            ) {
              // zoom into the building
              console.log('In Rect', overlayId, level, nextLevel, currentFloor, wheelDelta);

              const {
                [floor]: { defaultX, defaultY },
              } = floors;
              linkTo({ x: defaultX, y: defaultY, level: highestLevel, floor });
            }
          },
          500,
        ),
      );
    });
  }

  render() {
    const {
      floorStore: { floors },
      setMapItems,
      linkTo,
    } = this.props;

    const getOverlayMapItem = (id, x, y, width, height, floor) => ({
      id,
      x,
      y,
      floor: CAMPUS_FLOOR_ID,
      scaleDimension: true,
      rect: {
        width,
        height,
        color: DEFAULT_COLOR,
      },
      onMouseOver: () => {
        document.body.style.cursor = 'pointer';
        setMapItems([
          {
            id,
            rect: {
              width,
              height,
              color: MOUSEOVER_COLOR,
            },
          },
        ]);
      },
      onMouseOut: () => {
        document.body.style.cursor = 'auto';
        setMapItems([
          {
            id,
            rect: {
              width,
              height,
              color: DEFAULT_COLOR,
            },
          },
        ]);
      },
      onClick: () => {
        const {
          [floor]: { defaultLevel, defaultX, defaultY },
        } = floors;
        linkTo({ floor, x: defaultX, y: defaultY, level: defaultLevel });
      },
    });

    setMapItems(overlays.map(overlay => getOverlayMapItem(...overlay)));

    return null;
  }
}

const MapCanvasPlugin = {
  Component: CampusBuildingOverlay,
  connect: ['appSettingStore', 'floorStore', 'setMapItems', 'linkTo', 'addWheelListener'],
};

const id = 'campusBuildingOverlay';
export { id, MapCanvasPlugin };
