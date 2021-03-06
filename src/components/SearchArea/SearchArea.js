import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isNil from 'lodash.isnil';

import detectPlatform, { PLATFORM } from '../Main/detectPlatform';

import { searchMapItemAction, searchMapItemPropTypes } from '../../reducers/searchMapItem';
import {
  searchShortestPathAction,
  clearSearchShortestPathResultAction,
  searchShortestPathPropType,
} from '../../reducers/searchShortestPath';
import {
  searchNearestAction,
  clearSearchNearestResultAction,
  searchNearestPropType,
} from '../../reducers/searchNearest';
import {
  userActivitiesPropType,
  setUserActivitiesAction,
  ACTION_SOURCE,
} from '../../reducers/userActivities';
import { floorsPropType } from '../../reducers/floors';
import { placePropType } from '../Router/Url';
import { searchOptionsPropType } from '../Router/searchOptions';
import {
  TYPE as INPUT_TYPE,
  isEqual as InputIsEqual,
  EMPTY,
  hasContent as inputHasContent,
} from './Input';
import { MODE as LOG_MODE } from '../Main/logger';
import { appSettingsPropType } from '../../reducers/appSettings';

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
    searchShortestPathStore: searchShortestPathPropType.isRequired,
    SearchView: PropTypes.func.isRequired,
    linkTo: PropTypes.func.isRequired,
    logger: PropTypes.func.isRequired,
    userActivitiesStore: userActivitiesPropType.isRequired,
    setUserActivitiesHandler: PropTypes.func.isRequired,
    displayAdvancedSearch: PropTypes.bool,
    from: placePropType,
    to: placePropType,
    via: PropTypes.arrayOf(placePropType),
    x: PropTypes.number,
    y: PropTypes.number,
    floor: PropTypes.string,
    level: PropTypes.number,
    search: PropTypes.bool.isRequired,
    searchOptions: searchOptionsPropType.isRequired,
    appSettingStore: appSettingsPropType.isRequired,
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
      userActivitiesStore,
      to,
      from,
      via,
      searchOptions,
      searchShortestPathHandler,
      x,
      y,
      level,
      floor,
    } = this.props;
    if (
      search &&
      (!InputIsEqual(prevProps.to, to) ||
        !InputIsEqual(prevProps.from, from) ||
        search !== prevProps.search ||
        (via || []).length !== (prevProps.via || []).length ||
        (via || []).some((place, i) => !InputIsEqual(prevProps.via[i], place)) ||
        userActivitiesStore !== prevProps.userActivitiesStore)
    ) {
      this.search();
    }

    // auto positioning after a search if search success and no position is specified in url
    if ([floor, x, y, level].some(v => isNil(v))) {
      this.positionToNearestItem(prevProps);
      this.positionToShortestPathItem(prevProps);
    }

    if (searchNearestStore !== prevProps.searchNearestStore && searchNearestStore.success) {
      const { nearest } = searchNearestStore;

      // follow up shortest path search after nearest item searched
      searchShortestPathHandler(
        from.data.type === INPUT_TYPE.NEAREST
          ? { id: nearest.id, floor: nearest.floor }
          : getSearchPlaceFormat(from),
        to.data.type === INPUT_TYPE.NEAREST
          ? { id: nearest.id, floor: nearest.floor }
          : getSearchPlaceFormat(to),
        this.getViaPlaces(),
        searchOptions,
      );
    }
  }

  getViaPlaces() {
    return (this.props.via || [])
      .filter(place => inputHasContent(place))
      .map(place => getSearchPlaceFormat(place));
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

  updateSearchOptions = (newSearchOptions, search = null) => {
    if (search) {
      const { setUserActivitiesHandler } = this.props;

      setUserActivitiesHandler({
        actionSource: ACTION_SOURCE.BUTTON_CLICK,
      });
    }

    this.props.linkTo(currentUrlParams => ({
      ...(search === null ? {} : { search }),
      searchOptions: {
        ...currentUrlParams.searchOptions,
        ...newSearchOptions,
      },
    }));
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
    const { setUserActivitiesHandler, linkTo } = this.props;

    setUserActivitiesHandler({
      actionSource: ACTION_SOURCE.BUTTON_CLICK,
    });
    linkTo({ search: true });
  };

  search = () => {
    const {
      searchShortestPathHandler,
      clearSearchShortestPathResultHandler,
      searchNearestHandler,
      clearSearchNearestResultHandler,
      searchOptions: { sameFloor },
      from,
      to,
      via,
      logger,
      searchOptions,
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
        searchOptions,
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
        searchOptions,
      );
      logMode = LOG_MODE.NEAREST;
    } else {
      // point to point search
      searchShortestPathHandler(
        getSearchPlaceFormat(from),
        getSearchPlaceFormat(to),
        this.getViaPlaces(),
        searchOptions,
      );
    }

    logger({
      from: from.data.value,
      to: to.data.value,
      mode: logMode,
    });
  };

  positionToDefault() {
    const {
      appSettingStore: { defaultPosition, mobileDefaultPosition },
      linkTo,
    } = this.props;

    if (!defaultPosition || !mobileDefaultPosition) {
      return;
    }

    const { floor, x, y, level } =
      detectPlatform() === PLATFORM.MOBILE ? mobileDefaultPosition : defaultPosition;

    if ([floor, x, y, level].every(v => !isNil(v))) {
      linkTo({ floor, x, y, level }, 'replace');
    }
  }

  positionToNearestItem(prevProps) {
    const { searchNearestStore, linkTo } = this.props;

    if (searchNearestStore === prevProps.searchNearestStore) {
      return;
    }

    switch (true) {
      case searchNearestStore.failure:
        // position to default position if no nearest found
        this.positionToDefault();

        break;
      case searchNearestStore.success:
        {
          const { nearest } = searchNearestStore;
          linkTo(
            {
              x: nearest.coordinates[0],
              y: nearest.coordinates[1],
              floor: nearest.floor,
            },
            'replace',
          );
        }
        break;
      default:
    }
  }

  positionToShortestPathItem(prevProps) {
    const { searchNearestStore, searchShortestPathStore, linkTo } = this.props;
    if (searchShortestPathStore === prevProps.searchShortestPathStore) {
      return;
    }

    // only do auto focus to start point if user is not searching for a nearest item
    if (searchNearestStore.nearest !== null) {
      return;
    }

    switch (true) {
      case searchShortestPathStore.failure:
        // position to default position if no nearest found
        this.positionToDefault();
        break;
      case searchShortestPathStore.success:
        {
          const { paths } = searchShortestPathStore;
          if (!paths.length) {
            return;
          }

          const [
            {
              floor,
              coordinates: [x, y],
            },
          ] = paths;

          linkTo(
            {
              floor,
              x,
              y,
            },
            'replace',
          );
        }
        break;
      default:
    }
  }

  render() {
    const {
      floorStore,
      searchMapItemStore,
      searchOptions,
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
        searchOptions={searchOptions}
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
    userActivitiesStore: state.userActivities,
    searchNearestStore: state.searchNearest,
    searchShortestPathStore: state.searchShortestPath,
    floorStore: state.floors,
    appSettingStore: state.appSettings,
  }),
  dispatch => ({
    searchMapItemHandler: keyword => {
      dispatch(searchMapItemAction(keyword));
    },
    searchShortestPathHandler: (from, to, via, searchOptions) => {
      dispatch(searchShortestPathAction(from, to, via, searchOptions));
    },
    clearSearchShortestPathResultHandler: () => {
      dispatch(clearSearchShortestPathResultAction());
    },
    searchNearestHandler: (floor, name, nearestType, sameFloor, id, searchOptions) => {
      dispatch(searchNearestAction(floor, name, nearestType, sameFloor, id, searchOptions));
    },
    clearSearchNearestResultHandler: () => {
      dispatch(clearSearchNearestResultAction());
    },
    setUserActivitiesHandler: payload => {
      dispatch(setUserActivitiesAction(payload));
    },
  }),
)(SearchArea);
