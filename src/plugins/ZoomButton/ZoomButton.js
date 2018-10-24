import React from 'react';
import classnames from 'classnames';
import plusImage from './plus.png';
import minusImage from './minus.png';
import style from './ZoomButton.module.css';

function ZoomButton({ nextLevel, previousLevel, level: currentLevel, linkTo, platform }) {
  const zoom = level => () => {
    linkTo({ level });
  };

  const buttonClassName = classnames({
    [style.buttonImage]: platform !== 'MOBILE',
    [style.buttonImageMobile]: platform === 'MOBILE',
  });

  return (
    <div className={style.body}>
      <button
        className={classnames(style.button, { [style.disabled]: currentLevel === nextLevel })}
        type="button"
        onClick={zoom(nextLevel)}
      >
        <img className={buttonClassName} src={plusImage} alt="Zoom In" />
      </button>
      <button
        className={classnames(style.button, { [style.disabled]: currentLevel === previousLevel })}
        type="button"
        onClick={zoom(previousLevel)}
      >
        <img className={buttonClassName} src={minusImage} alt="Zoom Out" />
      </button>
    </div>
  );
}

const MapCanvasPlugin = {
  Component: ZoomButton,
  connect: ['nextLevel', 'previousLevel', 'level', 'linkTo', 'platform'],
};

const id = 'zoomButton';
export { id, MapCanvasPlugin };
