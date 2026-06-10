<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['admin', 'sotuv'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->name) && strlen($data->name)>2){
		$sql = $asli->insert('harajat_category',[
			'name' => $data->name
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