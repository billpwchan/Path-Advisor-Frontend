import React from 'react';
import classnames from 'classnames';
import style from './StreetView.module.css';
import DragMan from "./DragMan";
import BaseMan from "./BaseMan";
import PinMan from "./PinMan";
import { PanoDisplay } from "../PanoDisplay/PanoDisplay";
import {getPanoInfo,getNextPano} from "./BackendAPI";

/* 
This is the highest level StreetView component. 

It only communicate with the subcomponents through signals, but does not 
touches concrete image display.

Subcomponet interactions: 
- Initially, set BaseMan at available mode(baseManAvail=true), and hide DragMan(displayDragMan=false).
- Then when BaseMan is pressed, BaseMan will call handleBaseManPressed function here. StreetView then set BaseMan as unavailable(baseManAvail=false) and display DragMan(displayDragMan=true).
- Then when DragMan is dropped, DragMan will call handleDragManDrop function here. StreetView will then hide DragMan(displayDragMan=falese) and restore BaseMan to available(baseManAvail=true).
*/


function PanoServerEndPoint() {
    return PanoServerEndPoint_dev();
}
function PanoServerEndPoint_dev() {
    return 'http://localhost:380';
}

function positiveModulo(number, modulo) {
    if (number >= 0) {
        return number % modulo;
    }
    else {
        return number % modulo + modulo;
    }
}
class StreetView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseManAvail: true,
            displayDragMan: false,
            displayPinMan: false,
            displayPano: false,
            fullScreenPano: false,
            PinManAngle: 0,
            panoX: 0,
            panoY: 0,
            panoUrl: "",//A global variable to store panoUrl. It is supposed to be updated in getPanoUrl().
            panoDefaultOffset: 0,
            panoDefaultClockwiseAngleFromNorth: 0,

        };
    }
    
    /* 
    Helper function to convert mouse coordinate on screen to campus coordinate in map.
    The code is modified from component/MapCanvas/CanvasHandler.js.
    This can be very helpful. Feel free to make good use of it.
    */
    getCampusXYFromMouseXY(canvas, mouseX, mouseY) {
        // Get the zoom in/out factor for current canvas display.
        const screenToCampusScale = { x: this.props.width / (this.props.normalizedWidth + 0.0001), y: this.props.height / (this.props.normalizedHeight + 0.0001) };

        // Get the dimension of canvas on screen.
        const canvasCoordinate = canvas.getBoundingClientRect();

        // Return the absolute campus coordinate where current mouse is pointing to.
        return [(mouseX - (canvasCoordinate.left + 0.5 * canvasCoordinate.width)) / screenToCampusScale.x + this.props.x,
        (mouseY - (canvasCoordinate.top + 0.5 * canvasCoordinate.height)) / screenToCampusScale.y + this.props.y];
    }

    /* Subcomponent Handlers */
    handleBaseManPressed() {
        this.setState({
            baseManAvail: false,
            displayDragMan: true,
            displayPinMan: false,
            // displayPano:false
        });
    }
    placePinManAt(PanoServerEndPoint, floor, x, y) {
        return getPanoInfo(PanoServerEndPoint, floor, x, y).then(
            response => {
                const { pano_x, pano_y, panoUrl, panoDefaultOffset, panoDefaultClockwiseAngleFromNorth } = response;
                this.props.linkTo({ x: pano_x, y: pano_y + this.props.height * 0.5 });
                this.setState({
                    baseManAvail: true,
                    displayDragMan: false,
                    displayPinMan: true,
                    displayPano: true,
                    panoX: pano_x,
                    panoY: pano_y,
                    panoUrl: panoUrl,
                    panoDefaultOffset: panoDefaultOffset,
                    panoDefaultClockwiseAngleFromNorth: panoDefaultClockwiseAngleFromNorth
                });
            });
    }
    handleDragManDrop(e) {
        let [x, y] = this.getCampusXYFromMouseXY(this.props.canvas, e.clientX, e.clientY);
        this.placePinManAt(PanoServerEndPoint, this.props.floor, x, y);
    }
    /**
     *@param {number} forwardDirection , a string in {"Forward","Backward"}, or an angle counted clockwise from North direction.
     */
    handleNavigation(movementDirection) {
        let deg = 0;
        if (movementDirection === "Forward") {
            deg = positiveModulo(this.state.PinManAngle, 360);
        }
        else if (movementDirection === "Backward") {
            deg = positiveModulo(180 + this.state.PinManAngle, 360);
        }
        else {
            deg = Math.parseFloat(movementDirection);
        }
        // console.log("movementDirection", movementDirection, "deg", deg);
        getNextPano(PanoServerEndPoint, this.props.floor, this.state.panoX, this.state.panoY, deg)
            .then(res => {
                if (res !== null) {
                    const [targetX, targetY] = res;
                    // console.log(targetX, targetY);
                    this.placePinManAt(PanoServerEndPoint, this.props.floor, targetX, targetY);
                }
            });
    }
    handlePanoClose() {
        this.setState({
            displayPinMan: false,
            displayPano: false,
            fullScreenPano: false,
        });
    }
    handlePanoResize() {
        let fullScreen = this.state.fullScreenPano;
        this.setState({
            fullScreenPano: !fullScreen,
        });
    }
    handlePanoRotate_dev(newAngle) {
        this.setState({
            PinManAngle: newAngle,
        });
    }
    handlePanoRotate(e) {
        this.handlePanoRotate_dev(e);
    }
    /*End of Subcomponent Handlers */

    /*Subcomponent Renderers */
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
            x = this.state.panoX;
            y = this.state.panoY;
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
                    angle={this.state.PinManAngle}
                />
            </div>
        );
    }

    renderPano() {

        if (this.state.displayPano) {

            return <PanoDisplay
                panoImage={this.state.panoUrl}
                defaultOffset={this.state.panoDefaultOffset}
                defaultClockwiseAngleFromNorth={this.state.panoDefaultClockwiseAngleFromNorth}
                width={this.props.width}
                height={this.props.height}
                parentOffShow={() => this.handlePanoClose()}
                parentHandleUpdate={(e) => this.handlePanoRotate(e)}
                parentHandleNavigation={(forwardDirection) => this.handleNavigation(forwardDirection)}
            />;
        } else {
            return null;
        }
    }

    /*End of Subcomponent Renderers */


    render() {
        const platform = this.props.platform;
        const buttonClassName = classnames({
            [style.buttonImage]: platform !== 'MOBILE',
            [style.buttonImageMobile]: platform === 'MOBILE',
        });

        return (
            <div style={{ zIndex: -1 }} id={id}>
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
        'mapItemStore',
        'linkTo',
        'level'
    ],
};

const id = "StreetView";
export { id, MapCanvasPlugin };
