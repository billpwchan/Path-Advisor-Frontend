import React from 'react';
import classnames from 'classnames';
import plusImage from './plus.png';
import minusImage from './minus.png';
import style from './ZoomButton.module.css';

function ZoomButton({ nextLevel, previousLevel, level: currentLevel, linkTo }) {
  const zoom = level => () => {
    linkTo({ level });
  };

  return (
    <div className={style.body}>
      <button
        className={classnames(style.button, { [style.disabled]: currentLevel === nextLevel })}
        type="button"
        onClick={zoom(nextLevel)}
      >
        <img className={style.buttonImage} src={plusImage} alt="Zoom In" />
      </button>
      <button
        className={classnames(style.button, { [style.disabled]: currentLevel === previousLevel })}
        type="button"
        onClick={zoom(previousLevel)}
      >
        <img className={style.buttonImage} src={minusImage} alt="Zoom Out" />
      </button>
    </div>
  );
}

const MapCanvasPlugin = {
  Component: ZoomButton,
  connect: ['nextLevel', 'previousLevel', 'level', 'linkTo'],
};

const id = 'zoomButton';
export { id, MapCanvasPlugin };
