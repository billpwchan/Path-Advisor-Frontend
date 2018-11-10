import React, { Component } from 'react';
import style from './ContextMenu.module.css';

class ContextMenu extends Component {
  state = { isContextMenuDisplay: false, clientX: null, clientY: null };

  ref = React.createRef();

  componentDidMount() {
    this.props.addCanvasContextMenuListener(({ originalEvent, clientX, clientY }) => {
      originalEvent.preventDefault();
      this.setState({ isContextMenuDisplay: true, clientX, clientY });
    });

    document.addEventListener('mousedown', e => {
      let node = e.target;

      while (node !== null) {
        if (node === this.ref.current) {
          return;
        }
        node = node.parentElement;
      }

      this.hideContextMenu();
    });
  }

  hideContextMenu = () => {
    this.setState({ isContextMenuDisplay: false });
  };

  suggestLocation = () => {
    const { clientX, clientY } = this.state;
    const { APIEndpoint, floor, movingLeftX, movingTopY } = this.props;
    window.open(
      `${APIEndpoint()}/suggest.php?type=location&floor=${floor}&x=${clientX +
        movingLeftX}&y=${clientY + movingTopY}`,
      '_blank',
      'height=300,width=350',
    );
    this.hideContextMenu();
  };

  render() {
    const { isContextMenuDisplay, clientX, clientY } = this.state;
    const {
      floorStore: { floors, buildings },
      floor,
      movingLeftX,
      movingTopY,
    } = this.props;
    return isContextMenuDisplay ? (
      <ul
        ref={this.ref}
        className={style.body}
        style={{ left: clientX, top: clientY }}
        onContextMenu={e => {
          e.preventDefault();
        }}
      >
        <li className={style.heading}>
          {floors && floors[floor] && floors[floor].name
            ? `Floor ${floors[floor].name} - ${buildings[floors[floor].buildingId].name}`
            : `${buildings[floors[floor].buildingId].name}`}{' '}
          ({clientX + movingLeftX},{clientY + movingTopY})
        </li>
        {/* <li>
          <button type="button" className={style.button} onClick={() => console.log('ok')}>
            Starts from here
          </button>
        </li>
        <li>
          <button type="button" className={style.button}>
            Stops to here
          </button>
        </li> */}
        <li>
          <button type="button" className={style.button} onClick={this.suggestLocation}>
            Suggests a location here
          </button>
        </li>
      </ul>
    ) : null;
  }
}

const MapCanvasPlugin = {
  Component: ContextMenu,
  connect: [
    'addCanvasContextMenuListener',
    'floorStore',
    'floor',
    'movingLeftX',
    'movingTopY',
    'APIEndpoint',
  ],
};

const id = 'CONTEXT_MENU';
export { id, MapCanvasPlugin };
