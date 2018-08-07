import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';

class MapCanvas extends Component {
  state = {};

  helloWorld = () => {};

  render() {
    const { children } = this.props;
    return (
      <div>
        <div> MapCanvas own things </div>
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
