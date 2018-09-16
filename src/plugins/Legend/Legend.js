import React from 'react';
import styles from './Legend.module.css';

const pluginId = 'legend';

function Legend({ legends, legendIds }) {
  return (
    <div>
      <div className={styles.head}>Legends</div>
      <ul className={styles.legendList}>
        {legendIds.map(id => {
          const { name, image } = legends[id];
          return (
            <li key={id}>
              <img className={styles.image} src={image} alt={name} />
              <span className={styles.text}>{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { pluginId, Legend as PrimaryPanelPlugin };
