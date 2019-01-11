import PinManImages from './PinManImages';

const imageWidth = 40;
const imageHeight = 40;

const PIN_MAN_ID = 'PIN_MAN_ID';

/*
    This is the pin man component after drag man is dropped on map.
    It sets an map item on the location on map where mouse is released.
    
    If you want to retrieve information about PinMan, for example its location, 
*/


function handleOnClick({ setMapItems, eventTrigger }) {
    handleOnClick_dev({setMapItems,eventTrigger});
    return;
}
function getPinManImage(angle) {
    return getPinManImage_dev(angle);
}

/*
 This is a very rudinmentary function to get pin man image given angle.
 It basically read in the static image file loaded from PinManImages.js .
*/
function getPinManImage_dev(angle) {
    const index = Math.floor(angle / 22.5);
    const image = new Image();
    image.src = PinManImages[index];
    return image;
}

/*
 This is a toy handle click function we developed to test the turning feature.
 If you click on the small man, it will turn in clickwise direction.
 */
var angle = 0;

async function handleOnClick_dev({ setMapItems, eventTrigger }) {
    // var id = eventTrigger.id;

    // console.log('clicked', eventTrigger.id);

    const image = getPinManImage(angle);
    angle = (angle + 22.5) % 360;
    setMapItems([
        {
            ...eventTrigger,
            image: image,
        },
    ]);

}

function PinMan({ setMapItems, removeMapItem, x, y, floor, angle, onClick }) {

    // put a read pin man in map if user specified the 'from' value in input field
    if (x && y && floor) {
        console.log('Pin Man rendered', x, y);

        angle = angle == null ? 0 : angle;
        const image = getPinManImage(angle)
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
                scaleDimension: true,
                // onClick:(e)=>onClick(e),
                onClick: (eventTrigger) => handleOnClick({ setMapItems, eventTrigger }),
            },
        ]);

    } else {
        console.log("Pin man removed");
        removeMapItem(PIN_MAN_ID);
    }

    return null;
}

export default PinMan;