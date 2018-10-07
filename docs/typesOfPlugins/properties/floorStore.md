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