import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PrimaryPanel from '../PrimaryPanel/PrimaryPanel';
import plugins from '../../plugins';

class Main extends Component {
  primaryPanelRef = createRef();

  static defaultProps = {
    match: { params: {} },
  };

  state = {};

  componentWillMount() {
    this.primaryPanelPlugins = plugins.map(({ pluginId, PrimaryPanelPlugin }) => (
      <PrimaryPanelPlugin key={pluginId} primaryPanelRef={this.primaryPanelRef} />
    ));
  }

  render() {
    return (
      <div>
        <PrimaryPanel ref={this.primaryPanelRef}>{this.primaryPanelPlugins}</PrimaryPanel>
      </div>
    );
  }
}

Main.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
};

export default connect(state => ({
  mappedTest: state.mapItems.test,
}))(Main);
