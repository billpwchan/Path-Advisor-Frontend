import React, { Component } from 'react';

const pluginId = 'mapitem';
const imgCached = {};

const DEFAULT_TEXT_STYLE = {
  size: '12 px',
  family: 'Verdana',
  color: 'black',
  center: true,
  maxLineWidth: 35,
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
    const { mapItems, addMapItems, legends, updateMapItems, openOverlayHandler } = this.props;

    addMapItems(
      mapItems.reduce((accumulator, { id, coordinates: [x, y], floor, name, type, photo, url }) => {
        const baseMapItem = {
          id: `${floor}_${id}`,
          floor,
          x,
          y,
        };

        switch (type) {
          case 'crossBuildingConnector':
          case 'escalator':
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
          case 'lift':
            accumulator.push(
              {
                ...baseMapItem,
                id: `${floor}_${id}_circle`,
                circle: {
                  radius: 15,
                  borderColor: '#666666',
                  color: 'lightblue',
                },
              },
              {
                ...baseMapItem,
                id: `${floor}_${id}_text`,
                textElement: {
                  ...DEFAULT_TEXT_STYLE,
                  text: name,
                },
              },
            );
            break;
          default: {
            const defaultMapItem = {
              ...baseMapItem,
              textElement: {
                ...DEFAULT_TEXT_STYLE,
                text: convertName(name),
              },
            };

            accumulator.push({
              ...defaultMapItem,

              onClick: () => {
                if (photo) openOverlayHandler(name, photo, url);
              },

              onMouseOver: () => {
                document.body.style.cursor = 'pointer';
                updateMapItems([
                  {
                    ...defaultMapItem,
                    textElement: {
                      ...defaultMapItem.textElement,
                      color: 'lightblue',
                    },
                  },
                ]);
              },

              onMouseOut: () => {
                document.body.style.cursor = 'auto';
                updateMapItems([
                  {
                    ...defaultMapItem,
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
const OverlayContentPlugin = ({ name, photo, url }) => (
  <div>
    {url && (
      <div>
        Link: <a href={url}>url</a>
      </div>
    )}
    <div>{photo && <img src={photo} alt={name} />}</div>
  </div>
);

export { pluginId, MapCanvasPlugin, OverlayHeaderPlugin, OverlayContentPlugin };
