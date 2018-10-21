# Types of plugins

There are four types of plugin for this project. They are `PrimaryPanelPlugin`, `MapCanvasPlugin`, `OverlayHeaderPlugin` and `OverlayContentPlugin`. In general, if you want to add new features in map canvas area (drag and drop floor plan area), you will need to build a `MapCanvasPlugin` type plugin. If you want to add features for showing details of a map item on the left UI panel, you will need to build `OverlayHeaderPlugin` and `OverlayContentPlugin`. If you want to add any other features in the left panel of the UI, you will need to build a `PrimaryPanelPlugin` type plugin. It is completely normal that you may need to build more than one of these plugins to complete your feature.

![plugin-indication-1](../images/pluginIndication1.jpg)

![plugin-indication-2](../images/pluginIndication2.jpg)

## PrimaryPanelPlugin

### Properties

<!-- [x](properties/x.md ':include') -->
#### x
`x` - number

Current x coordinate of the center of the map canvas.

<!-- [y](properties/y.md ':include') -->
#### y
`y` - number

Current y coordinate of the center of the map canvas.

<!-- [level](properties/level.md ':include') -->
#### level
`level` - number

Current zoom level. 0 is the default zoom level at largest scale.

<!-- [floor](properties/floor.md ':include') -->
#### floor
`floor` - string

Current floor ID.

<!-- [linkTo](properties/linkTo.md ':include') -->
#### linkTo
`linkTo` - function

A function that takes a `{x, y, floor, level}` object argument and it reposition the map canvas to this position. All four properties in the object are optional, if they are missing in the supplied object, they will be assigned with current position value. For example, you can call `linkTo` with `{level: 2}` to indicate that you don't want to change the current `x`, `y`, `floor` value but to change only the zoom level and keep the map canvas at the same position.


<!-- [legendStore](properties/legendStore.md ':include') -->
#### legendStore
`legendStore` - object

An object storing all legend types available for map items
```javascript
{
  loading: boolean, /* Indicate if legends are loading or not */
  failure: boolean, /* Indicate if legends failed to load */
  success: boolean, /* Indicate if legends are loaded successfully */
  legendIds: [], /* An array of legendIds in string */
  legends: { /* An object of legend data with legendId as keys */
    [legendId]: {
      name: string, /* Name of the legend */
      image: string  /* url of the legend image */
    },
  }
}
```

<!-- [mapItemStore](properties/mapItemStore.md ':include') -->
#### mapItemStore
`mapItemStore` - object

An object storing map items with in the currently viewport. Note that these map items may or may not be rendered in map canvas, the default project will not render anything in the map canvas. It is control by another plugin.

```javascript
{
  loading: boolean, /* Indicate if map items are loading or not */
  failure: boolean, /* Indicate if map items failed to load */
  success: boolean, /* Indicate if map items are loaded successfully */
  mapItems: [ /* An array of map items object */
    {
      name: string /* Name of the map item */
      floor: string, /* Floor id of the map item */
      coordinates: [
        number, /* coordinate x of the map item */
        number  /* coordinate y of the map item */
      ],
      id: string /* Id of the map item */
      type: string /* Map item type */
      photo: string|null /* photo url of the map item */,
      url: string|null /* url of the map item */
    }
  ]
}
```

<!-- [floorStore](properties/floorStore.md ':include') -->
#### floorStore
`floorStore` - object

An object storing the all the floor and building data.

```javascript
{
  loading: boolean, /* Indicate if floors are loading or not */
  failure: boolean, /* Indicate if floors failed to load */
  success: boolean, /* Indicate if floors are loaded successfully */
  floors: { /* An object of the floor data with floorId as keys */
    [floorId]: {
      name: string, /* Name of the floor */
      buildingId: string, /* Id of building of the floor belongs to */
      meterPerPixel: number, /* Meter per pixel of this floor's map */
      mapWidth: number, /* Width of the map of this floor */
      mapHeight: number, /* Height of the map of this floor */
      ratio: number, /* Ratio of the map to the mini map of this floor */
      defaultX: number, /* Default x position for this floor */
      defaultY: number, /* Default y position for this floor */
      defaultLevel: number /* Default level for this floor */
    }
  },
  buildingIds: [string], /* An array of all available building ids */
  buildings: { /* An object of the building data with buildingId as keys */
    [buildingId]: {
      name: string, /* Name of the building */
      floorIds: [string] /* An array of floor ids of the building */
    }
  }
}
```

