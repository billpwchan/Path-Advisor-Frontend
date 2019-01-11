import React from 'react';
import closeIcon from "./img/close.png";
import expandIcon from "./img/expand.png";
import toSplitIcon from "./img/toSplit.png";
import Axios from "axios";
/**
 * The following code to get pano images from outer source is largely
 * modified from plugins/MapTile/MapTile.js
 */

 let panoUrl = "";//A global variable to store panoUrl. It is supposed to be updated in getPanoUrl().

function getPanoURL(APIEndpoint, floor, x, y) {
    getPanoURL_dev(APIEndpoint, floor, x, y);
}
function PanoServerEndPoint(){
    return PanoServerEndPoint_dev();
}


function PanoDisplay({ height, width, fullScreen, onCloseClick, onResizeClick,x,y,floor }) {
    
    getPanoURL(PanoServerEndPoint,floor,x,y);//Update the panoUrl variable.    
    
    return (
        <div style={{ position: "absolute", left: 0, bottom: 0, height: height, width: width }}>
            <img
                style={{ position: "absolute", flex: 1, height: height, width: undefined }}
                resizeMode="cover"
                src={panoUrl}
                alt="PanoImage"
            />
            <button
                style={{ position: "absolute", height: 20, top: 0, right: 0, bottom: 100 }}
                type="button"
                onClick={() => onCloseClick()}
            >
                <img src={closeIcon} alt="ClosePanoIcon" />
            </button>
            <button
                style={{ position: "absolute", height: 20, top: 0, right: 20, bottom: 100 }}
                type="button"
                onClick={() => onResizeClick()}
            >
                <img src={fullScreen ? toSplitIcon : expandIcon} alt="ResizePanoIcon" />
            </button>
        </div>
    );
}

/* The following are contingent modules set for the conviniece of current development. */

// let url = "http://localhost:380/pano_pixel.php?floor=1&photo=1107Left_EXIT_Concourse.jpg&pano_id=n130";

// Return the address for slave server endpoint.
function PanoServerEndPoint_dev() {
    return 'http://localhost:380';
}

// A toy getPanoURL method we use for retrieveing PanoImage from slave server, given the PinMan location.
function getPanoURL_dev(APIEndpoint, floor, x, y) {
    let pano_id;
    let pano_source;
    
    Axios.get(`${APIEndpoint()}/phplib/get_map_data_2.php?floor=${floor}&coorX=${x}&coorY=${y}`)
        .then(
            response => {
                response = response.data;
                console.log(response);
                
                // The following decision making method is modified from map_interface.js, line 1070-1104
                if (response.split(";")[0] === "area") {
                    pano_id = response.split(";")[7];
                    pano_source = response.split(";")[8] + ".jpg";
                }
                else {
                    pano_id = response.split(";")[5];
                    pano_source = response.split(";")[6] + ".jpg";
                }
                // Decision Making Ends

                // Update the value of global variable panoUrl.
                panoUrl=`${APIEndpoint()}/pano_pixel.php?floor=${floor}&photo=${pano_source}&pano_id=${pano_id}`;
                // console.log('panoUrl',panoUrl);
            }
        );
}

export default PanoDisplay;