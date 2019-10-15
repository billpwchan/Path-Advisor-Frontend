import React, { Children } from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchNearest, { nearestOptions } from './SearchNearest';

describe('SearchNearest', () => {
  it('Should display input value from prop', () => {
    const onNearestItemClick = () => {};
    const direction = 'from';
    const value = 'ROOM 1234';

    const { queryByDisplayValue } = render(
      <SearchNearest {...{ onNearestItemClick, direction, value }} />,
    );

    const input = queryByDisplayValue(value);
    expect(input).toBeInTheDocument();
  });

  it('click on input should show menu', () => {
    const onNearestItemClick = () => {};
    const direction = 'from';
    const value = 'ROOM 1234';

    const { getByDisplayValue, queryByText } = render(
      <SearchNearest {...{ onNearestItemClick, direction, value }} />,
    );

    expect(queryByText(nearestOptions.lift.name)).not.toBeInTheDocument();

    fireEvent.click(getByDisplayValue(value));
    expect(queryByText(nearestOptions.lift.name)).toBeInTheDocument();
  });

  it('click on menu item should trigger onNearestItemClick and hide menu', () => {
    const onNearestItemClick = jest.fn();
    const direction = 'from';
    const value = 'ROOM 1234';

    const { getByDisplayValue, getByText } = render(
      <SearchNearest {...{ onNearestItemClick, direction, value }} />,
    );

    // show menu
    fireEvent.click(getByDisplayValue(value));

    // click on menu item
    fireEvent.click(getByText(nearestOptions.lift.name));

    expect(onNearestItemClick).toHaveBeenCalledWith({
      name: nearestOptions.lift.name,
      data: nearestOptions.lift.data,
    });
  });

  it('click on menu should show sub menu items', () => {
    const onNearestItemClick = jest.fn();
    const direction = 'from';
    const value = 'ROOM 1234';

    const { getByDisplayValue, getByText, queryByText } = render(
      <SearchNearest {...{ onNearestItemClick, direction, value }} />,
    );

    // show menu
    fireEvent.click(getByDisplayValue(value));

    // click on menu item
    fireEvent.click(getByText('Nearest toilet'));

    expect(onNearestItemClick).toHaveBeenCalledTimes(0);

    const subItem = queryByText(nearestOptions.maleToilet.name);
    expect(subItem).toBeInTheDocument();

    fireEvent.click(subItem);

    expect(onNearestItemClick).toHaveBeenCalledWith({
      name: nearestOptions.maleToilet.name,
      data: nearestOptions.maleToilet.data,
    });
  });

  it('should show children provided in menu', () => {
    const onNearestItemClick = jest.fn();
    const direction = 'from';
    const value = 'ROOM 1234';

    const CustomChildren = ({ onClickHook }) => (
      <button type="button" onClick={onClickHook}>
        Custom children
      </button>
    );

    const { getByDisplayValue, queryByText } = render(
      <SearchNearest {...{ onNearestItemClick, direction, value }}>
        <CustomChildren />
      </SearchNearest>,
    );

    // show menu
    fireEvent.click(getByDisplayValue(value));

    const child = queryByText('Custom children');
    expect(child).toBeInTheDocument();
  });

  it('clicking on custom children should hide the menu', () => {
    const onNearestItemClick = jest.fn();
    const direction = 'from';
    const value = 'ROOM 1234';

    const CustomChildren = ({ onClickHook }) => (
      <button type="button" onClick={onClickHook}>
        Custom children
      </button>
    );

    const { getByDisplayValue, getByText } = render(
      <SearchNearest {...{ onNearestItemClick, direction, value }}>
        <CustomChildren />
      </SearchNearest>,
    );

    // show menu
    fireEvent.click(getByDisplayValue(value));

    const child = getByText('Custom children');
    expect(child).toBeInTheDocument();
    fireEvent.click(child);
    expect(child).not.toBeInTheDocument();
  });
});
