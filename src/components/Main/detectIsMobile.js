export default function detectIsMobile() {
  return (
    typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
  );
}
