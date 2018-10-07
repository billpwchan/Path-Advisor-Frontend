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