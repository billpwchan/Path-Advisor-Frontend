import React from 'react';
import PropTypes from 'prop-types';

function MapItemOverlayHeader({ style, name }) {
  return <h1 className={style.title}>{name}</h1>;
}

MapItemOverlayHeader.propTypes = {
  style: PropTypes.shape({ title: PropTypes.string.isRequired }).isRequired,
  name: PropTypes.string.isRequired,
};

export default MapItemOverlayHeader;
