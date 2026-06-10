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

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
	
	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="GET"){
			$products = $asli->getdata('products',['id'=>$_GET['id']]);
			$asli->resp['data'] = $products;
		}
	}
	else{
		$products = $asli->getdatas('products',[],"id>1");
		$asli->resp['data'] = $products;
	}
	$asli->print_json();
?>