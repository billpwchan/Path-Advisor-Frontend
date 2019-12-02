import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { searchMapItemAction, searchMapItemPropTypes } from '../../reducers/searchMapItem';
import {
  searchShortestPathAction,
  clearSearchShortestPathResultAction,
} from '../../reducers/searchShortestPath';
import {
  searchNearestAction,
  clearSearchNearestResultAction,
  searchNearestPropType,
} from '../../reducers/searchNearest';
import {
  setSearchOptionsAction,
  searchOptionsPropTypes,
  ACTION_SOURCE,
} from '../../reducers/searchOptions';
import { floorsPropType } from '../../reducers/floors';
import { placePropType } from '../Router/Url';
import {
  TYPE as INPUT_TYPE,
  isEqual as InputIsEqual,
  EMPTY,
  hasContent as inputHasContent,
} from './Input';
import { MODE as LOG_MODE } from '../Main/logger';

function getSearchPlaceFormat(inputPlace) {
  const {
    data: { type, id, floor, value },
  } = inputPlace;
  return type === INPUT_TYPE.KEYWORD ? { keyword: value } : { id, floor };
}

class SearchArea extends Component {
  static propTypes = {
    searchMapItemHandler: PropTypes.func.isRequired,
    searchShortestPathHandler: PropTypes.func.isRequired,
    clearSearchShortestPathResultHandler: PropTypes.func.isRequired,
    searchNearestHandler: PropTypes.func.isRequired,
    clearSearchNearestResultHandler: PropTypes.func.isRequired,
    searchMapItemStore: searchMapItemPropTypes.isRequired,
    floorStore: floorsPropType.isRequired,
    searchNearestStore: searchNearestPropType.isRequired,
    SearchView: PropTypes.func.isRequired,
    linkTo: PropTypes.func.isRequired,
    logger: PropTypes.func.isRequired,
    setSearchOptionsHandler: PropTypes.func.isRequired,
    searchOptionsStore: searchOptionsPropTypes.isRequired,
    displayAdvancedSearch: PropTypes.bool,
    from: placePropType,
    to: placePropType,
    via: PropTypes.arrayOf(placePropType),
    search: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    // init orders, do not need to react if props changed later
    this.state = {
      searchInputOrders:
        this.props.from.data.type === INPUT_TYPE.NEAREST
          ? ['SearchNearest', 'SearchInput']
          : ['SearchInput', 'SearchNearest'],
    };
  }

  componentDidMount() {
    if (this.props.search) {
      this.search();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      searchNearestStore,
      search,
      searchOptionsStore,
      to,
      from,
      searchShortestPathHandler,
    } = this.props;
    if (
      search &&
      (!InputIsEqual(prevProps.to, to) ||
        !InputIsEqual(prevProps.from, from) ||
        search !== prevProps.search ||
        searchOptionsStore !== prevProps.searchOptionsStore)
    ) {
      this.search();
    }

    if (searchNearestStore !== prevProps.searchNearestStore && searchNearestStore.success) {
      // follow up shortest path search after nearest item searched
      const { nearest } = searchNearestStore;

      // point to point search
      searchShortestPathHandler(
        from.data.type === INPUT_TYPE.NEAREST
          ? { id: nearest.id, floor: nearest.floor }
          : getSearchPlaceFormat(from),
        to.data.type === INPUT_TYPE.NEAREST
          ? { id: nearest.id, floor: nearest.floor }
          : getSearchPlaceFormat(to),
        this.getViaPlaces(),
      );
    }
  }

  onKeywordChange = (direction, index) => keyword => {
    const { searchMapItemHandler, linkTo } = this.props;

    let linkMethod = 'push';
    let inputData = EMPTY;

    if (keyword.length) {
      linkMethod = 'replace';
      inputData = { name: keyword, data: { type: INPUT_TYPE.KEYWORD, value: keyword } };
      searchMapItemHandler(keyword);
    }

    if (direction === 'via') {
      linkTo(currentUrlParams => {
        const via = [...(currentUrlParams.via || [])];
        via[index] = inputData;
        return {
          via,
          search: false,
        };
      }, linkMethod);
      return;
    }

    linkTo(
      {
        [direction]: inputData,
        search: false,
      },
      linkMethod,
    );
  };

  onAddViaPlace = () => {
    this.props.linkTo(currentUrlParams => {
      const via = [...(currentUrlParams.via || [])];
      via.push({ ...EMPTY });
      return {
        ...currentUrlParams,
        via,
      };
    });
  };

  onRemoveViaPlace = index => () => {
    this.props.linkTo(currentUrlParams => {
      const via = [...(currentUrlParams.via || [])];
      via.splice(index, 1);
      return {
        ...currentUrlParams,
        via,
      };
    });
  };

