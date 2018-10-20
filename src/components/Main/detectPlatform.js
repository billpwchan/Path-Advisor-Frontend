export const PLATFORM = {
  MOBILE: 'MOBILE',
  DESKTOP: 'DESKTOP',
};

export default function detectPlatform() {
  return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
    ? PLATFORM.DESKTOP
    : PLATFORM.MOBILE;
}
