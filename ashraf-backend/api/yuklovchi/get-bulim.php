<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','admin','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();		
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$bulim = $asli->getdata('bulim',['id'=>$_GET['id']]);
			$asli->resp['data'] = $bulim;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$bulim = $asli->getdatas('bulim',[],"id>1");
		$asli->resp['data'] = $bulim;
	}
	$asli->print_json();
?>