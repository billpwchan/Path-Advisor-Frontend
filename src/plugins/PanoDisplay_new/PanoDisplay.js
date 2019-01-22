import React from 'react';
import style from './PanoDisplay.module.css';
import closeIcon from "./close.png";
import expandIcon from "./expand.png";
import toSplitIcon from "./toSplit.png";
import panoImage from "./Atrium02.jpg";
import rotateLeftImg from "./rotate_left.png";
import rotateRightImg from "./rotate_right.png";
import rotateLeftOnClickImg from "./rotate_left_onclick.png";
import rotateRightOnClickImg from "./rotate_right_onclick.png";
import compassImg from "./compass.png";
import panoImage2 from "./Atrium01.jpg";

const timeoutSpeed = 150; //the speed in whcih holding on the button turn
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


class PanoDisplay extends React.Component{
    state = {
        show:true,
        fullScreen: false,
        leftButton:rotateLeftImg,
        rightButton:rotateRightImg,
        isDrag:false,
        scrollLeft:0, //show how much is turned.
        degree:0,
        clientX:0,
        panoImage:null
    };

    setImageDimension = (imageSrc) => {
        let urlRegex = /url\((["'])(.*?)\1\)/;
        let match = urlRegex.exec(imageSrc);
        let image = new Image();
        image.src = match[2];
        //gives you the width of background image.
        //need to get the width of canvas screen
        //if panoHeight is the full canvas heihgt, then the image will be original scale
        //if panoHeight is half the full canvas height, then 
        this.setState({
            widthImage:image.width,
            heightImage: image.height,
            scaledWidth:image.width/(image.height/(this.props.height/2))
        })
    }

    componentDidMount = () => {
        this.setState({
            panoImage:panoImage
        })
        let imageSrc = this.refs.panoDisplay.style.backgroundImage;
        this.setImageDimension(imageSrc);
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this.state.panoImage !== prevState.panoImage){
            let imageSrc = this.refs.panoDisplay.style.backgroundImage;
            this.setImageDimension(imageSrc);
        }
    }

    toggleFullScreen = () => {
        let newWidth = 0;
        if(!this.state.fullScreen){
            newWidth = this.state.widthImage;
        }else{
            newWidth = this.state.widthImage/(this.state.heightImage/(this.props.height/2));
        }
        this.setState({
            fullScreen:!this.state.fullScreen,
            scaledWidth:newWidth
        })
    }

    offShow = () => {
		this.setState({
			show:false
		})
    };


    //HANDLERS FOR DRAG ROTATE

    handleStart = (e) => {
        this.setState({
            clientX:e.clientX,
            isDrag:true,
            scrollLeft:this.state.scrollLeft
        })
    }

    handleDrag = (e) => {
        if(this.state.isDrag){
            e.preventDefault();
            let offsetX = e.clientX - this.state.clientX;
            offsetX = offsetX * scaleX;
            //need to set refinement to the offset.
            this.setState({
                clientX: e.clientX,
                scrollLeft:this.state.scrollLeft - offsetX,
                cursor: 'grabbing',
            })
        }
    }
    //Problem now is that the mouse movement is of the same measurement as pixel scroll hm..
    handleStop = (e) => {
        this.setState({
            clientX: 0,
            offsetX: 0,
            isDrag:false,
            cursor: 'grab',
        })
    }

    //HANDLERS FOR LEFT AND RIGHT ROTATE BUTTONS

    t = undefined; //to keep track so you can clear timeout later
    rotateLeft = (increment) => {
        //8clicks will go back to starting point. since the width is 3400/8, 
        //take the scaledWidth/8
        let newx = this.state.scrollLeft - increment;
        this.setState({
            scrollLeft:newx
        })
        this.t = setTimeout(()=>this.rotateLeft(increment), timeoutSpeed); //set how fast you want it to turn;
    }

    handleRotateLeft = async () => {
        await this.setState({
            leftButton:rotateLeftOnClickImg
        })
        let increment = this.state.scaledWidth/8;
        await this.rotateLeft(increment);
    }

    rotateRight =  (increment) => {
        let newx = this.state.scrollLeft + increment;  
    
        this.setState({
            scrollLeft:newx
        })
        this.t = setTimeout(()=>this.rotateRight(increment), timeoutSpeed); //set how fst you want it to turn
    }

    handleRotateRight = async () => {
        await this.setState({
            rightButton:rotateRightOnClickImg
        })
        let increment = this.state.scaledWidth/8;
        await this.rotateRight(increment);
    }

    resetRotateLeft = () => {
        this.setState({
            leftButton:rotateLeftImg
        })
        clearTimeout(this.t);
    }

    resetRotateRight = () => {
        this.setState({
            rightButton:rotateRightImg
        })
        clearTimeout(this.t);
    }

    handleKeyDown = async (e) => {
        if(e.keyCode === 37){
            this.rotateLeft(30);
            clearTimeout(this.t);
        } 
        else if(e.keyCode === 39){
            this.rotateRight(30);
            clearTimeout(this.t);
        }else if(e.keyCode === 38){
            this.setState({
                degree:(this.state.scrollLeft % this.state.scaledWidth)/this.state.scaledWidth * 360,
                panoImage:panoImage2
            });
        }else if(e.keyCode === 40){
            this.setState({
                degree:(this.state.scrollLeft % this.state.scaledWidth)/this.state.scaledWidth * 360,
                panoImage:panoImage
            });
        } 
    }

    render(){
        const backgroundStyle = {
            display: this.state.show? 'block': 'none',
            backgroundImage:`url(${this.state.panoImage})`,
            backgroundPosition:-this.state.scrollLeft,
            cursor: this.state.cursor
        };
        console.log(this.state.scaledWidth);
        let degree = (this.state.scrollLeft % this.state.scaledWidth)/this.state.scaledWidth * 360;
        //let scrollLeft = degree/360 * this.state.scaledWidth
        return (
        <div ref="panoDisplay" className={this.state.fullScreen? style.fullScreen:style.panoScreen} style={backgroundStyle} onMouseDown={this.handleStart} onMouseMove={this.handleDrag} onMouseUp={this.handleStop} onMouseLeave={this.handleStop} tabIndex="0" onKeyDown={this.handleKeyDown} >
            <img className={style.compass} src={compassImg} alt="compass" style={{transform:`rotate(${degree + "deg"})`}}/>
            <button type="button" className={style.rotateButtonLeft} onMouseDown={this.handleRotateLeft} onMouseLeave={this.resetRotateLeft} onMouseUp={this.resetRotateLeft} >
                <img src={this.state.leftButton} alt="Rotate-Left Button"/>
            </button>
            <button type="button" className={style.rotateButtonRight} onMouseDown={this.handleRotateRight} onMouseLeave={this.resetRotateRight} onMouseUp={this.resetRotateRight}>
                <img src={this.state.rightButton} alt="Rotate-Right Button"/>
            </button>
            <button type="button" className={style.closeButton} onClick={this.offShow}>
                <img src={closeIcon} alt="Close-Pano Button"/>
            </button>
            <button type="button" className={style.resizeButton} onClick={this.toggleFullScreen}>
                <img src={this.state.fullScreen ? toSplitIcon : expandIcon} alt="Resize-Pano Button" />
            </button>
        </div>
        );
    }
}

const MapCanvasPlugin = {
	Component: PanoDisplay,
	connect: ['platform','linkTo','x','y','level','canvas', 'width', 'height'],
}

const id = 'panoDisplay';
export {id, MapCanvasPlugin};
