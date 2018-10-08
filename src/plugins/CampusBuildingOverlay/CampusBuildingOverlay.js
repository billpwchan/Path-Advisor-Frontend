const DEFAULT_COLOR = 'transparent';
const MOUSEOVER_COLOR = 'rgba(173,216,230,0.7)';

function CampusBuildingOverlay({ floorStore: { floors }, setMapItems, linkTo }) {
  const getOverlayMapItem = (id, x, y, width, height, floor) => ({
    id,
    x,
    y,
    floor: 'Overall',
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

  setMapItems([
    getOverlayMapItem('academicBuildingOverlay', 873, 403, 300, 700, 'G'),
    getOverlayMapItem('CYTOverlay', 970, 1090, 110, 110, 'CYTG'),
    getOverlayMapItem('LSKOverlay', 1158, 1344, 140, 200, 'NABG'),
    getOverlayMapItem('IASOverlay', 1408, 1485, 110, 110, 'IASG'),
    getOverlayMapItem('UCOverlay', 1196, 973, 120, 120, 'UCG'),
  ]);

  return null;
}

const MapCanvasPlugin = {
  Component: CampusBuildingOverlay,
  connect: ['floorStore', 'setMapItems', 'linkTo'],
};
const id = 'campusBuildingOverlay';
export { id, MapCanvasPlugin };
