import React from 'react';
import classnames from 'classnames';

import style from './StreetView.module.css';
import availImage from "./img/Man_for_available.png";
import mouseoverImage from "./img/Man_for_mouseover.png";
import outsideImage from "./img/Man_already_outside.png";
import DragMan from "./DragMan";
import BaseMan from "./BaseMan";

class StreetView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            srcImage: availImage,
            baseManAvail: true,
            displayDragMan: false,
        };

    }

    handleBaseManPressed() {
        console.log("BaseMan pressed, detected by parent.");
        this.setState({
            baseManAvail:false,
            displayDragMan: true,
        });
    }
    handleDragManDrop() {
        console.log("DragMan dropped, detected by parent.");
        this.setState({
            baseManAvail:true,
            displayDragMan: false,
        });
    }
    renderBaseMan(buttonClassName) {
        console.log("BaseMan available?",this.state.baseManAvail);
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
        return (<DragMan
            display={display}
            buttonClassName={buttonClassName}
            initialX={this.state.dragManX}
            initialY={this.state.dragManY}
            parentHandleDrop={() => this.handleDragManDrop()}
    />);
    }
    render() {

        console.log('Street View Icon rendered');
        const platform = this.props.platform;
        const buttonClassName = classnames({
            [style.buttonImage]: platform !== 'MOBILE',
            [style.buttonImageMobile]: platform === 'MOBILE',
        });


        return (
            <div id={id}>
                {
                    this.renderBaseMan(buttonClassName)
                }
                {
                    this.renderDragMan(buttonClassName)
                }
            </div>
        );


    }
}
const MapCanvasPlugin = {
    Component: StreetView,
    connect: ['platform'],
};

const id = "StreetView";
export { id, MapCanvasPlugin };
