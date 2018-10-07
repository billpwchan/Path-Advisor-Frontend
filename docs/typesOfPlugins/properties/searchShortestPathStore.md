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