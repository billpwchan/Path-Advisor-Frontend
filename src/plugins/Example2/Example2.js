import React from 'react';

const pluginId = 'Example 2';

const OverlayHeaderPlugin = ({ name }) => <h1>{name} from other plugins</h1>;
const OverlayContentPlugin = ({ id, name, photo }) => (
  <div>{photo && <img src={photo} alt="{name}" />}</div>
);

export { pluginId, OverlayHeaderPlugin, OverlayContentPlugin };
