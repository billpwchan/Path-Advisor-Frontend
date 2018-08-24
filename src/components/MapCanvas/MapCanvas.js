import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
// import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';
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
    scale: PropTypes.string,
  };

  state = {};

  componentDidMount() {
    const { x, y, floor, scale } = this.props;

    this.canvasHandler.addMouseUpListener(({ x, y, floor, scale }) => {
      // Update url
    });

    this.canvasRootRef.current.appendChild(this.canvasHandler.getCanvas());
    this.canvasHandler.updatePosition(x, y, floor, scale);
  }

  componentDidUpdate() {
    const { x, y, floor, scale } = this.props;
    this.canvasHandler.updatePosition(x, y, floor, scale);
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <div> MapCanvas own things </div>
        <div ref={this.canvasRootRef} />
        <div>
          {children.map(({ pluginId, MapCanvasPlugin }) => (
            <MapCanvasPlugin
              key={pluginId}
              {...this.canvasHandler.getProps()}
              APIEndpoint={APIEndpoint}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default MapCanvas;

// export default withRouter(
//   connect(
//     null,
//     null,
//     null,
//     { withRef: true },
//   )(MapCanvas),
// );
