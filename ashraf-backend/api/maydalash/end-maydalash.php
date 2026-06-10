<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['maydalash','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->zayavka_id)){
		$my = $asli->summaustun('maydalash','massa',['zayavka_msq_id'=>$data->zayavka_id]);
		if($my<$zmq['rmassa']*0.97){
			$asli->resp += ['success'=> false, 'message' => "Ishingga masulyatsizlik bilan kirishmoqdasan. Keyingi safar yaxshi gap eshitmaysan!!!"];
		}
		else{
			$sql = $asli->update('zayavka_msq',['status'=>'bajarildi','maydalash_end'=>time()],['id'=>$data->zayavka_id]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Tugatilmadi!"];
			}	
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>