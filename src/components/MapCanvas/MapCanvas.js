import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { withRouter } from 'react-router-dom';
// import { connect, connectAdvanced } from 'react-redux';
import CanvasHandler from './CanvasHandler';
import { APIEndpoint } from '../../config/config';
import getUrl from '../RouterManager/GetUrl';

class MapCanvas extends Component {
  canvasRootRef = createRef();

  canvasHandler = new CanvasHandler();

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    x: PropTypes.number,
    y: PropTypes.number,
    floor: PropTypes.string,
    scale: PropTypes.number,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    getMapItemsHandler: PropTypes.func.isRequired,
    mapItemStore: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    x: 2,
    y: 2,
    floor: 'G',
    scale: 1,
  };

  state = {};

  componentDidMount() {
    console.log('componentDidMount');
    const { history } = this.props;
    window.reactHistory = history;
    window.canvasHandler = this.canvasHandler;
    this.canvasHandler.addMouseUpListener(({ x, y, floor, scale }) => {
      // Update url
      history.push(getUrl({ floor, x, y, scale }));
    });

    const { x, y, floor, scale } = this.props;
    console.log('default props', { x, y, floor, scale });
    this.canvasRootRef.current.appendChild(this.canvasHandler.getCanvas());
    this.canvasHandler.updateDimenision(1024, 768);
    history.push(getUrl({ floor, x, y, scale }));
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    const { x, y, floor, scale } = this.props;
    this.canvasHandler.updatePosition(x, y, floor, scale);
  }

  render() {
    const { children } = this.props;
    console.log('my props', this.props);
    return (
      <div>
        <div> MapCanvas own things </div>
        <div ref={this.canvasRootRef} />
        <div>
          {children.map(
            ({ pluginId, MapCanvasPlugin }) =>
              MapCanvasPlugin && (
                <MapCanvasPlugin
                  key={pluginId}
                  {...this.canvasHandler.getProps()}
                  APIEndpoint={APIEndpoint}
                />
              ),
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(MapCanvas);

// export default withRouter(
//   connect(
//     null,
//     null,
//     null,
//     { withRef: true },
//   )(MapCanvas),
// );
