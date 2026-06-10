<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->id) && isset($data->price) && isset($data->taminotchi_id)){
		$asli->begintranz();
		$asli->kalit = 1;
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