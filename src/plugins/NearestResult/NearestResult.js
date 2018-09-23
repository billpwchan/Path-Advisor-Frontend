import React from 'react';
import arrowImage from './arrow.png';
import style from './NearestResult.module.css';

const arrowImageWidth = 9;
const arrowImageHeight = 20;

const pluginId = 'nearestResult';

function NearestResultPrimaryPanel({
  searchNearestStore,
  floorStore: { floors, buildings },
  linkTo,
}) {
  const getBuildingAndFloorText = floor =>
    `Floor ${floors[floor].name}, ${buildings[floors[floor].buildingId].name}`;

  const searchNearestHead = <div className={style.head}>Search result</div>;
  switch (true) {
    case searchNearestStore.loading:
      return (
        <div>
          {searchNearestHead}
          <div className={style.content}>Please wait...</div>
        </div>
      );

    case searchNearestStore.success: {
      const { from, nearest } = searchNearestStore;
      return (
        <div>
          {searchNearestHead}
          <div className={style.content}>
            <div className={style.head}>
              Nearest {nearest.type} from {from.name} ({getBuildingAndFloorText(from.floor)})
            </div>
            <div>
              <button
                className={style.link}
                type="button"
                onClick={() =>
                  linkTo({
                    x: nearest.coordinates[0],
                    y: nearest.coordinates[1],
                    floor: nearest.floor,
                  })
                }
              >
                {nearest.name} ({getBuildingAndFloorText(nearest.floor)})
              </button>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

function NearestResultMapCanvas({ setMapItems, removeMapItem, searchAreaInputStore }) {
  // put a read pin in map if user specified the 'from' value in input field
  const { from: { data: { coordinates: [x, y] = [null, null], floor = null } = {} } = {} } =
    searchAreaInputStore || {};

  const pinId = 'targetPin';

  if (x && y && floor) {
    const image = new Image();
    image.src = arrowImage;

    setMapItems([
      {
        id: pinId,
        floor,
        x: x - arrowImageWidth / 2,
        y: y - arrowImageHeight,
        image,
      },
    ]);
  } else {
    removeMapItem(pinId);
  }

  return null;
}

export {
  pluginId,
  NearestResultPrimaryPanel as PrimaryPanelPlugin,
  NearestResultMapCanvas as MapCanvasPlugin,
};
