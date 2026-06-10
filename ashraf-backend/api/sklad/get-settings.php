<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sklad','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
	$data = $asli->getdata("settings",['id'=>1]);

	$asli->resp['data'] = $data;

	$asli->print_json();
?>