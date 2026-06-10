<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['kassir','admin','sotuv'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($data->naqdsum) && isset($data->naqdusd) && isset($data->bank) && isset($data->bank) && isset($data->user_id)){
		$asli->begintranz();
		$asli->kalit = 1;
		$sql = $asli->insert('get_dostavka_balans_history',[
			'naqdsum' => $data->naqdsum,
			'naqdusd' => $data->naqdusd,
			'bank' => $data->bank,
			'karta' => $data->karta,
			'sana' => time(),
			'kassir_id' => $user['id'],
			'dostavka_id' => $data->user_id
		]);
		if(!$sql){
			$asli->kalit = 0;
		}
		$balans = $asli->getdata('balans',['id'=>1]);
		$sql = $asli->update('balans',[
			'naqdsum' => $balans['naqdsum'] + $data->naqdsum,
			'naqdusd' => $balans['naqdusd'] + $data->naqdusd,
			'bank' => $balans['bank'] + $data->bank,
			'karta' => $balans['karta'] + $data->karta
		],['id'=>1]);
		if(!$sql){
			$asli->kalit = 0;
		}
		$dkrim = $asli->getdata('dostavka_krim',['dostavka_id'=>$data->user_id]);
		$sql = $asli->update('dostavka_krim',[
			'naqdsum' => $dkrim['naqdsum'] - $data->naqdsum,
			'naqdusd' => $dkrim['naqdusd'] - $data->naqdusd,
			'bank' => $dkrim['bank'] - $data->bank,
			'karta' => $dkrim['karta'] - $data->karta
		],['dostavka_id'=>$data->user_id]);
		if(!$sql){
			$asli->kalit = 0;
		}
		if($asli->kalit == 1){
			$asli->endtranz();
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qo'shildi"];
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>