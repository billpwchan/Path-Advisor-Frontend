import React from 'react';
import classnames from 'classnames';
import style from './StreetView.module.css';
import DragMan from './DragMan';
import BaseMan from './BaseMan';
import PinMan from './PinMan';
import PanoDisplay from '../PanoDisplay/PanoDisplay';
import { getPanoInfo, getNextPano, getPanoNodes, getPanoEdgeCoordinates } from './BackendAPI';

/* 
This is the highest level StreetView component. 

It only communicate with the subcomponents through signals, but does not 
touches concrete image display.

Subcomponet interactions: 
- Initially, set BaseMan at available mode(baseManAvail=true), and hide DragMan(displayDragMan=false).
- Then when BaseMan is pressed, BaseMan will call handleBaseManPressed function here. StreetView then set BaseMan as unavailable(baseManAvail=false) and display DragMan(displayDragMan=true).
- Then when DragMan is dropped, DragMan will call handleDragManDrop function here. StreetView will then hide DragMan(displayDragMan=falese) and restore BaseMan to available(baseManAvail=true).
*/

const id = 'StreetView';

function positiveModulo(number, modulo) {
  if (modulo <= 0) {
    return NaN;
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
      panoMapItemIds: [],
      pathNodeMapItemIds: [],
    };
    this.baseManRef = React.createRef();
  }

  componentDidMount() {
    const { floor } = this.props;
    this.updatePanoItems(floor);
  }

  componentDidUpdate(prevProps) {
    const { floor: prevFloor, searchShortestPathStore: prevPathResult } = prevProps;
    const { floor, searchShortestPathStore: pathResult } = this.props;

    this.updatePathPanoNodes(prevPathResult, pathResult);

    if (prevFloor !== floor) {
      // alert("Floor changes");
      this.handlePanoClose();
      this.updatePanoItems(floor);
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

  async updatePanoItems(floor) {
    const panoNodes = await getPanoNodes(floor);
    const panoNodeMapItemIds = panoNodes.map(({ _id }) => `PN${_id}`);
    const panoNodeMapItems = panoNodes.map(({ _id, coordinates: [x, y] }) => ({
      id: `PN${_id}`,
      floor,
      x,
      y,
      center: true,
      circle: {
        radius: 3,
        color: 'steelblue',
      },
      hidden: true,
      zIndex: -2,
    }));

    const panoEdges = await getPanoEdgeCoordinates(floor);
    const panoEdgeMapItemIds = panoEdges.map(({ _id }) => `PE${_id}`);
    const panoEdgeMapItems = panoEdges.map(({ _id, fromNodeCoordinates, toNodeCoordinates }) => ({
      id: `PE${_id}`,
      floor,
      line: {
        coordinates: [fromNodeCoordinates, toNodeCoordinates],
        cap: 'square',
        width: 1.5,
        strokeStyle: 'rgba(0,0,255,0.5)',
      },
      hidden: true,
      zIndex: -2,
    }));

    this.setState({ panoMapItemIds: [...panoEdgeMapItemIds, ...panoNodeMapItemIds] });
    this.props.setMapItems([...panoEdgeMapItems, ...panoNodeMapItems]);
  }

  async updatePathPanoNodes(prevSearchShortestPathStore, searchShortestPathStore) {
    if (
      prevSearchShortestPathStore === searchShortestPathStore ||
      !searchShortestPathStore.success
    ) {
      return;
    }
    this.state.pathNodeMapItemIds.forEach(_id => this.props.removeMapItem(_id));

    const pathPanoNodes = searchShortestPathStore.paths.filter(node => node.panorama);
    const pathNodeMapItemIds = pathPanoNodes.map(({ id: _id }) => `SPPN${_id}`);
    const panoNodeMapItems = pathPanoNodes.map(({ id: _id, floor, coordinates: [x, y] }) => ({
      id: `SPPN${_id}`,
      floor,
      x,
      y,
      center: true,
      circle: {
        radius: 3.5,
        color: 'orange',
      },
      onClick: () => this.placePinManAt(floor, x, y),
      onMouseOver: () => {
        document.body.style.cursor = 'pointer';
      },
      onMouseOut: () => {
        document.body.style.cursor = 'auto';
      },
    }));

    this.setState({ pathNodeMapItemIds });
    this.props.setMapItems(panoNodeMapItems);
  }

  togglePanoItems(on) {
    const { panoMapItemIds } = this.state;
    this.props.setMapItems(
      panoMapItemIds.map(panoMapItemId => ({ id: panoMapItemId, hidden: !on })),
    );
  }

  /* Subcomponent Handlers */
  handleBaseManPressed = e => {
    e.preventDefault();
    document.body.style.cursor = "grabbing";
    this.setState({
      baseManAvail: false,
      displayDragMan: true,
      displayPinMan: false,
      // displayPano:false
    });
    this.togglePanoItems(true);
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
        _id,
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
        panoId: _id,
        panoX: parseFloat(panoX),
        panoY: parseFloat(panoY),
        panoUrl: url,
        panoDefaultOffset: westX,
      });
    });
  }

  handleDragManDrop = e => {
    document.body.style.cursor = "auto";
    const { left, right, top, bottom } = this.baseManRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
      this.setState({
        baseManAvail: true,
        displayDragMan: false,
        displayPinMan: false,
        displayPano: false,
      });
      return;
    }
    const [x, y] = this.getCampusXYFromMouseXY(this.props.canvas, e.clientX, e.clientY);
    this.placePinManAt(this.props.floor, x, y);
  }

  handleNavigation = movementDirection => {
    let deg = 0;
    if (movementDirection === 'Forward') {
      deg = positiveModulo(this.state.PinManAngle, 360);
    } else if (movementDirection === 'Backward') {
      deg = positiveModulo(180 + this.state.PinManAngle, 360);
    } else {
      deg = parseFloat(movementDirection);
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

  handlePanoClose = () => {
    this.setState({
      displayPinMan: false,
      displayPano: false,
      fullScreenPano: false,
      PinManAngle: 0,
    });
    this.togglePanoItems(false);
  }

  handlePanoResize() {
    const fullScreen = this.state.fullScreenPano;
    this.setState({
      fullScreenPano: !fullScreen,
    });
  }

  handlePanoRotate = newAngle => {
    this.setState({
      PinManAngle: newAngle,
    });
  }
  /* End of Subcomponent Handlers */

  /* Subcomponent Renderers */
  renderBaseMan(buttonClassName) {
    return (
      <BaseMan
        ref={this.baseManRef}
        available={this.state.baseManAvail}
        buttonClassName={buttonClassName}
        parentHandlePressed={this.handleBaseManPressed}
      />
    );
  }

  renderDragMan(buttonClassName) {
    const display = this.state.displayDragMan ? 'block' : 'none';
    return (
      <DragMan
        display={display}
        buttonClassName={buttonClassName}
        parentHandleDrop={this.handleDragManDrop}
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
          parentOffShow={this.handlePanoClose}
          parentHandleUpdate={this.handlePanoRotate}
          parentHandleNavigation={this.handleNavigation}
        />
      );
    }
    return null;
  }

  /* End of Subcomponent Renderers */

  render() {
    const { platform } = this.props;
    const buttonClassName = classnames({
      [style.buttonImage]: platform !== 'MOBILE',
      [style.buttonImageMobile]: platform === 'MOBILE',
    });

    return (
      <div id={id}>
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
    'searchShortestPathStore',
  ],
};

export { id, MapCanvasPlugin };
