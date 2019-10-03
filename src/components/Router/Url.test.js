import '@testing-library/jest-dom/extend-expect';
import { object } from 'prop-types';
import { parseParams } from './Url';
import { TYPE, EMPTY } from '../SearchArea/Input';
import { nearestOptions } from '../SearchNearest/SearchNearest';

describe('Url', () => {
  describe('parseParams', () => {
    it('able to parse empty params', () => {
      expect(parseParams({}, '', 'DESKTOP', {})).toStrictEqual({
        isFromNormalized: true,
        floor: undefined,
        from: EMPTY,
        to: EMPTY,
        level: undefined,
        search: false,
        suggestion: undefined,
        suggestionX: null,
        suggestionY: null,
        x: undefined,
        y: undefined,
      });
    });

    it('able to parse search param', () => {
      expect(parseParams({ search: 'search' }, '', 'DESKTOP', {}).search).toEqual(true);
    });

    [['fromPlace', 'from'], ['toPlace', 'to']].forEach(([placeProp, place]) => {
      it(`able to parse ${place}`, () => {
        const placeName = 'ROOM 1234';
        expect(parseParams({ [placeProp]: placeName }, '', 'DESKTOP', {})[place]).toStrictEqual({
          data: { type: TYPE.KEYWORD, value: placeName },
          name: placeName,
        });

        const placeId = 'id';
        const floor = '3';
        const coordinates = [1, 2];

        const inCompletePlaceString = `${placeName};${placeId};;;`;
        expect(
          parseParams({ [placeProp]: inCompletePlaceString }, '', 'DESKTOP', {})[place],
        ).toStrictEqual({
          data: { type: TYPE.KEYWORD, value: placeName },
          name: placeName,
        });

        const completePlaceString = `${placeName};${placeId};${floor};${coordinates.join(',')}`;
        expect(
          parseParams({ [placeProp]: completePlaceString }, '', 'DESKTOP', {})[place],
        ).toStrictEqual({
          data: { type: TYPE.ID, value: placeName, id: placeId, coordinates, floor },
          name: placeName,
        });
      });
    });

    it('able to parse floorPath and coordinatePath', () => {
      const coordinatePath = 'at/normalized/1,2,3';
      const floorPath = 'floor/G/';

      const { x, y, level, floor } = parseParams({ floorPath, coordinatePath });
      expect(x).toBe(1);
      expect(y).toBe(2);
      expect(level).toBe(3);
      expect(floor).toBe('G');
    });

    it('able to parse query string', () => {
      const { from, to } = parseParams({}, '?roomno=1234');
      expect(from).toStrictEqual({
        data: { type: TYPE.KEYWORD, value: '1234' },
        name: '1234',
      });

      expect(to).toStrictEqual(nearestOptions.lift);
    });

    it('able to parse nearest type', () => {
      Object.keys(nearestOptions).forEach(nearestId => {
        const { from } = parseParams({ fromNearestType: nearestId });
        expect(from).toStrictEqual(nearestOptions[nearestId]);
      });

      Object.keys(nearestOptions).forEach(nearestId => {
        const { to } = parseParams({ toNearestType: nearestId });
        expect(to).toStrictEqual(nearestOptions[nearestId]);
      });
    });

    it('able to parse suggestion path', () => {
      const { suggestion, suggestionX, suggestionY } = parseParams({
        suggestionPath: 'suggestion/general',
      });
      expect(suggestion).toBe('general');
      expect(suggestionX).toBe(null);
      expect(suggestionY).toBe(null);
    });

    it('able to parse suggestion coordinates path', () => {
      const { suggestion, suggestionX, suggestionY } = parseParams({
        suggestionPath: 'suggestion/general',
        suggestionCoordinatePath: 'at/2,3',
      });
      expect(suggestion).toBe('general');
      expect(suggestionX).toBe(2);
      expect(suggestionY).toBe(3);
    });
  });
});
