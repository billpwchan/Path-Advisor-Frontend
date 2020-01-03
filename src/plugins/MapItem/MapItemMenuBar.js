import React, { Component } from 'react';
import style from './MapItemMenuBar.module.css';

class MenuBar extends Component {
  state = {
    isMenuShown: false,
  };

  menuRef = React.createRef();

  showMenu = () => {
    this.setState({
      isMenuShown: true,
    });

    document.addEventListener('click', this.hideIfClickOutSideListener);
  };

  hideIfClickOutSideListener = e => {
    let node = e.target;
    while (node !== null) {
      if (node === this.menuRef.current) {
        return;
      }
      node = node.parentElement;
    }

    this.setState({
      isMenuShown: false,
    });

    document.removeEventListener('click', this.hideIfClickOutSideListener);
  };

  render() {
    const { isMenuShown } = this.state;
    const {
      legendStore: { legends, legendIds },
      updateLegendDisplayHandler,
    } = this.props;

    return (
      <div className={style.body}>
        <button type="button" onClick={this.showMenu}>
          Legend
        </button>
        {isMenuShown ? (
          <ul ref={this.menuRef} className={style.menu}>
            {legendIds.map(legendId => (
              <li key={legendId}>
                <label className={style.label} htmlFor={`${legendId}_checkbox`}>
                  <input
                    type="checkbox"
                    id={`${legendId}_checkbox`}
                    checked={legends[legendId].display}
                    onChange={() => {
                      updateLegendDisplayHandler(legendId, !legends[legendId].display);
                    }}
                  />
                  {legends[legendId].name}
                </label>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
}
export default {
  Component: MenuBar,
  connect: ['legendStore', 'updateLegendDisplayHandler'],
};
