import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NearestResult } from './NearestResult';

describe('NearestResult plugin', () => {
  it('should render loading text if search is loading', () => {
    const searchNearestStore = { loading: true };
    const { queryByText } = render(<NearestResult {...{ searchNearestStore }} />);
    expect(queryByText('Please wait...')).toBeInTheDocument();
  });

  it('should render failure message if search has failed', () => {
    const { queryByText, rerender } = render(
      <NearestResult searchNearestStore={{ loading: true }} />,
    );
    rerender(
      <NearestResult
        searchNearestStore={{ loading: false, failure: true }}
        searchOptionsStore={{}}
      />,
    );

    expect(queryByText('Sorry, no result found.')).toBeInTheDocument();
  });

  it('should render nearest information if search has succeed', () => {
    const { queryByText, rerender } = render(
      <NearestResult searchNearestStore={{ loading: true }} />,
    );

    const linkTo = jest.fn();

    const searchNearestStore = {
      loading: false,
      success: true,
      nearest: {
        coordinates: [1, 2],
        type: 'lift',
        name: 'Lift 1',
        id: '0',
        floor: '1',
      },
      from: {
        coordinates: [3, 4],
        type: null,
        name: 'ROOM 1234',
        id: '1',
        floor: 'G',
      },
    };

    const floorStore = {
      floors: {
        G: {
          name: 'G',
          buildingId: 'A',
        },
        1: {
          name: '1',
          buildingId: 'A',
        },
      },
      buildingIds: ['A'],
      buildings: {
        A: {
          name: 'Building A',
          floorIds: ['G'],
        },
      },
    };

    rerender(
      <NearestResult
        searchNearestStore={searchNearestStore}
        floorStore={floorStore}
        searchOptionsStore={{}}
        linkTo={linkTo}
      />,
    );

    expect(queryByText('Please wait...')).not.toBeInTheDocument();

    const fromFloorId = searchNearestStore.from.floor;
    expect(
      queryByText(
        `Nearest ${searchNearestStore.nearest.type} from ${searchNearestStore.from.name} (Floor ${
          floorStore.floors[fromFloorId].name
        }, ${floorStore.buildings[floorStore.floors[fromFloorId].buildingId].name})`,
      ),
    ).toBeInTheDocument();

    const nearestFloorId = searchNearestStore.nearest.floor;
    const nearestItem = queryByText(
      `${searchNearestStore.nearest.name} (Floor ${floorStore.floors[nearestFloorId].name}, ${
        floorStore.buildings[floorStore.floors[nearestFloorId].buildingId].name
      })`,
    );

    expect(nearestItem).toBeInTheDocument();
    fireEvent.click(nearestItem);

    expect(linkTo).toHaveBeenCalledWith({
      x: searchNearestStore.nearest.coordinates[0],
      y: searchNearestStore.nearest.coordinates[1],
      floor: searchNearestStore.nearest.floor,
    });
  });
});
