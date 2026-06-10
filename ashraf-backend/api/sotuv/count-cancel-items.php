<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$user_id = $user['id'];
	$n = $asli->countustun('spam_orders','id',[],"user_id<>'$user_id' AND status='nochecked'");

	if($n!=0){
		$asli->resp += ['success'=> true, 'message' => "Sizda $n ta bekor qilingan buyurtma bor!", 'n' => $n];
		$asli->resp['data'] = $n;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda savdo bo'limdan so'rov mavjud emas!"];
	}
	$asli->print_json();
?>