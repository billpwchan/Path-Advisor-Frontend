import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './SearchNearest.module.css';
import { TYPE as INPUT_TYPE } from '../SearchArea/Input';

export const nearestOptions = {
  lift: { name: 'Nearest Lift', data: { type: INPUT_TYPE.NEAREST, value: 'lift' } },
  maleToilet: {
    name: 'Nearest male toilet',
    data: { type: INPUT_TYPE.NEAREST, value: 'male toilet' },
  },
  femaleToilet: {
    name: 'Nearest female toilet',
    data: { type: INPUT_TYPE.NEAREST, value: 'female toilet' },
  },
  expressStation: {
    name: 'Nearest express station',
    data: { type: INPUT_TYPE.NEAREST, value: 'express station' },
  },
  drinkingFountain: {
    name: 'Nearest drinking fountain',
    data: { type: INPUT_TYPE.NEAREST, value: 'drinking fountain' },
  },
  atm: { name: 'Nearest ATM', data: { type: INPUT_TYPE.NEAREST, value: 'ATM' } },
  mailbox: { name: 'Nearest mailbox', data: { type: INPUT_TYPE.NEAREST, value: 'mailbox' } },
  restaurant: {
    name: 'Nearest restaurant',
    data: { type: INPUT_TYPE.NEAREST, value: 'restaurant' },
  },
  virtualBarnStation: {
    name: 'Nearest virtual barn workstation',
    data: { type: INPUT_TYPE.NEAREST, value: 'virtual barn station' },
  },
  satellitePrinter: {
    name: 'Nearest satellite printer',
    data: { type: INPUT_TYPE.NEAREST, value: 'satellite printer' },
  },
};

const rootMenuOptions = direction => [
  nearestOptions.lift,
  { name: 'Atrium', data: { type: INPUT_TYPE.KEYWORD, value: 'Atrium' } },
  {
    name: 'Bus stop',
    children: [
      { name: 'North bus stop', data: { type: INPUT_TYPE.KEYWORD, value: 'North Bus Stop' } },
      { name: 'South bus stop', data: { type: INPUT_TYPE.KEYWORD, value: 'South Bus Stop' } },
    ],
  },
  {
    name: 'MTR Station',
    children: [
      {
        name: 'Choi Hung',
        data: {
          type: INPUT_TYPE.KEYWORD,
          value: direction === 'from' ? 'North Bus Stop' : 'South Bus Stop',
        },
      },
      {
        name: 'Hang Hau',
        data: {
          type: INPUT_TYPE.KEYWORD,
          value: direction === 'from' ? 'South Bus Stop' : 'North Bus Stop',
        },
      },
    ],
  },
  {
    name: 'Nearest toilet',
    children: [nearestOptions.maleToilet, nearestOptions.femaleToilet],
  },
  {
    name: 'Others',
    children: [
      nearestOptions.expressStation,
      nearestOptions.drinkingFountain,
      nearestOptions.atm,
      nearestOptions.mailbox,
      nearestOptions.restaurant,
      nearestOptions.virtualBarnStation,
      nearestOptions.satellitePrinter,
    ],
  },
];

class SearchNearest extends Component {
  static propTypes = {
    direction: PropTypes.string.isRequired,
    onNearestItemClick: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    children: PropTypes.node,
  };

  state = {
    hideDropDown: true,
  };

  static getDerivedStateFromProps({ direction }, { prevDirection }) {
    if (prevDirection === direction) {
      return null;
    }
    return {
      prevDirection: direction,
      menuOptions: rootMenuOptions(direction),
    };
  }

  hideIfClickOutSideListener = e => {
    let node = e.target;

    while (node !== null) {
      if (node.className === style.dropDownListItem) {
        return;
      }
      node = node.parentElement;
    }

    this.hideDropDown();
    document.removeEventListener('click', this.hideIfClickOutSideListener);
  };

  selectDropDownItem = (name, children, data) => () => {
    const { onNearestItemClick, direction } = this.props;
    if (children) {
      this.setState({
        menuOptions: children,
      });

      return;
    }

    if (data) {
      this.hideDropDown();
      this.setState({
        menuOptions: rootMenuOptions(direction),
      });

      document.removeEventListener('click', this.hideIfClickOutSideListener);
      onNearestItemClick({ name, data });
    }
  };

  showDropDown = () => {
    this.setState({
      hideDropDown: false,
    });

    document.addEventListener('click', this.hideIfClickOutSideListener);
  };

  hideDropDown = () => {
    this.setState({
      hideDropDown: true,
      menuOptions: rootMenuOptions(this.props.direction),
    });
  };

  render() {
    const { menuOptions, hideDropDown } = this.state;
    const { value, children } = this.props;
    return (
      <div>
        <input
          type="text"
          className={style.input}
          readOnly
          onClick={this.showDropDown}
          value={value}
        />
        <button type="button" className={style.dropDownButton} onClick={this.showDropDown}>
          <span className={style.arrowDown} />
        </button>
        {!hideDropDown && (
          <ul className={style.dropDownList}>
            {React.Children.map(children, child => (
              <li className={style.dropDownListItem}>
                {React.cloneElement(child, { onClickHook: this.hideDropDown })}
              </li>
            ))}
            {menuOptions.map(({ name, children: listChildren, data }) => (
              <li key={name} className={style.dropDownListItem}>
                <button
                  type="button"
                  className={style.dropDownListItemButton}
                  onClick={this.selectDropDownItem(name, listChildren, data)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default SearchNearest;
