```javascript
{
  type: 'GET_AUTOCOMPLETE',
  payload: { keyword: '35' }
}
```

```javascript
{
  type: 'GET_MAP_ITEMS',
  payload: { floor: '1', coordinates: [1614, 1269], offsetCoordinates: [970,316]}
}
```

```javascript
{
  type: 'SEARCH_NEAREST',
  payload: { floor: '3', name: 'ROOM 3542', nearestType: 'lift', sameFloor: true }
}
```

```javascript
{
  type: 'SEARCH_SHORTEST_PATH',
  payload: { from: {keyword: '3542'}, to: {keyword: 'Atrium'} }
}
```

```javascript
{
  type: 'SEARCH_SHORTEST_PATH',
  payload: { from: {id: 'p142', floor: "3"}, to: {id: 'p11', floor: "G"} }
}
```


```javascript
{
  type: 'SEARCH_SHORTEST_PATH',
  payload: { from: { nodeId: "n614", floor: "3" }, to: { nodeId: "n241", floor: "G" } }
}
```

Requests

```javascript
fetchIdToNodeIdRequest("3", "p142");
```

```javascript
fetchNodeIdsToMapItemsRequest([
  { floor: "3", nodeId: "n614" },
  { floor: "3", nodeId: "n198" },
  { floor: "3", nodeId: "n197" },
  { floor: "3", nodeId: "n195" },
  { floor: "3", nodeId: "n1239" },
  { floor: "3", nodeId: "n194" },
  { floor: "3", nodeId: "n193" },
  { floor: "3", nodeId: "n1238" },
  { floor: "3", nodeId: "n1237" },
  { floor: "3", nodeId: "n192" },
  { floor: "3", nodeId: "n174" },
  { floor: "3", nodeId: "n173" },
  { floor: "3", nodeId: "n1215" },
  { floor: "3", nodeId: "n176" },
  { floor: "3", nodeId: "n175" },
  { floor: "3", nodeId: "n178" },
  { floor: "3", nodeId: "n179" },
  { floor: "3", nodeId: "n181" },
  { floor: "3", nodeId: "n585" },
  { floor: "1", nodeId: "n246" },
  { floor: "1", nodeId: "n101" },
  { floor: "1", nodeId: "n100" },
  { floor: "1", nodeId: "n99" },
  { floor: "1", nodeId: "n135" },
  { floor: "1", nodeId: "n98" },
  { floor: "1", nodeId: "n255" },
  { floor: "1", nodeId: "n474" },
  { floor: "1", nodeId: "n96" },
  { floor: "1", nodeId: "n97" },
  { floor: "1", nodeId: "n94" },
  { floor: "1", nodeId: "n93" },
  { floor: "1", nodeId: "n92" },
  { floor: "1", nodeId: "n572" },
  { floor: "1", nodeId: "n95" },
  { floor: "1", nodeId: "n470" },
  { floor: "1", nodeId: "n467" },
  { floor: "1", nodeId: "n466" },
  { floor: "1", nodeId: "n465" },
  { floor: "1", nodeId: "n464" },
  { floor: "1", nodeId: "n91" },
  { floor: "1", nodeId: "n90" },
  { floor: "1", nodeId: "n450" },
  { floor: "1", nodeId: "n446" },
  { floor: "G", nodeId: "n65" },
  { floor: "G", nodeId: "n281" },
  { floor: "G", nodeId: "n280" },
  { floor: "G", nodeId: "n279" },
  { floor: "G", nodeId: "n56" },
  { floor: "G", nodeId: "n59" },
  { floor: "G", nodeId: "n238" },
  { floor: "G", nodeId: "n241" }
]);
```

```javascript
searchShortestPathRequest({ keyword: "3542" }, { keyword: "Atrium" });
searchShortestPathRequest(
  { nodeId: "n614", floor: "3" },
  { nodeId: "n241", floor: "G" }
);
```
