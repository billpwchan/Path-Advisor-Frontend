import React from 'react';
import classnames from 'classnames';
import style from './StreetView.module.css';
import DragMan from './DragMan';
import BaseMan from './BaseMan';
import PinMan from './PinMan';
import { PanoDisplay } from '../PanoDisplay/PanoDisplay';
import { getPanoInfo, getNextPano } from './BackendAPI';

/* 
This is the highest level StreetView component. 

It only communicate with the subcomponents through signals, but does not 
touches concrete image display.

Subcomponet interactions: 
- Initially, set BaseMan at available mode(baseManAvail=true), and hide DragMan(displayDragMan=false).
- Then when BaseMan is pressed, BaseMan will call handleBaseManPressed function here. StreetView then set BaseMan as unavailable(baseManAvail=false) and display DragMan(displayDragMan=true).
- Then when DragMan is dropped, DragMan will call handleDragManDrop function here. StreetView will then hide DragMan(displayDragMan=falese) and restore BaseMan to available(baseManAvail=true).
*/

function positiveModulo(number, modulo) {
  if (modulo <= 0) {
    return;
  }
  if (number >= 0) {
    return number % modulo;
  }
  return (number % modulo) + modulo;
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
      panoId: '',
      panoX: 0,
      panoY: 0,
      panoUrl: '', // A global variable to store panoUrl. It is supposed to be updated in getPanoUrl().
      panoDefaultOffset: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.floor !== this.props.floor) {
      // alert("Floor changes");
      this.handleFloorChange();
    }
  }

  /* 
    Helper function to convert mouse coordinate on screen to campus coordinate in map.
    The code is modified from component/MapCanvas/CanvasHandler.js.
    This can be very helpful. Feel free to make good use of it.
    */
  getCampusXYFromMouseXY(canvas, mouseX, mouseY) {
    // Get the zoom in/out factor for current canvas display.
    const screenToCampusScale = {
      x: this.props.width / (this.props.normalizedWidth + 0.0001),
      y: this.props.height / (this.props.normalizedHeight + 0.0001),
    };

    // Get the dimension of canvas on screen.
    const canvasCoordinate = canvas.getBoundingClientRect();

    // Return the absolute campus coordinate where current mouse is pointing to.
    return [
      (mouseX - (canvasCoordinate.left + 0.5 * canvasCoordinate.width)) / screenToCampusScale.x +
        this.props.x,
      (mouseY - (canvasCoordinate.top + 0.5 * canvasCoordinate.height)) / screenToCampusScale.y +
        this.props.y,
    ];
  }

  handleFloorChange() {
    // Close the pano display when the user switches floor.
    this.handlePanoClose();
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

  placePinManAt(floor, x, y) {
    return getPanoInfo(floor, [x, y]).then(response => {
      if (response === null) {
        this.setState({
          baseManAvail: true,
          displayDragMan: false,
        });
        return;
      }
      const {
        id,
        coordinates: [panoX, panoY],
        url,
        westX,
      } = response;

      this.props.linkTo({ x: parseFloat(panoX), y: parseFloat(panoY) + this.props.height * 0.5 });

      this.setState({
        baseManAvail: true,
        displayDragMan: false,
        displayPinMan: true,
        displayPano: true,
        panoId: id,
        panoX: parseFloat(panoX),
        panoY: parseFloat(panoY),
        panoUrl: url,
        panoDefaultOffset: westX,
      });
    });
  }

  handleDragManDrop(e) {
    const [x, y] = this.getCampusXYFromMouseXY(this.props.canvas, e.clientX, e.clientY);
    this.placePinManAt(this.props.floor, x, y);
  }

  handleNavigation(movementDirection) {
    let deg = 0;
    if (movementDirection === 'Forward') {
      deg = positiveModulo(this.state.PinManAngle, 360);
    } else if (movementDirection === 'Backward') {
      deg = positiveModulo(180 + this.state.PinManAngle, 360);
    } else {
      deg = Math.parseFloat(movementDirection);
    }
    getNextPano(this.state.panoId, deg).then(res => {
      if (res !== null) {
        const {
          coordinates: [targetX, targetY],
        } = res;
        this.placePinManAt(this.props.floor, parseFloat(targetX), parseFloat(targetY));
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
    const fullScreen = this.state.fullScreenPano;
    this.setState({
      fullScreenPano: !fullScreen,
    });
  }

  handlePanoRotate(newAngle) {
    this.setState({
      PinManAngle: newAngle,
    });
  }
  /* End of Subcomponent Handlers */

  /* Subcomponent Renderers */
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
    const display = this.state.displayDragMan ? 'block' : 'none';
    return (
      <DragMan
        display={display}
        buttonClassName={buttonClassName}
        parentHandleDrop={e => this.handleDragManDrop(e)}
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
      return (
        <PanoDisplay
          panoImage={this.state.panoUrl}
          defaultOffset={this.state.panoDefaultOffset}
          angle={this.state.PinManAngle}
          width={this.props.width}
          height={this.props.height}
          parentOffShow={() => this.handlePanoClose()}
          parentHandleUpdate={e => this.handlePanoRotate(e)}
          parentHandleNavigation={forwardDirection => this.handleNavigation(forwardDirection)}
        />
      );
    }
    return null;
  }

  /* End of Subcomponent Renderers */

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
    'linkTo',
  ],
};

const id = 'StreetView';
export { id, MapCanvasPlugin };
