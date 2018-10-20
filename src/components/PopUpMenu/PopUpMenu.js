import React from 'react';
import PropTypes from 'prop-types';
import FullScreenOverlay from '../FullScreenOverlay/FullScreenOverlay';
import style from './PopUpMenu.module.css';

const PopUpMenu = ({ title, items, onClose }) => (
  <FullScreenOverlay onClick={onClose} center>
    <ul className={style.body}>
      <li className={style.header}>{title}</li>
      {items.map(({ image, label, onClick }) => (
        <li key={label} className={style.item}>
          <button type="button" className={style.button} onClick={onClick}>
            <img className={style.icon} src={image} alt={label} />
            <span className={style.text}>{label}</span>
          </button>
        </li>
      ))}
    </ul>
  </FullScreenOverlay>
);

PopUpMenu.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PopUpMenu;
