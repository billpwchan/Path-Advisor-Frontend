import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './SearchNearest.module.css';

const rootNearestOptions = direction => [
  { name: 'Nearest Lift', data: { type: 'nearest', value: 'lift' } },
  { name: 'Atrium', data: { type: 'keyword', value: 'Atrium' } },
  {
    name: 'Bus stop',
    children: [
      { name: 'North bus stop', data: { type: 'keyword', value: 'North Bus Stop' } },
      { name: 'South bus stop', data: { type: 'keyword', value: 'South Bus Stop' } },
    ],
  },
  {
    name: 'MTR Station',
    children: [
      {
        name: 'Choi Hung',
        data: {
          type: 'keyword',
          value: direction === 'from' ? 'North Bus Stop' : 'South Bus Stop',
        },
      },
      {
        name: 'Hang Hau',
        data: {
          type: 'keyword',
          value: direction === 'from' ? 'South Bus Stop' : 'North Bus Stop',
        },
      },
    ],
  },
  {
    name: 'Nearest toilet',
    children: [
      { name: 'Nearest male toilet', data: { type: 'nearest', value: 'male toilet' } },
      { name: 'Nearest female toilet', data: { type: 'nearest', value: 'female toilet' } },
    ],
  },
  {
    name: 'Others',
    children: [
      { name: 'Nearest express station', data: { type: 'nearest', value: 'express station' } },
      {
        name: 'Nearest drinking fountain',
        data: { type: 'nearest', value: 'drinking fountain' },
      },
      { name: 'Nearest ATM', data: { type: 'nearest', value: 'ATM' } },
      { name: 'Nearest mailbox', data: { type: 'nearest', value: 'mailbox' } },
      { name: 'Nearest restaurant', data: { type: 'nearest', value: 'restaurant' } },
      {
        name: 'Nearest virtual barn workstation',
        data: { type: 'nearest', value: 'virtual barn station' },
      },
      {
        name: 'Nearest satellite printer',
        data: { type: 'nearest', value: 'satellite printer' },
      },
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
      nearestOptions: rootNearestOptions(direction),
    };
  }

  selectDropDownItem = (name, children, data) => () => {
    const { onNearestItemClick, direction } = this.props;
    if (children) {
      this.setState({
        nearestOptions: children,
      });

      return;
    }

    if (data) {
      this.hideDropDown();
      this.setState({
        nearestOptions: rootNearestOptions(direction),
      });

      onNearestItemClick({ name, data });
    }
  };

  showDropDown = () => {
    this.setState({
      hideDropDown: false,
    });
  };

  hideDropDown = () => {
    this.setState({
      hideDropDown: true,
    });
  };

  render() {
    const { nearestOptions, hideDropDown } = this.state;
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
            {nearestOptions.map(({ name, children: listChildren, data }) => (
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
