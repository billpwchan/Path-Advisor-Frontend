import React from 'react';
import PropTypes from 'prop-types';
import style from './Loading.module.css';

function Loading({ text = '' }) {
  return (
    <div>
      <img src="/images/icons/loading.svg" alt="loading" className={style.image} />
      <div className={style.text}>{text}</div>
    </div>
  );
}

Loading.propTypes = {
  text: PropTypes.string,
};

export default Loading;