<!-- [searchNearestStore](properties/searchNearestStore.md ':include') -->
#### searchNearestStore
`searchNearestStore` - object

An object storing the search nearest item result.

```javascript
{
  loading: boolean, /* Indicate if the nearest search result are loading or not */
  failure: boolean, /* Indicate if the nearest search result failed to load */
  success: boolean, /* Indicate if the nearest search result are loaded successfully */
  from: { /* Start location from the nearest item */
    coordinates: [
      number, /* x coordinate of the start location */
      number  /* y coordinate of the start location */
    ],
    type: string|null, /* Type of the start location */
    name: string, /* Name of the start location */
    id: string, /* Id of the start location */
    floor: string /* Floor id of the start location */
  },
  nearest: {
    coordinates: [
      number, /* x coordinate of the nearest item */
      number  /* y coordinate of the nearest item */
    ],
    type: string, /* Type of the nearest item */
    name: string, /* Name of the nearest item */
    id: string, /* Id of the nearest item */
    floor: string, /* Floor id of the nearest item */
  }
}
```

<!-- [searchShortestPathStore](properties/searchShortestPathStore.md ':include') -->
#### searchShortestPathStore
`searchShortestPathStore` - object

An object storing the shortest path between two locations.

```javascript
{
  loading: boolean, /* Indicate if the shortest path search result are loading or not */
  failure: boolean, /* Indicate if the shortest path search result failed to load */
  success: boolean, /* Indicate if the shortest path search result are loaded successfully */
  paths: [ /* An array of nodes of the shortest point */
    {
      floor: string, /* Floor of the node */
      coordinates: [
        number, /* x coordinate of the node */
        number  /* y coordinate of the node */
      ],
      nodeId: string, /* Id of the node */
      distance: number, /* Distance from previous node */
      id: string|null, /*  Map item id of the node, if the node is a map item */
      name: string|null, /*  Map item name if the node is a map item */
      type: string|null, /*  Map item type if the node is a map item */
      photo: string|null /*  Map item photo url if the node is a map item */
    }
  ]
}
```

<!-- [searchAreaInputStore](properties/searchAreaInputStore.md ':include') -->
#### searchAreaInputStore
`searchAreaInputStore` - object

An object storing the user input search query.

```javascript
{
  searchAreaInput: {
    from: {},  /* Starting point search object */
    to: {},    /* Ending point search object */
    searchOptions: { /* Search options object */
      sameFloor: boolean, /* Whether the nearest object should be on the same floor, only for nearest search */
      noStairCase: boolean, /* Whether the shortest path should include stair case */,
      noEscalator: boolean, /* Whether the shortest path should include escalator */,
      searchMode: "SHORTEST_TIME"|"SHORTEST_DISTANCE"|"MIN_NO_OF_LIFTS" /* Shortest path search mode */
    },
  }
}
```

Search starting or ending point object can be in one of the following format

Full information
```javascript
{
  name: string, /* Display name of the search object */
  data: {
    id: string, /* Id of the search object */
    floor: string, /* Floor of the search object */
    value: string, /* Value of the search object */
    type: "id", /* Search object type, full information search object type must be "id" */
    coordinates: [
      number, /* x coordinate of the search object */
      number  /* y coordinate of the search object */
    ]
  }
}
```

Only keyword
```javascript
{
  name: string, /* Display name of the search object */
  data: {
    type: 'keyword', /* Search object type */
    value: string /* Value of the search object, same as display name for keyword search object type */
  }
}
```

Nearest search
```javascript
{
  name: string, /* Display name of the search object */
  data: {
    type: 'nearest', /* Search object type */
    value: 'lift'|'male toilet'|'female toilet'|'express station'
           |'drinking fountain'|'ATM'|'mailbox'|'restaurant'
           |'virtual barn station'|'satellite printer' /* Nearest object type to be searched */
  }
}
```

<!-- [searchMapItemStore](properties/searchMapItemStore.md ':include') -->
#### searchMapItemStore
`searchMapItemStore` - object

An object storing the list the map items searched by keyword

```javascript
{
  loading: boolean, /* Indicate if the search result are loading or not */
  failure: boolean, /* Indicate if the search result failed to load */
  success: boolean, /* Indicate if the search result are loaded successfully */
  suggestions: [ /* An array of map item objects */
    {
      name: string, /* Name of the map item */
      floor: string, /* Floor id of the map item */
      coordinates: [
        number, /* x coordinate of the map item */
        number  /* y coordinate of the map item */
      ],
      id: string, /* Id of the map item */
      type: string|null /* Type of the map item */
    }
  ]
}
```

