#### setMapItems
`setMapItems([mapItem1, mapItem2, ...])` - function

Add or update a map item on the map canvas.

It takes an array of objects as an argument with the following format:
Note that you can only define one of the following properties in the object

`textElemenet`, `circle`, `rect`, `line`, `image`, `shape`

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
  zIndex:number|null, /* The depth of the map item, when map items overlap each other, the map item with higher zIndex will cover those with lower zIndex, default to 0 */
  center: boolean, /* The x,y coordinates will be set as a center of the object if set to true */
  hidden: boolean, /* Wether the map tile is hidden */
  scalePosition: boolean, /* Should the map item scale it's position when the map scale change */
  scaleDimension: boolean, /* Should the map item scale it's dimension when the map scale change */
  onClick: function|null, /* callback function to be called when the map item is clicked */
  onMouseOver: function|null, /* callback function to be called when the cursor is over the map item */
  onMouseOut: function|null, /* callback function to be called when the cursor was over the map item and now is out side the map item */
  customHitX: number|null, /* The custom x coordinate on the left of the map item used in calculating hit test, will use default x coordinate if this is not specified */
  customHitY: number|null, , /* The custom y coordinate at the top of the map item used in calculating hit test, will use default y coordinate if this is not specified */
  customHitWidth: number|null, /* The custom width of the map item used in calculating hit test, will use default width of the map item if this is not specified */
  customHitHeight: number|null, /* The custom height of the map item used in calculating hit test, will use default height of the map item if this is not specified */
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