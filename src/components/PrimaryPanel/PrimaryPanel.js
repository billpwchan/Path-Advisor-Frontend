import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';

class PrimaryPanel extends Component {
  state = {};

  render() {
    const { children, place, helloWorld, tests } = this.props;
    return (
      <div>
        <div> Primary own things {tests}</div>
        <div>
          {children.map(({ pluginId, PrimaryPanelPlugin }) => (
            <PrimaryPanelPlugin key={pluginId} helloWorld={helloWorld} place={place} />
          ))}
        </div>
      </div>
    );
  }
}

export default PrimaryPanel;

// export default withRouter(
//   connect(
//     null,
//     null,
//     null,
//     { withRef: true },
//   )(PrimaryPanel),
// );
