import pinImage from './pin.png';

const pinImageWidth = 9;
const pinImageHeight = 20;

const PIN_ID = 'PIN_ID';

function Pin({ setMapItems, removeMapItem, from }) {
  console.log('pin rendered');
  // put a read pin in map if user specified the 'from' value in input field
  const { data: { coordinates: [x, y] = [null, null], floor = null } = {} } = from;

  if (x && y && floor) {
    const image = new Image();
    image.src = pinImage;
    console.log(x,y)
    setMapItems([
      {
        id: PIN_ID,
        floor,
        x: x - pinImageWidth / 2,
        y: y - pinImageHeight,
        width: pinImageWidth,
        height: pinImageHeight,
        image,
        zIndex: 2,
      },
    ]);
  } else {
    removeMapItem(PIN_ID);
  }

  return null;
}

const MapCanvasPlugin = {
  Component: Pin,
  connect: ['from', 'setMapItems', 'removeMapItem'],
};

const id = 'pin';
export { id, MapCanvasPlugin };
