<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['DELETE'];
	$asli->allow_rolls = ['dostavka','sotuv','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($_GET['id'])){
		$asli->begintranz();
		$asli->kalit = 1;
		$debit = $asli->getdata('debithistory',[
			'id' => $_GET['id']
		]);
		if(time() - $debit['sana']<=5*3600){
			$sql = $asli->delete('debithistory',['id'=>$_GET['id']]);
			if(!$sql){
				$asli->kalit = 0;
			}
			$client = $asli->getdata('clients',['id'=>$debit['client_id']]);
			$sql = $asli->update('clients',[
				'balans' => $client['balans'] + $debit['summa']
			],['id'=>$data->client_id]);
			$summa = $debit['summa'];
			if(!$sql){				
				$asli->kalit = 0;
			}
			else{
				$q = $client['balans'] + $summa;
				$t = $asli->sendsms($client['telefon'],"Hisobingizdan $summa yechildi. Qarzdorlik : $q so'm");
			}
			$balans = $asli->getdata('balans',['id'=>1]);
			$sql = $asli->update('balans',[
				'naqdsum' => $balans['naqdsum'] - $debit['naqdsum'],
				'naqdusd' => $balans['naqdusd'] - $debit['naqdusd'],
				'bank' => $balans['bank'] - $debit['bank'],
				'karta' => $balans['karta'] - $debit['karta']
			],['id'=>1]);
			
			if(!$sql){
				$asli->kalit = 0;
			}
			

			if($asli->kalit == 1){
				$asli->endtranz();
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Xatolik! O'chirilmadi"];
			}
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Vaqti tugatilgan"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>