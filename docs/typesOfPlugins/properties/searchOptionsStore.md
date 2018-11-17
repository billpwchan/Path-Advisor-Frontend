#### searchOptionsStore
`searchOptionsStore` - object

An object storing the user search options

```javascript
{
  sameFloor: boolean, /* Whether the nearest object should be on the same floor, only for nearest search */
  noStairCase: boolean, /* Whether the shortest path should include stair case */
  noEscalator: boolean, /* Whether the shortest path should include escalator */
  searchMode: "SHORTEST_TIME"|"SHORTEST_DISTANCE"|"MIN_NO_OF_LIFTS", /* Shortest path search mode */
  actionSource: "EXTERNAL_LINK"|"BUTTON_CLICK" /* where the search action are initiated from an external link or a button click in the app */
}
```