import React from 'react';
import classnames from 'classnames';
import style from './StreetView.module.css';
import DragMan from "./DragMan";
import BaseMan from "./BaseMan";
import PinMan from "./PinMan";
import { PanoDisplay } from "../PanoDisplay/PanoDisplay";
import Axios from 'axios';

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
    /**
     * @param {number} forwardAngle , an angle counted clockwise from North direction.
     */
    getNextPano(APIEndpoint, floor, currX, currY, forwardAngle) {
        return;
    }
    getPanoInfo(APIEndpoint, floor, x, y) {
        return this.getPanoInfo_dev(APIEndpoint, floor, x, y);
    }

    // A toy getPanoURL method we use for retrieveing PanoImage from slave server, given the PinMan location.
    // panoX,panoY,panoURL,panoDefaultOffset,panoDefaultClockwiseAngleFromNorth are updated in this method.
    getPanoInfo_dev_0(APIEndpoint, floor, x, y) {
        let pano_id;
        let pano_source;
        let pano_x;
        let pano_y;

        return Axios.get(`${APIEndpoint()}/phplib/get_map_data_2.php?floor=${floor}&coorX=${x}&coorY=${y}`)
            .then(
                response => {
                    response = response.data;
                    console.log("get_map_data_2.php response", response);
                    /* The following decision making method is modified from map_interface.js, line 1070-1104*/
                    if (response.split(";")[0] === "area") {
                        pano_id = response.split(";")[7];
                        pano_source = response.split(";")[8] + ".jpg";
                        pano_x = response.split(";")[9];
                        pano_y = response.split(";")[10];
                    }
                    else {
                        pano_id = response.split(";")[5];
                        pano_source = response.split(";")[6] + ".jpg";
                        pano_x = parseInt(response.split(";")[7]);
                        pano_y = parseInt(response.split(";")[8]);
                    }
                    response = { pano_id, pano_source, pano_x, pano_y }
                    return response;
                });
    }
    getPanoInfo_dev_1(APIEndpoint, floor, pano_source, pano_id) {
        return Axios.get(`${APIEndpoint()}/pano_info.php?floor=${floor}&photo=${pano_source}&pano_id=${pano_id}`).then(
            response => {
                response = response.data;

                const panoUrl = `${APIEndpoint()}/pano_pixel.php?floor=${floor}&photo=${pano_source}&pano_id=${pano_id}`;
                const panoDefaultOffset = parseInt(response.split(';')[0]);
                const panoDefaultClockwiseAngleFromNorth = parseFloat(response.split(';')[1]);

                return { panoUrl, panoDefaultOffset, panoDefaultClockwiseAngleFromNorth };
            });
    }
    getPanoInfo_dev(APIEndpoint, floor, x, y) {
        return this.getPanoInfo_dev_0(APIEndpoint, floor, x, y).then(
            response => {

                const { pano_id, pano_source, pano_x, pano_y } = response;
                return this.getPanoInfo_dev_1(APIEndpoint, floor, pano_source, pano_id).then(
                    res => {
                        const { panoUrl, panoDefaultOffset, panoDefaultClockwiseAngleFromNorth } = res;

                        return { pano_x, pano_y, panoUrl, panoDefaultOffset, panoDefaultClockwiseAngleFromNorth };
                    }
                );
            }
        );
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
        return this.getPanoInfo(PanoServerEndPoint, floor, x, y).then(
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
            deg = this.state.PinManAngle;
        }
        else if (movementDirection === "Backward") {
            deg = positiveModulo(180 + this.state.PinManAngle, 360);
        }
        else {
            deg = Math.parseFloat(movementDirection);
        }
        console.log("movementDirection", movementDirection, "deg", deg);
        this.getNextPano(PanoServerEndPoint, this.props.floor, this.state.panoX, this.state.panoY, deg);
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
