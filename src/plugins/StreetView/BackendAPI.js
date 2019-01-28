import Axios from 'axios';
/**
 *  The expected behavior of getPanoInfo in backendAPI.
 *  Input: PanoServerEndPoint, floor, x, y
 *  Response: { pano_x, pano_y, panoUrl, panoDefaultOffset, panoDefaultClockwiseAngleFromNorth } 
 */

function getPanoInfo(APIEndpoint, floor, x, y) {
    return getPanoInfo_dev(APIEndpoint, floor, x, y);
}

/**
 * The expected behavior of getNextPano in backendAPI.
 * Input: PanoServerEndPoint, floor, currX, currY, forwardAngle)
 * Response: {targetX,targetY,targetId}                
 */

function getNextPano(APIEndpoint,floor,currX,currY,forwardAngle){
    return getNextPano_dev(APIEndpoint,floor,currX,currY,forwardAngle);
}

/**The following are experimental api functions developed based on old FYP backend. */
function getPanoInfo_dev_0(APIEndpoint, floor, x, y) {
    let pano_id;
    let pano_source;
    let pano_x;
    let pano_y;

    return Axios.get(`${APIEndpoint()}/phplib/get_map_data_2.php?floor=${floor}&coorX=${x}&coorY=${y}`)
        .then(
            response => {
                response = response.data;
                // console.log("get_map_data_2.php response", response);
                /* The following decision making method is modified from map_interface.js, line 1070-1104*/
                if (response.split(";")[0] === "area") {
                    pano_id = response.split(";")[7];
                    pano_source = response.split(";")[8] + ".jpg";
                    pano_x = response.split(";")[9];
                    pano_y = response.split(";")[10];
                }
                else {
                    pano_id = response.split(";")[5];
                    pano_source = response.split(";")[6] + ".jpg";
                    pano_x = parseInt(response.split(";")[7]);
                    pano_y = parseInt(response.split(";")[8]);
                }
                response = { pano_id, pano_source, pano_x, pano_y }
                return response;
            });
}
function getPanoInfo_dev_1(APIEndpoint, floor, pano_source, pano_id) {
    return Axios.get(`${APIEndpoint()}/pano_info.php?floor=${floor}&photo=${pano_source}&pano_id=${pano_id}`).then(
        response => {
            response = response.data;

            const panoUrl = `${APIEndpoint()}/pano_pixel.php?floor=${floor}&photo=${pano_source}&pano_id=${pano_id}`;
            const panoDefaultOffset = parseInt(response.split(';')[0]);
            const panoDefaultClockwiseAngleFromNorth = parseFloat(response.split(';')[1]);

            return { panoUrl, panoDefaultOffset, panoDefaultClockwiseAngleFromNorth };
        });
}
function getPanoInfo_dev(APIEndpoint, floor, x, y) {
    return getPanoInfo_dev_0(APIEndpoint, floor, x, y).then(
        response => {

            const { pano_id, pano_source, pano_x, pano_y } = response;
            return getPanoInfo_dev_1(APIEndpoint, floor, pano_source, pano_id).then(
                res => {
                    const { panoUrl, panoDefaultOffset, panoDefaultClockwiseAngleFromNorth } = res;

                    return { pano_x, pano_y, panoUrl, panoDefaultOffset, panoDefaultClockwiseAngleFromNorth };
                }
            );
        }
    );
}

function getNextPano_dev(APIEndpoint, floor, currX, currY, forwardAngle) {
    return getPanoInfo_dev_0(APIEndpoint, floor, currX, currY).then(res => {
        const { pano_id } = res;
        // console.log(pano_id);
        return Axios.get(`${APIEndpoint()}/phplib/get_map_data_2.php?floor=${floor}&findNext=${pano_id}`)
            .then(res => {


                res = res.data.split(";");
                // console.log(res);
                var neighborIndex = 0;
                var [targetId, targetX, targetY] = ["", 0, 0];
                var minimumAngleDifference = 360;

                for (; neighborIndex < res.length; neighborIndex += 3) {
                    if (res[neighborIndex] === "null" || res[neighborIndex] === "") {
                        // console.log()
                        continue;
                    }
                    else {
                        // console.log(res[neighborIndex]);
                        var [neighborX, neighborY] = res[neighborIndex + 1].split(',');
                        neighborX = parseFloat(neighborX);
                        neighborY = parseFloat(neighborY);
                        const [dx, dy] = [neighborX - currX, neighborY - currY];
                        /* In Map Coordinate System, y+ is pointing west and x+ is pointing south. */
                        /* The formula below calculates the relative angle of neighbor node to current location, measured from north direction oriented clockwise. */
                        const relativeAngle = 180 + Math.sign(dy+0.000001) * Math.acos(dx / Math.sqrt(dx * dx + dy * dy + 0.000001)) / Math.PI * 180;
                       /* The difference between target point relativeAngle and forwardAngle should be the less in diff and 360-diff*/
                        let diff = Math.abs(relativeAngle - forwardAngle);
                        diff = Math.min(diff,360-diff);
                        // console.log("dx,dy,relativeAngle,nodeId", dx, dy, relativeAngle,res[neighborIndex]);
                        if (diff < minimumAngleDifference) {
                            minimumAngleDifference = diff;
                            [targetId, targetX, targetY] = [res[neighborIndex], neighborX, neighborY];    
                        }
                    }
                }
                if (minimumAngleDifference > 90) {
                    /**
                     * If minimumAngleDifference is greater than 90 degrees, it means the direction we are currently facing has no Panoramic Images availible.
                     */
                    return null;
                } else {
                    // console.log("targetId",targetId);
                    return [targetX, targetY, targetId];
                }
            });
    });

}
export {getPanoInfo,getNextPano}