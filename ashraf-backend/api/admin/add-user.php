<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->rol) && strlen($data->login)>=4 && strlen($data->parol)>=6){

		$sql = $asli->insert('user',[
			'login' => $data->login,
			'parol' => md5($data->parol),
			'rol' => $data->rol,
			'familya' => $data->familya,
			'ism' => $data->ism,
			'telefon' => $asli->filterphone($data->telefon)
		]);
		
		if($sql){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qo'shildi"];
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>