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
		$my = $asli->summaustun('qaytamaydalash_items','massa',['qaytam_partiya_id'=>$data->zayavka_id]);
		$mx = $asli->summaustun('qaytam_items','massa',['qaytam_partiya_id'=>$data->zayavka_id]);
		if($my<$mx*0.90){
			$asli->resp += ['success'=> false, 'message' => "Ishingga masulyatsizlik bilan kirishmoqdasan. Keyingi safar yaxshi gap eshitmaysan!!!"];
		}
		else{
			$sql = $asli->update('qaytam_partiya',['status' => 'bajarildi',
					'endvaqt' => time()],['id'=>$data->zayavka_id]);
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