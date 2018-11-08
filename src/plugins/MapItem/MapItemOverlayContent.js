import React from 'react';
import PropTypes from 'prop-types';

function MapItemOverlayContent({ style, name, photo, url, others: { accessibleFloors } }) {
  return (
    <div className={style.body}>
      {photo && (
        <div className={style.photo}>
          <img src={photo} alt={name} />
        </div>
      )}

      {url && (
        <div className={style.url}>
          <div className={style.head}>Website</div>
          <a className={style.link} href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )}

      {accessibleFloors && (
        <div className={style.accessibleFloors}>
          <div className={style.head}>This lift stop at floors</div>
          <ul className={style.floorList}>
            {accessibleFloors.map(floor => (
              <li key={floor}>{floor}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

MapItemOverlayContent.propTypes = {
  style: PropTypes.shape({
    body: PropTypes.string,
    head: PropTypes.string,
    photo: PropTypes.string,
    url: PropTypes.string,
    floorList: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  photo: PropTypes.string,
  url: PropTypes.string,
  others: PropTypes.shape({}),
};

export default MapItemOverlayContent;
