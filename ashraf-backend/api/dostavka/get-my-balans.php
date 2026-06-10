<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','sotuv','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	$balans = $asli->getdata('dostavka_krim',['dostavka_id'=>$user['id']]);

	if($balans['id']>0){		
		$asli->resp += ['success'=> true, 'message' => "Kassaga topshirilishi lozim pullar"];
		$asli->resp['data'] = $balans;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda sizda balans mavjud emas!"];
	}
	$asli->print_json();
?>