import ConnectedComponent from './ConnectedComponent';

const cachedComponents = {};

function getConnectedComponent(id, connect, component, urlParams, linkTo) {
  if (!cachedComponents[id]) {
    cachedComponents[id] = ConnectedComponent(connect, urlParams, linkTo)(component);
  }
  return cachedComponents[id];
}

export default getConnectedComponent;
