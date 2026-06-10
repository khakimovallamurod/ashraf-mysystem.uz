<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$n = $asli->countustun('sale_orders','id',['status'=>'new']);

	if($n!=0){
		$asli->resp += ['success'=> true, 'message' => "Sizda $n ta sotuv bo'limidan yuk tayyorlashingiz uchun so'rov bor!", 'n' => $n];
		$asli->resp['data'] = $n;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda sotuv bo'limdan so'rov mavjud emas!"];
	}
	$asli->print_json();
?>