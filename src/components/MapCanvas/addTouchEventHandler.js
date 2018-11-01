let lastTouch = null;

function touchStart(target, e) {
  // e.preventDefault();

  const touches = e.touches;
  lastTouch = touches[0];

  if (e.touches.length === 1) {
    /* simluate mouse down event and fire */
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'mousedown',
      true,
      true,
      window,
      0,
      0,
      0,
      touches[0].clientX,
      touches[0].clientY,
      false,
      false,
      false,
      false,
      0,
      target,
    );

    document.dispatchEvent(evt);
  }
}

function touchMove(target, e) {
  e.preventDefault();

  const touches = e.touches;

  if (touches.length === 1) {
    lastTouch = touches[0];
    /* simluate mouse move event and fire */
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'mousemove',
      true,
      true,
      window,
      0,
      0,
      0,
      touches[0].clientX,
      touches[0].clientY,
      false,
      false,
      false,
      false,
      0,
      target,
    );

    document.dispatchEvent(evt);
  }
}

function touchEnd(target, e) {
  // e.preventDefault();

  /* simluate mouse up event and fire */
  const evt = document.createEvent('MouseEvents');

  evt.initMouseEvent(
    'mouseup',
    true,
    true,
    window,
    0,
    0,
    0,
    lastTouch.clientX,
    lastTouch.clientY,
    false,
    false,
    false,
    false,
    0,
    target,
  );
  document.dispatchEvent(evt);
}

function addTouchEventHandler(target) {
  target.addEventListener('touchstart', e => touchStart(target, e), false);
  target.addEventListener('touchmove', e => touchMove(target, e), false);
  target.addEventListener('touchend', e => touchEnd(target, e), false);
}

export default addTouchEventHandler;
