import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';

class PrimaryPanel extends Component {
  state = {
    tests: [<b key="test1">Have it</b>],
  };

  helloWorld = newItem => {
    this.setState(prevState => ({
      tests: [...prevState.tests, newItem],
    }));
  };

  render() {
    const { children, place } = this.props;
    const { tests } = this.state;
    return (
      <div>
        <div> Primary own things {tests}</div>
        <div>
          {children.map(({ pluginId, PrimaryPanelPlugin }) => (
            <PrimaryPanelPlugin key={pluginId} helloWorld={this.helloWorld} place={place} />
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
