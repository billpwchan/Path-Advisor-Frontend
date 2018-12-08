const levelToScale = [1.0, 0.85, 0.6, 0.5, 0.4];
const initialState = {
  loading: false,
  failure: false,
  success: true,
  levelToScale,
  highestLevel: levelToScale.length - 1,
  lowestLevel: 0,
  meterPerPixel: 0.0455,
  minutesPerMeter: 0.015,
  defaultPosition: {
    floor: 'Overall',
    x: 936,
    y: 654,
    level: 3,
  },
  mobileDefaultPosition: {
    floor: 'G',
    x: 2162,
    y: 1263,
    level: 4,
  },
};

const appSettings = (state = initialState, { type }) => {
  switch (type) {
    default:
      return state;
  }
};

export default appSettings;
