#### legendStore
`legendStore` - object

An object storing all legend types available for map items
```javascript
{
  loading: boolean, /* Indicate if legends are loading or not */
  failure: boolean, /* Indicate if legends failed to load */
  success: boolean, /* Indicate if legends are loaded successfully */
  legendIds: [], /* An array of legendIds in string */
  legends: { /* An object of legend data with legendId as keys */
    [legendId]: {
      name: string, /* Name of the legend */
      image: string  /* url of the legend image */
    },
  }
}
```