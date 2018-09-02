import React, { Component } from 'react';

const pluginId = 'Example';
const PrimaryPanelPlugin = ({ place }) => (
  <div>
    <h1> Test Example Plugin, I am at {place}</h1>
  </div>
);

const OverlayHeaderPlugin = ({ name }) => <h1>{name}</h1>;
const OverlayContentPlugin = ({ id, name, photo }) => (
  <div>{photo && <img src={photo} alt="{name}" />}</div>
);

export { pluginId, PrimaryPanelPlugin, OverlayHeaderPlugin, OverlayContentPlugin };
