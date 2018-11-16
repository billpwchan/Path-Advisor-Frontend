import PropTypes from 'prop-types';
import React from 'react';
import { PLATFORM } from '../Main/detectPlatform';
import style from './TopPanel.module.css';
import SearchArea from '../SearchArea/SearchArea';
import SearchTopPanelView from '../SearchTopPanelView/SearchTopPanelView';
import Floor from '../Floor/Floor';
import FloorTopPanelView from '../FloorTopPanelView/FloorTopPanelView';
import { propTypes as urlPropTypes } from '../Router/Url';
import './TopPanel.css';

function TopPanel({ logger, linkTo, x, y, floor, level, from, to, search }) {
  return (
    <div className={style.body}>
      <SearchArea
        linkTo={linkTo}
        SearchView={SearchTopPanelView}
        from={from}
        to={to}
        search={search}
        logger={logger}
      />
      {floor && (
        <Floor
          selectedBuilding="academicBuilding"
          linkTo={linkTo}
          x={x}
          y={y}
          currentFloorId={floor}
          level={level}
          FloorView={FloorTopPanelView}
          platform={PLATFORM.MOBILE}
        />
      )}
    </div>
  );
}

TopPanel.propTypes = {
  linkTo: PropTypes.func.isRequired,
  logger: PropTypes.func.isRequired,
  ...urlPropTypes,
};

export default TopPanel;
