import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';
import throttle from 'lodash.throttle';
import CanvasHandler from './CanvasHandler';
import { APIEndpoint } from '../../config/config';

class MapCanvas extends Component {
  canvasRootRef = createRef();

  canvasHandler = new CanvasHandler();

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    x: PropTypes.number,
    y: PropTypes.number,
    floor: PropTypes.string,
    scale: PropTypes.number,
    getMapItemsHandler: PropTypes.func.isRequired,
    mapItemStore: PropTypes.shape({}).isRequired,
    legendStore: PropTypes.shape({}).isRequired,
    searchShortestPathStore: PropTypes.shape({}).isRequired,
    searchNearestStore: PropTypes.shape({}).isRequired,
    searchAreaInputStore: PropTypes.shape({}).isRequired,
    openOverlayHandler: PropTypes.func.isRequired,
    linkTo: PropTypes.func.isRequired,
  };

  static defaultProps = {
    x: 2,
    y: 2,
    floor: 'G',
    scale: 1,
  };

  state = {
    width: 1024,
    height: 768,
  };

  componentDidMount() {
    const { linkTo, getMapItemsHandler } = this.props;

    window.canvasHandler = this.canvasHandler;

    this.canvasHandler.addMouseUpListener(({ x, y, floor, scale }) => {
      // update position param if changed due to mouse event
      linkTo({ floor, x, y, scale });
    });

    const { x, y, floor, scale } = this.props;
    const { width, height } = this.state;

    this.canvasRootRef.current.appendChild(this.canvasHandler.getCanvas());
    this.canvasHandler.updateDimenision(width, height);

    this.canvasHandler.addPositionChangeListener(
      throttle(
        ({ floor: _floor, leftX, topY, width: _width, height: _height }) => {
          getMapItemsHandler(_floor, [leftX, topY], _width, _height);
        },
        1000,
        { leading: false },
      ),
    );

    this.canvasHandler.addPositionChangeListener(
      ({ x: movingX, y: movingY, leftX: movingLeftX, topY: movingTopY }) => {
        this.setState({ movingX, movingY, movingLeftX, movingTopY });
      },
    );

    // init position param
    linkTo({ floor, x, y, scale });
    this.canvasHandler.updatePosition(x, y, floor, scale);
  }

  componentDidUpdate(prevProps) {
    // sync react position to canvas if it is changed
    const { x, y, floor, scale } = this.props;
    if (
      x !== prevProps.x ||
      y !== prevProps.y ||
      floor !== prevProps.floor ||
      scale !== prevProps.scale
    ) {
      this.canvasHandler.updatePosition(x, y, floor, scale);
    }
  }

  render() {
    const {
      children,
      mapItemStore,
      x,
      y,
      floor,
      scale,
      legendStore,
      openOverlayHandler,
      searchNearestStore,
      searchShortestPathStore,
      searchAreaInputStore,
      linkTo,
    } = this.props;
    const { movingX, movingY, movingLeftX, movingTopY, width, height } = this.state;

    return (
      <div>
        <div ref={this.canvasRootRef} />
        <div>
          {children.map(
            ({ pluginId, MapCanvasPlugin }) =>
              MapCanvasPlugin && (
                <MapCanvasPlugin
                  key={pluginId}
                  x={x}
                  y={y}
                  movingX={movingX}
                  movingY={movingY}
                  movingLeftX={movingLeftX}
                  movingTopY={movingTopY}
                  floor={floor}
                  scale={scale}
                  APIEndpoint={APIEndpoint}
                  mapItems={mapItemStore.mapItems}
                  width={width}
                  height={height}
                  legends={legendStore.legends}
                  openOverlayHandler={openOverlayHandler}
                  searchNearestStore={searchNearestStore}
                  searchShortestPathStore={searchShortestPathStore}
                  searchAreaInputStore={searchAreaInputStore}
                  linkTo={linkTo}
                  {...this.canvasHandler.getProps()}
                />
              ),
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(MapCanvas);

// export default withRouter(
//   connect(
//     null,
//     null,
//     null,
//     { withRef: true },
//   )(MapCanvas),
// );
