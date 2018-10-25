import React from 'react';
import PropTypes from 'prop-types';
import style from './MapItemMobileOverlayContent.module.css';
import MapItemOverlayContent from './MapItemOverlayContent';

const MapItemMobileOverlayContent = ({ name, photo, url, others }) => (
  <MapItemOverlayContent name={name} photo={photo} url={url} others={others} style={style} />
);

MapItemMobileOverlayContent.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string,
  url: PropTypes.string,
  others: PropTypes.shape({}),
};

export default {
  connect: [],
  Component: MapItemMobileOverlayContent,
};
