#### addMapItemClickListener
`addMapItemClickListener(id, mapItemId, listener, isPrepend)` - function

Add a click listener to a map item. Every map item can have more than one listener. They will be save into a list and will be triggered one after one. But if one of the listeners in the list return false, it will stop triggering all other listeners behind in the list.

Parameters:

`id` - string - Id of the click listener.

`mapItemId` - string - Id of the map item to attach listener.

`listener` - function - function to be called when the event is triggered.
If the function return `false` then it will stop triggering any other listeners in the list behind.
When the listener is triggered, it will receive a map item object, see `setMapItems` for the the format of a map item object. The map item object received will also include two new properties `renderedX` and `renderedY` which is the actual coordinates when they are rendered in map canvas.

`isPrepend` - boolean - Prepend to the map item's listener list. Useful if your listener will to stop all other listeners is the list behind.