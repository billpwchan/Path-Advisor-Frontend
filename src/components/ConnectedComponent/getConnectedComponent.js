import ConnectedComponent from './ConnectedComponent';

const cachedComponents = {};

function getConnectedComponent(id, connect, component) {
  if (!cachedComponents[id]) {
    cachedComponents[id] = ConnectedComponent(connect)(component);
  }
  return cachedComponents[id];
}

export default getConnectedComponent;
