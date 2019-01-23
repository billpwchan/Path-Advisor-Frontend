import React from 'react';
import classnames from 'classnames';
import style from './StreetView.module.css';
import DragMan from "./DragMan";
import BaseMan from "./BaseMan";
import PinMan from "./PinMan";
import {PanoDisplay} from "../PanoDisplay/PanoDisplay";
// import PanoDisplay from "./PanoDisplay";
import Axios from 'axios';
// import axios from 'axios';

/* 
This is the highest level StreetView component. 

It only communicate with the subcomponents through signals, but does not 
touches concrete image display.

Subcomponet interactions: 
- Initially, set BaseMan at available mode(baseManAvail=true), and hide DragMan(displayDragMan=false).
- Then when BaseMan is pressed, BaseMan will call handleBaseManPressed function here. StreetView then set BaseMan as unavailable(baseManAvail=false) and display DragMan(displayDragMan=true).
- Then when DragMan is dropped, DragMan will call handleDragManDrop function here. StreetView will then hide DragMan(displayDragMan=falese) and restore BaseMan to available(baseManAvail=true).
*/

let panoUrl = "";//A global variable to store panoUrl. It is supposed to be updated in getPanoUrl().
function getPanoURL(APIEndpoint, floor, x, y) {
    getPanoURL_dev(APIEndpoint, floor, x, y);
}
function PanoServerEndPoint(){
    return PanoServerEndPoint_dev();
}
function PanoServerEndPoint_dev() {
    return 'http://localhost:380';
}
// A toy getPanoURL method we use for retrieveing PanoImage from slave server, given the PinMan location.
function getPanoURL_dev(APIEndpoint, floor, x, y) {
    let pano_id;
    let pano_source;
    
    Axios.get(`${APIEndpoint()}/phplib/get_map_data_2.php?floor=${floor}&coorX=${x}&coorY=${y}`)
        .then(
            response => {
                response = response.data;
                        
                // The following decision making method is modified from map_interface.js, line 1070-1104
                if (response.split(";")[0] === "area") {
                    pano_id = response.split(";")[7];
                    pano_source = response.split(";")[8] + ".jpg";
                }
                else {
                    pano_id = response.split(";")[5];
                    pano_source = response.split(";")[6] + ".jpg";
                }
                // Decision Making Ends

                // Update the value of global variable panoUrl.
                panoUrl=`${APIEndpoint()}/pano_pixel.php?floor=${floor}&photo=${pano_source}&pano_id=${pano_id}`;
                // console.log('panoUrl',panoUrl);
            }
        );
}

class StreetView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseManAvail: true,
            displayDragMan: false,
            displayPinMan: false,
            displayPano: false,
            fullScreenPano:false,
            PinManX: 0,
            PinManY: 0,
            PinManAngle: 0,
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
        });
    }
    handleDragManDrop(e) {
        let [x, y] = this.getCampusXYFromMouseXY(this.props.canvas, e.clientX, e.clientY);

        // Move the map to centre at beneath the dropped location,
        //  so that the PinMan is not blocked by the PanoDisplay.
        this.props.linkTo({ x: x, y: y + this.props.height * 0.5 });

        this.setState({
            baseManAvail: true,
            displayDragMan: false,
            displayPinMan: true,
            displayPano: true,
            PinManX: x,
            PinManY: y,
        });
    }
    handlePanoClose() {
        this.setState({
            displayPinMan: false,
            displayPano: false,
            fullScreenPano:false,
        });
    }
    handlePanoResize(){
        let fullScreen=this.state.fullScreenPano;
        this.setState({
            fullScreenPano:!fullScreen,
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
                    angle={this.state.PinManAngle}
                    onClick={(e) => this.handlePanoRotate(e)}
                />
            </div>
        );
    }

    // renderPano_old() {
    //     let x = this.state.PinManX;
    //     let y = this.state.PinManY;
    //     let floor = this.props.floor;
    //     let fullScreen = this.state.fullScreenPano;
    //     if (this.state.displayPano) {
    //         return <PanoDisplay
    //             height={fullScreen ? this.props.height : this.props.height * 0.5}
    //             width={this.props.width}
    //             onCloseClick={() => this.handlePanoClose()}
    //             onResizeClick={() => this.handlePanoResize()}
    //             fullScreen={fullScreen}
    //             x={x}
    //             y={y}
    //             floor={floor}
    //         />;
    //     } else {
    //         return null;
    //     }
    // }
    renderPano_new() {
        let x = this.state.PinManX;
        let y = this.state.PinManY;
        let floor = this.props.floor;
        getPanoURL(PanoServerEndPoint,floor,x,y);//Update the panoUrl variable.    
        if (this.state.displayPano) {
            return <PanoDisplay
                panoImage={panoUrl}    
                platform={this.props.platform}
                linkTo={this.props.linkTo}
                x={this.props.linkTo}
                y={this.props.y}
                level={this.props.level}
                canvas={this.props.canvas}
                width={this.props.width}
                height={this.props.height}
                parentOffShow={() => this.handlePanoClose()}
                parentHandleUpdate={(e)=>this.handlePanoRotate(e)}
            />;
        } else {
            return null;
        }
    }
    renderPano(){
        return this.renderPano_new()
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
