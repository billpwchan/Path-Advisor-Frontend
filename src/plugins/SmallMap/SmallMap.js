import React from 'react';
import classnames from 'classnames';
import showImage from './small_show.png';
import hideImage from './small_hidden.png';
import style from './SmallMap.module.css';
import image from './G_small.png';
import Draggable from 'react-draggable';
//Upon clicking the button, fetch the map and display it but making the size of map smaller.
/*
Actions to do:
1) Load the small image of the map, need to understand the logic first. (DONE)
2) Make the map draggable (DONE)
3) Dropping the map will cause the the map view to reload; (DONE)
4) shifting the map view will cause adjustments as well (DONE)
5) Zooming in and out changes the small map. (DONE)

THINGS TO REFACTOR;
1) image should be retrieved from database instead of from local file
2) Width, Height of small map follow the size of small map
3) Width, Height of rangeBox follow the size of range box
4) Dimensions, width and height, follow that of the image. 
5) Speed of how fast the image moves can be factored in line 102, 109 , etc.
6) Each image is founded to be 4000 by 2700 px
7) Mapping ratio is not that well defined.

BUGS:
1) When top = 0px, the red box exceeds the container. The reason is because the height of container and height of 
	 button together add to 224px, hence both the height and container aren't really overlapped.
(FIXED WITH flex box display. Not sure why. )
2) Range Box is jumping everywhere; Reason could be, when range box is updated
	- Realise that it moves in the direction where it is adjusted and of similar magnitude.
	- Clicking and stopping really quickly may be due to the handling effects.
(FIXED WITH OFFSETs SET TO ZERO)
3) Can't access to the top and left part of image in container.
	- Has to do with componentDidUpdate.
	- Possible reason is that if the rangebox is at the top-left most corner of the 200 by 200 container,
	  this will mean that the center will be displayed that position. 
(FIXED)
*/
const SMALL_MAP_WIDTH = 200; //these follow the width and height of small map.
const SMALL_MAP_HEIGHT = 200;
const IMAGE_WIDTH = 468;
const IMAGE_HEIGHT = 331;
const FULLCANVAS_WIDTH = 4000;
const FULLCANVAS_HEIGHT = 2700;
const scale = 0.2;

class SmallMap extends React.PureComponent{
	state = {
		move: false,
		show: false,
		xBox:0,		//xBox,yBox indicate the coordinates of top-left corner of range box from the small-map container.
		yBox:0,
		offsetx:0,
		offsety:0,
		smallMapScrollTop: 0,
		smallMapScrollLeft: 0,
		xcoor:0,   //These coordinates are the starting coordinate when the dragging start used to calculate offset
		ycoor:0,
		RANGE_WIDTH:80,
		RANGE_HEIGHT:40
	}

	buttonClassName = classnames({
		[style.buttonImage]: this.props.platform !== 'MOBILE',
		[style.buttonImageMobile]: this.props.platform === 'MOBILE',
	});
	/*
	smallMapSize = classnames({
		[style.smallMapRange0]: this.props.level === 0,
		[style.smallMapRange1]: this.props.level === 1,
		[style.smallMapRange2]: this.props.level === 2,
		[style.smallMapRange3]: this.props.level === 3,
		[style.smallMapRange4]: this.props.level === 4,
	});
	*/
	setRange = level => {
		let newWidth = 80*(1+level*scale);
		let newHeight = 40*(1+level*scale);
		this.setState({
			RANGE_WIDTH: newWidth,
			RANGE_HEIGHT: newHeight
		})
	}

	setRectangle = (x,y) => {
		//Set the center of rangeBox given coordinates.
		//This center is relative to the 200px by 200px small map container.
		//*** We need to assume that x and y coordinates are between 0 to 200.
		//To find the top-left corner, we can simply.
		this.setState({
			xBox: x - this.state.RANGE_WIDTH/2,
			yBox: y - this.state.RANGE_HEIGHT/2
		})
	} 