<!-- [appSettingStore](properties/appSettingStore.md ':include') -->
#### appSettingStore
`appSettingStore` - object

An object storing app settings.

```javascript
{
  loading: boolean, /* Indicate if app settings are loading or not */
  failure: boolean, /* Indicate if app settings failed to load */
  success: boolean, /* Indicate if app settings are loaded successfully */
  levelToScale: [number], /* An array of scales available */
  meterPerPixel: number, /* Meter per pixel ratio of the map */
  minutesPerMeter: number, /* Minutes per meter ratio */
  defaultPosition: { /* Default position to jump to when the user enter the index page */
    floor: string, /* Floor Id of the default position */
    x: number, /* x coordinate of the default position */
    y: number, /* y coordinate of the default position */
    level: number, /* Level of the default position */
  },
}
```

<!-- [openOverlayHandler](properties/openOverlayHandler.md ':include') -->
#### openOverlayHandler
`openOverlayHandler(name, photo, url, others)` - function

Open an map item overlay in primary panel area, the param pass in here will be accessible by OverlayHeaderPlugin and OverlayContentPlugin.

Parameters:

`name` - string - Name of the map item

`photo` - string - photo url of the map item, if any

`url` - string - website url of the map item, if any

`others` - object - any other custom data

## MapCanvasPlugin

### Inherited

`MapCanvasPlugin` can get all the properties PrimaryPanelPlugin gets, plus the following extra properties:

### Properties

<!-- [width](properties/width.md ':include') -->
#### width
`width` - number

Current map canvas width.

<!-- [height](properties/height.md ':include') -->
#### height
`height` - number

Current map canvas height.

#### scaledWidth
`scaledWidth` - number

`width` multiply by current level's scale.

#### scaledHeight
`scaledHeight` - number

`height` multiply by current level's scale.

<!-- [movingX](properties/movingX.md ':include') -->
#### movingX
`movingX` - number

x coordinate of the center of the map canvas while the user is doing drag and drop action.

<!-- [movingY](properties/movingY.md ':include') -->
#### movingY
`movingY` - number

y coordinate of the center of the map canvas while the user is doing drag and drop action.

#### movingScaledX
`movingScaledX` - number

`movingX` multiply by current level's scale.

#### movingScaledY
`movingScaledY` - number

`movingY` multiply by current level's scale.

<!-- [movingLeftX](properties/movingLeftX.md ':include') -->
#### movingLeftX
`movingLeftX` - number

x coordinate offset on the left of the map canvas reference to `movingX` while the user is doing drag and drop action.

<!-- [movingTopY](properties/movingTopY.md ':include') -->
#### movingTopY
`movingTopY` - number

y coordinate offset at the top of the map canvas while the user is doing drag and drop action.

#### movingScreenLeftX
`movingScreenLeftX` - number

Similar to `movingLeftX`, but use `movingScaledX` as reference point.

#### movingScreenLeftY
`movingScreenLeftY` - number

Similar to `movingLeftY`, but use `movingScaledY` as reference point.

#### nextLevel
`nextLevel` - number

Next possible zoom level value that represents a larger scale value. Value Will be the same as `level` if there is no possible next zoom level.

#### previousLevel
`previousLevel` - number

Previous zoom level that represents a smaller scale value. Value will be the same as `level` if there is no possible previous zoom level.

####
<!-- [APIEndpoint](properties/APIEndpoint.md ':include') -->

#### APIEndpoint
`APIEndpoint` - string

The root API endpoint of the system.

<!-- [addMapTiles](properties/addMapTiles.md ':include') -->
#### addMapTiles
`addMapTiles([mapTile1, mapTile2, ...])` - function

Add a map tile to the map canvas.

It takes an array of map tile objects.

mapTile object

```javascript
{
  id: string, /* Id of the map tile */
  floor: string, /* Floor id for the map tile */,
  x: number, /* x coordinate of the map tile */
  y: number, /* y coordinate of the map tile */
  image: HTMLImageElement, /* Image of the map tile */,
  width:number|null, /* Width of the image or if null is given it will be determined automatically when the image is loaded */
  height:number|null, /* Height of the image or if null is given it will be determined automatically when the image is loaded */
  hidden:boolean, /* Wether the map tile is hidden */
  scalePosition: boolean, /* Should the map item scale it's position when the map scale change */
  scaleDimension: boolean, /* Should the map item scale it's dimension when the map scale change */
}
```

