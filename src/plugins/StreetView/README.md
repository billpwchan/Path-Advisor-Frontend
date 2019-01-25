Street view plugin can be divided into two major parts: one is the small man feature, the other is the panoramic image display. 

The plugin is controlled by a master class called StreetView. StreetView is the end point connecting to the main body of pathadviser. It only communicate with the subcomponents through signals, but does not touch actual image display.

StreetView mediates the communication between four subcomponents:

- [BaseMan](#class-baseman), which can be clicked by the user to pull out the small man.
- [DragMan](#class-dragman), which handles the small man display when the user has clicked BaseMan and dragged the small man out by not yet dropped the small man onto the map.
- [PinMan](#class-pinman), which handles the display of the small man when it is dropped onto the map. It rotates in response to the rotation of panoramic image.
- PanoDisplay, which displays the panoramic image and handles image rotation and navigation effect. It is much more complex than the three small man classes.

### class StreetView
This is the highest level StreetView component. 

It calls the render functions of BaseMan, DragMan and PinMan in its render function.

It only communicates with the subcomponents through signals, but does not 
touches concrete image display.

Subcomponet interactions: 
- Initially, set BaseMan at available mode(baseManAvail=true), and hide DragMan(displayDragMan=false). The PanoDisplay is not rendered.
- Then when BaseMan is pressed, BaseMan will call handleBaseManPressed function in StreetView. StreetView then set BaseMan as unavailable(baseManAvail=false) and display DragMan(displayDragMan=true).
- Then when DragMan is dropped, DragMan will call handleDragManDrop function in StreetView. StreetView will then hide DragMan(displayDragMan=falese) and restore BaseMan to available(baseManAvail=true). StreetView will also call the render function of PanoDisplay to show the panoramic image.

### class BaseMan

This is the class component for BaseMan.

If parent passes in available==true, BaseMan only performs mouse over effect through handleMouseOver and handleMouseOut.

Else if parent passes in available==false, BaseMan directly display outsideImage.

When BaseMan is pressed(onMouseDown), it calls the [handle function](#class-streetview) passed down by parent.

### class DragMan

This is the function component for DragMan. 

It is hidden by default(display=="none"), and is displayed only when the parent component passes in display=="block". 

The DragMan follows the mouse trajectory of the client, this effect is achieved by simple javascript manipulation on HTML elements(see updateDragManPosition), not using React.

When the DragMan is dropped(onMouseUp), it calls the handle function passed in by the parent.


### class PinMan
This is the pin man component after drag man is dropped on map.

It sets an map item on the location on map where mouse is released, the location is passed in by parent.

It accepts an angle passed in by the parent, then display the small man image corresponding to the angle.

### class PanoDisplay
Please provide details below.