	setMapPosition = (x,y) => {
		//Inputs represent the coordinates center of small map
		this.setState({
			smallMapScrollLeft: x-SMALL_MAP_WIDTH/2,
			smallMapScrollTop: y-SMALL_MAP_HEIGHT/2,
		});
	}

	async componentDidUpdate(prevProps, prevState){
		/**
		 * When user drags the map view, the scroll offsets of the small image changes.
		 * However, the position of the rangebox is the same.
		 * The center of the rangebox takes the value of the x and y coordinates on the map view.
		 * - This tkaes into refactoring, however, this is not needed, the default range box will be reset to original
		 * if((this.props.x !== prevProps.x) || this.props.y !== prevProps.y){
			let newX = (this.props.x/FULLCANVAS_WIDTH)*IMAGE_WIDTH ;
			let newY = (this.props.y/FULLCANVAS_HEIGHT)*IMAGE_HEIGHT ;
			newX = newX - RANGE_WIDTH/2 - this.state.xBox + SMALL_MAP_WIDTH/2;
			newY = newY - RANGE_HEIGHT/2 - this.state.yBox + SMALL_MAP_HEIGHT/2;
			this.setMapPosition(newX, newY);
		}
		 */
		/*
		Code required will simply readjust the position.
		Adjusting the position of x and y will be mapped 
		*/
		if(((this.props.x !== prevProps.x) || (this.props.y !== prevProps.y)) && this.state.move === false ) {
			let newX = (this.props.x/FULLCANVAS_WIDTH)*IMAGE_WIDTH ;
			let newY = (this.props.y/FULLCANVAS_HEIGHT)*IMAGE_HEIGHT ;
			let offsetX =0;
			let offsetY =0;

			if(newX + SMALL_MAP_WIDTH/2 <IMAGE_WIDTH && newY + SMALL_MAP_HEIGHT/2 <IMAGE_HEIGHT && newX - SMALL_MAP_WIDTH/2 > 0 && newY - SMALL_MAP_HEIGHT/2> 0){
				this.setRectangle(SMALL_MAP_WIDTH/2,SMALL_MAP_WIDTH/2);
				this.setMapPosition(newX, newY);
				return;
			}
			if(newX + SMALL_MAP_WIDTH/2 >=IMAGE_WIDTH){
				offsetX = newX + SMALL_MAP_WIDTH/2 - IMAGE_WIDTH;
				newX = newX - offsetX;
			}
			else if(newX - SMALL_MAP_WIDTH/2 <= 0){
				offsetX = newX - SMALL_MAP_WIDTH/2;
				newX = newX - offsetX;
			}
			if(newY + SMALL_MAP_HEIGHT/2 >=IMAGE_HEIGHT){
				offsetY = newY + SMALL_MAP_HEIGHT/2 - IMAGE_HEIGHT;
				newY = newY - offsetY;
			}
			else if(newY - SMALL_MAP_HEIGHT/2 <= 0){
				offsetY = newY - SMALL_MAP_HEIGHT/2;
				newY = newY - offsetY;
			}
			this.setMapPosition(newX,newY);
			//adjusting the offsets so that it cna only take vlaues from 0 to 50. center is at (100,100).
			//This ensures that if range box is 100 by 60, it wont go out of range.
			//question is that offsets should be tuned to the size of box.
			//if box is 120 by 80, offsets can only go from 0 to 40(DONE);
			if(offsetX > (SMALL_MAP_WIDTH - this.state.RANGE_WIDTH)/2){
				offsetX =  (SMALL_MAP_WIDTH - this.state.RANGE_WIDTH)/2;
			}else if(offsetX < -(SMALL_MAP_WIDTH - this.state.RANGE_WIDTH)/2){
				offsetX =  -(SMALL_MAP_WIDTH - this.state.RANGE_WIDTH)/2;
			}
			if(offsetY > (SMALL_MAP_HEIGHT-this.state.RANGE_HEIGHT)/2){
				offsetY =  (SMALL_MAP_HEIGHT-this.state.RANGE_HEIGHT)/2;
			}else if(offsetY < -(SMALL_MAP_HEIGHT-this.state.RANGE_HEIGHT)/2){
				offsetY =  -(SMALL_MAP_HEIGHT-this.state.RANGE_HEIGHT)/2;
			}
			this.setRectangle(SMALL_MAP_WIDTH/2 + offsetX,SMALL_MAP_WIDTH/2 +offsetY);
		}
		if(this.props.level !== prevProps.level){
			await this.setRange(this.props.level);
			let x = prevState.xBox + prevState.RANGE_WIDTH/2;
			let y = prevState.yBox + prevState.RANGE_HEIGHT/2;
			//theses are updated values
			
			let offsetX = await x + this.state.RANGE_WIDTH/2;
			if (offsetX >= SMALL_MAP_WIDTH){
				let diffX = await offsetX-SMALL_MAP_WIDTH;
				x = await x - diffX;
			}
			else if(this.state.RANGE_WIDTH/2>=x){
				x = await x + (this.state.RANGE_WIDTH/2-x);
			}
			let offsetY = await this.state.RANGE_HEIGHT/2 + y;
			if(offsetY >= SMALL_MAP_HEIGHT){
				let diffY = await offsetY-SMALL_MAP_HEIGHT;
				y = await y - diffY;
			}
			else if(this.state.RANGE_HEIGHT/2>=y){
				y = await y + (this.state.RANGE_HEIGHT/2-y);
			}
			await this.setRectangle(x,y);
		}
	}

