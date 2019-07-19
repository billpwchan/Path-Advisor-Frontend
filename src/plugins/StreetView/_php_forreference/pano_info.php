
<?php


error_reporting(0);

$floor = $_GET['floor'];

$photo = $_GET['photo'];
require_once("./phplib/get_path.php"); 
require_once("./phplib/get_file_input.php");

// get_file_input(trim($path["map_data_path"]) . "intermediate_vertexes_" . $floor . ".xml", $nodeStringArray);
// $count = 0;
// $testPt = array($coorX, $coorY);
// /* Save all the nodes with panoramic image to $node_with_pano 
// *   See get_map_data_2.php line 271-301.
// */
// foreach ($nodeStringArray as $value) {
//         $string = explode(";", $value);
//         $position = explode(",", $string[1]);

//         if (trim($string[3]) != "null") {
//         $node_with_pano[$count][0] = trim($string[0]);
//         $node_with_pano[$count][1] = trim($position[0]);
//         $node_with_pano[$count][2] = trim($position[1]);
//         $node_with_pano[$count][3] = trim($string[3]);
//         $count++;
        
//         }		 
// }

// $dist = -1; $tempCount = 0;
// /* find the nearest node with panoramic image */
// for ($counter = 0; $counter < $count ; $counter++){
//     $nodePt = array($node_with_pano[$counter][1], $node_with_pano[$counter][2]);
//     $new_dist_pano = euclideanDistance($nodePt, $testPt);
//     if ($new_dist_pano < $dist || $dist < 0){
//         $tempCount++;
//         $dist = $new_dist_pano;
//         $tempNode = $counter;
//     }
// }
// $nodePano = $node_with_pano[$tempNode][0];
// $nodePanoX = $node_with_pano[$tempNode][1];
// $nodePanoY = $node_with_pano[$tempNode][2];
// $nodePanoDir = $node_with_pano[$tempNode][3];

    
get_file_input("./map_data/pano_info_" . $floor . ".xml",$panoInfoArray);
$zero_coord = "";				
foreach ($panoInfoArray as $value){
    $string=explode(";", $value);
    if ($string[0]==$photo){	// get zero-degree, tag coord, tag id
        $zero_coord=$string[1];
        break;
    }
}

// Adopted from display_pano.php line 60 and below.
$photoDir= "./map_panorama/" .$_GET['floor'] . "/";
$photo_location= $photoDir .$_GET['photo']; 

if (file_exists($photo_location)) {
    list($width, $height, $type, $attr) = getimagesize($photo_location);
}else{
    echo "file not exist.";
}
// get start coor	
$angle_offset= $zero_coord/$width*360;
echo $zero_coord.";".$angle_offset;

?>
