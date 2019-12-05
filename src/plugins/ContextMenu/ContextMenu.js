import React, { Component } from 'react';
import style from './ContextMenu.module.css';

class ContextMenu extends Component {
  state = {
    isContextMenuDisplay: false,
    clientX: null,
    clientY: null,
    clientMapX: null,
    clientMapY: null,
  };

  ref = React.createRef();

  componentDidMount() {
    this.props.addCanvasContextMenuListener(
      async ({ originalEvent, clientX, clientY, clientMapX, clientMapY }) => {
        const { floor, getNearestMapItemHandler } = this.props;

        originalEvent.preventDefault();

        this.setState({
          isContextMenuDisplay: true,
          clientX,
          clientY,
          clientMapX,
          clientMapY,
        });

        getNearestMapItemHandler(floor, [clientMapX, clientMapY]);
      },
    );

    document.addEventListener('mousedown', this.clickAwayListener);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.clickAwayListener);
  }

  getMenuTitle() {
    const {
      nearestMapItemStore: { mapItem },
      floorStore: { floors, buildings },
      floor,
    } = this.props;

    const { name = null } = mapItem || {};
    const { clientMapX, clientMapY } = this.state;

    if (name) {
      return name;
    }

    return `${
      floors && floors[floor] && floors[floor].name
        ? `Floor ${floors[floor].name} - ${buildings[floors[floor].buildingId].name}`
        : buildings[floors[floor].buildingId].name
    } (${clientMapX}, ${clientMapY})`;
  }

  hideContextMenu = () => {
    this.setState({ isContextMenuDisplay: false });
  };

  suggestLocation = () => {
    const { clientMapX, clientMapY } = this.state;
    const { linkTo } = this.props;
    linkTo({
      suggestion: 'location',
      suggestionX: clientMapX,
      suggestionY: clientMapY,
    });
    this.hideContextMenu();
  };

  setLocation = direction => () => {
    const {
      linkTo,
      floor,
      nearestMapItemStore: { mapItem },
    } = this.props;

    const { id = null } = mapItem || {};

    const { clientMapX, clientMapY } = this.state;
    const menuTitle = this.getMenuTitle();

    linkTo({
      search: true,
      [direction]: {
        name: menuTitle,
        data: {
          id,
          type: 'id',
          floor,
          value: menuTitle,
          coordinates: [clientMapX, clientMapY],
        },
      },
    });

    this.hideContextMenu();
  };

  clickAwayListener = e => {
    let node = e.target;

    while (node !== null) {
      if (node === this.ref.current) {
        return;
      }
      node = node.parentElement;
    }

    this.hideContextMenu();
  };

  render() {
    const { isContextMenuDisplay, clientX, clientY } = this.state;
    const { mapItem } = this.props.nearestMapItemStore;

    const { id = null } = mapItem || {};

    const menuTitle = this.getMenuTitle();

    return isContextMenuDisplay ? (
      <ul
        ref={this.ref}
        className={style.body}
        style={{ left: clientX, top: clientY }}
        onContextMenu={e => {
          e.preventDefault();
        }}
      >
        <li className={style.heading}>{menuTitle}</li>
        {id ? (
          <>
            <li>
              <button type="button" className={style.button} onClick={this.setLocation('from')}>
                Starts from here
              </button>
            </li>
            <li>
              <button type="button" className={style.button} onClick={this.setLocation('to')}>
                Stops to here
              </button>
            </li>
          </>
        ) : null}
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
    'APIEndpoint',
    'linkTo',
    'getNearestMapItemHandler',
    'nearestMapItemStore',
  ],
};

const id = 'CONTEXT_MENU';
export { id, MapCanvasPlugin };
