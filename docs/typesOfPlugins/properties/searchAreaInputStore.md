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
