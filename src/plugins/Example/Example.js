import React, { Component } from 'react';

const pluginId = 'Example';
const PrimaryPanelPlugin = ({ place }) => (
  <div>
    <h1> Test Example Plugin, I am at {place}</h1>
  </div>
);

export { pluginId, PrimaryPanelPlugin };
