null values are the type missing for now. It will be there after backend revamp task.

## searchMapItem API, Node Ids to object API:

```javascript
[{ name: "Cafe", floor: "1", coordinates: [1, 1], id: "p12", type: null }];
```

## Nearest API:

```javascript
{
  nearest: { type: 'lift', name: 'LIFT 30', id: 'p144', coordinates: [1, 1], floor: 4}
  from: { name: 'Cafe', floor: '1', coordinates: null, id: 'p12', type: null}
}
```

## MapItems API

```javascript
[
  {
    name: "MALE TOILET",
    floor: null,
    coordinates: [1, 1],
    id: "p12",
    type: "male toilet",
    plugin_photo: "",
    plugin_url: ""
  }
];
```

## Search API

```javascript
[
  {
    floor: "1",
    coordinates: [1, 1],
    distance: 10,
    nodeId: "39",
    type: "lift",
    name: "LIFT 30",
    id: "p144",
    plugin_photo: "",
    plugin_url: ""
  }
];
```

## Object id to node id API

This will be deprecated after API revamped, new API will happily take both node id or object id for all requests

```javascript
{ nodeId: 'n234', floor: '3'}
```

## Node Ids to objects API

```javascript
[
  {
    name: "Cafe",
    floor: "1",
    id: "p12",
    type: "rest",
    nodeId: "n1",
    plugin_photo: ""
  }
];
```
