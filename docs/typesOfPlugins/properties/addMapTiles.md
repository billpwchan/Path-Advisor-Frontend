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
  scalePosition: boolean, /* Should the map tile scale it's position when the map scale change */
  scaleDimension: boolean, /* Should the map tile scale it's dimension when the map scale change */
}
```