<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id']) || isset($_GET['viloyat_id'])){
		if(isset($_GET['id'])){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$tuman = $asli->getdata('tuman',['id'=>$_GET['id']]);
			$asli->resp['data'] = $tuman;
		}
		if(isset($_GET['viloyat_id'])){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$tuman = $asli->getdatas('tuman',['vil_id'=>$_GET['viloyat_id']]);
			$asli->resp['data'] = $tuman;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$tuman = $asli->getdatas('tuman',[],"1");
		$asli->resp['data'] = $tuman;
	}
	$asli->print_json();
?>