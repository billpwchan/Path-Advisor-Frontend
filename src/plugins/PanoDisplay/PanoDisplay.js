import React from 'react';
import PropTypes from 'prop-types';
import style from './PanoDisplay.module.css';
import closeIcon from './assets/close.png';
import expandIcon from './assets/expand.png';
import toSplitIcon from './assets/toSplit.png';
import rotateLeftImg from './assets/rotate_left.png';
import rotateRightImg from './assets/rotate_right.png';
import rotateLeftOnClickImg from './assets/rotate_left_onclick.png';
import rotateRightOnClickImg from './assets/rotate_right_onclick.png';
import compassImg from './assets/compass.png';

const timeoutSpeed = 150; // the speed in which holding on the button turn
const ovalTimeoutSpeed = 3000;
const scaleX = 1; // pixel scale to mouse drag other words, sensitivity
const clickTimeout = 100; // the threshold mouse-down delay to distinguish clicking and draging
/**
 * Things to do
 * 1) Do drag rotation (DONE)
 * 2) stitch the left and right side of the image (DONE)
 * Possible ideas:
 * - stitch a frame's width from zero position and the entire panorama, this cna be done with coordinate manipunation
 * (may not be very neat)
 * - have a 3d image, in essence cube(can be cool)
 * - have the image as background and on repeat, so it will show the same image. (ADOPTED)
 * (can be convenient when you have features placed on it.)
 *
 * 3) add the pointing to north compass(DONE)
 * - find width of image
 *
 * 4) Create a smooth drag (DONE)
 * - change cursor when dragging
 */

const colors = [
  '#393E41',
  '#E94F37',
  '#1C89BF',
  '#A1D363',
  '#85FFC7',
  '#297373',
  '#FF8552',
  '#A40E4C',
];

