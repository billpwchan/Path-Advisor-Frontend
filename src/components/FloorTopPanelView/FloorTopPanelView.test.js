import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FloorTopPanelView from './FloorTopPanelView';

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
      floorIds: ['A_1', 'A_2', 'A_3'],
    },
    B: {
      name: 'B Name',
      floorIds: ['B_1', 'B_2'],
    },
  },
  floors: {
    A_1: { buildingId: 'A', name: 'A_1 Name', ...floorProps },
    A_2: { buildingId: 'A', name: 'A_2 Name', ...floorProps },
    A_3: { buildingId: 'A', name: '3', ...floorProps },
    B_1: { buildingId: 'B', name: 'B_1 Name', ...floorProps },
    B_2: { buildingId: 'B', name: 'B_2 Name', ...floorProps },
  },
};

describe('FloorTopPanelView', () => {
  it('Display current floor name in the button', () => {
    const selectedBuilding = 'A';
    const selectFloor = () => {};
    const currentFloorId = 'A_1';

    const { queryByText } = render(
      <FloorTopPanelView {...{ floorStore, selectFloor, selectedBuilding, currentFloorId }} />,
    );

    const button = queryByText(floorStore.floors[currentFloorId].name);
    expect(button).toBeInTheDocument();
  });

  it('Display current floor name in the button with /F suffix if name is a number', () => {
    const selectedBuilding = 'A';
    const selectFloor = () => {};
    const currentFloorId = 'A_3';

    const { queryByText } = render(
      <FloorTopPanelView {...{ floorStore, selectFloor, selectedBuilding, currentFloorId }} />,
    );

    const button = queryByText(`${floorStore.floors[currentFloorId].name}/F`);
    expect(button).toBeInTheDocument();
  });

  it('Should not display buttons in modal for floors by default', () => {
    const selectedBuilding = 'A';
    const selectFloor = () => {};
    const currentFloorId = 'A_1';

    const { queryByText } = render(
      <FloorTopPanelView {...{ floorStore, selectFloor, selectedBuilding, currentFloorId }} />,
    );

    const modalTitle = queryByText('Floor');
    expect(modalTitle).not.toBeInTheDocument();
  });

  it('Display floor buttons in modal on clicking expand button', () => {
    const selectedBuilding = 'B';
    const selectFloor = () => {};
    const currentFloorId = 'B_1';

    const { queryByText, getByText, getAllByText } = render(
      <FloorTopPanelView {...{ floorStore, selectFloor, selectedBuilding, currentFloorId }} />,
    );

    fireEvent.click(getByText(floorStore.floors[currentFloorId].name));

    const modalTitle = queryByText('Floor');
    expect(modalTitle).toBeInTheDocument();

    const { floors, buildings } = floorStore;
    buildings[selectedBuilding].floorIds.forEach(floorId => {
      const button =
        floorId === currentFloorId
          ? // first button with current floor Id name is the expand button
            getAllByText(floors[floorId].name)[1]
          : getByText(floors[floorId].name);
      expect(button).toBeInTheDocument();
    });
  });

  it('Switch to floor on clicking floor buttons in modal', () => {
    const selectedBuilding = 'B';
    const selectFloor = jest.fn();
    const currentFloorId = 'B_1';

    const { queryByText, getByText } = render(
      <FloorTopPanelView {...{ floorStore, selectFloor, selectedBuilding, currentFloorId }} />,
    );

    // show the modal
    fireEvent.click(getByText(floorStore.floors[currentFloorId].name));

    const clickFloorId = 'B_2';
    const floor = floorStore.floors[clickFloorId];
    fireEvent.click(getByText(floor.name));

    expect(selectFloor).toHaveBeenCalledWith(clickFloorId);

    // popup modal close after clicking
    const modalTitle = queryByText('Floor');
    expect(modalTitle).not.toBeInTheDocument();
  });
});
