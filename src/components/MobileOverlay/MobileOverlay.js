import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FullScreenOverlay from '../FullScreenOverlay/FullScreenOverlay';
import style from './MobileOverlay.module.css';
import { closeOverlayAction } from '../../reducers/overlay';

const MobileOverlay = ({ overlayStore, closeOverlayHandler, children = [] }) => {
  const { open, photo, name, url, others } = overlayStore;
  return open ? (
    <FullScreenOverlay className={style.overlayBody} onClick={closeOverlayHandler}>
      {children.map(({ id, MobileOverlayHeaderPlugin }) => {
        if (!MobileOverlayHeaderPlugin || !MobileOverlayHeaderPlugin.Component) {
          return null;
        }
        return (
          <MobileOverlayHeaderPlugin.Component
            key={`header_${id}`}
            name={name}
            photo={photo}
            url={url}
            others={others}
          />
        );
      })}

      {children.map(({ id, MobileOverlayContentPlugin }) => {
        if (!MobileOverlayContentPlugin || !MobileOverlayContentPlugin.Component) {
          return null;
        }
        return (
          <MobileOverlayContentPlugin.Component
            key={`header_${id}`}
            name={name}
            photo={photo}
            url={url}
            others={others}
          />
        );
      })}
    </FullScreenOverlay>
  ) : null;
};

MobileOverlay.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      MobileOverlayHeaderPlugin: PropTypes.element,
      MobileOverlayContentPlugin: PropTypes.element,
    }),
  ),
  overlayStore: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    photo: PropTypes.string,
    name: PropTypes.string,
    url: PropTypes.string,
    others: PropTypes.object,
  }).isRequired,
  closeOverlayHandler: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    overlayStore: state.overlay,
  }),
  dispatch => ({
    closeOverlayHandler: () => {
      dispatch(closeOverlayAction());
    },
  }),
)(MobileOverlay);
