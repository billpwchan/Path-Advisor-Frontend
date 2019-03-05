import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import FullScreenOverlay from '../FullScreenOverlay/FullScreenOverlay';
import style from './OverlayMessageBox.module.css';

const OverlayMessageBox = ({ className = undefined, children, onClose }) => (
  <FullScreenOverlay className={style.overlayBody} onBodyClick={onClose} center>
    <div className={classnames(style.body, className)}>{children}</div>
  </FullScreenOverlay>
);

OverlayMessageBox.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OverlayMessageBox;
