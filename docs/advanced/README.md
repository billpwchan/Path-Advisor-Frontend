# Advanced topics

## Render optimization

A plugin will be re-rendered every time when its connected properties are updated. Therefore to minimize the numbers of unnecessary update, you should only connect properties you need for a plugin.

A property is considered to be updated when it is assigned a value by some external actions, usually triggered by user interaction. But there is no guarantee the assigned value must be different from the old one. One of the examples is that when users select a nearest item in the dropdown list, property `to` will be considered as updated and if your plugin connects to `to` property, the plugin function or the render function of the plugin class will be called to re-render. If the user later click on the nearest item again, `to` will be considered to be updated as well and the same re-rendering process will follow. This process can guarantee it captures every user interactions correctly.

Usually this process will be enough for most of the use cases. If for performance reason or any other reason you only want rendering to happen when the actual value of a property changed. You will need to define your plugin as a class and extending from [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) or define a [shouldComponentUpdate](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) method in your React.Component class.

Example:

```javascript
class HelloWorld extends React.Component {
  shouldComponentUpdate(nextProps) {
    return;
    nextProps.to.name !== this.props.to.name
  }

  render() {
    console.log(
      "This message will only be logged if the value to.name are changed, even if users click on the items multiple times"
    );
    return null;
  }
}
```

## Life cycle

Since a plugin of this project is just a React component. You can use all any methods available in React to define and control the life cycle of a plugin.

[getDerivedStateFromProps](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops)

[shouldComponentUpdate](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)

[getSnapshotBeforeUpdate](https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)

[componentDidMount](https://reactjs.org/docs/react-component.html#componentdidmount)

[componentWillUnmount](https://reactjs.org/docs/react-component.html#componentwillunmount)


## Order of executing

The plugin will be executed in the exact order you defined them in `plugins/index.js`. For example:

```javascript
import * as SomeOtherPlugin from "./SomeOtherPlugin/SomeOtherPlugin";
import * as Pin from "./Pin/Pin";

export default [SomeOtherPlugin, Pin];
```

`SomeOtherPlugin` will be executed followed by `Pin`.

## Import assets

This project's setup allows you to import the following static assets directly using `import` keyword in javascript file. You should also put all your plugin's assets in your own plugin folder instead of the root folder or any other location of the project.

- Image

Example
```javascript
import pin from './pin.png'

function showImage(){
  return <img src={pin} alt="pin image" />;
}
```

- Module css

A module css should always have a suffix with `.module.css` in its filename, otherwise the system cannot recognize it is a module css file.

Module css

text.module.css
```css
.text {
  font-size: 40px;
}
```

Plugin
```javascript
import style from 'text.module.css';

function Text() {
  return <p className={style.text}>Hello World</p>;
}
```