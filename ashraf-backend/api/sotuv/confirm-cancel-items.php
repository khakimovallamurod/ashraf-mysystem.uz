<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['sotuv','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$sql = $asli->update('spam_orders',['status'=>'confirmed'],['id'=>$_GET['id']]);

	if($sql){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli tasdiqlandi"];
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
	}
	$asli->print_json();
?>