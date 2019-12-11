import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './AdvancedSearch.module.css';
import { searchOptionsPropTypes, SEARCH_MODES } from '../../reducers/searchOptions';

function AdvancedSearch({ searchOptionsStore, updateSearchOptions, search }) {
  const { noStairCase, noEscalator, searchMode, stepFreeAccess } = searchOptionsStore;

  const updateSetting = setting => ({ target }) => {
    const updatedSettings = {
      noStairCase,
      noEscalator,
      stepFreeAccess,
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
            id="stepFreeAccessOption"
            className={style.itemInput}
            type="checkbox"
            checked={stepFreeAccess}
            onChange={updateSetting('stepFreeAccess')}
          />
          <label htmlFor="stepFreeAccessOption" className={style.itemText}>
            Step free access
          </label>
          <div className={style.optionDesc}>Completely step free and wheelchair user friendly.</div>
        </li>

        <li>
          <input
            id="noStairCaseOption"
            className={style.itemInput}
            type="checkbox"
            checked={noStairCase || stepFreeAccess}
            onChange={updateSetting('noStairCase')}
            disabled={stepFreeAccess}
          />
          <label htmlFor="noStairCaseOption" className={style.itemText}>
            Do not involve any staircase
          </label>
          <div className={style.optionDesc}>This does not exclude steps on the same floor.</div>
        </li>
        <li>
          <input
            id="noEscalatorOption"
            className={style.itemInput}
            type="checkbox"
            checked={noEscalator || stepFreeAccess}
            disabled={stepFreeAccess}
            onChange={updateSetting('noEscalator')}
          />
          <label htmlFor="noEscalatorOption" className={style.itemText}>
            Do not involve any escalator
          </label>
        </li>
      </ul>

      <div className={classnames(style.head, style.timeAndDistanceHead)}>Time and distance</div>
      <ul className={style.list}>
        <li>
          <input
            id="shortestTimeOption"
            className={style.itemInput}
            type="radio"
            checked={searchMode === SEARCH_MODES.SHORTEST_TIME}
            value={SEARCH_MODES.SHORTEST_TIME}
            onChange={updateSetting('searchMode')}
          />
          <label htmlFor="shortestTimeOption" className={style.itemText}>
            Shortest time
          </label>
        </li>
        <li>
          <input
            id="shortestDistanceOption"
            className={style.itemInput}
            type="radio"
            checked={searchMode === SEARCH_MODES.SHORTEST_DISTANCE}
            value={SEARCH_MODES.SHORTEST_DISTANCE}
            onChange={updateSetting('searchMode')}
          />
          <label htmlFor="shortestDistanceOption" className={style.itemText}>
            Shortest distance
          </label>
        </li>
        <li>
          <input
            id="minOfLiftOption"
            className={style.itemInput}
            type="radio"
            checked={searchMode === SEARCH_MODES.MIN_NO_OF_LIFTS}
            value={SEARCH_MODES.MIN_NO_OF_LIFTS}
            onChange={updateSetting('searchMode')}
          />
          <label htmlFor="minOfLiftOption" className={style.itemText}>
            Involve minimum number of lifts
          </label>
        </li>
      </ul>
    </div>
  );
}

AdvancedSearch.propTypes = {
  searchOptionsStore: searchOptionsPropTypes.isRequired,
  updateSearchOptions: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
};

export default AdvancedSearch;
