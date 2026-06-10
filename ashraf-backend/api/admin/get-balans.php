<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$balans = $asli->getdata('balans',['id'=>1]);

	if($balans['id']>0){		
		$asli->resp += ['success'=> true, 'message' => "Kassaga topshirilishi lozim pullar"];
		$ret['naqdsum'] = $balans['naqdsum'];
		$ret['naqdusd'] = $balans['naqdusd'];
		$ret['bank'] = $balans['bank'];
		$ret['karta'] = $balans['karta'];
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda sizda balans mavjud emas!"];
	}
	$asli->print_json();
?>