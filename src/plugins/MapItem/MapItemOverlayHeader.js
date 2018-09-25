import React from 'react';
import PropTypes from 'prop-types';
import style from './MapItemOverlayHeader.module.css';

function MapItemOverlayHeader({ name }) {
  return <h1 className={style.title}>{name}</h1>;
}

MapItemOverlayHeader.propTypes = {
  name: PropTypes.string.isRequired,
};

export default MapItemOverlayHeader;
