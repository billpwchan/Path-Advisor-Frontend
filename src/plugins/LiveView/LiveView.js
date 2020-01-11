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
    .filter(({ others = {} }) => others.liveView)
    .map(({ id: itemId, coordinates: [x, y], floor, name = '', photo, url, others }) => ({
      id: `${floor}_${itemId}_liveView`,
      center: true,
      x,
      y,
      floor,
      offsetX: 40,
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
    }));

  setMapItems(liveViewLegends);

  return null;
}

const MapCanvasPlugin = {
  connect: ['mapItemStore', 'legendStore', 'openOverlayHandler', 'setMapItems', 'platform'],
  Component: LiveViewVideoLegend,
};

const core = true;
export { id, core, MapCanvasPlugin, OverlayContentPlugin, MobileOverlayContentPlugin };
