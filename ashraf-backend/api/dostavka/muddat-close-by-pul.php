<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['dostavka','sotuv','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($data->naqdsum) && isset($data->naqdusd) && isset($data->bank) && isset($data->bank) && isset($data->client_id) && isset($data->id)){
		
		$asli->begintranz();
		$asli->kalit = 1;
		$sql = $asli->update('sale_orders',[
			'muddat' => 0
		],['id'=>$data->id]);
		if(!$sql){
			$asli->kalit = 0;
		}
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
			// $client['telefon']
			$ff = $client['balans'] - $summa;
			$t = $asli->sendsms("998906052867","Hisobingizga muvaffiqqiyatli $summa krim qilindi. Qolgan summa : {$ff} so'm");
		}
		else{			
			$asli->kalit = 0;
		}
		
		$dkrim = $asli->getdata('dostavka_krim',['dostavka_id'=>$user['id']]);
		if($dkrim['id']>0){
			$sql = $asli->update('dostavka_krim',[
				'naqdsum' => $dkrim['naqdsum'] + $data->naqdsum,
				'naqdusd' => $dkrim['naqdusd'] + $data->naqdusd,
				'bank' => $dkrim['bank'] + $data->bank,
				'karta' => $dkrim['karta'] + $data->karta
			],['dostavka_id'=>$user['id']]);
		}
		else{
			$sql = $asli->insert('dostavka_krim',[
				'naqdsum' => $data->naqdsum,
				'naqdusd' => $data->naqdusd,
				'bank' =>$data->bank,
				'karta' => $data->karta,
				'dostavka_id'=>$user['id']
			]);
		}
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