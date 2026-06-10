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

	if(
		isset($data->client_id) &&
		isset($data->naqdsum) &&
		isset($data->naqdusd) &&
		isset($data->bank) &&
		isset($data->karta) &&
		strlen($data->izoh) >= 1
	){

		$naqdsum = floatval($data->naqdsum);
		$naqdusd = floatval($data->naqdusd);
		$valyuta = floatval($data->valyuta);
		$bank = floatval($data->bank);
		$karta = floatval($data->karta);

		$summa = $naqdsum + $bank + $karta + ($naqdusd * $valyuta);

		if($summa <= 0){
			$asli->response(403);
			$asli->print_json();
			exit;
		}

		$asli->begintranz();
		$asli->kalit = 1;

		$client = $asli->getdata('clients',['id'=>$data->client_id]);

		if($client['id'] > 0){
			$code = mt_rand(10000,99999);

			// HISTORY GA YOZISH
			$sql = $asli->insert('pay_client_history',[
				'summa' => $summa,
				'naqdsum' => $naqdsum,
				'naqdusd' => $naqdusd,
				'valyuta' => $valyuta,
				'bank' => $bank,
				'karta' => $karta,
				'izoh' => $data->izoh,
				'user_id' => $user['id'],
				'code' => $code,
				'client_id' => $data->client_id,
				'status' => 'checked',
				'sana' => time()
			]);

			if(!$sql){
				$asli->kalit = 0;
			}

			// CLIENT BALANS KAMAYADI (mijoz pul berdi)
			$sql = $asli->update('clients',[
				'balans' => $client['balans'] - $summa
			],['id'=>$data->client_id]);

			if(!$sql){
				$asli->kalit = 0;
			}

			// KASSA OSHADI
			$balans = $asli->getdata('balans',['id'=>1]);

			$sql = $asli->update('balans',[
				'naqdsum' => $balans['naqdsum'] + $naqdsum,
				'naqdusd' => $balans['naqdusd'] + $naqdusd,
				'bank' => $balans['bank'] + $bank,
				'karta' => $balans['karta'] + $karta
			],['id'=>1]);

			if(!$sql){
				$asli->kalit = 0;
			}

			if($asli->kalit == 1){
				$asli->endtranz();
				$asli->resp += [
					'success'=> true,
					'message' => "Mijozdan pul muvaffaqiyatli olindi"
				];
			}
			else{
				$asli->bekor();
				$asli->resp += [
					'success'=> false,
					'message' => "Tranzaktsiya yakunlanmadi!"
				];
			}

		}else{
			$asli->bekor();
			$asli->resp += [
				'success'=> false,
				'message' => "Mijoz topilmadi!"
			];
		}

	}else{
		$asli->response(403);
	}

	$asli->print_json();
?>
