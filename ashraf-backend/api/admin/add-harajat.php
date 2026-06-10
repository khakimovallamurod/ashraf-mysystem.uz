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

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	if(isset($data->naqdsum) && strlen($data->izoh)>=1){
		$asli->begintranz();
		$asli->kalit = 1;
		$balans = $asli->getdata('balans',['id'=>1]);
		$sql = $asli->update('balans',[
			'naqdsum' => $balans['naqdsum'] - $data->naqdsum,
			'naqdusd' => $balans['naqdusd'] - $data->naqdusd,
			'bank' => $balans['bank'] - $data->bank,
			'karta' => $balans['karta'] - $data->karta
		],['id'=>1]);
		if(!$sql){
			$asli->kalit = 0;
		}
		$sql = $asli->insert('harajat',[
			'naqdsum' => $data->naqdsum,
			'naqdusd' => $data->naqdusd,
			'bank' => $data->bank,
			'karta' => $data->karta,
			'izoh' => $data->izoh,
			'user_id' => $user['id'],
			'category_id' => $data->category_id,
			'sana' => time()
		]);
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