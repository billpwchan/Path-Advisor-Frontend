import classnames from 'classnames';
import React, { Component } from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import style from './SearchArea.module.css';
import switchImage from './switch.png';
import SearchInput from '../SearchInput/SearchInput';
import SearchNearest from '../SearchNearest/SearchNearest';
import getUrl from '../RouterManager/GetUrl';

class SearchArea extends Component {
  static propTypes = {
    getAutoCompleteAction: PropTypes.func.isRequired,
    searchShortestPathAction: PropTypes.func.isRequired,
    searchNearestAction: PropTypes.func.isRequired,
    autoCompleteStore: PropTypes.shape({}),
    floorStore: PropTypes.shape({}),
    history: PropTypes.shape({}),
  };

  state = {
    from: { name: '' },
    to: { name: '' },
    searchOptions: { sameFloor: false },
    searchInputOrders: ['SearchInput', 'SearchNearest'],
  };

  onKeywordChange = fieldName => keyword => {
    const { getAutoCompleteAction } = this.props;
    this.setState({ [fieldName]: { name: keyword, data: { type: 'keyword', value: keyword } } });
    getAutoCompleteAction(keyword);
  };

  onAutoCompleteItemClick = fieldName => ({ name, coordinates: [x, y], floor, id }) => {
    const { history } = this.props;
    this.setState({ [fieldName]: { name, data: { id, floor, value: name, type: 'id' } } });
    history.push(getUrl({ floor, x, y, scale: 1 }));
  };

  onNearestItemClick = fieldName => ({ name, data }) => {
    this.setState({
      [fieldName]: { name, data },
    });
  };

  updateSameFloor = e => {
    const { searchOptions } = this.state;
    this.setState({
      searchOptions: {
        ...searchOptions,
        sameFloor: e.target.checked,
      },
    });
  };

  switchInputOrder = () => {
    const { searchInputOrders, from, to } = this.state;
    this.setState({
      searchInputOrders: searchInputOrders.reverse(),
      from: to,
      to: from,
    });
  };

  search = () => {
    const { searchShortestPathAction, searchNearestAction } = this.props;
    const {
      from: {
        data: { type: fromType, id: fromId, floor: fromFloor, value: fromValue },
      },
      to: {
        data: { type: toType, id: toId, floor: toFloor, value: toValue },
      },
      searchOptions: { sameFloor },
    } = this.state;

    if (fromType === 'nearest') {
      searchNearestAction(toFloor, toValue, fromValue, sameFloor, toId);
    } else if (toType === 'nearest') {
      searchNearestAction(fromFloor, fromValue, toValue, sameFloor, fromId);
    } else {
      // point to point search
      const searchFrom =
        fromType === 'keyword' ? { keyword: fromValue } : { id: fromId, floor: fromFloor };
      const searchTo = toType === 'keyword' ? { keyword: toValue } : { id: toId, floor: toFloor };

      searchShortestPathAction(searchFrom, searchTo);
    }
  };

  render() {
    const {
      searchOptions: { sameFloor },
      searchInputOrders,
    } = this.state;
    const { floorStore, autoCompleteStore } = this.props;
    const suggestions = get(autoCompleteStore, 'suggestions', []);

    const searchInputs = {
      SearchInput: direction => (
        <SearchInput
          suggestions={suggestions}
          onKeywordChange={this.onKeywordChange(direction)}
          loading={autoCompleteStore.loading}
          onAutoCompleteItemClick={this.onAutoCompleteItemClick(direction)}
          value={this.state[direction].name}
          floorStore={floorStore}
        />
      ),
      SearchNearest: direction => (
        <SearchNearest
          direction={direction}
          onNearestItemClick={this.onNearestItemClick(direction)}
          value={this.state[direction].name}
        >
          <SearchInput
            suggestions={suggestions}
            onKeywordChange={this.onKeywordChange(direction)}
            loading={autoCompleteStore.loading}
            onAutoCompleteItemClick={this.onAutoCompleteItemClick(direction)}
            placeholder="Room number/ name"
            floorStore={floorStore}
          />
        </SearchNearest>
      ),
    };

    return (
      <div className={style.body}>
        <div className={style.head}>Search</div>
        <div className={style.contentContainer}>
          <div className={style.content}>
            <div className={style.searchColumn}>
              <div className={style.searchRow}>
                <div className={style.inputTitle}>From</div>
                <div className={style.inputField}>{searchInputs[searchInputOrders[0]]('from')}</div>
              </div>
              <div className={style.searchRow}>
                <div className={style.inputTitle}>To</div>
                <div className={style.inputField}> {searchInputs[searchInputOrders[1]]('to')} </div>
              </div>
            </div>

            <button
              className={classnames(style.searchColumn, style.switch)}
              type="button"
              onClick={this.switchInputOrder}
            >
              <img src={switchImage} alt="switch" />
            </button>

            <div className={style.checkBoxRow}>
              <input
                className={style.checkBoxColumn}
                type="checkbox"
                onChange={this.updateSameFloor}
                checked={sameFloor}
              />
              <div className={style.checkBoxColumn}>On the same floor</div>
            </div>

            <div className={style.searchButtonContainer}>
              <input
                type="button"
                className={style.searchButton}
                value="GO"
                onClick={this.search}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchArea;
