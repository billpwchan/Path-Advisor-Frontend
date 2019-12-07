import '@testing-library/jest-dom/extend-expect';
import { parseParams, build } from './Url';
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
        via: null,
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

    it('able to parse via places', () => {
      expect(
        parseParams({
          viaPlaces: 'via$/',
        }).via,
      ).toEqual(null);

      expect(
        parseParams({
          viaPlaces: 'via$/2345',
        }).via,
      ).toStrictEqual(
        ['2345'].map(place => ({
          data: { type: TYPE.KEYWORD, value: place },
          name: place,
        })),
      );

      expect(
        parseParams({
          viaPlaces: 'via$/2345|1234',
        }).via,
      ).toStrictEqual(
        ['2345', '1234'].map(place => ({
          data: { type: TYPE.KEYWORD, value: place },
          name: place,
        })),
      );

      const placeName = 'ROOM 1234';
      const placeId = 'id';
      const floor = '3';
      const coordinates = [1, 2];

      const completePlaceString = `${placeName};${placeId};${floor};${coordinates.join(',')}`;

      expect(
        parseParams({
          viaPlaces: `via$/${completePlaceString}|1234`,
        }).via,
      ).toStrictEqual([
        {
          data: { type: TYPE.ID, value: placeName, id: placeId, coordinates, floor },
          name: placeName,
        },
        {
          data: { type: TYPE.KEYWORD, value: '1234' },
          name: '1234',
        },
      ]);

      expect(
        parseParams({
          viaPlaces: `via$`,
        }).via,
      ).toStrictEqual([EMPTY]);

      expect(
        parseParams({
          viaPlaces: `via$/|1234`,
        }).via,
      ).toStrictEqual([EMPTY, { data: { type: TYPE.KEYWORD, value: '1234' }, name: '1234' }]);
    });
  });

  describe('build url', () => {
    const basicPosition = {
      floor: 'G',
      x: '1',
      y: '2',
      level: '3',
    };
    const basicPositionUrl = '/floor/G/at/normalized/1,2,3';

    it('able to build url with x, y, floor, level given', () => {
      expect(build(basicPosition)).toEqual(basicPositionUrl);
    });

    it('able to build url with from param', () => {
      expect(
        build({
          ...basicPosition,
          from: { data: { type: TYPE.KEYWORD, value: '1234' }, name: '1234' },
        }),
      ).toEqual(`/from/1234/to${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          from: {
            data: { type: TYPE.ID, value: '1234', id: 'id', coordinates: [1, 2], floor: 'G' },
            name: 1234,
          },
        }),
      ).toEqual(`/from/1234;id;G;1,2/to${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          from: {
            data: { type: TYPE.NEAREST, value: 'lift' },
            name: 'lift',
          },
        }),
      ).toEqual(`/nearest/lift/to${basicPositionUrl}`);
    });

    it('able to build url with to param', () => {
      expect(
        build({
          ...basicPosition,
          to: { data: { type: TYPE.KEYWORD, value: '1234' }, name: '1234' },
        }),
      ).toEqual(`/from/to/1234${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          to: {
            data: { type: TYPE.ID, value: '1234', id: 'id', coordinates: [1, 2], floor: 'G' },
            name: 1234,
          },
        }),
      ).toEqual(`/from/to/1234;id;G;1,2${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          to: {
            data: { type: TYPE.NEAREST, value: 'lift' },
            name: 'lift',
          },
        }),
      ).toEqual(`/nearest/lift/from${basicPositionUrl}`);
    });

    it('able to build url with via param', () => {
      const placeName = 'ROOM 1234';
      const placeId = 'id';
      const floor = '3';
      const coordinates = [1, 2];

      const completePlaceString = `${placeName};${placeId};${floor};${coordinates.join(',')}`;

      expect(
        build({
          ...basicPosition,
          via: null,
        }),
      ).toEqual(basicPositionUrl);

      expect(
        build({
          ...basicPosition,
          via: [],
        }),
      ).toEqual(basicPositionUrl);

      expect(
        build({
          ...basicPosition,
          via: [
            {
              data: { type: TYPE.KEYWORD, value: '' },
              name: '',
            },
          ],
        }),
      ).toEqual(`/from/to/via$${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          via: [EMPTY],
        }),
      ).toEqual(`/from/to/via$${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          via: [
            EMPTY,
            {
              data: { type: TYPE.KEYWORD, value: '1234' },
              name: '1234',
            },
          ],
        }),
      ).toEqual(`/from/to/via$/|1234${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          via: [
            {
              data: { type: TYPE.KEYWORD, value: '1234' },
              name: '1234',
            },
            EMPTY,
          ],
        }),
      ).toEqual(`/from/to/via$/1234|${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          via: [
            {
              data: { type: TYPE.KEYWORD, value: '1234' },
              name: '1234',
            },
          ],
        }),
      ).toEqual(`/from/to/via$/1234${basicPositionUrl}`);

      expect(
        build({
          ...basicPosition,
          via: [
            {
              data: { type: TYPE.ID, value: placeName, id: placeId, coordinates, floor },
              name: placeName,
            },
            {
              data: { type: TYPE.KEYWORD, value: '1234' },
              name: '1234',
            },
          ],
        }),
      ).toEqual(`/from/to/via$/${completePlaceString}|1234${basicPositionUrl}`);
    });
  });
});
