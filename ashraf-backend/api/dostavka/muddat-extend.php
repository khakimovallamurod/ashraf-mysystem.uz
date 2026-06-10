<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);


	if(isset($_GET['id']) && strtotime($_GET['sana'])>time()){
	 //isset($_GET['sana1']) && isset($_GET['sana2'])
	 	$t = mt_rand(10000,99999);		
		$sql = $asli->update('sale_orders',['muddat_code'=>$t,'muddat_temp'=>strtotime($_GET['sana'])],['id'=>$_GET['id']]);
		if($sql){
			$ret['code'] = $t;
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "O'zgarmadi"];
		}
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->response('403');
	}
	$asli->print_json();
?>