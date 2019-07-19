<?php

header('Content-Type: image/png');
session_start();
error_reporting(0);

$photoDir= "./map_panorama/" .$_GET['floor'] . "/";
$photo_location= $photoDir .$_GET['photo']; 
$src = @imagecreatefromjpeg($photo_location);

imagejpeg($src);

imagedestroy($src);

?>
