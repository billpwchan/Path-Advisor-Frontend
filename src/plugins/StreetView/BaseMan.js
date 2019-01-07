import React from 'react';
import classnames from 'classnames';

import availImage from "./img/Man_for_available.png";
import mouseoverImage from "./img/Man_for_mouseover.png";
import outsideImage from "./img/Man_already_outside.png";
import style from "./StreetView.module.css";

// This is the class component for BaseMan.

// If parent passes in available==true, BaseMan only performs mouse over effect through handleMouseOver and handleMouseOut.
// Else if parent passes in available==false, BaseMan directly display outsideImage.

// When BaseMan is pressed(onMouseDown), it calls the handle function passed down by parent.
       

class BaseMan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageForAvail: availImage,
        };
    }
    
    handleMouseOver() {
        let image = mouseoverImage;
        this.setState({
            imageForAvail: image,
        });
    }
    handleMouseOut() {
        // The availability of BaseMan is given by parent, since it depends on whether DragMan is dropped.
        let image = availImage;
        this.setState({
            imageForAvail: image,
        });
    }
    
    render() {
        console.log("Base Man Rendered");
        let buttonClassName = this.props.buttonClassName;
        
        // If parent passes in available==true, handle mouse over effect by myself.
        // Else if parent passes in available==false, directly display outsideImage.
        let image = this.props.available?this.state.imageForAvail:outsideImage;
        
        return (
            <button
                className={classnames(style.body)}
                type="button"
                onMouseDown={() => this.props.parentHandlePressed()}
                onMouseOver={() => this.handleMouseOver()}
                onMouseOut={() => this.handleMouseOut()}
            >
                <img className={buttonClassName} src={image} alt="StreetView_BaseMan" />
            </button>
        );
    }
}
export default BaseMan;