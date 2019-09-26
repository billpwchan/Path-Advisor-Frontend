import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FloorPrimaryPanelView from './FloorPrimaryPanelView';

const floorProps = {
  meterPerPixel: 1,
  mapWidth: 1,
  mapHeight: 1,
  ratio: 1,
  defaultX: 1,
  defaultY: 1,
  defaultLevel: 1,
  mobileDefaultX: 1,
  mobileDefaultY: 1,
  mobileDefaultLevel: 1,
};
const floorStore = {
  loading: false,
  failure: false,
  success: true,
  buildingIds: ['A', 'B'],
  buildings: {
    A: {
      name: 'A Name',
      floorIds: ['A_1', 'A_2'],
    },
    B: {
      name: 'B Name',
      floorIds: ['B_1', 'B_2'],
    },
  },
  floors: {
    A_1: { buildingId: 'A', name: 'A_1 Name', ...floorProps },
    A_2: { buildingId: 'A', name: 'A_2 Name', ...floorProps },
    B_1: { buildingId: 'B', name: 'B_1 Name', ...floorProps },
    B_2: { buildingId: 'B', name: 'B_2 Name', ...floorProps },
  },
};

describe('FloorPrimaryPanelView', async () => {
  it('Display all floor buttons in default building A', () => {
    const selectedBuilding = 'A';
    const selectBuilding = () => {};
    const selectFloor = () => {};

    const { queryByText } = render(
      <FloorPrimaryPanelView {...{ floorStore, selectBuilding, selectFloor, selectedBuilding }} />,
    );

    const { buildings, floors } = floorStore;
    buildings[selectedBuilding].floorIds.forEach(floorId => {
      const button = queryByText(floors[floorId].name);
      expect(button).toBeInTheDocument();
    });
  });

  it('Click on floor buttons trigger selectFloor with floorId', () => {
    const selectedBuilding = 'A';
    const selectBuilding = () => {};
    const selectFloor = jest.fn();

    const { getByText } = render(
      <FloorPrimaryPanelView {...{ floorStore, selectBuilding, selectFloor, selectedBuilding }} />,
    );

    const { buildings, floors } = floorStore;
    buildings[selectedBuilding].floorIds.forEach(floorId => {
      fireEvent.click(getByText(floors[floorId].name));
      expect(selectFloor).toHaveBeenCalledWith(floorId);
    });
  });

  it('Click on building buttons display floor buttons on the selected floor', () => {
    let selectedBuilding = 'A';
    const selectBuilding = buildingId => {
      selectedBuilding = buildingId;
    };
    const selectFloor = () => {};

    const { queryByText, getByText, rerender } = render(
      <FloorPrimaryPanelView {...{ floorStore, selectBuilding, selectFloor, selectedBuilding }} />,
    );

    fireEvent.click(getByText('B Name'));

    expect(selectedBuilding).toEqual('B');
    rerender(
      <FloorPrimaryPanelView {...{ floorStore, selectBuilding, selectFloor, selectedBuilding }} />,
    );

    const { buildings, floors } = floorStore;
    buildings[selectedBuilding].floorIds.forEach(floorId => {
      const button = queryByText(floors[floorId].name);
      expect(button).toBeInTheDocument();
    });
  });
});
