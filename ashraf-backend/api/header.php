<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
	header("Access-Control-Allow-Methods: POST, GET, DELETE, UPDATE, OPTIONS, PUT");

	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
		header("HTTP/1.1 200 OK");
		exit();
	}
?>