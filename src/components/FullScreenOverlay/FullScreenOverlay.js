import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import style from './FullScreenOverlay.module.css';

const FullScreenOverlay = ({
  className = undefined,
  onBodyClick,
  children,
  center = false,
  onCloseIconClick = null,
}) => (
  /* eslint jsx-a11y/click-events-have-key-events: [0] */
  /* eslint jsx-a11y/no-static-element-interactions: [0] */
  <div
    className={classnames(className, style.body, { [style.bodyCenter]: center })}
    onClick={onBodyClick}
  >
    {onCloseIconClick ? (
      <button type="button" onClick={onCloseIconClick} className={style.close}>
        ×
      </button>
    ) : null}
    {center ? <div className={style.center}>{children}</div> : children}
  </div>
);

FullScreenOverlay.propTypes = {
  className: PropTypes.string,
  onBodyClick: PropTypes.func,
  children: PropTypes.node,
  center: PropTypes.bool,
  onCloseIconClick: PropTypes.func,
};

export default FullScreenOverlay;
