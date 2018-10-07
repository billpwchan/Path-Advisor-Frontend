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