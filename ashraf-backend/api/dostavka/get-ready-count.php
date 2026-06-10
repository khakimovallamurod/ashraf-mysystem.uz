<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	$n = $asli->countustun('sale_orders','id',['dostavka_id'=>$user['id'],'status'=>'tayyorlandi']);

	if($n!=0){
		$asli->resp += ['success'=> true, 'message' => "Sizda $n ta savdo bo'limidan yuk qabul qilishingiz uchun so'rov bor!", 'n' => $n];
		$asli->resp['data'] = $n;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda savdo bo'limdan so'rov mavjud emas!"];
	}
	$asli->print_json();
?>