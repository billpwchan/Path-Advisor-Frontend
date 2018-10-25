import React from 'react';
import PropTypes from 'prop-types';
import style from './MapItemMobileOverlayHeader.module.css';
import MapItemOverlayHeader from './MapItemOverlayHeader';

const MapItemMobileOverlayHeader = ({ name }) => <MapItemOverlayHeader name={name} style={style} />;

MapItemMobileOverlayHeader.propTypes = {
  name: PropTypes.string.isRequired,
};

export default {
  connect: [],
  Component: MapItemMobileOverlayHeader,
};
