<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['maydalash','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$n = $asli->countustun('zayavka_msq','id',['status'=>'tayyorlandi']);

	if($n!=0){
		$asli->resp += ['success'=> true, 'message' => "Sizda $n ta yuk qabul qilishingiz uchun so'rov bor!", 'n' => $n];
		$asli->resp['data'] = $n;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz so'rov mavjud emas!"];
	}
	$asli->print_json();
?>