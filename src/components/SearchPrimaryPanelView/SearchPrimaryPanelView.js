import classnames from 'classnames';
import get from 'lodash.get';
import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from '../SearchInput/SearchInput';
import SearchNearest from '../SearchNearest/SearchNearest';
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch';
import style from './SearchPrimaryPanelView.module.css';
import switchImage from './switch.png';
import { searchAreaInputPropTypes } from '../../reducers/searchAreaInput';

function SearchPrimaryPanelView({
  floorStore,
  searchMapItemStore,
  searchAreaInputStore,
  onKeywordChange,
  onAutoCompleteItemClick,
  onNearestItemClick,
  switchInputOrder,
  updateSameFloor,
  search,
  displayAdvancedSearch,
  updateSearchOptions,
}) {
  const suggestions = get(searchMapItemStore, 'suggestions', []);
  const {
    searchOptions: { sameFloor },
    searchInputOrders,
  } = searchAreaInputStore;

  const searchInputs = {
    SearchInput(direction) {
      return (
        <SearchInput
          inputClassName={style.input}
          autoCompleteListClassName={style.autoCompleteList}
          suggestions={suggestions}
          onKeywordChange={onKeywordChange(direction)}
          loading={searchMapItemStore.loading}
          onAutoCompleteItemClick={onAutoCompleteItemClick(direction)}
          value={searchAreaInputStore[direction].name}
          floorStore={floorStore}
        />
      );
    },
    SearchNearest(direction) {
      return (
        <SearchNearest
          direction={direction}
          onNearestItemClick={onNearestItemClick(direction)}
          value={searchAreaInputStore[direction].name}
        >
          <SearchInput
            inputClassName={style.input}
            autoCompleteListClassName={style.autoCompleteList}
            suggestions={suggestions}
            onKeywordChange={onKeywordChange(direction)}
            loading={searchMapItemStore.loading}
            onAutoCompleteItemClick={onAutoCompleteItemClick(direction)}
            placeholder="Room number/ name"
            floorStore={floorStore}
          />
        </SearchNearest>
      );
    },
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
            onClick={switchInputOrder}
          >
            <img src={switchImage} alt="switch" />
          </button>

          <div className={style.checkBoxRow}>
            <input
              className={style.checkBoxColumn}
              type="checkbox"
              onChange={updateSameFloor}
              checked={sameFloor}
            />
            <div className={style.checkBoxColumn}>On the same floor</div>
          </div>

          <div className={style.searchButtonContainer}>
            <input type="button" className={style.searchButton} value="GO" onClick={search} />
          </div>
        </div>
      </div>
      {displayAdvancedSearch && (
        <AdvancedSearch
          searchAreaInputStore={searchAreaInputStore}
          updateSearchOptions={updateSearchOptions}
          search={search}
        />
      )}
    </div>
  );
}

SearchPrimaryPanelView.propTypes = {
  floorStore: PropTypes.shape({}).isRequired,
  searchMapItemStore: PropTypes.shape({}).isRequired,
  searchAreaInputStore: searchAreaInputPropTypes.isRequired,
  onKeywordChange: PropTypes.func.isRequired,
  onAutoCompleteItemClick: PropTypes.func.isRequired,
  onNearestItemClick: PropTypes.func.isRequired,
  switchInputOrder: PropTypes.func.isRequired,
  updateSameFloor: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  displayAdvancedSearch: PropTypes.bool.isRequired,
  updateSearchOptions: PropTypes.func.isRequired,
};

export default SearchPrimaryPanelView;
