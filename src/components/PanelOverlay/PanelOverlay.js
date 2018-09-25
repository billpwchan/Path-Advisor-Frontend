import React from 'react';
import PropTypes from 'prop-types';
import style from './PanelOverlay.module.css';

const PanelOverlay = ({ headerElements, contentElements, closeOverlayHandler }) => (
  <div>
    <button type="button" onClick={closeOverlayHandler} className={style.close}>
      ×
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
