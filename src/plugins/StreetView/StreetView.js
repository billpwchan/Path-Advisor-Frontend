import React from 'react';
import classnames from 'classnames';
import style from './StreetView.module.css';
import DragMan from "./DragMan";
import BaseMan from "./BaseMan";
import PinMan from "./PinMan";
import PanoDisplay from "./PanoDisplay";
import axios from 'axios';

/* 
This is the highest level StreetView component. 

It only communicate with the subcomponents through signals, but does not 
touches concrete image display.

Subcomponet interactions: 
- Initially, set BaseMan at available mode(baseManAvail=true), and hide DragMan(displayDragMan=false).
- Then when BaseMan is pressed, BaseMan will call handleBaseManPressed function here. StreetView then set BaseMan as unavailable(baseManAvail=false) and display DragMan(displayDragMan=true).
- Then when DragMan is dropped, DragMan will call handleDragManDrop function here. StreetView will then hide DragMan(displayDragMan=falese) and restore BaseMan to available(baseManAvail=true).
*/

const PanoRotationActivatorID = 'PIN_MAN_ID'; // This value is temporary, for development use.
const PanoRotationListenerID = 'PANO_ROTATE_LISTENER_ID'; // This value is fixed.

class StreetView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseManAvail: true,
            displayDragMan: false,
            displayPinMan: false,
            displayPano: false,
            PinManX: 0,
            PinManY: 0,
            PinManAngle: 0,
            // defaultCanvasHeight:0,
        };


    }
    // componentDidMount(){
    //     console.log(this.state.defaultCanvasHeight);
    //     this.setState({
    //         defaultCanvasHeight:this.props.canvas.getBoundingClientRect().height,
    //     });
    //     console.log(this.state.defaultCanvasHeight);
    // }
    /* 
    Helper function to convert mouse coordinate on screen to campus coordinate in map.
    The code is modified from component/MapCanvas/CanvasHandler.js.
    This can be very helpful. Feel free to make good use of it.
    */
    getCampusXYFromMouseXY(canvas, mouseX, mouseY) {
        console.log("normalized width", this.props.normalizedWidth);
        // Get the zoom in/out factor for current canvas display.
        const screenToCampusScale = { x: this.props.width / (this.props.normalizedWidth + 0.0001), y: this.props.height / (this.props.normalizedHeight + 0.0001) };

        // Get the dimension of canvas on screen.
        const canvasCoordinate = canvas.getBoundingClientRect();

        // Return the absolute campus coordinate where current mouse is pointing to.
        return [(mouseX - (canvasCoordinate.left + 0.5 * canvasCoordinate.width)) / screenToCampusScale.x + this.props.x,
        (mouseY - (canvasCoordinate.top + 0.5 * canvasCoordinate.height)) / screenToCampusScale.y + this.props.y];
    }

    handleBaseManPressed() {
        console.log("BaseMan pressed, detected by parent.");

        this.setState({
            baseManAvail: false,
            displayDragMan: true,
            displayPinMan: false,
        });

       
    }
    handleDragManDrop(e) {
        console.log("DragMan dropped, detected by parent.");
        let [x, y] = this.getCampusXYFromMouseXY(this.props.canvas, e.clientX, e.clientY);

        // Move the map to centre at the the dropped location.
        this.props.linkTo({ x: x, y: y + this.props.height*0.5 });

        this.setState({
            baseManAvail: true,
            displayDragMan: false,
            displayPinMan: true,
            displayPano: true,
            PinManX: x,
            PinManY: y,
        });

     
    }
    handlePanoClose(){
        console.log('pano closed');
        if (this.state.displayPano) {
            let currentWidth = parseInt(this.props.width);
            let currentHeight = parseInt(this.props.height);
            
        }
        this.setState({
            displayPinMan:false,
            displayPano:false
        });
    }
    handlePanoRotate_dev(e) {
        let pinManElement;
        for (var index in this.props.mapItemStore.mapItems) {
            const item = this.props.mapItemStore.mapItems[index];
            console.log(item.name, item.id, item.photo);
            if (item.id === 'PIN_MAN_ID') {
                pinManElement = item;
                break;
            }
        }
        if (pinManElement == null) {
            console.log('Pin man id not found');
            return null;
        }

        const newAngle = this.state.PinManAngle + 22.5;
        pinManElement.photo = "./img/man/" + (Math.floor(newAngle / 22.5)) + ".png";
        this.setState({
            PinManAngle: newAngle,
        });
    }
    handlePanoRotate(e) {
        this.handlePanoRotate_dev(e);
    }

    renderBaseMan(buttonClassName) {
        return (
            <BaseMan
                available={this.state.baseManAvail}
                buttonClassName={buttonClassName}
                parentHandlePressed={() => this.handleBaseManPressed()}
            />
        );
    }
    renderDragMan(buttonClassName) {
        let display = this.state.displayDragMan ? "block" : "none";
        return (
            <DragMan
                display={display}
                buttonClassName={buttonClassName}
                initialX={this.state.dragManX}
                initialY={this.state.dragManY}
                parentHandleDrop={(e) => this.handleDragManDrop(e)}
            />
        );
    }
    renderPinMan() {
        let x;
        let y;
        let floor;

        if (this.state.displayPinMan) {
            x = this.state.PinManX;
            y = this.state.PinManY;
            floor = this.props.floor;
        }

        return (
            <div>
                <PinMan
                    setMapItems={this.props.setMapItems}
                    removeMapItem={this.props.removeMapItem}
                    x={x}
                    y={y}
                    floor={floor}
                    onClick={(e) => this.handlePanoRotate(e)}
                />
            </div>
        );
    }

    renderPano() {
        let fullScreen = false;
        if (this.state.displayPano) {
            return <PanoDisplay
                height={fullScreen?this.props.height:this.props.height*0.5}
                width={this.props.width}
                onClick={()=>this.handlePanoClose()}
            />;

        } else {
            return null;
        }
    }

    render() {
        const platform = this.props.platform;
        const buttonClassName = classnames({
            [style.buttonImage]: platform !== 'MOBILE',
            [style.buttonImageMobile]: platform === 'MOBILE',
        });
       
        return (
            <div style={{zIndex:-1}} id={id}>
                {this.renderPano()}
                
                {this.renderPinMan()}
                {this.renderBaseMan(buttonClassName)}
                {this.renderDragMan(buttonClassName)}

            </div>
        );
    }
}

const MapCanvasPlugin = {
    Component: StreetView,
    connect: [
        'platform',
        'canvas',
        'setMapItems',
        'removeMapItem',
        'x',
        'y',
        'floor',
        'height',
        'normalizedHeight',
        'width',
        'normalizedWidth',
        'addMapItemClickListener',
        'removeMapItemClickListener',
        'mapItemStore',
        'updateDimension',
        'appSettingStore',
        'linkTo',
    ],
};

const id = "StreetView";
export { id, MapCanvasPlugin };
