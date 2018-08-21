import React, { Component, createRef } from 'react';
// import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';
import CanvasHandler from './CanvasHandler';

const canvasHandler = new CanvasHandler();

class MapCanvas extends Component {
  canvasRootRef = createRef();

  state = {};

  componentDidMount() {
    this.canvasRootRef.current.appendChild(canvasHandler.getCanvas());
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <div> MapCanvas own things </div>
        <div ref={this.canvasRootRef} />
        <div>
          {children.map(({ pluginId, MapCanvasPlugin }) => (
            <MapCanvasPlugin key={pluginId} {...canvasHandler.getProps()} />
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