function Circle(props) {
  const { x, y, dx, dy } = props;
  const circleStyle = {
    display: 'inline-block',
    backgroundColor: colors[3],
    borderColor: colors[3],
    borderRadius: '50%',
    width: dx,
    height: dy,
    position: 'fixed',
    left: x - dx / 2,
    top: y - dy / 2,
    opacity: 0.8,
    transition: 'opacity 250ms linear',
  };
  return <div style={circleStyle} />;
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
      isClick: false,
      degree: 0, // current orientation. West = 0.
      clientX: 0,
      clientY: 0,
      displayOval: false,
    };

    this.ovalTimeout = null;
    // HANDLERS FOR LEFT AND RIGHT ROTATE BUTTONS
    this.rotateTimeout = null; // to keep track so you can clear timeout later

    this.panoDisplayRef = React.createRef();
  }

  componentDidMount = () => {
    const { current: ref } = this.panoDisplayRef;
    const imageSrc = ref.style.backgroundImage;
    this.setImageDimension(imageSrc);
    ref.focus();
  };

  componentDidUpdate = prevProps => {
    const { panoImage: prevPanoImage } = prevProps;
    const { panoImage } = this.props;

    if (panoImage !== prevPanoImage) {
      const { current: ref } = this.panoDisplayRef;
      const imageSrc = ref.style.backgroundImage;
      this.setImageDimension(imageSrc);
      ref.focus();

      this.props.parentHandleUpdate(this.state.degree);
    }
  };

  /* The Helper function to get the size of the small oval. */
  getSmallOvalDim() {
    const { height, width } = this.props;
    const R = 1; // Radius of small circle in meters
    const h = 1.65; // The normal height of a human in meters
    const cameraVerticalField = 120; // The vertical field of camera in degrees.
    const cameraHorizontalField = 180; // The horizontal field of camera in degrees.
    const visionAtInf = (1 - 0.15) * height;
    const theta =
      90 -
      ((cameraVerticalField / 2) * Math.max(0, this.state.clientY - visionAtInf)) / visionAtInf; // The height angle of circle in degrees.
    const phi = (180 * 2 * Math.asin((R * Math.cos((Math.PI * theta) / 180)) / h)) / Math.PI; // The width angle of small oval in visible field in degrees.
    const omega = (180 / Math.PI) * Math.asin((2 * R * Math.cos((theta / 180) * Math.PI)) / h); // The height angle of small oval in visible field in degrees.
    const dx = (phi / cameraHorizontalField) * width;
    const dy = (omega / cameraVerticalField) * (height / 2);
    return { dx, dy };
  }

  setImageDimension = imageSrc => {
    const urlRegex = /url\((["'])(.*?)\1\)/;
    const match = urlRegex.exec(imageSrc);
    const image = new Image();
    image.src = match[2];
    image.onload = () => {
      // gives you the width of background image.
      // need to get the width of canvas screen
      // if panoHeight is the full canvas height, then the image will be original scale
      // if panoHeight is half the full canvas height, then
      this.setState({
        widthImage: image.width,
        heightImage: image.height,
      });
    };
  };

  onPanoImageLoad = e => {
    const { width, height } = e.target;
    this.setState({ widthImage: width, heightImage: height });
  };

  getNewDegreeFromOffset(offset) {
    const scrollLeft = this.degreeToScaledOffset(this.state.degree);
    const newX = (scrollLeft + offset) % this.getScaledWidth();
    return this.scaledOffsetToDegree(newX);
  }

  /**
   * The actual width entire pano image after loading, including the part overflowing outof the container.
   */
  getScaledWidth() {
    if (this.state.fullScreen) {
      return this.state.widthImage;
    }
    return (this.state.widthImage / this.state.heightImage) * (this.props.height / 2);
  }

  getScaledDefaultOffset() {
    const { defaultOffset, height } = this.props;
    const scaledOffset = (defaultOffset / this.state.heightImage) * (height / 2);
    return scaledOffset;
  }

  toggleFullScreen = () => {
    this.setState(state => ({ fullScreen: !state.fullScreen }));
  };

  offShow = () => {
    this.setState({ show: false });
    this.props.parentOffShow();
  };

  // HANDLERS FOR DRAG ROTATE

  handleMouseDown = e => {
    this.setState({
      clientX: e.clientX,
      isDrag: true,
      isClick: true,
    });
    setTimeout(() => this.setState({ isClick: false }), clickTimeout);
  };

  handleMouseMove = e => {
    if (this.state.isDrag) {
      e.preventDefault();
      let offsetX = e.clientX - this.state.clientX;
      offsetX *= scaleX;
      // need to set refinement to the offset.
      const degree = this.getNewDegreeFromOffset(-offsetX);
      this.setState({
        cursor: 'grabbing',
        degree,
      });

      this.props.parentHandleUpdate(degree);
    }

    this.setState({
      clientX: e.clientX,
      clientY: e.clientY,
    });
    this.restartOvalTimer();
  };

  // Problem now is that the mouse movement is of the same measurement as pixel scroll hm..
  handleMouseUp = () => {
    if (this.state.isClick) {
      this.handlePanoClick(this.state.clientX);
    }
    this.setState({
      isDrag: false,
      isClick: false,
      cursor: 'grab',
    });
  };

  handleMouseEnter = e => {
    this.setState({
      clientX: e.clientX,
      cursor: 'grab',
      displayOval: true,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      isDrag: false,
      isClick: false,
      cursor: 'grab',
      clientX: 0,
      displayOval: false,
    });
  };

  handlePanoClick = clientX => {
    const offsetX = clientX - (window.innerWidth - this.props.width / 2);
    const newDegree = this.getNewDegreeFromOffset(offsetX);
    this.props.parentHandleNavigation(newDegree);
  };

  restartOvalTimer = () => {
    /*
    Start/Restart the ovalTimeout timer.
    Doing the restarting in handler is the only way to display desired fading features:
        a. When mouse is moved, always display oval.
        b. When mouse is not moving for xxx milliseconds, hide the oval.
    */
    if (this.ovalTimeout != null) {
      clearTimeout(this.ovalTimeout);
    }
    this.ovalTimeout = setTimeout(() => {
      this.setState({
        displayOval: false,
      });
    }, ovalTimeoutSpeed);
  };

  rotateLeft = increment => {
    // 8 clicks will go back to starting point. since the width is 3400/8,
    // take the scaledWidth/8
    const degree = this.getNewDegreeFromOffset(-increment);
    this.setState({
      degree,
    });

    this.props.parentHandleUpdate(degree);

    this.rotateTimeout = setTimeout(() => this.rotateLeft(increment), timeoutSpeed); // set how fast you want it to turn;
  };

  handleRotateLeft = async () => {
    await this.setState({
      leftButton: rotateLeftOnClickImg,
    });
    const scaledWidth = this.getScaledWidth();
    const increment = scaledWidth / 8;
    await this.rotateLeft(increment);
  };

  rotateRight = increment => {
    const degree = this.getNewDegreeFromOffset(increment);
    this.setState({
      degree,
    });
    this.props.parentHandleUpdate(degree);

    this.rotateTimeout = setTimeout(() => this.rotateRight(increment), timeoutSpeed); // set how fst you want it to turn
  };

  handleRotateRight = async () => {
    await this.setState({
      rightButton: rotateRightOnClickImg,
    });
    const scaledWidth = this.getScaledWidth();
    const increment = scaledWidth / 8;
    await this.rotateRight(increment);
  };

  resetRotateLeft = () => {
    this.setState({
      leftButton: rotateLeftImg,
    });
    clearTimeout(this.rotateTimeout);
  };

  resetRotateRight = () => {
    this.setState({
      rightButton: rotateRightImg,
    });
    clearTimeout(this.rotateTimeout);
  };

  handleKeyDown = async e => {
    if (e.keyCode === 37) {
      this.rotateLeft(30);
      clearTimeout(this.rotateTimeout);
    } else if (e.keyCode === 39) {
      this.rotateRight(30);
      clearTimeout(this.rotateTimeout);
    } else if (e.keyCode === 38) {
      this.props.parentHandleNavigation('Forward');
    } else if (e.keyCode === 40) {
      this.props.parentHandleNavigation('Backward');
    }
  };

  degreeToScaledOffset(deg) {
    return (deg / 360) * this.getScaledWidth();
  }

  scaledOffsetToDegree(scaledOffset) {
    return (360 * scaledOffset) / this.getScaledWidth();
  }

  render() {
    const { panoImage, angle } = this.props;
    const {
      degree,
      show,
      cursor,
      fullScreen,
      displayOval,
      clientX,
      clientY,
      leftButton,
      rightButton,
    } = this.state;

    const pixelOffset = this.getScaledDefaultOffset();
    const { dx, dy } = this.getSmallOvalDim();

    const totalPixelOffset = this.degreeToScaledOffset(angle) + pixelOffset;
    const totalPixelOffsetFromCenter = totalPixelOffset - this.getScaledWidth() / 2;
    const backgroundStyle = {
      display: 'block',
      backgroundImage: `url(${panoImage})`,
      backgroundPosition: `calc(${-totalPixelOffsetFromCenter}px + 50%)`,
      cursor,
    };
    return (
      show && (
        <div
          ref={this.panoDisplayRef}
          className={fullScreen ? style.fullScreen : style.panoScreen}
          style={backgroundStyle}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
          role="presentation"
        >
          {displayOval && <Circle x={clientX} y={clientY} dx={dx} dy={dy} display={displayOval} />}

          <img
            className={style.compass}
            src={compassImg}
            alt="compass"
            style={{ transform: `rotate(${-degree}deg)` }}
          />
          <button
            type="button"
            className={style.rotateButtonLeft}
            onMouseDown={this.handleRotateLeft}
            onMouseLeave={this.resetRotateLeft}
            onMouseUp={this.resetRotateLeft}
          >
            <img src={leftButton} alt="Rotate-Left Button" />
          </button>
          <button
            type="button"
            className={style.rotateButtonRight}
            onMouseDown={this.handleRotateRight}
            onMouseLeave={this.resetRotateRight}
            onMouseUp={this.resetRotateRight}
          >
            <img src={rightButton} alt="Rotate-Right Button" />
          </button>
          <button type="button" className={style.closeButton} onClick={this.offShow}>
            <img src={closeIcon} alt="Close-Pano Button" />
          </button>
          <button type="button" className={style.resizeButton} onClick={this.toggleFullScreen}>
            <img src={fullScreen ? toSplitIcon : expandIcon} alt="Resize-Pano Button" />
          </button>
        </div>
      )
    );
  }
}

Circle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
};

PanoDisplay.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  defaultOffset: PropTypes.number.isRequired,
  panoImage: PropTypes.string.isRequired,
  parentHandleUpdate: PropTypes.func.isRequired,
  parentOffShow: PropTypes.func.isRequired,
  parentHandleNavigation: PropTypes.func.isRequired,
};

export default PanoDisplay;
