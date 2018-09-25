import React from 'react';
import style from './Legend.module.css';

const pluginId = 'legend';

function Legend({ legends, legendIds }) {
  return (
    <div className={style.body}>
      <div className={style.head}>Legends</div>
      <ul className={style.legendList}>
        {legendIds.map(id => {
          const { name, image } = legends[id];
          return (
            <li key={id}>
              <img className={style.image} src={image} alt={name} />
              <span className={style.text}>{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { pluginId, Legend as PrimaryPanelPlugin };
