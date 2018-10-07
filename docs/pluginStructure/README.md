# Plugin structure

## File structure

All plugins will live under the root `plugins` folder and each plugin will have their own folder containing all their assets inside. Inside their own folders, there should be at least one js file which its filename should be the same as the plugin folder's name and this file will be the entry point for the plugin. All plugin folder name should be in camel case.
For example, if you want to build a hello world plugin, you will need to create a folder named `HelloWorld` under plugins folder. Inside `HelloWorld` folder, there should be a `HelloWorld.js` file.

```
...
src
└── plugins/
    └── HelloWorld/
        └──  HelloWorld.js
...
```

Finally, in order to include your plugin, you need to edit `plugins/index.js` file to include `HelloWorld.js` file.

plugins/index.js

```javascript
import * as FooBar from './FooBar/FooBar';
import * as HelloWorld from './HelloWorld/HelloWorld';

export [FooBar, HelloWorld];
```


## Entry point file

The plugin entry point file `HelloWorld.js` will have the following format:

```javascript
const id = "HelloWorld";

function HelloWorldPrimaryPanel() {
  return <h1> Hello World in PrimaryPanel </h1>;
}

function HelloWorldMapCanvas() {
  return <h1> Hello World in MapCanvas </h1>;
}

function HelloWorldOverlayHeaderPlugin() {
  return <h1> Hello World in MapCanvas </h1>;
}

function HelloWorldOverlayContentPlugin() {
  return <h1> Hello World in MapCanvas </h1>;
}

const PrimaryPanelPlugin = { Component: HelloWorldPrimaryPanel, connect: [] };
const MapCanvasPlugin = { Component: HelloWorldMapCanvas, connect: [] };
const OverlayHeaderPlugin = { Component: OverlayHeaderPlugin, connect: [] };
const OverlayContentPlugin = { Component: OverlayContentPlugin, connect: [] };

export {
  id,
  PrimaryPanelPlugin,
  MapCanvasPlugin,
  OverlayHeaderPlugin,
  OverlayContentPlugin
};
```

Note that if your plugin only contains `PrimaryPanelPlugin`, you don't need to export all the other types. i.e.

```javascript
const id = "HelloWorld";

function HelloWorld() {
  return <h1> Hello World </h1>;
}

const PrimaryPanelPlugin = { Component: HelloWorld, connect: [] };

export { id, PrimaryPanelPlugin };
```

## Component and connected properties

As shown in previous chapter, each plugin type will be in the following structure:

```javascript
const PrimaryPanelPlugin = { Component: null, connect: [] };
```

There are two keys for a plugin, `Component` and `connect`.

`Component` is the actual plugin component, it can be a plain javascript function or a class extending
[React.Component](https://reactjs.org/docs/glossary.html#components) or [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent)

`connect` is an array of property names that will be passed to the Component.

For example, if your component need the current `floor`, `x` and `y` coordinate values, you need to define them in the `connect` array in order to use them in the component.

Note that connected property can be a string, a number or a function. In this case, `floor` is string and `x` and `y` are numbers.

For `OverlayHeaderPlugin` and `OverlayContentPlugin`, the connect array will be ignored. They will always receive four fixed properties: `name`, `photo`, `url` and `others`.

** Functional plugin version **

```javascript
const id = "HelloWorld";

function HelloWorld({ x, y, floor }) {
  return (
    <h1>
      I am now at floor {floor} at ({x},{y}) position.
    </h1>
  );
}

const PrimaryPanelPlugin = {
  Component: HelloWorld,
  connect: ["x", "y", "floor"]
};

export { id, PrimaryPanelPlugin };
```

** Class plugin version **

```javascript
class HelloWorld extends React.Component {
  render() {
    const { x, y, floor } = this.props;
    return (
      <h1>
        I am now at floor {floor} at ({x},{y}) position.
      </h1>
    );
  }
}

const PrimaryPanelPlugin = {
  Component: HelloWorld,
  connect: ["x", "y", "floor"]
};

export { id, PrimaryPanelPlugin };
```

For each plugin type you can connect different types of properties, they are described in [Types of plugin]() section.

## Updating and rendering

Each time the properties connecting to the plugin component are updated, the plugin function, or the render method of the plugin if you define your plugin as a class, will be called.

Also if your plugin only exists to call some functions and do not render anything, you must return `null`. An error will be thrown if a plugin does not return anything.

** function plugin **

```javascript
function HelloWorld() {
  console.log("Hello world plugin");
  return null;
}
```

** class plugin **

```javascript
class HelloWorld extends React.Component {
  render() {
    console.log("Hello world plugin");
    return null;
  }
}
```