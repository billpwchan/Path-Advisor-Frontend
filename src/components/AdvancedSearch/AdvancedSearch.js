import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './AdvancedSearch.module.css';
import { SEARCH_MODES } from '../../reducers/searchAreaInput';

function AdvancedSearch({ searchAreaInputStore, updateSearchOptions, search }) {
  const {
    searchOptions: { noStairCase, noEscalator, searchMode },
  } = searchAreaInputStore;

  const updateSetting = setting => ({ target }) => {
    const updatedSettings = {
      noStairCase,
      noEscalator,
      searchMode,
    };

    updatedSettings[setting] = target.type === 'checkbox' ? target.checked : target.value;

    updateSearchOptions(updatedSettings);

    search();
  };

  return (
    <div className={style.body}>
      <div className={style.head}>Accessibility</div>
      <ul className={style.list}>
        <li>
          <input
            className={style.itemInput}
            type="checkbox"
            checked={noStairCase}
            onChange={updateSetting('noStairCase')}
          />
          <div className={style.itemText}>Do not involve any staircase</div>
        </li>
        <li>
          <input
            className={style.itemInput}
            type="checkbox"
            checked={noEscalator}
            onChange={updateSetting('noEscalator')}
          />
          <div className={style.itemText}>Do not involve any escalator</div>
        </li>
      </ul>

      <div className={classnames(style.head, style.timeAndDistanceHead)}>Time and distance</div>
      <ul className={style.list}>
        <li>
          <input
            className={style.itemInput}
            type="radio"
            checked={searchMode === SEARCH_MODES.SHORTEST_TIME}
            value={SEARCH_MODES.SHORTEST_TIME}
            onChange={updateSetting('searchMode')}
          />
          <div className={style.itemText}>Shortest time</div>
        </li>
        <li>
          <input
            className={style.itemInput}
            type="radio"
            checked={searchMode === SEARCH_MODES.SHORTEST_DISTANCE}
            value={SEARCH_MODES.SHORTEST_DISTANCE}
            onChange={updateSetting('searchMode')}
          />
          <div className={style.itemText}>Shortest distance</div>
        </li>
        <li>
          <input
            className={style.itemInput}
            type="radio"
            checked={searchMode === SEARCH_MODES.MIN_NO_OF_LIFTS}
            value={SEARCH_MODES.MIN_NO_OF_LIFTS}
            onChange={updateSetting('searchMode')}
          />
          <div className={style.itemText}>Involve minimum number of lifts</div>
        </li>
      </ul>
    </div>
  );
}

AdvancedSearch.propTypes = {
  searchAreaInputStore: PropTypes.shape({}).isRequired,
  updateSearchOptions: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
};

export default AdvancedSearch;
