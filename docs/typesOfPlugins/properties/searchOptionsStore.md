#### searchOptionsStore
`searchOptionsStore` - object

An object storing the user search options

```javascript
{
  sameFloor: boolean, /* Whether the nearest object should be on the same floor, only for nearest search */
  noStairCase: boolean, /* Whether the shortest path should include staircase connecting from one floor to another floor, it doesn't exclude steps on the same floor */
  noEscalator: boolean, /* Whether the shortest path should include escalator */
  stepFreeAccess: boolean, /* Whether the shortest path should be completely step free, if this is set to true, it will ignore noStairCase and noEscalator settings as the path returned will be completely step free */
  searchMode: "SHORTEST_TIME"|"SHORTEST_DISTANCE"|"MIN_NO_OF_LIFTS", /* Shortest path search mode */
  actionSource: "EXTERNAL_LINK"|"BUTTON_CLICK"|"DRAG_AND_DROP"|"CONTEXT_MENU" /* where the search action are initiated from an external link or a button click in the app */
}
```