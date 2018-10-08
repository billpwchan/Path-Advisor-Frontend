const initialState = {
  loading: false,
  failure: false,
  success: true,
  levelToScale: [1.0, 0.85, 0.6, 0.5, 0.4],
  meterPerPixel: 0.0455,
  minutesPerMeter: 0.015,
  defaultPosition: {
    floor: 'Overall',
    x: 936,
    y: 654,
    level: 1,
  },
};

const appSettings = (state = initialState, { type, payload }) => {
  switch (type) {
    default:
      return state;
  }
};

export default appSettings;
