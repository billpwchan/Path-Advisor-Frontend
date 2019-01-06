import dragManImage from "./img/Dragman/Yellow_Figure_Right_m.png";
import React from 'react';
import classnames from 'classnames';


function updateDragManPosition(e){
    let dragManObject = document.getElementById(DragManID);
    let height = dragManObject.clientHeight;
    let width = dragManObject.clientWidth;
 
    dragManObject.style.left = e.clientX- width/2 + "px";
    dragManObject.style.top = e.clientY- height/2+ "px";
 
 }

function DragMan({display,buttonClassName,initialX,initialY,onMouseUp}){
    document.onmousemove = updateDragManPosition;
    console.log("Drag Man Rendered");
    const styles = {
        position: 'fixed',
        top: initialY,   
        left: initialX,  
        display:display
      };
    return(  
            <img 
            style={styles} 
            id={DragManID}
            className={buttonClassName} 
            src = {dragManImage}        
            onMouseUp={()=>onMouseUp()}
            />
        ); 
}


const DragManID = "DragMan";
export default DragMan;