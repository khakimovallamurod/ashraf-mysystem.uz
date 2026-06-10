<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['dostavka','sotuv','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($data->naqdsum) && isset($data->naqdusd) && isset($data->bank) && isset($data->bank) && isset($data->client_id)){
		$asli->begintranz();
		$asli->kalit = 1;
		$sql = $asli->insert('debithistory',[
			'summa' => $data->naqdsum + ($data->naqdusd * $data->valyuta) + $data->bank + $data->karta,
			'naqdsum' => $data->naqdsum,
			'naqdusd' => $data->naqdusd,
			'valyuta' => $data->valyuta,
			'bank' => $data->bank,
			'karta' => $data->karta,
			'sana' => time(),
			'dostavka_id' => $user['id'],
			'client_id' => $data->client_id
		]);
		if(!$sql){
			$asli->kalit = 0;
		}
		if($data->naqdusd>0){
			$summa = $data->naqdsum + $data->naqdusd * $data->valyuta + $data->bank + $data->karta;
		}
		else{
			$summa = $data->naqdsum + $data->bank + $data->karta;
		}
		$client = $asli->getdata('clients',['id'=>$data->client_id]);

		if($client['id']>0){
			$sql = $asli->update('clients',[
				'balans' => $client['balans'] - $summa
			],['id'=>$data->client_id]);

			if(!$sql){				
				$asli->kalit = 0;
			}
			$os = $client['balans'] - $summa;
			$tx = "Hisobingizga muvaffiqqiyatli $summa sum krim qilindi. Qolgan summa : $os sum";
			$t = $asli->sendsms($client['telefon'],$tx);
		}
		else{			
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