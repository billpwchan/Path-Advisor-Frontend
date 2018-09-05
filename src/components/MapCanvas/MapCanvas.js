import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';
import throttle from 'lodash.throttle';
import CanvasHandler from './CanvasHandler';
import { APIEndpoint } from '../../config/config';
import getUrl from '../RouterManager/GetUrl';

class MapCanvas extends Component {
  canvasRootRef = createRef();

  canvasHandler = new CanvasHandler();

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    x: PropTypes.number,
    y: PropTypes.number,
    floor: PropTypes.string,
    scale: PropTypes.number,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    getMapItemsHandler: PropTypes.func.isRequired,
    mapItemStore: PropTypes.shape({}).isRequired,
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
    const { history, getMapItemsHandler } = this.props;

    window.canvasHandler = this.canvasHandler;

    this.canvasHandler.addMouseUpListener(({ x, y, floor, scale }) => {
      // update position param if changed due to mouse event
      history.push(getUrl({ floor, x, y, scale }));
    });

    const { x, y, floor, scale } = this.props;
    const { width, height } = this.state;

    this.canvasRootRef.current.appendChild(this.canvasHandler.getCanvas());
    this.canvasHandler.updateDimenision(width, height);

    this.canvasHandler.addPositionChangeListener(
      throttle(
        ({ floor: _floor, x: startX, y: startY, width: _width, height: _height }) => {
          getMapItemsHandler(_floor, [startX, startY], _width, _height);
        },
        1000,
        { leading: false },
      ),
    );

    this.canvasHandler.addPositionChangeListener(({ x, y }) => {
      this.setState({ movingX: x, movingY: y });
    });

    // init position param
    history.push(getUrl({ floor, x, y, scale }));
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
    const { children, mapItemStore, x, y, floor, scale } = this.props;
    const { movingX = x, movingY = y, width, height } = this.state;

    return (
      <div>
        <div> MapCanvas own things </div>
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
                  floor={floor}
                  scale={scale}
                  APIEndpoint={APIEndpoint}
                  mapItems={mapItemStore.mapItems}
                  width={width}
                  height={height}
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
