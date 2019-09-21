import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdvancedSearch from './AdvancedSearch';
import { SEARCH_MODES } from '../../reducers/searchOptions';

const initialSearchOptionsStore = {
  noStairCase: false,
  noEscalator: false,
  searchMode: '',
};

describe('AdvancedSearch', () => {
  it('click on No staircase checkbox should set settings with noStairCase=true', () => {
    const updateSearchOptions = jest.fn();
    const search = jest.fn();
    const searchOptionsStore = { ...initialSearchOptionsStore };

    const { getByLabelText } = render(
      <AdvancedSearch {...{ searchOptionsStore, updateSearchOptions, search }} />,
    );

    const checkbox = getByLabelText('Do not involve any staircase');
    expect(checkbox.checked).toEqual(false);

    fireEvent.click(checkbox);

    expect(updateSearchOptions).toHaveBeenCalledWith({
      ...initialSearchOptionsStore,
      noStairCase: true,
    });
    expect(search).toHaveBeenCalledTimes(1);
  });

  it('click on No escalator checkbox should set settings with noEscalator=true', () => {
    const updateSearchOptions = jest.fn();
    const search = jest.fn();
    const searchOptionsStore = { ...initialSearchOptionsStore };

    const { getByLabelText } = render(
      <AdvancedSearch {...{ searchOptionsStore, updateSearchOptions, search }} />,
    );

    const checkbox = getByLabelText('Do not involve any escalator');
    expect(checkbox.checked).toEqual(false);

    fireEvent.click(checkbox);

    expect(updateSearchOptions).toHaveBeenCalledWith({
      ...initialSearchOptionsStore,
      noEscalator: true,
    });
    expect(search).toHaveBeenCalledTimes(1);
  });

  [
    { label: 'Shortest time', searchMode: SEARCH_MODES.SHORTEST_TIME },
    { label: 'Shortest distance', searchMode: SEARCH_MODES.SHORTEST_DISTANCE },
    { label: 'Involve minimum number of lifts', searchMode: SEARCH_MODES.MIN_NO_OF_LIFTS },
  ].forEach(({ label, searchMode }) => {
    it(`click on ${label} radio button should update settings searchMode=${searchMode}`, () => {
      const updateSearchOptions = jest.fn();
      const search = jest.fn();
      const searchOptionsStore = { ...initialSearchOptionsStore };

      const { getByLabelText } = render(
        <AdvancedSearch {...{ searchOptionsStore, updateSearchOptions, search }} />,
      );

      const checkbox = getByLabelText(label);
      expect(checkbox.checked).toEqual(false);

      fireEvent.click(checkbox);

      expect(updateSearchOptions).toHaveBeenCalledWith({
        ...initialSearchOptionsStore,
        searchMode,
      });
      expect(search).toHaveBeenCalledTimes(1);
    });
  });
});
