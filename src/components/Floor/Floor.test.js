import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Floor } from './Floor';
import { PLATFORM } from '../Main/detectPlatform';

const FloorView = () => null;

const floorProps = {
  meterPerPixel: 1,
  mapWidth: 1,
  mapHeight: 1,
  ratio: 1,
  defaultX: 1,
  defaultY: 1,
  defaultLevel: 1,
  mobileDefaultX: 4,
  mobileDefaultY: 4,
  mobileDefaultLevel: 4,
};
const floorStore = {
  loading: false,
  failure: false,
  success: true,
  buildingIds: ['A', 'B', 'C'],
  buildings: {
    A: {
      name: 'A Name',
      floorIds: ['A_1', 'A_2'],
    },
    B: {
      name: 'B Name',
      floorIds: ['B_1', 'B_2'],
    },
    C: {
      name: 'C Name',
      floorIds: ['C_1'],
    },
    academicBuilding: {
      name: 'Academic building name',
      floorIds: ['1', '2', 'LG1', 'LG2'],
    },
  },
  floors: {
    A_1: { buildingId: 'A', name: 'A_1 Name', ...floorProps },
    A_2: { buildingId: 'A', name: 'A_2 Name', ...floorProps },
    B_1: { buildingId: 'B', name: 'B_1 Name', ...floorProps },
    B_2: { buildingId: 'B', name: 'B_2 Name', ...floorProps },
    C_1: { buildingId: 'C', name: 'C_1 Name', ...floorProps },
    1: { buildingId: 'academicBuilding', name: '1 Name', ...floorProps },
    2: { buildingId: 'academicBuilding', name: '2 Name', ...floorProps },
    LG1: { buildingId: 'academicBuilding', name: 'LG1 Name', ...floorProps },
    LG2: { buildingId: 'academicBuilding', name: 'LG2 Name', ...floorProps },
  },
};

const props = {
  platform: PLATFORM.DESKTOP,
  floorStore,
  x: 2,
  y: 2,
  level: 2,
  currentFloorId: 'A_1',
  selectedBuilding: 'A',
  FloorView,
};

describe('Floor', () => {
  describe('selectBuilding', () => {
    it('should call linkTo if building has only one floor', () => {
      const linkTo = jest.fn();
      const selectedBuilding = 'C';
      const component = TestRenderer.create(<Floor {...props} linkTo={linkTo} />);
      component.getInstance().selectBuilding(selectedBuilding)();
      expect(linkTo).toHaveBeenCalledWith({
        x: floorProps.defaultX,
        y: floorProps.defaultY,
        floor: floorStore.buildings[selectedBuilding].floorIds[0],
        level: floorProps.defaultLevel,
      });
    });

    it('should not call linkTo if building has more than one floors', () => {
      const linkTo = jest.fn();
      const selectedBuilding = 'B';
      const component = TestRenderer.create(<Floor {...props} linkTo={linkTo} />);
      component.getInstance().selectBuilding(selectedBuilding)();
      expect(linkTo).toHaveBeenCalledTimes(0);
    });

    it('should call selectBuildingAction if provided', () => {
      const selectBuildingAction = jest.fn();
      const selectedBuilding = 'B';
      const component = TestRenderer.create(
        <Floor {...props} linkTo={() => {}} selectBuildingAction={selectBuildingAction} />,
      );
      component.getInstance().selectBuilding(selectedBuilding)();
      expect(selectBuildingAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectFloor', () => {
    it('should use same coordinate if selected floor in same building', () => {
      const linkTo = jest.fn();
      const selectedFloor = 'A_2';
      const component = TestRenderer.create(<Floor {...props} linkTo={linkTo} />);
      component.getInstance().selectFloor(selectedFloor)();
      expect(linkTo).toHaveBeenCalledWith({
        x: props.x,
        y: props.y,
        floor: selectedFloor,
        level: props.level,
      });
    });

    describe('if selected floor in different building', () => {
      it('should use default coordinate', () => {
        const linkTo = jest.fn();
        const selectedFloor = 'B_1';
        const component = TestRenderer.create(<Floor {...props} linkTo={linkTo} />);
        component.getInstance().selectFloor(selectedFloor)();
        expect(linkTo).toHaveBeenCalledWith({
          x: floorProps.defaultX,
          y: floorProps.defaultY,
          floor: selectedFloor,
          level: floorProps.defaultLevel,
        });
      });

      it('should use mobile default coordinate if platform is mobile', () => {
        const linkTo = jest.fn();
        const selectedFloor = 'B_1';
        const component = TestRenderer.create(
          <Floor {...{ ...props, platform: PLATFORM.MOBILE }} linkTo={linkTo} />,
        );

        component.getInstance().selectFloor(selectedFloor)();
        expect(linkTo).toHaveBeenCalledWith({
          x: floorProps.mobileDefaultX,
          y: floorProps.mobileDefaultX,
          floor: selectedFloor,
          level: floorProps.mobileDefaultLevel,
        });
      });
    });

    it('should use default coordinate if select floor from non-number to non-number floor in academic building ', () => {
      const currentFloorId = 'LG1';
      const selectedFloor = '2';

      const linkTo = jest.fn();

      const component = TestRenderer.create(
        <Floor {...{ ...props, currentFloorId }} linkTo={linkTo} />,
      );

      component.getInstance().selectFloor(selectedFloor)();
      expect(linkTo).toHaveBeenCalledWith({
        x: floorProps.defaultX,
        y: floorProps.defaultY,
        floor: selectedFloor,
        level: floorProps.defaultLevel,
      });
    });

    it('should use same coordinate if select floor from number to number floor in academic building ', () => {
      const currentFloorId = '1';
      const selectedFloor = '2';

      const linkTo = jest.fn();

      const component = TestRenderer.create(
        <Floor {...{ ...props, currentFloorId }} linkTo={linkTo} />,
      );

      component.getInstance().selectFloor(selectedFloor)();
      expect(linkTo).toHaveBeenCalledWith({
        x: props.x,
        y: props.y,
        floor: selectedFloor,
        level: props.level,
      });
    });
  });
});
