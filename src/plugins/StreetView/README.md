Street view plugin can be divided into two major parts: one is the small man feature, the other is the panoramic image display. 

The plugin is controlled by a master class called StreetView. StreetView is the end point connecting to the main body of pathadviser. It only communicate with the subcomponents through signals, but does not touch actual image rendering.

StreetView mediates the communication between four subcomponents:

- [BaseMan](#baseman), which can be clicked by the user to pull out the small man.
- [DragMan](#dragman), which handles the small man display when the user has clicked BaseMan and dragged the small man out by not yet dropped the small man onto the map.
- [PinMan](#pinman), which handles the display of the small man when it is dropped onto the map. It rotates in response to the rotation of panoramic image.
- [PanoDisplay](#panodisplay), which displays the panoramic image and handles image rotation and navigation effect. It is much more complex than the three small man classes.

## How angle is defined in the plugin
For all angle quantities in StreetView, angle=0 corresponds to **North** direction in campus map. An **increment** in the value of angle corresponds to rotation in **clockwise** orientation.

*Code Review Notes: In this plugin's context, the actual **west** is regarded as **north**. This is because the backend data marks the X-coord of the **west** direction of each image, and the original frontend author thinks it is the north*. So geographically speaking, angle=0 corresponds to **west** and the map coordinate system uses **+y = south, +x = east**. But functionalities are not affected. 

## StreetView
This is the highest level StreetView component. 

It calls the render functions of BaseMan, DragMan and PinMan in its render function.

It only communicates with the subcomponents through signals, but does not 
touches concrete image display.

Subcomponet interactions: 
- Initially, set BaseMan at available mode(baseManAvail=true), and hide DragMan(displayDragMan=false). The PanoDisplay is not rendered.
- Then when BaseMan is pressed, BaseMan will call handleBaseManPressed function in StreetView. StreetView then set BaseMan as unavailable(baseManAvail=false) and display DragMan(displayDragMan=true).
- Then when DragMan is dropped, DragMan will call handleDragManDrop function in StreetView. StreetView will then hide DragMan(displayDragMan=falese) and restore BaseMan to available(baseManAvail=true). StreetView will also call the render function of PanoDisplay to show the panoramic image.

### positiveModulo(number, modulo)
A helper function which implements the mathematical modulo function.

Examples:
``` Javascript
positiveModulo(17, 5); // 2

positiveModulo(15, 3); // 0

positiveModulo(-2, 5); // 3

positiveModulo(-7, 3); // 2

positiveModulo(3, -5); // undefined
```

### class StreetView
Inherited from React.Component.

#### componet state(upon initialization)
```Javascript
{
 baseManAvail: true,
 displayDragMan: false,
 displayPinMan: false,
 displayPano: false,
 fullScreenPano: false,
 PinManAngle: 0,
 panoX: 0,
 panoY: 0,
 panoUrl: "",
 panoDefaultOffset: 0,
 panoDefaultClockwiseAngleFromNorth: 0,
};
```
#### parent props connected
```Javascript
platform,
canvas,
setMapItems,
removeMapItem,
x,
y,
floor,
height,
normalizedHeight,
width,
normalizedWidth,
linkTo
```
#### constructor(props)
Initialize StreetView comonent.
#### getCampusXYFromMouseXY(canvas, mouseX, mouseY) 
Input: user mouse coordinate on screen (normally event.clientX and event.clientY) 

Returns: campus coordinate in map.

It relies on *canvas* property passed in from parent component.

This can be very helpful. Feel free to make good use of it.

#### componentDidUpdate(prevProps, prevState)
Event handler for general updates in StreetView component.

List of attributes monitored and corresponding handlers called when attributes changed:
-  props.floor, [handleFloorChange()](#handlefloorchange) is called when changed.

#### handleFloorChange
Event handler when the user changes floor. 

Now simply call [handlePanoClose()](#handlepanoclose) to close the PanoDisplay.

#### handleBaseManPressed
Event handler when BaseMan signifies it is been pressed.

The behaviors is set StreetView state such that BaseMan is not availible, display DragMan and do not display PinMan.

#### handleDragManDrop
Event handler when PinMan is dropped onto the map.

It fist call [getCampusXYFromMouseXY()](#getcampusxyfrommousexy) to convert the user's mouse coordinate to the corresponding coordinate on campus map. Then call [placePinManAt()](#placepinmanat) to place a PinMan to the correct location.

#### handleNavigation
Input: movementDirection , a string in {"Forward","Backward"}, or an angle counted clockwise from North direction, representing the movement direction of the user of navigation function.

It calls [placePinManAt()](#placepinManat) to place the PinMan to the next location.

It relies on [getNextPano()](#getnextpano) exposed by [backend API](#backendapi) to retrive the coordinates of next node to place the PinMan. 

#### handlePanoClose
The handler function to close the PanoDisplay. 

It sets componet state such that PinMan and PanoDisplay are both not displayed, and reset fullScreenPano mode to false.

#### handlePanoResize 
The handler function to handle a resize event of PanoDisplay.

It sets the current fullScreenPano flag to its negation.

#### handlePanoRotate
Input: newAngle
The handler function to handle a panoramic rotation event.

It simply sets the PinManAngle state to newAngle.
####  renderBaseMan
Input: buttonClassName
Returns the React markup for a BaseMan component.

The props passed in to the BaseMan object:
```Javascript
available={this.state.baseManAvail}
buttonClassName={buttonClassName}
parentHandlePressed={() => this.handleBaseManPressed()}
```
#### renderDragMan
Input: buttonClassName
Returns the React markup for a DragMan component.

The props passed in to the DragMan component:
```Javascript
display={this.state.displayDragMan ? "block" : "none";}
buttonClassName={buttonClassName}
parentHandleDrop={(e) => this.handleDragManDrop(e)}
```

#### renderPinMan
If the displayPinMan flag is off, return null.
Else, return the React markup for a PinMan component.
The props passed in to the PinMan component:
```Javascript
setMapItems={this.props.setMapItems}
removeMapItem={this.props.removeMapItem}
x = {this.state.panoX}
y = {this.state.panoY}
floor = {this.props.floor}
angle={this.state.PinManAngle}
```
#### renderPano
If the displayPano flag is off, return null.
Otherwise return the React markup for a PanoDisplay component.

Props passed to PanoDisplay:
```Javascript
panoImage={this.state.panoUrl}
defaultOffset={this.state.panoDefaultOffset}
defaultClockwiseAngleFromNorth={this.state.panoDefaultClockwiseAngleFromNorth}
width={this.props.width}
height={this.props.height}
parentOffShow={() => this.handlePanoClose()}
parentHandleUpdate={(e) => this.handlePanoRotate(e)}
parentHandleNavigation={(forwardDirection) => this.handleNavigation(forwardDirection)}
```
#### render
Call [renderPano()](#renderpano),[renderPinMan()](#renderpinman),[renderBaseMan()](#renderbaseman),[renderDragMan()](#renderdragman) in sequence to render the StreetView plugin.


#### placePinManAt
Input: PanoServerEndPoint, floor, x, y

Set component state such that 
1. PinMan is placed on *floor* at a position that has a panoramic image and is closest to *(x,y)* position on campus map, through *PanoServerEndPoint* url. 
2. The PanoDisplay shows the correct panoramic image corresponds to the location of PinMan.
3. Move the campus map so that the PinMan is displayed at the centre of the canvas.

It relies on [getPanoInfo()](#getpanoinfo) exposed by [backend API](#backendapi) to retrieve the position to place PinMan and the correct panoramic image to display.

## BackendAPI
This module specifies the communication interface functions between frontend and backend.

### getPanoInfo

The expected behavior of getPanoInfo in backendAPI:

Input: PanoServerEndPoint, floor, x, y

Returns: a promise.

Response: 
```Javascript
{ 
    pano_x, //a number, the x-coordinate of the nearest panoramic node to (x,y) on campus map.
    pano_y, //a number, the y-coordinate of the nearest panoramic node to (x,y) on campus map.
    panoUrl, //a string, the panoramic image url at (pano_x,pano_y) on campus map.
    panoDefaultOffset, //a number, the initial offset for the panoramic image corresponds to the zero-degree. Used in PanoDisplay.
    panoDefaultClockwiseAngleFromNorth, // a number, between 0 and 360. The angle in physical world corresponding to the zero-degree. For example if the panoramic image deems East direction as its zero-degree position, then this field should be 90. If North direction is the zero-degree position, then this filed should be 0.
     } 
```


### getNextPano

The expected behavior of getNextPano in backendAPI.

Input: PanoServerEndPoint, floor, currX, currY, forwardAngle.

Returns: a promise.

Response: {targetX,targetY,targetId}. They are the attributes of the next node to move to from *floor*, *(currX,currY)* on campus map facing *forwardAngle*. See [conceptual definition of angle](#how-angle-is-defined-in-the-plugin) for how angle is formally defined in this plugin.           
    


## BaseMan

This is the class component for BaseMan. It is an icon displayed at the bottom left of the canvas indicating the availibility of street view feature.

If parent passes in props.available==true, BaseMan only performs mouse over effect through handleMouseOver and handleMouseOut.

Else if parent passes in props.available==false, BaseMan directly display outsideImage.

When BaseMan is pressed(onMouseDown), it calls the [handle function](#handlebasemanpressed) passed down by parent.

### class BaseMan
Inherited from React.Component.
#### componet state
```Javascript
{
    imageForAvail: an image data url or a website url. It is initialzed to avaiImage.
}
```
#### constructor(props)
Initializes the component state. 

#### handleMouseOver()
Handler of mouse over event on BaseMan. It changes the imageForAvail to be displayed to mouseoverImage.

#### handleMouseOut()
Handler of mouse out event on BaseMan. It changes the imageForAvail to be displayed to availImage. 

#### render()
Parent controls whether the BaseMan now is availible, by passing in props.availible. If props.availible is false, always display outsideImage. Otherwise, display state.imageForAvail.

## DragMan

This is the function component for DragMan. 

It is hidden by default(display=="none"), and is displayed only when the parent component passes in display=="block". 

The DragMan follows the mouse trajectory of the client, this effect is achieved by simple javascript manipulation on HTML elements(see updateDragManPosition), not using React.

When the DragMan is dropped(onMouseUp), it calls the handle function passed in by the parent.

### updateDragManPosition
The function takes an event object(e), obtain the clientX and clientY coordinates for the event, and place the DragMan html element to the postion of user's mouse cursor using Javascript.

### DragMan({ display, buttonClassName, initialX, initialY, parentHandleDrop })
The function which actually renders the DragMan icon. It defines a global event listener of onmousemove and assign its value to reference to [updateDragManPosition(e)](#updatedragmanposition) function.


## PinMan
This is the pin man component after drag man is dropped on map.

It sets an map item on the location on map where mouse is released, the location is passed in by parent.

It accepts an angle passed in by the parent, then display the small man image corresponding to the angle.

All PinMan images are imported statically when the program compiles.


### getPinManImage(angle)
A helper function outside for PinMan.

Input: angle, a number between 0 and 360. Refer to [conceptual definition of angle](#how-angle-is-defined-in-the-plugin) for how angle is formally defined in this plugin.

Returns: the corresponding PinMan image to the angle.

Expected behavior:
There are 16 PinMan images availible. angle=0 should correspond to the image facing left. As angle increases, the PinMan rotates in clockwise orientation.


### PinMan({ setMapItems, removeMapItem, x, y, floor, angle })
The function which acutally renders PinMan icon.

The actual rendering parameters are passed in from parent component, including floor, x-y coordinate on campus map, angle for the PinMan.

If all in {*angle,x,y*} are defined, the setMapItems() function is called to place a PinMan image facing *angle* on *floor*, at *(x,y)* position.

If one in {*angle,x,y*} is none, the removeMapItem() function is called to remove the current PinMan icon from the campus map(if any).

## PanoDisplay
Please provide details below.

