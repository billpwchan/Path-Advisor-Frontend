import React, { Component } from 'react';
import style from './NearestResultMobile.module.css';
import calculateTextDimension from '../../components/MapCanvas/calculateTextDimension';

const FONT_STYLE = 'bold 11px Verdana';

class NearestResultMobile extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.searchNearestStore === this.props.searchNearestStore) {
      return;
    }

    const {
      searchNearestStore: { nearest },
      linkTo,
      setMapItems,
    } = this.props;

    if (nearest) {
      const {
        coordinates: [x, y],
        floor,
        name,
      } = nearest;

      linkTo({
        x,
        y,
        floor,
      });

      const { width, height } = calculateTextDimension(FONT_STYLE, name);

      const offsetHeight = 35;
      const paddingWidth = 20;
      const paddingHeight = 10;
      const arrowHeight = 10;
      const arrowWidth = 10;

      const tagWidth = width + paddingWidth;
      const tagHeight = height + paddingHeight;

      setMapItems([
        {
          id: 'NEAREST_ITEM_TAG_ID',
          x,
          y: y - offsetHeight + arrowHeight / 2,
          floor,
          center: true,
          shape: {
            fillStyle: 'rgba(0,0,0,0.7)',
            coordinates: [
              [0, 0],
              [tagWidth, 0],
              [tagWidth, tagHeight],
              [tagWidth / 2 + arrowWidth / 2, tagHeight],
              [tagWidth / 2, tagHeight + arrowHeight],
              [tagWidth / 2 - arrowWidth / 2, tagHeight],
              [0, tagHeight],
            ],
          },
          onClick: () => console.log('i am clicked'),
        },
        {
          id: 'NEAREST_ITEM_TAG_TEXT_ID',
          x,
          y: y - offsetHeight,
          floor,
          center: true,
          textElement: {
            style: FONT_STYLE,
            color: 'white',
            text: name,
          },
        },
      ]);
    }
  }

  render() {
    console.log('NearestResultMobile render');
    const { searchNearestStore, searchShortestPathStore } = this.props;

    if (searchNearestStore.loading || searchShortestPathStore.loading) {
      return (
        <div className={style.body}>
          <div className={style.loading}>
            <img src="/images/icons/loading.svg" alt="loading" className={style.image} />
          </div>
        </div>
      );
    }

    return null;
  }
}

const id = 'nearestResultMobile';
const MapCanvasPlugin = {
  Component: NearestResultMobile,
  connect: [
    'searchNearestStore',
    'searchShortestPathStore',
    'linkTo',
    'setMapItems',
    'calculateTextDimension',
  ],
  platform: ['MOBILE'],
};

export { id, MapCanvasPlugin };
