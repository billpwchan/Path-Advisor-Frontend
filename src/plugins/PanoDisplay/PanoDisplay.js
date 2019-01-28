import React from 'react';
import style from './PanoDisplay.module.css';
import closeIcon from "./close.png";
import expandIcon from "./expand.png";
import toSplitIcon from "./toSplit.png";
// import panoImage from "./Atrium02.jpg";
import rotateLeftImg from "./rotate_left.png";
import rotateRightImg from "./rotate_right.png";
import rotateLeftOnClickImg from "./rotate_left_onclick.png";
import rotateRightOnClickImg from "./rotate_right_onclick.png";
import compassImg from "./compass.png";
// import panoImage2 from "./Atrium01.jpg";
// import { off } from 'rsvp';

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
 * 3) add the pointint to north compass(DONE)
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
    constructor(props) {
        super(props);
        /**
         * scollLeft: it represents the number of pixels dragged left away from the initial position. It is solely dependent of mouse drag event.
         * degree: it represents the degree of the centre of pano image away from North direction in clockwise orientation. 
         * defaultOffset:
         */
        this.state = {
            show: true,
            fullScreen: false,
            leftButton: rotateLeftImg,
            rightButton: rotateRightImg,
            isDrag: false,
            scrollLeft: 0, //show how much is turned.
            degree: 0,
            clientX: 0,
            panoImage: props.panoImage,
            displayOval: false,

        };

        this.ovalTimeout = null;
    }


    setImageDimension = (imageSrc) => {
        let urlRegex = /url\((["'])(.*?)\1\)/;
        let match = urlRegex.exec(imageSrc);
        let image = new Image();
        image.src = match[2];
        image.onload = () => {
            //gives you the width of background image.
            //need to get the width of canvas screen
            //if panoHeight is the full canvas heihgt, then the image will be original scale
            //if panoHeight is half the full canvas height, then 
            this.setState({
                widthImage: image.width,
                heightImage: image.height,
            });
        }
    }

    degreeToScaledOffset(deg) {
        return deg / 360 * this.getScaledWidth();
    }
    scaledOffsetToDegree(scaledOffset) {
        return 360 * scaledOffset / this.getScaledWidth();
    }
    /**
     * The actual width entire pano image after loading, including the part overflowing outof the container.
     */
    getScaledWidth() {
        const scaledWidth = this.state.widthImage / (this.state.heightImage) * (this.props.height / 2);
        return scaledWidth;
    }
    getScaledDefaultOffset() {
        const scaledOffset = this.props.defaultOffset / (this.state.heightImage) * (this.props.height / 2);
        return scaledOffset;
    }

    componentDidMount = () => {
        this.setState({
            panoImage: this.props.panoImage
        });
        // console.log("did mount pano");
        let imageSrc = this.refs.panoDisplay.style.backgroundImage;
        this.setImageDimension(imageSrc);


    }

    componentDidUpdate = (prevProps, prevState) => {

        if (this.props.panoImage !== prevProps.panoImage) {
            let imageSrc = this.refs.panoDisplay.style.backgroundImage;
            this.setImageDimension(imageSrc);

            this.props.parentHandleUpdate(this.state.degree);
        }
    }

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
        })
    }

    offShow = () => {
        this.setState({
            show: false
        })
        this.props.parentOffShow();
    };


    //HANDLERS FOR DRAG ROTATE

    handleStart = (e) => {
        this.setState({
            clientX: e.clientX,
            isDrag: true,

        });
    }

    handleDrag = (e) => {
        if (this.state.isDrag) {
            e.preventDefault();
            let offsetX = e.clientX - this.state.clientX;
            offsetX = offsetX * scaleX;
            //need to set refinement to the offset.
            const scaledWidth = this.getScaledWidth();
            // console.log(this.state.widthImage, this.state.heightImage);
            const newx = this.state.scrollLeft - offsetX;
            let degree = (newx % scaledWidth) / scaledWidth * 360;
            this.setState({
                scrollLeft: newx,
                cursor: 'grabbing',
                degree: degree
            });

            this.props.parentHandleUpdate(degree);
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
        })
    }

    //HANDLERS FOR LEFT AND RIGHT ROTATE BUTTONS

    t = undefined; //to keep track so you can clear timeout later
    rotateLeft = (increment) => {
        //8 clicks will go back to starting point. since the width is 3400/8, 
        //take the scaledWidth/8
        const scaledWidth = this.getScaledWidth()
        let newx = this.state.scrollLeft - increment;
        let degree = (newx % scaledWidth) / scaledWidth * 360;

        this.setState({
            scrollLeft: newx,
            degree: degree
        })

        this.props.parentHandleUpdate(degree);

        this.t = setTimeout(() => this.rotateLeft(increment), timeoutSpeed); //set how fast you want it to turn;
    }

    handleRotateLeft = async () => {
        await this.setState({
            leftButton: rotateLeftOnClickImg
        })
        const scaledWidth = this.getScaledWidth();
        let increment = scaledWidth / 8;
        await this.rotateLeft(increment);
    }

    rotateRight = (increment) => {
        const scaledWidth = this.getScaledWidth();
        let newx = this.state.scrollLeft + increment;

        let degree = (newx % scaledWidth) / scaledWidth * 360;

        this.setState({
            scrollLeft: newx,
            degree: degree
        })
        this.props.parentHandleUpdate(degree);

        this.t = setTimeout(() => this.rotateRight(increment), timeoutSpeed); //set how fst you want it to turn
    }

    handleRotateRight = async () => {
        await this.setState({
            rightButton: rotateRightOnClickImg
        })
        const scaledWidth = this.getScaledWidth();
        let increment = scaledWidth / 8;
        await this.rotateRight(increment);
    }

    resetRotateLeft = () => {
        this.setState({
            leftButton: rotateLeftImg
        })
        clearTimeout(this.t);
    }

    resetRotateRight = () => {
        this.setState({
            rightButton: rotateRightImg
        })
        clearTimeout(this.t);
    }

    handleKeyDown = async (e) => {
        // const scaledWidth = this.getScaledWidth();
        if (e.keyCode === 37) {
            this.rotateLeft(30);
            clearTimeout(this.t);
        }
        else if (e.keyCode === 39) {
            this.rotateRight(30);
            clearTimeout(this.t);
        } else if (e.keyCode === 38) {
            this.props.parentHandleNavigation("Forward");
        } else if (e.keyCode === 40) {
            this.props.parentHandleNavigation("Backward");
        }
    }
    handleOvalClick(){
        console.log("Current deg");
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
        // let panoImage = this.state.panoImage;
        const pixelOffset = this.getScaledDefaultOffset();
        // console.log('scaled pixel offset', pixelOffset);
        const angleOffset = this.props.defaultClockwiseAngleFromNorth;
        // console.log('scaled default angle from north', angleOffset);

        let degree = this.state.degree;
        // console.log("current degree", degree);
        let { dx, dy } = this.getSmallOvalDim();

        const backgroundStyle = {
            display: this.state.show ? 'block' : 'none',
            backgroundImage: `url(${panoImage})`,
            // backgroundPosition: - offset - this.state.scrollLeft,
            backgroundPosition: - pixelOffset - this.degreeToScaledOffset(-angleOffset + degree),
            // backgroundPosition: - this.state.scrollLeft,
            cursor: this.state.cursor
        };
        // console.log('background image postition', -pixelOffset - this.degreeToScaledOffset(-angleOffset + degree));
        return (
            <div ref="panoDisplay" className={this.state.fullScreen ? style.fullScreen : style.panoScreen} style={backgroundStyle} onMouseDown={this.handleStart} onMouseMove={this.handleDrag} onMouseUp={this.handleStop} onMouseLeave={this.handleStop} tabIndex="0" onKeyDown={this.handleKeyDown} >

                <Circle x={this.state.clientX} y={this.state.clientY} dx={dx} dy={dy} display={this.state.displayOval} onClick = {()=>this.handleOvalClick()}></Circle>

                <img className={style.compass} src={compassImg} alt="compass" style={{ transform: `rotate(${-degree + "deg"})` }} />
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

export { PanoDisplay };
