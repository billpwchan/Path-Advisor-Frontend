import React, { Component } from 'react';

class PrimaryPanel extends Component {
  state = {};

  render() {
    const { children } = this.props;

    return (
      <div>
        <div>{children}</div>
      </div>
    );
  }
}

export default PrimaryPanel;
