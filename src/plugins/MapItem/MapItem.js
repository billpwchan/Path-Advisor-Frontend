import React, { Component } from 'react';
import fetchAccessibleFoorsRequest from '../../sagas/requests/fetchAccessibleFloorsRequest';

const pluginId = 'mapitem';
const imgCached = {};

const DEFAULT_TEXT_STYLE = {
  size: '12 px',
  family: 'Verdana',
  color: 'black',
  maxLineWidth: 35,
};

const CIRCLE_RADUIS = 15;

const DEFAULT_CIRCLE_STYLE = {
  radius: CIRCLE_RADUIS,
  borderColor: '#666666',
  color: 'lightblue',
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

class MapCanvasPlugin extends Component {
  shouldComponentUpdate(nextProps) {
    const { mapItems } = this.props;
    return mapItems !== nextProps.mapItems;
  }

  render() {
    const { mapItems, setMapItems, legends, openOverlayHandler } = this.props;

    setMapItems(
      mapItems.reduce((accumulator, { id, coordinates: [x, y], floor, name, type, photo, url }) => {
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
        switch (type) {
          case 'restaurant':
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
            });
            break;
          case 'crossBuildingConnector':
          case 'escalator':
            accumulator.push({
              ...baseMapItem,
              image: createImage(legends[type].image),
              onMouseOver: () => {
                document.body.style.cursor = 'pointer';
              },
              onMouseOut: () => {
                document.body.style.cursor = 'auto';
              },
            });
            break;
          case 'lift':
            accumulator.push(
              {
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
              },
              {
                ...baseMapItem,
                textElement: {
                  ...DEFAULT_TEXT_STYLE,
                  maxLineWidth: 30,
                  text: name,
                },
                id: `${floor}_${id}`,
                hitX: x - CIRCLE_RADUIS,
                hitY: y - CIRCLE_RADUIS,
                hitWidth: CIRCLE_RADUIS * 2,
                hitHeight: CIRCLE_RADUIS * 2,
                onMouseOver: () => {
                  document.body.style.cursor = 'pointer';
                },

                onMouseOut: () => {
                  document.body.style.cursor = 'auto';
                },

                onClick: () => {
                  fetchAccessibleFoorsRequest(floor, name).then(({ data: accessibleFloors }) => {
                    openOverlayHandler(name, photo, url, { accessibleFloors });
                  });
                },
              },
            );
            break;
          default: {
            accumulator.push({
              ...textMapItem,
              onClick: () => {
                if (photo) openOverlayHandler(name, photo, url);
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
                  },
                ]);
              },
            });
          }
        }

        if (photo) {
          accumulator.push({
            ...baseMapItem,
            id: `${floor}_${id}_photo`,
            x: x - 40,
            image: createImage(legends.photo.image),
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
        }

        return accumulator;
      }, []),
    );

    return null;
  }
}

const OverlayHeaderPlugin = ({ name }) => <h1>{name}</h1>;
const OverlayContentPlugin = ({ name, photo, url, others: { accessibleFloors } }) => (
  <div>
    {url && (
      <div>
        Link: <a href={url}>url</a>
      </div>
    )}
    <div>{photo && <img src={photo} alt={name} />}</div>
    {accessibleFloors && (
      <div>
        Accessible floors:
        <ul>
          {accessibleFloors.map(floor => (
            <li>{floor}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export { pluginId, MapCanvasPlugin, OverlayHeaderPlugin, OverlayContentPlugin };
