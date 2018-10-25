import React from 'react';
import PropTypes from 'prop-types';
import style from './MapItemDesktopOverlayContent.module.css';
import MapItemOverlayContent from './MapItemOverlayContent';

const MapItemDesktopOverlayContent = ({ name, photo, url, others }) => (
  <MapItemOverlayContent name={name} photo={photo} url={url} others={others} style={style} />
);

MapItemDesktopOverlayContent.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string,
  url: PropTypes.string,
  others: PropTypes.shape({}),
};

export default {
  connect: [],
  Component: MapItemDesktopOverlayContent,
};
