import React from 'react';
import PropTypes from 'prop-types';
import style from './MapItemDesktopOverlayHeader.module.css';
import MapItemOverlayHeader from './MapItemOverlayHeader';

const MapItemDesktopOverlayHeader = ({ name }) => (
  <MapItemOverlayHeader name={name} style={style} />
);

MapItemDesktopOverlayHeader.propTypes = {
  name: PropTypes.string.isRequired,
};

export default {
  connect: [],
  Component: MapItemDesktopOverlayHeader,
};
