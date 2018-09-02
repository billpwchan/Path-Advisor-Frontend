import React from 'react';
import PropTypes from 'prop-types';

const PanelOverlay = ({ headerElements, contentElements, closeOverlayHandler }) => (
  <div>
    Overlay
    <button type="button" onClick={closeOverlayHandler}>
      Close
    </button>
    <div>{headerElements}</div>
    <div>{contentElements}</div>
  </div>
);

PanelOverlay.propTypes = {
  headerElements: PropTypes.node,
  contentElements: PropTypes.node,
  closeOverlayHandler: PropTypes.func.isRequired,
};

export default PanelOverlay;
