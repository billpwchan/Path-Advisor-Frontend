import classnames from 'classnames';
import React from 'react';

import style from './FloorButton.module.css';

function FloorButton() {
  return (
    <button type="button">
      <div className="topPanel__tabLeft" />
      <div className={classnames('topPanel__tabSpace', style.space)} />
      <div className={style.icon} style={{ backgroundImage: 'url(/images/mobile/G.png)' }} />
      <div className={classnames('topPanel__tabSpace', style.space)} />
      <div className="topPanel__tabRight" />
    </button>
  );
}

export default FloorButton;