	componentDidMount(){
		/**
		 * Intialise the map position based on the map view;
		 * Setting the initial position as the center in container
		 * rangebox will naturally be set to the center as well, so that the center of rangeboe
		 * takes the coordinates of the center.
		 * 
		 */
		let newX = (this.props.x/FULLCANVAS_WIDTH)*IMAGE_WIDTH ;
		let newY = (this.props.y/FULLCANVAS_HEIGHT)*IMAGE_HEIGHT;
		this.setMapPosition(newX, newY);
		this.setRectangle(SMALL_MAP_WIDTH/2,SMALL_MAP_WIDTH/2);
	}

	toggleShow = () => {
		this.setState({
			show:!this.state.show
		})
	};

	handleStart = (e) =>{
		this.setState({
			move: true,
			xcoor: e.clientX,
			ycoor: e.clientY
		})
	}

	//Creating dragging motion for small map
	/**
	 *  There are several variables to account for:
	 *  1) The position/coordinates of the rangeBox within the smallMap container.
	 * 		- It goes from (0,0) to depending on the position of Box. 
	 * 		- The coordinates mark the top-left corner of the box.
	 *  2) The width and height of the rangeBox.
	 * 		
	 *  3) The scrolling width and height of the image.
	 * 		- Not sure how to account this into calculation.
	 * 
	 *  Approach:
	 *  1) Keep track of offset, this indicates how much is moved from the original position.
	 * 		- problem: offset may exceed the boundary.
	 *  2) Keep track of relative position of box, this is used to calculate newLeft and newTop of the rangeBox.
	 * 		- How to get relative position of the box? (DONE)
	 * 		- Look into cases: 
	 * 			1) if newLeft > 200, set it to 200-boxWidth; => account for the additional scroll effect.
	 * 			2) if newLeft < 0, set it to 0;
	 * 3) Adding in the scroll effect;
	 * 		- Calculate the shift in pixel, it depends on.
	 * 		Entire width of image is 468
	 * 		Entire height of image is 331
	 * 		This allows for more offsets, if newx >=100, then shift topleft of the pixel by 1px? 
	 * 4) Aligning the center image to middle of box;
	 * 		- I will need to have middle position of the map. Will use the movingX, movingY for the coordinates.
	 * 	 	- 
	 */
	handleDrag = (e) => {
		//move around the map on background if the box is near the side.
		let offsetx =  e.clientX - this.state.xcoor;
		let offsety = e.clientY - this.state.ycoor;
		let newx = this.state.xBox + offsetx;
		let newy = this.state.yBox + offsety;
		if(newx<0){
			offsetx = -this.state.xBox;
			if(this.state.smallMapScrollLeft > 0)
			this.setState({
				smallMapScrollLeft: this.state.smallMapScrollLeft - 5
			})
		}
		else if(newx>=SMALL_MAP_WIDTH-this.state.RANGE_WIDTH){
			offsetx = SMALL_MAP_WIDTH-this.state.RANGE_WIDTH-this.state.xBox;
			if(this.state.smallMapScrollLeft < IMAGE_WIDTH-SMALL_MAP_WIDTH)
			this.setState({
				smallMapScrollLeft: this.state.smallMapScrollLeft + 5
			})
		}
		if(newy<0){
			offsety = -this.state.yBox;
			if(this.state.smallMapScrollTop > 0)
			this.setState({
				smallMapScrollTop: this.state.smallMapScrollTop - 5
			})
		}
		else if(newy>=SMALL_MAP_HEIGHT-this.state.RANGE_HEIGHT){
			offsety = SMALL_MAP_HEIGHT-this.state.RANGE_HEIGHT-this.state.yBox;
			if(this.state.smallMapScrollTop < IMAGE_HEIGHT-SMALL_MAP_HEIGHT)
			this.setState({
				smallMapScrollTop: this.state.smallMapScrollTop + 5
			})
		}
		
		this.setState({
			offsetx: offsetx,
			offsety: offsety
		})
	}

