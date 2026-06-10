<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','dostavka','kassir','yuklovchi','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		if($user['rol']=="dostavka"){
			$users = $asli->getdatas('user',['id'=>$user['id']]);
		}
		else{
			$users = $asli->getdatas('user',['rol'=>'dostavka']);
		}
		foreach ($users as $key => $user) {
			$ret[$i]['id'] = $user['id'];
			$ret[$i]['dostavchik'] = $user['familya']." ".$user['ism'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>