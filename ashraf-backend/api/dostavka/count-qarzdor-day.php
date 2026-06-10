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

	$s = date("d.m.Y 00:00:00",time());
	$sana1 = strtotime($s);
	$sana2 = $sana1 + 86400;

	$n = $asli->countustun('sale_orders','id',[],"muddat>='$sana1' AND muddat<'$sana2'");

	if($n!=0){
		$asli->resp += ['success'=> true, 'message' => "Sizda $n ta klent kutib turibdi!", 'n' => $n];
		$asli->resp['data'] = $n;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda savdo bo'limdan so'rov mavjud emas!"];
	}
	$asli->print_json();
?>