<!-- [setMapItems](properties/setMapItems.md ':include') -->
#### setMapItems
`setMapItems([mapItem1, mapItem2, ...])` - function

Add or update a map item on the map canvas.

It takes an array of objects as an argument with the following format:
Note that you can only define one of the following properties in the object

`textElemenet`, `circle`, `rect`, `line`, `image`

If you define more than one, only the first encountered one will be taken and the rest will be ignore.
A map item doesn't support multiple types, you should define two map items with different types.

mapItem object:

```javascript
{
  id: string, /* Id of the map item */
  floor: string, /* Floor id for the map item */
  x: number, /* x coordinate of the map item */
  y: number, /* y coordinate of the map item */
  image: HTMLImageElement, /* Image of the map item */
  width:number|null, /* Width of the map item or if null is given, it will be determined automatically */
  height:number|null, /* Height of the map item or if null is given, it will be determined automatically */
  center: boolean, /* The x,y coordinates will be set as a center of the object if set to true */
  hidden: boolean, /* Wether the map tile is hidden */
  scalePosition: boolean, /* Should the map item scale it's position when the map scale change */
  scaleDimension: boolean, /* Should the map item scale it's dimension when the map scale change */
  onClick: function|null, /* callback function to be called when the map item is clicked */
  onMouseOver: function|null, /* callback function to be called when the cursor is over the map item */
  onMouseOut: function|null, /* callback function to be called when the cursor was over the map item and now is out side the map item */
  hitX: number|null, /* The custom x coordinate on the left of the map item used in calculating hit test, will use default x coordinate if this is not specified */
  hitY: number|null, , /* The custom y coordinate at the top of the map item used in calculating hit test, will use default y coordinate if this is not specified */
  hitWidth: number|null, /* The custom width of the map item used in calculating hit test, will use default width of the map item if this is not specified */
  hitHeight: number|null, /* The custom height of the map item used in calculating hit test, will use default height of the map item if this is not specified */
  others: {}, /* Any other custom data to be attached to this map item */
  textElement: {
    style: string, /* Font style of the text in CSS font format*/
    color: string, /* Color the text in CSS format */
    text: string, /* The text message */
    maxLineWidth: number /* The max line width allowed in pixel, the text will be wrapped into multiple lines if the width exceeds this number */
  },
  circle: {
    radius: number, /* Radius of the circle */
    color: string, /* Color of the circle in CSS format */
    borderColor: string /* Border color of the circle in CSS format */
  },
  rect: {
    width: number, /* Width of the rect */
    height: number, /* Height of the rect */
    color: string, /* Color of the rect in CSS format */
    borderColor: string /* Border color of the rect in CSS format */
  },
  line: {
    coordinates: [[]], /* An array of absolute coordinates [x, y] array which defines the line, center and scaleDimension options will be forced to false if line is given */
    strokeStyle: string, /* Color of the line in CSS format */
    cap: "butt"|"round"|"square", /* Determines how the end points of every line are drawn */
    width: number /* Width of the line */
  },
  shape: {
    coordinates: [[]], /* An array of relative coordinates [x, y] array which defines a shape, the first coordinate should always be [0,0] */
    strokeStyle: string, /* Color of the line in CSS format */
    fillStyle: string, /* Color of the background in CSS format */
    cap: "butt"|"round"|"square", /* Determines how the end points of every line are drawn */
    width: number /* Width of the line */
  }
}
```

<!-- [removeMapItem](properties/removeMapItem.md ':include') -->
#### removeMapItem
`removeMapItem(mapItemId)` - function

Remove a map item on the map canvas. It takes an map item id as first argument.

If map item id is not found. This function will do nothing.

<!-- [updateDimension](properties/updateDimension.md ':include') -->
#### updateDimension
`updateDimension(width, height)` - function

Update the dimension of the map canvas area.

<!-- [addMapItemClickListener](properties/addMapItemClickListener.md ':include') -->

#### addMapItemClickListener
`addMapItemClickListener(id, mapItemId, listener, isPrepend)` - function

