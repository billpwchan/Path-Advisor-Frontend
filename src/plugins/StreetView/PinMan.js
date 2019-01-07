import pinManImage from './img/man/0.png';
const imageWidth = 40;
const imageHeight = 40;

const PIN_MAN_ID = 'PIN_MAN_ID';

/*
    This is the pin man component after drag man is dropped on map.
    It sets an map item on the location on map where mouse is released.
*/


function PinMan({ setMapItems, removeMapItem, x, y, floor }) {

    // put a read pin man in map if user specified the 'from' value in input field
    if (x && y && floor) {
        console.log('Pin Man rendered', x, y);
        const image = new Image();
        image.src = pinManImage;

        setMapItems([
            {
                id: PIN_MAN_ID,
                floor: floor,
                x: x,
                y: y,
                width: imageWidth,
                height: imageHeight,
                image,
                zIndex: 2,
                center: true,
                scalePosition: true,
            },
        ]);
    } else {
        console.log("Pin man removed");
        removeMapItem(PIN_MAN_ID);
    }

    return null;
}

export default PinMan;