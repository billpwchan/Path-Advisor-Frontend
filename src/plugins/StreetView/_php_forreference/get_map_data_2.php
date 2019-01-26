<?php
error_reporting(0);

  $floor = $_GET["floor"];
  $room = $_GET["room"];
  $node_id = $_GET["node_id"];
  $coorX = $_GET["coorX"];
  $coorY = $_GET["coorY"];
  $MapCoorX = $_GET["MapCoorX"];
  $MapCoorY = $_GET["MapCoorY"];
  $offsetX = $_GET["offsetX"];
  $offsetY = $_GET["offsetY"];
  $edges = $_GET["edges"];
  
  require_once("get_path.php");
  require_once("get_file_input.php");
  
  $roomStringArray = array();
  $edgeStringArray = array();
  $panoEdgeStringArray = array();
  $nodeStringArray = array();
  $photoStringArray = array();
  $connectorStringArray = array();
  
  
  function findArea($x, $y, $z)
  {
      return 0.5 * (intval($x[0]) * intval($y[1]) - intval($x[0]) * intval($z[1]) - intval($y[0]) * intval($x[1]) + intval($y[0]) * intval($z[1]) + intval($z[0]) * intval($x[1]) - intval($z[0]) * intval($y[1]));
  }
  
  function euclideanDistance($x, $y)
  {
      return sqrt(pow($x[0] - $y[0], 2) + pow($x[1] - $y[1], 2));
  }
  
  function hitTest($coor, $testPt)
  {
      return((findArea($coor[1], $coor[2], $testPt) > 0 == findArea($coor[0], $coor[1], $testPt) > 0) && (findArea($coor[2], $coor[3], $testPt) > 0 == findArea($coor[0], $coor[1], $testPt) > 0) && (findArea($coor[3], $coor[0], $testPt) > 0 == findArea($coor[0], $coor[1], $testPt) > 0));
  }
  
  
  if (isSet($_GET['findNode'])){
	get_file_input(trim($path["map_data_path"]) . "intermediate_vertexes_" . $floor . ".xml", $nodeStringArray);
	foreach ($nodeStringArray as $value){
		$string1 = explode(";", $value);
		$position = explode(",", $string1[1]);
		if ($_GET['findNode'] == $string1[0] && $string1[3]!="null"){
			print $string1[0].";".$position[0].";".$position[1].";".$string1[3].";";
			break;
		}
	}
  }
  else if (isSet($_GET['findLift'])){
	get_file_input(trim($path["map_data_path"]) . "connectors_" . $floor . ".xml", $liftStringArray);
	foreach ($liftStringArray as $value){
		$string1 = explode(";", $value);
		if (substr($string1[0],0,4) == "LIFT")
			print $string1[1].";";
	}
	return;
  }
  else if (isSet($_GET['findAdminBlocked'])){
 	get_file_input(trim($path["map_data_path"]) . "edges_" . $floor . ".xml", $edgeStringArray);
	foreach ($edgeStringArray as $value){
		$string1 = explode(";", $value);
		if (trim($string1[0]) != "null" && trim($string1[6]) == "blocked"){
			print $string1[4].";";
		}
	}
	return;
 
  }
  else if (isSet($_GET['findEdgeById'])){
	get_file_input(trim($path["map_data_path"]) . "edges_" . $floor . ".xml", $edgeStringArray);
	$edgeToBlock = explode(";", $_GET['findEdgeById']);
	for($i=0; $i<sizeof($edgeToBlock); $i++){
		foreach ($edgeStringArray as $value){
			$string1 = explode(";", $value);
			if (trim($string1[0]) != "null" && trim($string1[6]) != "blocked"){
				if (trim($string1[0]) == $edgeToBlock[$i]){
					print $string1[4].";";
				}
			}
		}
	}
	return;	
  }
  else if (isSet($_GET['findEdge'])){
	$dist = -1;
	$testPt = array($coorX, $coorY);
	get_file_input(trim($path["map_data_path"]) . "edges_" . $floor . ".xml", $edgeStringArray);
	foreach ($edgeStringArray as $value){
		$string1 = explode(";", $value);
		$position = explode("|", $string1[4]);
		$tempX = explode(",", $position[0]);
		$tempY = explode(",", $position[1]);
		$edgePt = array(($tempX[0]+$tempY[0]) / 2, ($tempX[1]+$tempY[1]) / 2);
		$new_dist_pano = euclideanDistance($edgePt, $testPt);
		if ($new_dist_pano < $dist || $dist < 0){
			$dist = $new_dist_pano;
			$tempEdgeId1 = $string1[0];
			$tempNode1 = $string1[1];
			$tempNode2 = $string1[2];
			$tempEdgeX1 = $tempX[0];
			$tempEdgeY1 = $tempX[1];
			$tempEdgeX2 = $tempY[0];
			$tempEdgeY2 = $tempY[1];
		}
	}
	foreach ($edgeStringArray as $value){
		$string2 = explode(";", $value);
		if ($string2[1] == $tempNode2 && $string2[2] == $tempNode1){
			$tempEdgeId2 = $string2[0];
			break;
		}
	}
	print $tempEdgeId1.";".$tempEdgeId2.";".$tempEdgeX1.";".$tempEdgeY1.";".$tempEdgeX2.";".$tempEdgeY2.";";
	return;
  }
  else if (isSet($_GET['findNext'])){
	get_file_input(trim($path["map_data_path"]) . "pano_edges_" . $floor . ".xml", $panoEdgeStringArray); //newly added
	get_file_input(trim($path["map_data_path"]) . "intermediate_vertexes_" . $floor . ".xml", $nodeStringArray);
	get_file_input(trim($path["map_data_path"]) . "connectors_" . $floor . ".xml", $connectorStringArray);
	$count = 0;
	foreach ($panoEdgeStringArray as $value) {
		$string = explode(";", $value);
		if (trim($string[1])==$_GET['findNext']){
		//if ((trim($string1[4]) != "null" && trim($string1[6]) != "blocked"))
			$node_to_search[$count] = trim($string[2]);
			$count++;
			
		}
	}
	
	
	for ($j=0; $j<$count; $j++){
		$checkConnector = false;
		$checkNode = false;
		foreach ($nodeStringArray as $value){
			$string1 = explode(";", $value);
			if (trim($string1[0]) == $node_to_search[$j]){
				print $string1[0] . ";" . $string1[1] . ";" . $string1[3] . ";"; 
				$checkNode = true;
				break;
			}	
		}
		foreach ($connectorStringArray as $value1){
			$string2 = explode(";", $value1);
			if ($node_to_search[$j] == trim($string2[1])){
				print $string2[0] . ";" . $string2[1] . ";" .$string2[3].";";
				$checkConnector = true;
				break;
			}
		}
		if ($checkNode && !$checkConnector)
			print "null;null;null;";
	}
	/*foreach ($nodeStringArray as $value){
		$string1 = explode(";", $value);
		if (trim($string1[3]) != "null"){
			for ($j=0; $j<$count; $j++){
				if (trim($string1[0]) == $node_to_search[$j] && trim($string1[3]) != "null")
					print $string1[0] . ";" . $string1[1] . ";" . $string1[3] . ";" ; 
			}
		}
	}*/
	

	return;  
  }
  
  else if (isSet($edges)){
	get_file_input(trim($path["map_data_path"]) . "pano_edges_" . $floor . ".xml", $panoEdgeStringArray); //newly added
	get_file_input(trim($path["map_data_path"]) . "intermediate_vertexes_" . $floor . ".xml", $nodeStringArray);
	$count = 0;
	foreach ($nodeStringArray as $value) {
          $string = explode(";", $value);      
          if (trim($string[3]) != "null") {
			$node_with_pano[$count][0] = trim($string[0]);
			print $string[1].";";
			$count++;
          }		 
    }
	print " "; // for split the edges and nodes
	foreach ($panoEdgeStringArray as $value) {
		$string1 = explode(";", $value);
		for ($j=0; $j<$count; $j++){
			if ((trim($string1[1])==$node_with_pano[$j][0]) && (trim($string1[4]) != "null") && (trim($string1[6]) != "blocked")){
			//if ((trim($string1[4]) != "null" && trim($string1[6]) != "blocked"))
				print $string1[4].";";
			}
		}
	}
	return;
  }
  
  else if (isSet($room)) {
      get_file_input(trim($path["map_data_path"]) . "intermediate_vertexes_" . $floor . ".xml", $nodeStringArray);
      
      foreach ($nodeStringArray as $value) {
          $string = explode(";", $value);
          if (trim($string[2]) == $room) {
              print $string[0];
              return;
          }
      }
  } elseif ($node_id) {
      get_file_input(trim($path["map_data_path"]) . "intermediate_vertexes_" . $floor . ".xml", $nodeStringArray);
      get_file_input(trim($path["map_data_path"]) . "main_vertexes_" . $floor . ".xml", $roomStringArray);
      
      $pid = -1;
      foreach ($nodeStringArray as $value) {
          $string = explode(";", $value);
          if (trim($string[0]) == $node_id) {
              $pid = trim($string[2]);
              break;
          }
      }
      foreach ($roomStringArray as $value) {
          $string = explode(";", $value);
          if (trim($string[0]) == $pid) {
              print $pid . ";" . $string[1] . ";" . $string[2] ;
              break;
          }
      }
  } elseif (isSet($coorX) && isSet($coorY)) {
      get_file_input(trim($path["map_data_path"]) . "intermediate_vertexes_" . $floor . ".xml", $nodeStringArray);
      get_file_input(trim($path["map_data_path"]) . "main_vertexes_" . $floor . ".xml", $roomStringArray);
	  get_file_input(trim($path["map_data_path"]) . "edges_" . $floor . ".xml", $edgeStringArray); //newly added
      $pid = -1;
      $rmInfo = "";
      foreach ($roomStringArray as $value) {
          $string = explode(";", $value);
          $position = explode("|", $string[4]);
          $coor = array();
          $coor[] = explode(",", $position[0]);
          $coor[] = explode(",", $position[1]);
          $coor[] = explode(",", $position[2]);
          $coor[] = explode(",", $position[3]);
          $testPt = array($coorX, $coorY);
          $hit = false;
          $hit = hitTest($coor, $testPt);
          
          if (!$hit) {
              /*check sub area*/
              $areaStringArray = array();
              get_file_input(trim($path["map_data_path"]) . "subArea_" . $floor . ".xml", $areaStringArray);
              foreach ($areaStringArray as $item) {
                  $itemString = explode(";", $item);
                  if (trim($itemString[1]) == trim($string[0])) {
                      $position = explode("|", $itemString[2]);
                      $coor = array();
                      $coor[] = explode(",", $position[0]);
                      $coor[] = explode(",", $position[1]);
                      $coor[] = explode(",", $position[2]);
                      $coor[] = explode(",", $position[3]);
                      $hit = hitTest($coor, $testPt);
                      if ($hit)
                          break;
                  }
              }
          }
          
          if ($hit) {
              $pid = trim($string[0]);
              $rmInfo = trim($string[1]) . ";" . trim($string[2]) . ";" . trim($string[5]);
              break;
          }
      }

	$count = 0;
	/* Save all the nodes with panoramic image to $node_with_pano */
    foreach ($nodeStringArray as $value) {
          $string = explode(";", $value);
          $position = explode(",", $string[1]);

          if (trim($string[3]) != "null") {
			$node_with_pano[$count][0] = trim($string[0]);
			$node_with_pano[$count][1] = trim($position[0]);
			$node_with_pano[$count][2] = trim($position[1]);
			$node_with_pano[$count][3] = trim($string[3]);
			$count++;
			
          }		 
    }
	
	$dist = -1; $tempCount = 0;
	/* find the nearest node with panoramic image */
	for ($counter = 0; $counter < $count ; $counter++){
		$nodePt = array($node_with_pano[$counter][1], $node_with_pano[$counter][2]);
		$new_dist_pano = euclideanDistance($nodePt, $testPt);
		if ($new_dist_pano < $dist || $dist < 0){
			$tempCount++;
			$dist = $new_dist_pano;
			$tempNode = $counter;
		}
	}
	$nodePano = $node_with_pano[$tempNode][0];
	$nodePanoX = $node_with_pano[$tempNode][1];
	$nodePanoY = $node_with_pano[$tempNode][2];
	$nodePanoDir = $node_with_pano[$tempNode][3];
	
      
      $dist = -1;
      $node_id;
	  $next_node=array();
	  $next_node_coorX=array();
	  $next_node_coorY=array();
	  $next_node_dir=array();
	  $counter = 0;
	  $roomNode;
	  $room_found = false;
      
      foreach ($nodeStringArray as $value) {
          $string = explode(";", $value);
          $position = explode(",", $string[1]);
          
          $tempCoor = array(intval($position[0]), intval($position[1]));
          $new_dist = euclideanDistance($testPt, $tempCoor);
          
          if ($new_dist < $dist || $dist < 0) {
              $dist = $new_dist;
              $node_id = trim($string[0]);
			  $nodeCoor = $tempCoor;
          }
          
          
          if (trim($string[2]) == $pid) {
			  $room_found = true;
			  $roomNode = trim($string[0]);
          }
      }

	  /*foreach ($edgeStringArray as $value) {
		  $string = explode(";", $value);
		  $node_tobefound = $string[1];
		  if ((trim($node_tobefound) == $nodePano) && ($string[6] != "blocked")){
		 //if ($string[6] != "blocked"){
			for ($j=0; $j<$count; $j++){
				if ($string[2] == $node_with_pano[$j][0]){
					$next_node[$counter] = $string[2];
					$next_node_coorX[$counter] = $node_with_pano[$j][1];
					$next_node_coorY[$counter] = $node_with_pano[$j][2];
					$next_node_dir[$counter] = $node_with_pano[$j][3];
					$counter++;
				}
			}
			//$next_node[$counter] = $string[2];
			//$counter++;
		  }
	  }*/
      if ($room_found){
		    print "area;" . $roomNode . ";" . $rmInfo . ";" . $nodeCoor[0] . ";" . $nodeCoor[1] . ";" . $nodePano . ";" . $nodePanoDir . ";" . $nodePanoX . ";" . $nodePanoY . ";" ;
	  }
	  else
			print "node;" . $node_id . ";" . $new_dist . ";" . $nodeCoor[0] . ";" . $nodeCoor[1] . ";" . $nodePano . ";" . $nodePanoDir . ";" . $nodePanoX . ";" . $nodePanoY . ";" ;

	  
	  } elseif (isSet($MapCoorX) && isSet($MapCoorY) && isSet($offsetX) && isSet($offsetY)) {

      $rangeX = $MapCoorX + $offsetX;
      $rangeY = $MapCoorY + $offsetY;

      get_file_input(trim($path["map_data_path"]) . "main_vertexes_" . $floor . ".xml", $roomStringArray);
      foreach ($roomStringArray as $value) {
          $string = explode(";", $value);
          $position = explode("|", $string[4]);
          $_p0 = explode(",", $position[0]);
          $_p1 = explode(",", $position[1]);
          $_p2 = explode(",", $position[2]);
          $_p3 = explode(",", $position[3]);
          
          $p0 = array(($_p0[0] + $_p1[0]) / 2, ($_p0[1] + $_p1[1]) / 2);
          $p1 = array(($_p1[0] + $_p2[0]) / 2, ($_p1[1] + $_p2[1]) / 2);
          $p2 = array(($_p2[0] + $_p3[0]) / 2, ($_p2[1] + $_p3[1]) / 2);
          $p3 = array(($_p3[0] + $_p0[0]) / 2, ($_p3[1] + $_p0[1]) / 2);
          
          $m1 = $m2 = "NaN";
          
          if ($p0[0] - $p2[0] != 0) {
              $m1 = ($p0[1] - $p2[1]) / ($p0[0] - $p2[0]);
          }
          
          if ($p1[0] - $p3[0] != 0) {
              $m2 = ($p1[1] - $p3[1]) / ($p1[0] - $p3[0]);
          }
          
          $c1 = $p0[1] - $m1 * $p0[0];
          $c2 = $p1[1] - $m2 * $p1[0];
          
          if ($p0[0] - $p2[0] == 0) {
              $cx = $p0[0];
          } elseif ($p1[0] - $p3[0] == 0) {
              $cx = $p1[0];
          } else {
              $cx = ($c2 - $c1) / ($m1 - $m2);
          }
          
          
          if (is_numeric($m2)) {
              $cy = $m2 * $cx + $c2;
          } else {
              $cy = $m1 * $cx + $c1;
          }
          
          $cx = round($cx);
          $cy = round($cy);
          
          if ($cx >=  $MapCoorX && $cx <= $rangeX && $cy >= $MapCoorY && $cy <= $rangeY){
 
              $string[5]=trim($string[5]);
              $string[6]=trim($string[6]);
              print $cx . "," . $cy . ";" . $string[1] . ";" . $string[2] . ";" . $string[5] . ";" . $string[6] .  ";" . $string[0] . "\n";
          }
      }
      // Users uploaded photos
      get_file_input("/home/cs_lhh/public_html/interface/usr_data/photos.txt", $photoStringArray );
      //print "Hi1\n";
      foreach ($photoStringArray as $value) {
          //print "Hi2\n";
          //print "$value\n";
	  $value = trim(($value));
          $string = explode("<>", $value);
          $x = intval($string[3]);
          $y = intval($string[4]);
          //print "Hi3\n";
          //$enc = mb_detect_encoding($string[0]);
          //print "Hi4\n";
          //$string[0]= mb_convert_encoding('UTF-8',"ASCII", $enc );
          //print "Hi5\n";
          if ($floor == $string[2] && $x >=  $MapCoorX && $x <= $rangeX && $y >= $MapCoorY && $y <= $rangeY && !file_exists("/home/cs_lhh/public_html/interface/usr_data/ban_photo/$string[0]")){
              $string[0] = trim($string[0]);
              print $string[3] . "," . $string[4] . ";" . $string[1] . ";userPhoto;" . $string[0] . ";$string[5];\n";
          }
      }
  }
?>