<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['agent'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){		
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$viloyat = $asli->getdata('viloyat',['id'=>$_GET['id']]);
			$asli->resp['data'] = $viloyat;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$viloyat = $asli->getdatas('viloyat',[],"1");
		$asli->resp['data'] = $viloyat;
	}
	$asli->print_json();
?>