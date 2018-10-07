#### addMapItemMouseOverListener
`addMapItemMouseOverListener(id, mapItemId, listener, isPrepend)` - function

Add a mouse over listener to a map item. Every map item can have more than one listener. They will be save into a list and will be triggered one after one. But if one of the listeners in the list return false, it will stop triggering all other listeners behind in the list.

Parameters:

`id` - string - Id of the mouse over listener.

`mapItemId` - string - Id of the map item to attach listener.

`listener` - function - function to be called when the event is triggered.
If the function return `false` then it will stop triggering any other listeners in the list behind.

`isPrepend` - boolean - Prepend to the map item's listener list. Useful if your listener will to stop all other listeners is the list behind.