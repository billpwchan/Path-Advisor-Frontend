import PropTypes from 'prop-types';
import React from 'react';
import style from './TopPanel.module.css';
import SearchArea from '../SearchArea/SearchArea';
import SearchTopPanelView from '../SearchTopPanelView/SearchTopPanelView';
import FloorButton from '../FloorButton/FloorButton';

import './TopPanel.css';

function TopPanel({ linkTo }) {
  return (
    <div className={style.body}>
      <SearchArea linkTo={linkTo} SearchView={SearchTopPanelView} />
      <FloorButton />
    </div>
  );
}

TopPanel.propTypes = {
  linkTo: PropTypes.func.isRequired,
};

export default TopPanel;