	handleStop = (e) => {
		//re-renders the canvas map to desired positions.
		this.setState({
			xBox: this.state.xBox + this.state.offsetx,
			yBox: this.state.yBox + this.state.offsety,
			offsetx: 0,
			offsety:0
		})
		//target the center of the box, to find the coordinates(x,y) on original map
		let centerX = this.state.smallMapScrollLeft + this.state.xBox + this.state.RANGE_WIDTH/2;
		let centerY = this.state.smallMapScrollTop + this.state.yBox + this.state.RANGE_HEIGHT/2;
		//find ratio followed by the x and y coordinate in map view
		let ratioX  = centerX/IMAGE_WIDTH;
		let ratioY = centerY/IMAGE_HEIGHT;
		let mapX = ratioX * FULLCANVAS_WIDTH;
		let mapY = ratioY * FULLCANVAS_HEIGHT;
		this.props.linkTo({x:mapX,y:mapY,level:this.props.level});
		this.setState({
			move: false
		})
	}

	render(){
		console.log(this.state.RANGE_WIDTH);
		return(
			<div className={style.container}>	
			<div className={style.smallMap} style={this.state.show? {display:"block"}: {display:"none"}}>
				<img className={style.smallMapImage} src={image} style={{bottom:this.state.smallMapScrollTop , right:this.state.smallMapScrollLeft}} alt="small map"/>
				<Draggable bounds={`parent`} position={{x:this.state.xBox, y:this.state.yBox}}onStart={this.handleStart} onDrag={this.handleDrag} onStop={this.handleStop}>
				<div className={`${style.smallMapStyle}`} style={{width:this.state.RANGE_WIDTH, height:this.state.RANGE_HEIGHT}}/>
				</Draggable>
			</div>
			<button type="button" onClick={this.toggleShow}>
				<img className={this.buttonClassName} src={this.state.show? hideImage:showImage} alt="hide-show button"/>
			</button>
			</div>
		);
	};

}

const MapCanvasPlugin = {
	Component: SmallMap,
	connect: ['platform','linkTo','x','y','level'],
}

const id = 'smallMap';
export {id, MapCanvasPlugin};