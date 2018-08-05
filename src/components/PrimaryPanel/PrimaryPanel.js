import React, { Component } from 'react';

class PrimaryPanel extends Component {
  state = { plugins: [<h1>Default</h1>] };

  add = plugin => {
    const { plugins } = this.state;

    this.setState({
      plugins: [...plugins, plugin],
    });
  };

  render() {
    const { plugins } = this.state;

    return (
      <div>
        <div>{plugins}</div>
      </div>
    );
  }
}

export default PrimaryPanel;
