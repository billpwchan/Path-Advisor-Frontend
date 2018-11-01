function calDist(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * @param {HTMLElement} el
 * @param {object} handlers
 */
export default function watchPinch(el, handlers) {
  let initDist;
  let endDist;
  let pinching;

  el.addEventListener(
    'touchstart',
    e => {
      if (e.touches.length !== 2) {
        return;
      }

      const firstPoint = e.touches[0];
      const secondPoint = e.touches[1];

      initDist = calDist(
        firstPoint.clientX,
        firstPoint.clientY,
        secondPoint.clientX,
        secondPoint.clientY,
      );

      if (handlers && handlers.start) {
        handlers.start(e, initDist);
      }

      pinching = true;
    },
    false,
  );

  el.addEventListener(
    'touchmove',
    e => {
      if (!pinching) {
        return;
      }

      const firstPoint = e.touches[0];
      const secondPoint = e.touches[1];

      endDist = calDist(
        firstPoint.clientX,
        firstPoint.clientY,
        secondPoint.clientX,
        secondPoint.clientY,
      );

      if (handlers && handlers.moving) {
        handlers.moving(e, endDist / initDist, endDist);
      }
    },
    false,
  );

  el.addEventListener(
    'touchend',
    e => {
      if (!pinching) {
        return;
      }

      pinching = false;

      if (handlers && handlers.end) {
        handlers.end(e, endDist / initDist, endDist);
      }
    },
    false,
  );
}
