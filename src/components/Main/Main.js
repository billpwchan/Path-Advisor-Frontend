import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';

class Main extends Component {
  primaryPanelRef = createRef();

  static defaultProps = {
    match: { params: {} },
  };

  state = {};

  componentDidMount() {
    console.log('componentDidMount');
    plugins.forEach(plugin => {
      plugin({ primaryPanel: this.primaryPanelRef.current });
    });
  }

  render() {
    return (
      <div>
        <PrimaryPanel ref={this.primaryPanelRef} />
      </div>
    );
  }
}

Main.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
};

export default Main;
