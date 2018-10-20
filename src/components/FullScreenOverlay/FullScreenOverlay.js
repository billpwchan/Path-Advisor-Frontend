import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './FullScreenOverlay.module.css';

const FullScreenOverlay = ({ className = undefined, onClick, children, center }) => (
  /* eslint jsx-a11y/click-events-have-key-events: [0] */
  /* eslint jsx-a11y/no-static-element-interactions: [0] */
  <div className={classnames(className, style.body)} onClick={onClick}>
    {center ? <div className={style.center}>{children}</div> : { children }}
  </div>
);

FullScreenOverlay.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  center: PropTypes.bool,
};

export default FullScreenOverlay;
