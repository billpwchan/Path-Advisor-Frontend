import React from 'react';
import style from './PanoDisplay.module.css';
import closeIcon from "./close.png";
import expandIcon from "./expand.png";
import toSplitIcon from "./toSplit.png";
// import panoImage from "./ESCALATOR_LEFT_CORNER.jpg";
import rotateLeftImg from "./rotate_left.png";
import rotateRightImg from "./rotate_right.png";
import rotateLeftOnClickImg from "./rotate_left_onclick.png";
import rotateRightOnClickImg from "./rotate_right_onclick.png";
import compassImg from './compass.png';
//import panoImage from "./stitchedImage.png"

const timeoutSpeed = 150; //the speed in whcih holding on the button turn
const ovalTimeoutSpeed = 5000;
const scaleX = 1; //pixel scale to mouse drag other words, sensitivity
/**
 * Things to do
 * 1) Do drag rotation (DONE)
 * 2) stitch the left and right side of the image (DONE)
 * Possible ideas:
 * - stitch a frame's width from zeroposition and the entire panorama, this cna be done with coordinate maniputation
 * (may not be very neat)
 * - have a 3d image, in essence cube(can be cool)
 * - have the image as background and on repeat, so it will show the same image. (ADOPTED)
 * (can be convenient when you have features placed on it.)
 * 
 * 3) add the pointint to north compass
 * - find width of image
 * 
 * 4) Create a smooth drag (DONE)
 * - change cursor when dragging
 */


const colors = ["#393E41", "#E94F37", "#1C89BF", "#A1D363",
    "#85FFC7", "#297373", "#FF8552", "#A40E4C"];
function Circle(props) {
    let { x, y, dx, dy, display } = props;
    var circleStyle = {
        display: "inline-block",
        backgroundColor: colors[3],
        borderColor: colors[3],
        borderRadius: "50%",
        width: dx,
        height: dy,
        position: "fixed",
        left: x - dx / 2,
        top: y - dy / 2,
        opacity: display ? 0.8 : 0,
        transition: "opacity 250ms linear",
    };
    return (
        <div style={circleStyle}>
        </div>
    );
}

class PanoDisplay extends React.Component {
    state = {
        show: true,
        fullScreen: false,
        leftButton: rotateLeftImg,
        rightButton: rotateRightImg,
        isDrag: false,
        scrollLeft: 0, //show how much is turned.
        clientX: 0,
        clientY: 0,
        displayOval: false,
    };
    ovalTimeout = null;

