<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['sklad','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->fio) && isset($data->telefon)){
		$sql = $asli->insert('qassoblar',[
			'fio' => $data->fio,
			'telefon' => $data->telefon
		]);
		if($sql){
			$asli->resp += ['success'=> true, 'message' => "Barchasi muvaffiqqiyatli"];
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Qassob qo'shilmadi"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>