import { Component } from 'react';

import fetchAccessibleFloorsRequest from '../../sagas/requests/fetchAccessibleFloorsRequest';
import MapItemDesktopOverlayHeader from './MapItemDesktopOverlayHeader';
import MapItemDesktopOverlayContent from './MapItemDesktopOverlayContent';
import MapItemMobileOverlayHeader from './MapItemMobileOverlayHeader';
import MapItemMobileOverlayContent from './MapItemMobileOverlayContent';

const imgCached = {};

const DEFAULT_TEXT_STYLE = {
  style: '10px Verdana',
  color: 'black',
  maxLineWidth: 35,
};

const CIRCLE_RADIUS = 15;

const DEFAULT_CIRCLE_STYLE = {
  radius: CIRCLE_RADIUS,
  borderColor: '#666666',
  color: 'lightblue',
};

const LEGEND_DIMENSION = {
  width: 24,
  height: 24,
};

function convertName(name) {
  if (name.startsWith('ROOM')) {
    return name.substr(4).trim();
  }

  return name;
}

function createImage(src) {
  if (!imgCached[src]) {
    const img = new Image();
    img.src = src;
    imgCached[src] = img;
  }

  return imgCached[src];
}

class MapItem extends Component {
  shouldComponentUpdate(nextProps) {
    return !nextProps.mapItemStore.loading;
  }

  render() {
    console.log('MapItem rendered');
    const {
      mapItemStore: { mapItems },
      setMapItems,
      legendStore: { legends },
      openOverlayHandler,
      platform,
    } = this.props;

    setMapItems(
      mapItems.reduce((accumulator, { id, coordinates: [x, y], floor, name, type, photo, url }) => {
        const marginLeft = -40;
        let marginTop = 0;

        const baseMapItem = {
          id: `${floor}_${id}`,
          floor,
          x,
          y,
          center: true,
        };
        const textMapItem = {
          ...baseMapItem,
          textElement: {
            ...DEFAULT_TEXT_STYLE,
            text: convertName(name),
          },
        };

        if (photo) {
          accumulator.push({
            ...baseMapItem,
            id: `${floor}_${id}_photo`,
            x: x + marginLeft,
            image: createImage(legends.photo.image),
            ...LEGEND_DIMENSION,
            onClick: () => {
              openOverlayHandler(name, photo, url);
            },
            onMouseOver: () => {
              document.body.style.cursor = 'pointer';
            },
            onMouseOut: () => {
              document.body.style.cursor = 'auto';
            },
          });

          marginTop += 20;
        }

        switch (type) {
          case 'maleToilet':
          case 'femaleToilet':
          case 'stair':
          case 'expressStation':
          case 'drinkingFountain':
          case 'atm':
          case 'mailbox':
          case 'taxiStand':
          case 'virtualBarnWorkstation':
          case 'satellitePrinter':
            accumulator.push({
              ...baseMapItem,
              image: createImage(legends[type].image),
              ...LEGEND_DIMENSION,
            });
            break;
          case 'crossBuildingConnector':
          case 'escalator':
            accumulator.push({
              ...baseMapItem,
              image: createImage(legends[type].image),
              ...LEGEND_DIMENSION,
              onMouseOver: () => {
                document.body.style.cursor = 'pointer';
              },
              onMouseOut: () => {
                document.body.style.cursor = 'auto';
              },
            });
            break;
          case 'lift': {
            if (platform !== 'MOBILE') {
              accumulator.push({
                ...baseMapItem,
                id: `${floor}_${id}_circle`,
                circle: {
                  ...DEFAULT_CIRCLE_STYLE,
                },
                onMouseOver: () => {
                  setMapItems([
                    {
                      id: `${floor}_${id}_circle`,
                      circle: {
                        ...DEFAULT_CIRCLE_STYLE,
                        color: 'lightyellow',
                      },
                    },
                  ]);
                },
                onMouseOut: () => {
                  setMapItems([
                    {
                      id: `${floor}_${id}_circle`,
                      circle: {
                        ...DEFAULT_CIRCLE_STYLE,
                      },
                    },
                  ]);
                },
              });
            }

            const liftMapItem =
              platform === 'MOBILE'
                ? { image: createImage(legends[type].image), ...LEGEND_DIMENSION }
                : {
                    textElement: {
                      ...DEFAULT_TEXT_STYLE,
                      maxLineWidth: 30,
                      text: name,
                    },
                    id: `${floor}_${id}`,
                    customHitX: x - CIRCLE_RADIUS,
                    customHitY: y - CIRCLE_RADIUS,
                    customHitWidth: CIRCLE_RADIUS * 2,
                    customHitHeight: CIRCLE_RADIUS * 2,
                  };

            accumulator.push({
              ...baseMapItem,
              ...liftMapItem,
              onMouseOver: () => {
                document.body.style.cursor = 'pointer';
              },

              onMouseOut: () => {
                document.body.style.cursor = 'auto';
              },

              onClick: () => {
                fetchAccessibleFloorsRequest(floor, name).then(({ data: accessibleFloors }) => {
                  openOverlayHandler(name, photo, url, { accessibleFloors });
                });
              },
            });
            break;
          }
          default: {
            if (type === 'restaurant') {
              accumulator.push({
                ...baseMapItem,
                id: `${floor}_${id}_restaurant`,
                x: x + marginLeft,
                y: y + marginTop,
                image: createImage(legends[type].image),
                ...LEGEND_DIMENSION,
              });
            }

            const extraTextStyle = photo || url ? { color: 'blue' } : {};

            accumulator.push({
              ...textMapItem,
              textElement: {
                ...textMapItem.textElement,
                ...extraTextStyle,
              },

              onClick: () => {
                if (photo || url) openOverlayHandler(name, photo, url);
              },

              onMouseOver: () => {
                document.body.style.cursor = 'pointer';
                setMapItems([
                  {
                    ...textMapItem,
                    textElement: {
                      ...textMapItem.textElement,
                      color: 'lightblue',
                    },
                  },
                ]);
              },

              onMouseOut: () => {
                document.body.style.cursor = 'auto';
                setMapItems([
                  {
                    ...textMapItem,
                    textElement: {
                      ...textMapItem.textElement,
                      ...extraTextStyle,
                    },
                  },
                ]);
              },
            });
          }
        }

        return accumulator;
      }, []),
    );

    return null;
  }
}

const MapCanvasPlugin = {
  connect: ['mapItemStore', 'legendStore', 'openOverlayHandler', 'setMapItems', 'platform'],
  Component: MapItem,
};
const id = 'mapItem';
export {
  id,
  MapCanvasPlugin,
  MapItemDesktopOverlayHeader as OverlayHeaderPlugin,
  MapItemDesktopOverlayContent as OverlayContentPlugin,
  MapItemMobileOverlayHeader as MobileOverlayHeaderPlugin,
  MapItemMobileOverlayContent as MobileOverlayContentPlugin,
};
