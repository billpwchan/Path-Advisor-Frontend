import React from 'react';
import desktopStyle from './LiveView.module.css';
import mobileStyle from './MobileLiveView.module.css';

const LiveViewOverlayContent = style => ({ others }) => {
  const { liveView } = others || { liveView: null };

  return liveView ? (
    <div className={style.body}>
      <div className={style.head}>Live view</div>
      <iframe title="Bus stop live view" src={liveView.iframeUrl} className={style.iframe} />
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
  Component: LiveViewOverlayContent(desktopStyle),
};

const MobileOverlayContentPlugin = {
  connect: [],
  Component: LiveViewOverlayContent(mobileStyle),
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
  const videoLegends = mapItems
    .filter(
      ({ name = '' }) =>
        name.toUpperCase() === 'NORTH BUS STOP' || name.toUpperCase() === 'SOUTH BUS STOP',
    )
    .map(({ id: itemId, coordinates: [x, y], floor, name, photo, url, others }) => {
      // TO-FIX: hardcoding liveview info here before there is a API for it.
      if (name.toUpperCase() === 'NORTH BUS STOP' || name.toUpperCase() === 'SOUTH BUS STOP') {
        // eslint-disable-next-line
        others = {
          liveView: {
            url: 'http://liveview.ust.hk',
            iframeUrl: '/liveview.html',
          },
        };
      }

      return {
        id: `${floor}_${itemId}_video`,
        center: true,
        x,
        y,
        floor,
        offsetX: -40,
        image: createImage(legends.video.image),
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

  setMapItems(videoLegends);

  return null;
}

const MapCanvasPlugin = {
  connect: ['mapItemStore', 'legendStore', 'openOverlayHandler', 'setMapItems', 'platform'],
  Component: LiveViewVideoLegend,
};

export { id, MapCanvasPlugin, OverlayContentPlugin, MobileOverlayContentPlugin };