    componentDidMount = () => {
        let imageSrc = this.refs.panoDisplay.style.backgroundImage;
        let urlRegex = /url\((["'])(.*?)\1\)/;
        let match = urlRegex.exec(imageSrc);
        let image = new Image();
        image.src = match[2];
        //gives you the width of background image.
        //need to get the width of canvas screen
        //if panoHeight is the full canvas heihgt, then the image will be original scale
        //if panoHeight is half the full canvas height, then 
        this.setState({
            widthImage: image.width,
            heightImage: image.height,
            scaledWidth: image.width / (image.height / (this.props.height / 2))
        });

    }

    //zeroPosition can be affected by both the button and on scroll
    //for button, it sets a limit to the most left and most right to be display,
    //for mouse, there is no limit, need to indicate the direction of drag, done with offset as well

    toggleFullScreen = () => {
        let newWidth = 0;
        if (!this.state.fullScreen) {
            newWidth = this.state.widthImage;
        } else {
            newWidth = this.state.widthImage / (this.state.heightImage / (this.props.height / 2));
        }
        this.setState({
            fullScreen: !this.state.fullScreen,
            scaledWidth: newWidth
        });
    }

    offShow = () => {

        this.setState({
            show: false
        });
        // Must notify parent when the show is done. 
        // The parent call must be done AFTER this.setState().
        this.props.parentOffShow();
    };


    //HANDLERS FOR DRAG ROTATE

    handleStart = (e) => {
        this.setState({
            clientX: e.clientX,
            isDrag: true,
            scrollLeft: this.state.scrollLeft
        });
    }

    handleDrag = (e) => {
        if (this.state.isDrag) {
            e.preventDefault();
            let offsetX = e.clientX - this.state.clientX;
            offsetX = offsetX * scaleX;
            //need to set refinement to the offset.
            this.setState({
                scrollLeft: this.state.scrollLeft - offsetX,
                cursor: 'grabbing',
            });
        }
        this.setState({
            clientX: e.clientX,
            clientY: e.clientY,
            displayOval: true,
        });

        this.restartOvalTimer();
    }
    restartOvalTimer = () => {
        /* 
           Start/Restart the ovalTimeout timer. 
           Doing the restarting in handler is the only way to display disired fading features:
               a. When mouse is moved, always display oval. 
               b. When mouse is not moving for xxx miliseconds, hide the oval.
       */
        if (this.ovalTimeout != null) {
            clearTimeout(this.ovalTimeout);
        }
        this.ovalTimeout = setTimeout(() => {
            this.setState({
                displayOval: false
            }
            );
        }, ovalTimeoutSpeed);

    }

    //Problem now is that the mouse movement is of the same measurement as pixel scroll hm..
    handleStop = (e) => {
        this.setState({
            clientX: 0,
            offsetX: 0,
            isDrag: false,
            cursor: 'grab',
        });
    }

    //HANDLERS FOR LEFT AND RIGHT ROTATE BUTTONS

    t = undefined; //to keep track so you can clear timeout later
    rotateLeft = () => {
        //8clicks will go back to starting point. since the width is 3400/8, 
        //take the scaledWidth/8
        let increment = this.state.scaledWidth / 8;
        let newx = this.state.scrollLeft - increment;
        this.setState({
            scrollLeft: newx
        });
        this.t = setTimeout(this.rotateLeft, timeoutSpeed); //set how fast you want it to turn;
    }

    handleRotateLeft = async () => {
        console.log('handling rotate left,scroll left=', this.state.scrollLeft);
        await this.setState({
            leftButton: rotateLeftOnClickImg
        });
        await this.rotateLeft();
    }

    rotateRight = async () => {
        let increment = this.state.scaledWidth / 8;
        let newx = this.state.scrollLeft + increment;

        this.setState({
            scrollLeft: newx
        });
        this.t = setTimeout(this.rotateRight, timeoutSpeed); //set how fst you want it to turn
    }

    handleRotateRight = async () => {
        await this.setState({
            rightButton: rotateRightOnClickImg
        });
        await this.rotateRight();
    }

    resetRotateLeft = () => {
        this.setState({
            leftButton: rotateLeftImg
        });
        clearTimeout(this.t);
    }

    resetRotateRight = () => {
        this.setState({
            rightButton: rotateRightImg
        });
        clearTimeout(this.t);
    }
    /**The Helper function to get the size of the small oval. */
    getSmallOvalDim() {
        let R = 1; //Radius of small circle in meters
        let h = 1.65; //The normal height of a human in meters
        let cameraVerticalField = 120; // The vertical field of camera in degrees.
        let cameraHorizontalField = 180; // The horizontal field of camera in degrees.
        let visionAtInf = (1 - 0.15) * this.props.height;
        let theta = 90 - cameraVerticalField / 2 * Math.max(0, this.state.clientY - visionAtInf) / (visionAtInf); // The height angle of circle in degrees.
        let phi = 180 * 2 * Math.asin(R * Math.cos(Math.PI * theta / 180) / (h)) / Math.PI; // The width angle of small oval in visible field in degrees.
        let omega = 180 / Math.PI * Math.asin(2 * R * Math.cos(theta / 180 * Math.PI) / h);// The height angle of small oval in visible field in degrees.
        let dx = phi / cameraHorizontalField * this.props.width
        let dy = omega / cameraVerticalField * (this.props.height / 2)
        return { dx, dy }
    }

    render() {
        let panoImage = this.props.panoImage;
        const backgroundStyle = {
            display: this.state.show ? 'block' : 'none',
            backgroundImage: `url(${panoImage})`,
            backgroundPosition: -this.state.scrollLeft,
            cursor: this.state.cursor
        };

        let degree = (this.state.scrollLeft % this.state.scaledWidth) / this.state.scaledWidth * 360;
        
        let { dx, dy } = this.getSmallOvalDim();


        return (
            <div ref="panoDisplay" className={this.state.fullScreen ? style.fullScreen : style.panoScreen} style={backgroundStyle} onMouseDown={this.handleStart} onMouseMove={this.handleDrag} onMouseUp={this.handleStop} onMouseLeave={this.handleStop}>

                <Circle x={this.state.clientX} y={this.state.clientY} dx={dx} dy={dy} display={this.state.displayOval}></Circle>
                
                <img className={style.compass} src={compassImg} alt="compass" style={{ transform: `rotate(${degree + "deg"})` }} />
                <button type="button" className={style.rotateButtonLeft} onMouseDown={this.handleRotateLeft} onMouseLeave={this.resetRotateLeft} onMouseUp={this.resetRotateLeft} >
                    <img src={this.state.leftButton} alt="Rotate-Left Button" />
                </button>
                <button type="button" className={style.rotateButtonRight} onMouseDown={this.handleRotateRight} onMouseLeave={this.resetRotateRight} onMouseUp={this.resetRotateRight}>
                    <img src={this.state.rightButton} alt="Rotate-Right Button" />
                </button>
                <button type="button" className={style.closeButton} onClick={this.offShow}>
                    <img src={closeIcon} alt="Close-Pano Button" />
                </button>
                <button type="button" className={style.resizeButton} onClick={this.toggleFullScreen}>
                    <img src={this.state.fullScreen ? toSplitIcon : expandIcon} alt="Resize-Pano Button" />
                </button>
            </div>
        );
    }
}

// const MapCanvasPlugin = {
// 	Component: PanoDisplay,
// 	connect: ['platform','linkTo','x','y','level','canvas', 'width', 'height'],
// }

const id = 'panoDisplay';
export { PanoDisplay };
// export default PanoDisplay;
