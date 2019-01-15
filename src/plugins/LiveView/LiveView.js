import React from 'react';
import desktopStyle from './LiveView.module.css';
import mobileStyle from './MobileLiveView.module.css';

const GetLiveViewOverlayContent = style =>
  function LiveViewOverlayContent({ others }) {
    const { liveView } = others || { liveView: null };

    return liveView ? (
      <div className={style.body}>
        <div className={style.head}>Live view</div>
        {liveView.iframeUrl ? (
          <iframe title="Bus stop live view" src={liveView.iframeUrl} className={style.iframe} />
        ) : null}
        {liveView.imageUrls
          ? liveView.imageUrls.map(url => (
              <img key={url} src={url} alt="Live snapshot" className={style.image} />
            ))
          : null}
        <div className={style.url}>
          <a className={style.link} href={liveView.url} rel="noreferrer noopener" target="_blank">
            {liveView.url}
          </a>
        </div>
      </div>
    ) : null;
  };

const id = 'liveView';

const OverlayContentPlugin = {
  connect: [],
  Component: GetLiveViewOverlayContent(desktopStyle),
};

const MobileOverlayContentPlugin = {
  connect: [],
  Component: GetLiveViewOverlayContent(mobileStyle),
};

function createImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

function LiveViewVideoLegend({
  mapItemStore: { mapItems },
  setMapItems,
  legendStore: { legends },
  openOverlayHandler,
}) {
  const liveViewLegends = mapItems
    .filter(
      ({ name = '' }) =>
        name.toUpperCase() === 'NORTH BUS STOP' ||
        name.toUpperCase() === 'SOUTH BUS STOP' ||
        name === 'Barn B, ROOM 1101' ||
        name === 'ROOM 4403 - 4404' ||
        name === 'BARN C ROOM 4579-4580',
    )
    .map(({ id: itemId, coordinates: [x, y], floor, name = '', photo, url, others }) => {
      // TO-FIX: hardcoding liveview info here before there is an API for it.
      if (name.toUpperCase() === 'NORTH BUS STOP') {
        // eslint-disable-next-line no-param-reassign
        others = {
          liveView: {
            url: 'http://wowza.ust.hk/Northgate/',
            iframeUrl: '/liveview/liveview-north.html',
          },
        };
      }

      if (name.toUpperCase() === 'SOUTH BUS STOP') {
        // eslint-disable-next-line no-param-reassign
        others = {
          liveView: {
            url: 'http://wowza.ust.hk/Southgate/',
            iframeUrl: '/liveview/liveview-south.html',
          },
        };
      }

      if (name === 'Barn B, ROOM 1101') {
        // eslint-disable-next-line no-param-reassign
        others = {
          liveView: {
            url:
              'https://itsc.ust.hk/services/academic-teaching-support/facilities/computer-barn/snapshots-in-computer-barns/',
            imageUrls: [
              'http://itsc.ust.hk/apps/realcam/barnb_1_000M.jpg',
              'http://itsc.ust.hk/apps/realcam/barnb_2_000M.jpg',
            ],
          },
        };
      }

      if (name === 'ROOM 4403 - 4404') {
        // eslint-disable-next-line no-param-reassign
        others = {
          liveView: {
            url:
              'https://itsc.ust.hk/services/academic-teaching-support/facilities/computer-barn/snapshots-in-computer-barns/',
            imageUrls: [
              'http://itsc.ust.hk/apps/realcam/barna_t1_000M.jpg',
              'http://itsc.ust.hk/apps/realcam/barna_g1_000M.jpg',
            ],
          },
        };
      }

      if (name === 'BARN C ROOM 4579-4580') {
        // eslint-disable-next-line no-param-reassign
        others = {
          liveView: {
            url:
              'https://itsc.ust.hk/services/academic-teaching-support/facilities/computer-barn/snapshots-in-computer-barns/',
            imageUrls: [
              'http://itsc.ust.hk/apps/realcam/barnc_g1_000M.jpg',
              'http://itsc.ust.hk/apps/realcam/barnc_t1_000M.jpg',
            ],
          },
        };
      }

      return {
        id: `${floor}_${itemId}_liveView`,
        center: true,
        x,
        y,
        floor,
        offsetX: -40,
        image: createImage(legends.liveView.image),
        onClick: () => {
          openOverlayHandler(name, photo, url, others);
        },
        onMouseOver: () => {
          document.body.style.cursor = 'pointer';
        },
        onMouseOut: () => {
          document.body.style.cursor = 'auto';
        },
        width: 24,
        height: 24,
      };
    });

  setMapItems(liveViewLegends);

  return null;
}

const MapCanvasPlugin = {
  connect: ['mapItemStore', 'legendStore', 'openOverlayHandler', 'setMapItems', 'platform'],
  Component: LiveViewVideoLegend,
};

export { id, MapCanvasPlugin, OverlayContentPlugin, MobileOverlayContentPlugin };