Add a click listener to a map item. Every map item can have more than one listener. They will be save into a list and will be triggered one after one. But if one of the listeners in the list return false, it will stop triggering all other listeners behind in the list.

Parameters:

`id` - string - Id of the click listener.

`mapItemId` - string - Id of the map item to attach listener.

`listener` - function - function to be called when the event is triggered.
If the function return `false` then it will stop triggering any other listeners in the list behind.
When the listener is triggered, it will receive a map item object, see `setMapItems` for the the format of a map item object. The map item object received will also include two new properties `renderedX` and `renderedY` which is the actual coordinates when they are rendered in map canvas.

`isPrepend` - boolean - Prepend to the map item's listener list. Useful if your listener will to stop all other listeners is the list behind.

<!-- [addMapItemMouseOverListener](properties/addMapItemMouseOverListener.md ':include') -->
#### addMapItemMouseOverListener
`addMapItemMouseOverListener(id, mapItemId, listener, isPrepend)` - function

Add a mouse over listener to a map item. Every map item can have more than one listener. They will be save into a list and will be triggered one after one. But if one of the listeners in the list return false, it will stop triggering all other listeners behind in the list.

Parameters:

`id` - string - Id of the mouse over listener.

`mapItemId` - string - Id of the map item to attach listener.

`listener` - function - function to be called when the event is triggered.
If the function return `false` then it will stop triggering any other listeners in the list behind.

`isPrepend` - boolean - Prepend to the map item's listener list. Useful if your listener will to stop all other listeners is the list behind.

<!-- [addMapItemMouseOutListener](properties/addMapItemMouseOutListener.md ':include') -->
#### addMapItemMouseOutListener
`addMapItemMouseOutListener(id, mapItemId, listener, isPrepend)` - function

Add a mouse out listener to a map item. Every map item can have more than one listener. They will be save into a list and will be triggered one after one. But if one of the listeners in the list return false, it will stop triggering all other listeners behind in the list.

Parameters:

`id` - string - Id of the mouse out listener.

`mapItemId` - string - Id of the map item to attach listener.

`listener` - function - function to be called when the event is triggered.
If the function return `false` then it will stop triggering any other listeners in the list behind.

`isPrepend` - boolean - Prepend to the map item's listener list. Useful if your listener will to stop all other listeners is the list behind.

<!-- [removeMapItemClickListener](properties/removeMapItemClickListener.md ':include') -->
#### removeMapItemClickListener
`removeMapItemClickListener(id, mapItemId)` - function

Remove a map item click listener.

`id` - string - Id of the listener to be removed.

`mapItemId` - string - Id of the map item listener to be removed.

<!-- [removeMapItemMouseOverListener](properties/removeMapItemMouseOverListener.md ':include') -->
#### removeMapItemMouseOverListener
`removeMapItemMouseOverListener(id, mapItemId)` - function

Remove a map item mouse over listener.

`id` - string - Id of the listener to be removed.

`mapItemId` - string - Id of the map item listener to be removed.

<!-- [removeMapItemMouseOutListener](properties/removeMapItemMouseOutListener.md ':include') -->
#### removeMapItemMouseOutListener
`removeMapItemMouseOutListener(id, mapItemId)` - function

Remove a map item mouse out listener.

`id` - string - Id of the listener to be removed.

`mapItemId` - string - Id of the map item listener to be removed.

## OverlayHeaderPlugin

### Properties

<!-- [name](properties/name.md ':include') -->
#### name
`name` - string

Name of the map item.

<!-- [url](properties/url.md ':include') -->
#### url
`url` - string

Website url of the map item.

<!-- [photo](properties/photo.md ':include') -->
#### photo
`photo` - string

Photo url of the map item.

<!-- [others](properties/others.md ':include') -->
#### others
`others` - object

A object with any custom properties of the map item other than the the default `name`, `url` and `photo` It can be defined when other plugin calls `openOverlayHandler`

## OverlayContentPlugin

### Properties

<!-- [name](properties/name.md ':include') -->
#### name
`name` - string

Name of the map item.

<!-- [url](properties/url.md ':include') -->
#### url
`url` - string

Website url of the map item.

<!-- [photo](properties/photo.md ':include') -->
#### photo
`photo` - string

Photo url of the map item.

<!-- [others](properties/others.md ':include') -->
#### others
`others` - object

A object with any custom properties of the map item other than the the default `name`, `url` and `photo` It can be defined when other plugin calls `openOverlayHandler`