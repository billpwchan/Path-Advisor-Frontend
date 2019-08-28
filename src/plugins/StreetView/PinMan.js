import PinManImages from './PinManImages';

const imageWidth = 40;
const imageHeight = 40;
const imageWidthOffset = -20;
const imageHeightOffset = -30;

const PIN_MAN_ID = 'PIN_MAN_ID';

/*
    This is the pin man component after drag man is dropped on map.
    
    It sets an map item on the location on map where mouse is released, the location is passed in by parent.
    
    It accepts an angle passed in by the parent, then display the small man image corresponding to the angle.

*/

function getPinManImage(angle) {
  // console.log("pin man angle",angle);
  return getPinManImage_dev(angle);
}

/*
 This is a very rudinmentary function to get pin man image given angle.
 It basically read in the static image file loaded from PinManImages.js .
*/

function getPinManImage_dev(angle) {
  if (angle >= 0) {
    angle %= 360;
  } else {
    angle = (angle % 360) + 360;
  }
  const index = Math.floor(angle / 22.5);
  const image = new Image();

  image.src = PinManImages[index];
  // const image = ""
  return image;
}

function PinMan({ setMapItems, removeMapItem, x, y, floor, angle }) {
  if (x && y && floor) {
    angle = angle == null ? 0 : angle;
    const image = getPinManImage(angle);
    setMapItems([
      {
        id: PIN_MAN_ID,
        floor,
        x: x + imageWidthOffset,
        y: y + imageHeightOffset,
        width: imageWidth,
        height: imageHeight,
        image,
        zIndex: 2,
        center: true,
        scalePosition: true,
        scaleDimension: true,
      },
    ]);
  } else {
    removeMapItem(PIN_MAN_ID);
  }

  return null;
}

export default PinMan;
