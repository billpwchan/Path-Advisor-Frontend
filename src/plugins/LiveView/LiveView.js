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

const MapItemStoreMutation = mapItems =>
  mapItems.map(item => {
    const mapItem = { ...item };
    const name = mapItem.name && mapItem.name.toUpperCase();
    if (name === 'NORTH BUS STOP' || name === 'SOUTH BUS STOP') {
      mapItem.type = 'video';
      mapItem.others = mapItem.others ? mapItem.others : {};
      mapItem.others.liveView = {
        url: 'http://liveview.ust.hk',
        iframeUrl: '/liveview.html',
      };
    }
    return mapItem;
  });

export { id, OverlayContentPlugin, MobileOverlayContentPlugin, MapItemStoreMutation };
