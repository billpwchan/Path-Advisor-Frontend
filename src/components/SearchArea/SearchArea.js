import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { searchMapItemAction } from '../../reducers/searchMapItem';
import {
  searchShortestPathAction,
  clearSearchShortestPathResultAction,
} from '../../reducers/searchShortestPath';
import { searchNearestAction, clearSearchNearestResultAction } from '../../reducers/searchNearest';
import { setSearchAreaInputAction, searchAreaInputPropTypes } from '../../reducers/searchAreaInput';

class SearchArea extends Component {
  static propTypes = {
    searchMapItemHandler: PropTypes.func.isRequired,
    searchShortestPathHandler: PropTypes.func.isRequired,
    clearSearchShortestPathResultHandler: PropTypes.func.isRequired,
    searchNearestHandler: PropTypes.func.isRequired,
    clearSearchNearestResultHandler: PropTypes.func.isRequired,
    searchMapItemStore: PropTypes.shape({}),
    floorStore: PropTypes.shape({}),
    SearchView: PropTypes.node.isRequired,
    linkTo: PropTypes.func.isRequired,
    setSearchAreaInputHandler: PropTypes.func.isRequired,
    searchAreaInputStore: searchAreaInputPropTypes,
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
    linkTo({ floor, x, y, level: 0 });
  };

  onNearestItemClick = fieldName => ({ name, data }) => {
    this.props.setSearchAreaInputHandler({
      [fieldName]: { name, data },
    });
  };

  updateSameFloor = e => {
    this.updateSearchOptions({
      sameFloor: e.target.checked,
    });
  };

  updateSearchOptions = newSearchOptions => {
    const {
      searchAreaInputStore: { searchOptions },
      setSearchAreaInputHandler,
    } = this.props;

    setSearchAreaInputHandler({
      searchOptions: {
        ...searchOptions,
        ...newSearchOptions,
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
      searchAreaInputStore,
      displayAdvancedSearch,
      SearchView,
    } = this.props;

    return (
      <SearchView
        floorStore={floorStore}
        searchMapItemStore={searchMapItemStore}
        searchAreaInputStore={searchAreaInputStore}
        onKeywordChange={this.onKeywordChange}
        onAutoCompleteItemClick={this.onAutoCompleteItemClick}
        onNearestItemClick={this.onNearestItemClick}
        switchInputOrder={this.switchInputOrder}
        updateSameFloor={this.updateSameFloor}
        search={this.search}
        displayAdvancedSearch={displayAdvancedSearch}
        updateSearchOptions={this.updateSearchOptions}
      />
    );
  }
}

export default connect(
  state => ({
    searchMapItemStore: state.searchMapItem,
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
    clearSearchNearestResultHandler: () => {
      dispatch(clearSearchNearestResultAction());
    },
    setSearchAreaInputHandler: payload => {
      dispatch(setSearchAreaInputAction(payload));
    },
  }),
)(SearchArea);
