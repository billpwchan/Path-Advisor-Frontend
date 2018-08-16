import React, { Component, createRef } from 'react';
// import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';
import CanvasHandler from './CanvasHandler';

class MapCanvas extends Component {
  canvasRef = createRef();

  state = {};

  componentDidMount() {
    console.log('canvasRef', this.canvasRef);
    window.canvasHandler = new CanvasHandler(this.canvasRef.current);
  }

  render() {
    const { children, helloWorld } = this.props;
    return (
      <div>
        <div> MapCanvas own things </div>
        <canvas ref={this.canvasRef} width="300" height="300" />
        <div>
          {children.map(({ pluginId, MapCanvasPlugin }) => (
            <MapCanvasPlugin key={pluginId} helloWorld={this.helloWorld} />
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
