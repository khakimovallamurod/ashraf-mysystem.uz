<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->fio) && isset($data->telefon) && isset($_GET['id'])){

		$sql = $asli->update('qassoblar',[
			'fio' => $data->fio,
			'telefon' => $data->telefon
		],['id'=>$_GET['id']]);

		if($sql){
			$asli->resp += ['success'=> true, 'message' => "Barchasi muvaffiqqiyatli"];
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Xatolik! o'zgartirilmadi"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>