import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from '../SearchInput/SearchInput';
import SearchNearest, { nearestOptions } from '../SearchNearest/SearchNearest';
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch';
import style from './SearchPrimaryPanelView.module.css';
import switchImage from './switch.png';
import { searchOptionsPropTypes } from '../../reducers/searchOptions';
import { searchMapItemPropTypes } from '../../reducers/searchMapItem';
import { floorsPropType } from '../../reducers/floors';
import { placePropType } from '../Router/Url';
import {
  isEqual as inputIsEqual,
  isNearestQuery as inputIsNearestQuery,
} from '../SearchArea/Input';

class SearchPrimaryPanelView extends React.Component {
  static propTypes = {
    floorStore: floorsPropType.isRequired,
    searchMapItemStore: searchMapItemPropTypes.isRequired,
    searchOptionsStore: searchOptionsPropTypes.isRequired,
    onKeywordChange: PropTypes.func.isRequired,
    onAutoCompleteItemClick: PropTypes.func.isRequired,
    onAddViaPlace: PropTypes.func.isRequired,
    onRemoveViaPlace: PropTypes.func.isRequired,
    onNearestItemClick: PropTypes.func.isRequired,
    switchInputOrder: PropTypes.func.isRequired,
    updateSameFloor: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    displayAdvancedSearch: PropTypes.bool.isRequired,
    updateSearchOptions: PropTypes.func.isRequired,
    searchInputOrders: PropTypes.arrayOf(PropTypes.string).isRequired,
    from: placePropType,
    to: placePropType,
    via: PropTypes.arrayOf(placePropType),
  };

  state = {
    shouldAutoCompleteDisplay: {
      from: false,
      to: false,
    },
  };

  setAutoCompleteDisplayHandler = direction => value => {
    this.setState(prevState => ({
      shouldAutoCompleteDisplay: {
        ...prevState.shouldAutoCompleteDisplay,
        [direction]: value,
      },
    }));
  };

  getViaInput(index, place) {
    const {
      floorStore,
      onRemoveViaPlace,
      onAutoCompleteItemClick,
      searchMapItemStore,
      onKeywordChange,
    } = this.props;

    const { shouldAutoCompleteDisplay } = this.state;

    return (
      <div key={index} className={style.searchRow}>
        <div className={style.inputTitle}>
          <span className={style.viaCircle}>{String.fromCharCode(65 + index)}</span>
        </div>
        <div className={style.inputField}>
          <SearchInput
            inputClassName={style.input}
            autoCompleteListClassName={style.autoCompleteList}
            suggestions={searchMapItemStore.suggestions}
            onKeywordChange={onKeywordChange('via', index)}
            loading={searchMapItemStore.loading}
            onAutoCompleteItemClick={onAutoCompleteItemClick('via', index)}
            value={place ? place.name : ''}
            floorStore={floorStore}
            shouldAutoCompleteDisplay={shouldAutoCompleteDisplay[`${'via_'}${index}`]}
            setAutoCompleteDisplay={this.setAutoCompleteDisplayHandler(`${'via_'}${index}`)}
          />
        </div>
        <button type="button" className={style.inputViaRemove} onClick={onRemoveViaPlace(index)}>
          <span role="img" aria-label="remove">
            ×
          </span>
        </button>
      </div>
    );
  }

  shouldSameFloorInputDisplay() {
    const { from, to } = this.props;
    return [from, to].some(
      place => inputIsNearestQuery(place) && !inputIsEqual(place, nearestOptions.lift),
    );
  }

  render() {
    const {
      floorStore,
      searchMapItemStore,
      searchOptionsStore,
      onKeywordChange,
      onAutoCompleteItemClick,
      onNearestItemClick,
      switchInputOrder,
      updateSameFloor,
      search,
      displayAdvancedSearch,
      updateSearchOptions,
      from,
      to,
      via,
      searchInputOrders,
      onAddViaPlace,
    } = this.props;

    const { sameFloor } = searchOptionsStore;

    const { shouldAutoCompleteDisplay } = this.state;
    const searchInputs = {
      SearchInput: direction => (
        <SearchInput
          inputClassName={style.input}
          autoCompleteListClassName={style.autoCompleteList}
          suggestions={searchMapItemStore.suggestions}
          onKeywordChange={onKeywordChange(direction)}
          loading={searchMapItemStore.loading}
          onAutoCompleteItemClick={onAutoCompleteItemClick(direction)}
          value={direction === 'from' ? from.name : to.name}
          floorStore={floorStore}
          shouldAutoCompleteDisplay={shouldAutoCompleteDisplay[direction]}
          setAutoCompleteDisplay={this.setAutoCompleteDisplayHandler(direction)}
        />
      ),
      SearchNearest: direction => (
        <SearchNearest
          direction={direction}
          onNearestItemClick={onNearestItemClick(direction)}
          value={direction === 'from' ? from.name : to.name}
        >
          <SearchInput
            inputClassName={style.input}
            autoCompleteListClassName={style.autoCompleteList}
            suggestions={searchMapItemStore.suggestions}
            onKeywordChange={onKeywordChange(direction)}
            loading={searchMapItemStore.loading}
            onAutoCompleteItemClick={onAutoCompleteItemClick(direction)}
            placeholder="Room number/ name"
            floorStore={floorStore}
            shouldAutoCompleteDisplay={shouldAutoCompleteDisplay[direction]}
            setAutoCompleteDisplay={this.setAutoCompleteDisplayHandler(direction)}
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
                <div className={style.inputTitle}>
                  <span className={style.fromCircle} />
                  From
                </div>
                <div className={style.inputField}>{searchInputs[searchInputOrders[0]]('from')}</div>
              </div>
              {Array.isArray(via) && via.map((place, index) => this.getViaInput(index, place))}
              <div className={style.searchRow}>
                <div className={style.inputTitle}>
                  <span className={style.toCircle} /> To
                </div>
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

            {this.shouldSameFloorInputDisplay() ? (
              <div className={style.checkBoxRow}>
                <label>
                  <input
                    className={style.checkBoxColumn}
                    type="checkbox"
                    onChange={updateSameFloor}
                    checked={sameFloor}
                  />
                  On the same floor
                </label>
              </div>
            ) : null}

            <button type="button" className={style.addDestinationButton} onClick={onAddViaPlace}>
              <img className={style.addIcon} src="/images/icons/plus.svg" alt="Add" />
              Add destination
            </button>

            <div className={style.searchButtonContainer}>
              <input type="button" className={style.searchButton} value="GO" onClick={search} />
            </div>
          </div>
        </div>
        {displayAdvancedSearch && (
          <AdvancedSearch
            searchOptionsStore={searchOptionsStore}
            updateSearchOptions={updateSearchOptions}
            search={search}
          />
        )}
      </div>
    );
  }
}

export default SearchPrimaryPanelView;