  onAutoCompleteItemClick = (direction, index) => ({
    name,
    coordinates: [x, y],
    floor,
    id,
    displayName,
  }) => {
    if (direction === 'via') {
      this.props.linkTo(currentUrlParams => {
        const via = [...(currentUrlParams.via || [])];

        via[index] = {
          name: displayName || name,
          data: { id, floor, value: name, type: INPUT_TYPE.ID, coordinates: [x, y] },
        };

        return {
          search: false,
          floor,
          x,
          y,
          via,
        };
      });

      return;
    }

    this.props.linkTo({
      search: false,
      floor,
      x,
      y,
      [direction]: {
        name: displayName || name,
        data: { id, floor, value: name, type: INPUT_TYPE.ID, coordinates: [x, y] },
      },
    });
  };

  onNearestItemClick = direction => ({ name, data }) => {
    this.props.linkTo({
      [direction]: { name, data },
      search: false,
    });
  };

  updateSameFloor = e => {
    this.updateSearchOptions({
      sameFloor: e.target.checked,
    });
  };

  updateSearchOptions = newSearchOptions => {
    this.props.setSearchOptionsHandler({
      ...newSearchOptions,
    });
  };

  switchInputOrder = () => {
    const { from, to, linkTo } = this.props;

    this.setState(prevState => ({
      searchInputOrders: [...prevState.searchInputOrders].reverse(),
    }));

    linkTo({
      from: to,
      to: from,
      search: false,
    });
  };

  linkToSearch = () => {
    this.updateSearchOptions({
      actionSource: ACTION_SOURCE.BUTTON_CLICK,
    });
    this.props.linkTo({ search: true });
  };

  search = () => {
    const {
      searchShortestPathHandler,
      clearSearchShortestPathResultHandler,
      searchNearestHandler,
      clearSearchNearestResultHandler,
      searchOptionsStore: { sameFloor },
      from,
      to,
      via,
      logger,
    } = this.props;

    if ((!from.data.value && !from.data.id) || (!to.data.value && !to.data.id)) {
      return;
    }

    clearSearchNearestResultHandler();
    clearSearchShortestPathResultHandler();

    let logMode = LOG_MODE.NORMAL;

    if (from.data.type === INPUT_TYPE.NEAREST) {
      const firstVia = Array.isArray(via) ? via[0] : null;
      const next = firstVia && (firstVia.data.id || firstVia.data.value) ? firstVia : to;
      searchNearestHandler(
        next.data.floor,
        next.data.value,
        from.data.value,
        sameFloor,
        next.data.id,
      );
      logMode = LOG_MODE.NEAREST;
    } else if (to.data.type === INPUT_TYPE.NEAREST) {
      const lastVia = Array.isArray(via) ? via[via.length - 1] : null;
      const prev = lastVia && (lastVia.data.id || lastVia.data.value) ? lastVia : from;
      searchNearestHandler(
        prev.data.floor,
        prev.data.value,
        to.data.value,
        sameFloor,
        prev.data.id,
      );
      logMode = LOG_MODE.NEAREST;
    } else {
      // point to point search
      searchShortestPathHandler(
        getSearchPlaceFormat(from),
        getSearchPlaceFormat(to),
        this.getViaPlaces(),
      );
    }

    logger({
      from: from.data.value,
      to: to.data.value,
      mode: logMode,
    });
  };

  getViaPlaces() {
    return (this.props.via || [])
      .filter(place => inputHasContent(place))
      .map(place => getSearchPlaceFormat(place));
  }

  render() {
    const {
      floorStore,
      searchMapItemStore,
      searchOptionsStore,
      displayAdvancedSearch,
      SearchView,
      from,
      to,
      via,
    } = this.props;
    return (
      <SearchView
        floorStore={floorStore}
        searchMapItemStore={searchMapItemStore}
        searchOptionsStore={searchOptionsStore}
        searchInputOrders={this.state.searchInputOrders}
        from={from}
        to={to}
        via={via}
        onKeywordChange={this.onKeywordChange}
        onAutoCompleteItemClick={this.onAutoCompleteItemClick}
        onAddViaPlace={this.onAddViaPlace}
        onRemoveViaPlace={this.onRemoveViaPlace}
        onNearestItemClick={this.onNearestItemClick}
        switchInputOrder={this.switchInputOrder}
        updateSameFloor={this.updateSameFloor}
        search={this.linkToSearch}
        displayAdvancedSearch={displayAdvancedSearch}
        updateSearchOptions={this.updateSearchOptions}
      />
    );
  }
}

export default connect(
  state => ({
    searchMapItemStore: state.searchMapItem,
    searchOptionsStore: state.searchOptions,
    searchNearestStore: state.searchNearest,
    floorStore: state.floors,
  }),
  dispatch => ({
    searchMapItemHandler: keyword => {
      dispatch(searchMapItemAction(keyword));
    },
    searchShortestPathHandler: (from, to, via) => {
      dispatch(searchShortestPathAction(from, to, via));
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
    setSearchOptionsHandler: payload => {
      dispatch(setSearchOptionsAction(payload));
    },
  }),
)(SearchArea);
