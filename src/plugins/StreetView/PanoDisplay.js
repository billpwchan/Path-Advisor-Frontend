import React from 'react';
import closeIcon from "./img/close.png";
/**
 * The following code to get pano images from outer source is largely
 * modified from plugins/MapTile/MapTile.js
 */

// function PanoServerEndPoint() {
//     return 'http://localhost:380';
// }
// function getPanoURL(APIEndpoint, floor, photo, pano_id) {
//     return `${APIEndpoint()}/pano_pixel.php?floor=${floor}&photo=${photo}&pano_id=${pano_id}`;
// }

function PanoDisplay({ height, width, onClick }) {
    let url = "http://localhost:380/pano_pixel.php?floor=1&photo=1107Left_EXIT_Concourse.jpg&pano_id=n130";
    
    return (
        <div style={{position: "absolute", left: 0, bottom: 0, height: height, width: width }}>

            <img
                onMouseOver={()=>{console.log("Mouse over close");}}
                style={{ position: "absolute", flex: 1, height: height, width: undefined }}
                resizeMode="cover"
                src={url}
            />
            
            
            
            <button
                style={

                    
                    {position: "absolute", 
                    height: 20, 
                    top: 0, 
                    right: 0, 
                    bottom: 100}}
                type="button"
                onClick={() => onClick()}
                
            >
                <img src={closeIcon}/>
            </button>


        </div>
    );
}
export default PanoDisplay;