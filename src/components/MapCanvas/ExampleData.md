```javascript
img = new Image();
canvasHandler.addMapItems([
  {
    id: 1,
    floor: "G",
    x: 0,
    y: 0,
    textElement: {
      size: "12 px",
      family: "Verdana",
      color: "red",
      text: "abcdefghijklmnopqrstuvwxyz"
    },
    onClick: () => console.log("I am clicked")
  },
  {
    id: 2,
    floor: "G",
    x: 30,
    y: 40,
    image: img
  }
]);

img.src = "http://pathadvisor.ust.hk/img/express.png";

canvasHandler.addMapTiles([{ id: 3, floor: "G", x: 10, y: 200 }]);
```
