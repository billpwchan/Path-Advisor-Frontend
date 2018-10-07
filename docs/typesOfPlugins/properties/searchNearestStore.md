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
