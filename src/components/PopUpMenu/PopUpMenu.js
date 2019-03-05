import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import FullScreenOverlay from '../FullScreenOverlay/FullScreenOverlay';
import style from './PopUpMenu.module.css';

const PopUpMenu = ({ title, items, onClose, selectedIndex = undefined, className = undefined }) => (
  <FullScreenOverlay onBodyClick={onClose} center>
    <div className={classnames(style.body, className)}>
      <div className={style.header}>{title}</div>
      <ul>
        {items.map((item, i) => (
          /* eslint react/no-array-index-key: [0] */
          <li
            key={i}
            className={classnames(style.item, { [style.itemSelected]: selectedIndex === i })}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  </FullScreenOverlay>
);

PopUpMenu.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  selectedIndex: PropTypes.number,
};

export default PopUpMenu;
