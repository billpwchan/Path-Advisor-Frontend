import React, { Component } from 'react';

const pluginId = 'Example';
const PrimaryPanelPlugin = ({ mapPositionChanged }) => <h1> Test {mapPositionChanged} </h1>;
const MapCanvasPlugin = null;

export { pluginId, PrimaryPanelPlugin, MapCanvasPlugin };
