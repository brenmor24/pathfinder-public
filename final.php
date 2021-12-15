<?php 

$DBSTRING = "sqlite:/home/ec2-user/cse383/database/cse383.db";
include "sql.inc";
include "final.class.php";

header ("Access-Control-Allow-Origin: *");
header ("Access-Control-Allow-Methods: GET,POST,PUSH,OPTIONS");
header ("content-type: application/json");
header ("Access-Control-Allow-Headers: Content-Type");
require_once "RestServer.php";

$method=$_REQUEST["method"];

$rest = new RestServer (new final_rest(),$method);
$rest->handle ();