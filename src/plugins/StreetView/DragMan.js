import dragManImage from './img/Dragman/Yellow_Figure_Right_m.png';
import React from 'react';

// This is the function component for DragMan.

// It is hidden by default(display=="none"), and is displayed only when the parent component
// passes in display=="block".

// The DragMan follows the mouse trajectory of the client,
// this effect is achieved by simple javascript manipulation on HTML elements(see updateDragManPosition), not using React.

// When the DragMan is dropped(onMouseUp), it calls the handle function passed in by the parent.

// Helper function to move DragMan along with client mouse.

const DragManID = 'DragMan';

function updateDragManPosition(e) {
  const dragManObject = document.getElementById(DragManID);
  const height = dragManObject.clientHeight;
  const width = dragManObject.clientWidth;

  dragManObject.style.left = `${e.clientX - width / 2}px`;
  dragManObject.style.top = `${e.clientY - height / 2}px`;
}

function DragMan({ display, buttonClassName, parentHandleDrop }) {
  document.onmousemove = updateDragManPosition;
  const styles = {
    position: 'fixed',
    display: display,
  };

  // We need to communicate with parent when and only when DragMan is dropped.
  return (
    <img
      style={styles}
      id={DragManID}
      className={buttonClassName}
      src={dragManImage}
      onMouseUp={e => parentHandleDrop(e)}
      alt="DragMan"
    />
  );
}

export default DragMan;
