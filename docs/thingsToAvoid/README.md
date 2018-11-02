# Things to avoid

If you want to submit your plugin to be included in the production path advisor app, there are a few rules your plugin needs to follow. This is to ensure whenever there is an app update, it wouldn't break your plugin and the plugins wouldn't place a restriction on how we update the app as well. This process can minimize the maintenance time for both side of the developers.

## Use private or unpublished API

**Do not use private or unpublished API.**
Your plugin should always use the the APIs and functions documented in this documentation. If you feel like you need extra functions or connected properties to accomplish your feature. Please free feel to create an issue in the repository or contact ITSC directly for the requirement.

## Edit code outside of your plugin folder

**Do not edit code outside of your plugin folder.**
You should only add or edit code for the files in your plugin folder. When you submit your plugin, we only take the files inside your plugin folder.

Similarly for `package.json`, do not edit the package.json file residing in root directory. If you want to add any dependencies, you can always add them in package.json **residing in your plugin directory**. The build script will always look for all package.json files in the `plugins` folder and install the dependencies one by one.


## Direct DOM manipulation

**Do not manipulate DOM of any of the existing DOM elements**, like adding or changing DOM elements or attaching event handlers to any of the existing DOM elements. This is because the ID and the class names are generated randomly and the DOM element itself may be changed or removed when we update our app. You should use the connected properties and the API documented in this documentation to get the values and do the operations you want.

While manipulating of **your own plugin's DOM elements** is not restricted, we do not recommend that as there is a better way of doing so when using the React framework.


