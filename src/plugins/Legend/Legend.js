import React from 'react';
import style from './Legend.module.css';

function Legend({ legendStore: { legends, legendIds } }) {
  console.log('Legend rendered');
  return (
    <div className={style.body}>
      <div className={style.head}>Legends</div>
      <ul className={style.legendList}>
        {legendIds.map(id => {
          const { name, image } = legends[id];
          return image ? (
            <li key={id}>
              <img className={style.image} src={image} alt={name} />
              <span className={style.text}>{name}</span>
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
}

const PrimaryPanelPlugin = {
  Component: Legend,
  connect: ['legendStore'],
};
const id = 'legend';
export { id, PrimaryPanelPlugin };
