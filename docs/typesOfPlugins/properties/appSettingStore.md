#### appSettingStore
`appSettingStore` - object

An object storing app settings.

```javascript
{
  loading: boolean, /* Indicate if app settings are loading or not */
  failure: boolean, /* Indicate if app settings failed to load */
  success: boolean, /* Indicate if app settings are loaded successfully */
  levelToScale: [number], /* An array of scales available */
  meterPerPixel: number, /* Meter per pixel ratio of the map */
  minutesPerMeter: number, /* Minutes per meter ratio */
  defaultPosition: { /* Default position to jump to when the user enter the index page */
    floor: string, /* Floor Id of the default position */
    x: number, /* x coordinate of the default position */
    y: number, /* y coordinate of the default position */
    level: number, /* Level of the default position */
  },
}
```