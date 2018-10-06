import classnames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import style from './SearchArea.module.css';
import switchImage from './switch.png';
import SearchInput from '../SearchInput/SearchInput';
import SearchNearest from '../SearchNearest/SearchNearest';
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch';
import { searchMapItemAction } from '../../reducers/searchMapItem';
import {
  searchShortestPathAction,
  clearSearchShortestPathResultAction,
  updateSearchShortestPathSettingAction,
} from '../../reducers/searchShortestPath';
import { searchNearestAction, clearSearchNearestResultAction } from '../../reducers/searchNearest';
import { setSearchAreaInputAction } from '../../reducers/searchAreaInput';

class SearchArea extends Component {
  static propTypes = {
    searchMapItemHandler: PropTypes.func.isRequired,
    searchShortestPathHandler: PropTypes.func.isRequired,
    clearSearchShortestPathResultHandler: PropTypes.func.isRequired,
    searchNearestHandler: PropTypes.func.isRequired,
    clearSearchNearestResultHandler: PropTypes.func.isRequired,
    searchMapItemStore: PropTypes.shape({}),
    floorStore: PropTypes.shape({}),
    linkTo: PropTypes.func.isRequired,
    setSearchAreaInputHandler: PropTypes.func.isRequired,
    searchAreaInputStore: PropTypes.shape({
      from: PropTypes.shape({
        name: PropTypes.string,
        data: PropTypes.shape({
          type: PropTypes.string,
          id: PropTypes.string,
          floor: PropTypes.string,
          value: PropTypes.string,
          coordinates: PropTypes.arrayOf(PropTypes.number),
        }),
      }),
      to: PropTypes.shape({
        name: PropTypes.string,
        data: PropTypes.shape({
          type: PropTypes.string,
          id: PropTypes.string,
          floor: PropTypes.string,
          value: PropTypes.string,
          coordinates: PropTypes.arrayOf(PropTypes.number),
        }),
      }),
      searchOptions: PropTypes.shape({
        sameFloor: PropTypes.bool,
      }),
      searchInputOrders: PropTypes.arrayOf(PropTypes.string),
    }),
    searchShortestPathStore: PropTypes.shape({}),
    updateSearchShortestPathSettingHandler: PropTypes.func.isRequired,
    displayAdvancedSearch: PropTypes.bool.isRequired,
  };

  onKeywordChange = fieldName => keyword => {
    const { searchMapItemHandler, setSearchAreaInputHandler } = this.props;
    setSearchAreaInputHandler({
      [fieldName]: { name: keyword, data: { type: 'keyword', value: keyword } },
    });
    searchMapItemHandler(keyword);
  };

  onAutoCompleteItemClick = fieldName => ({ name, coordinates: [x, y], floor, id }) => {
    const { setSearchAreaInputHandler, linkTo } = this.props;
    setSearchAreaInputHandler({
      [fieldName]: { name, data: { id, floor, value: name, type: 'id', coordinates: [x, y] } },
    });
    linkTo({ floor, x, y, scale: 1 });
  };

  onNearestItemClick = fieldName => ({ name, data }) => {
    this.props.setSearchAreaInputHandler({
      [fieldName]: { name, data },
    });
  };

  updateSameFloor = e => {
    const {
      searchAreaInputStore: { searchOptions },
      setSearchAreaInputHandler,
    } = this.props;
    setSearchAreaInputHandler({
      searchOptions: {
        ...searchOptions,
        sameFloor: e.target.checked,
      },
    });
  };

  switchInputOrder = () => {
    const {
      searchAreaInputStore: { searchInputOrders, from, to },
      setSearchAreaInputHandler,
    } = this.props;
    setSearchAreaInputHandler({
      searchInputOrders: searchInputOrders.reverse(),
      from: to,
      to: from,
    });
  };

  search = () => {
    const {
      searchShortestPathHandler,
      clearSearchShortestPathResultHandler,
      searchNearestHandler,
      clearSearchNearestResultHandler,
      searchAreaInputStore: {
        from: {
          data: { type: fromType, id: fromId, floor: fromFloor, value: fromValue },
        },
        to: {
          data: { type: toType, id: toId, floor: toFloor, value: toValue },
        },
        searchOptions: { sameFloor },
      },
    } = this.props;

    if ((!fromValue && !fromId) || (!toValue && !toId)) {
      return;
    }

    clearSearchNearestResultHandler();
    clearSearchShortestPathResultHandler();

    if (fromType === 'nearest') {
      searchNearestHandler(toFloor, toValue, fromValue, sameFloor, toId);
    } else if (toType === 'nearest') {
      searchNearestHandler(fromFloor, fromValue, toValue, sameFloor, fromId);
    } else {
      // point to point search
      const searchFrom =
        fromType === 'keyword' ? { keyword: fromValue } : { id: fromId, floor: fromFloor };
      const searchTo = toType === 'keyword' ? { keyword: toValue } : { id: toId, floor: toFloor };

      searchShortestPathHandler(searchFrom, searchTo);
    }
  };

  render() {
    const {
      floorStore,
      searchMapItemStore,
      searchAreaInputStore: {
        searchOptions: { sameFloor },
        searchInputOrders,
      },
      searchShortestPathStore,
      updateSearchShortestPathSettingHandler,
      displayAdvancedSearch,
    } = this.props;
    const suggestions = get(searchMapItemStore, 'suggestions', []);

    const searchInputs = {
      SearchInput: direction => (
        <SearchInput
          suggestions={suggestions}
          onKeywordChange={this.onKeywordChange(direction)}
          loading={searchMapItemStore.loading}
          onAutoCompleteItemClick={this.onAutoCompleteItemClick(direction)}
          value={this.props.searchAreaInputStore[direction].name}
          floorStore={floorStore}
        />
      ),
      SearchNearest: direction => (
        <SearchNearest
          direction={direction}
          onNearestItemClick={this.onNearestItemClick(direction)}
          value={this.props.searchAreaInputStore[direction].name}
        >
          <SearchInput
            suggestions={suggestions}
            onKeywordChange={this.onKeywordChange(direction)}
            loading={searchMapItemStore.loading}
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
        {displayAdvancedSearch && (
          <AdvancedSearch
            searchShortestPathStore={searchShortestPathStore}
            updateSearchShortestPathSettingHandler={updateSearchShortestPathSettingHandler}
            search={this.search}
          />
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    searchMapItemStore: state.searchMapItem,
    searchShortestPathStore: state.searchShortestPath,
    searchAreaInputStore: state.searchAreaInput,
    floorStore: state.floors,
  }),
  dispatch => ({
    searchMapItemHandler: keyword => {
      dispatch(searchMapItemAction(keyword));
    },
    searchShortestPathHandler: (from, to) => {
      dispatch(searchShortestPathAction(from, to));
    },
    clearSearchShortestPathResultHandler: () => {
      dispatch(clearSearchShortestPathResultAction());
    },
    searchNearestHandler: (floor, name, nearestType, sameFloor, id) => {
      dispatch(searchNearestAction(floor, name, nearestType, sameFloor, id));
    },
    updateSearchShortestPathSettingHandler: (noStairCase, noEscalator, searchMode) => {
      dispatch(updateSearchShortestPathSettingAction(noStairCase, noEscalator, searchMode));
    },
    clearSearchNearestResultHandler: () => {
      dispatch(clearSearchNearestResultAction());
    },
    setSearchAreaInputHandler: payload => {
      dispatch(setSearchAreaInputAction(payload));
    },
  }),
)(SearchArea);
