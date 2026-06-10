<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['kassir','admin','sotuv','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	if(isset($data->chiquvchi_hisob) && strlen($data->kiruvchi_hisob)>=1){
		$asli->begintranz();
		$asli->kalit = 1;


		$balans = $asli->getdata('balans',['id'=>1]);

		$naqdsum = $balans['naqdsum'];
		$naqdusd = $balans['naqdusd'];
		$bank = $balans['bank'];
		$karta = $balans['karta'];
		// naqdsum
		if($data->chiquvchi_hisob=="naqdsum" && $data->kiruvchi_hisob=="bank"){
			$naqdsum -= $data->summa;
			$bank += $data->summa;
		}
		if($data->chiquvchi_hisob=="naqdsum" && $data->kiruvchi_hisob=="karta"){
			$naqdsum -= $data->summa;
			$karta += $data->summa;
		}
		if($data->chiquvchi_hisob=="naqdsum" && $data->kiruvchi_hisob=="naqdusd"){
			$naqdsum -= $data->summa * $data->valyuta;
			$naqdusd += $data->summa;
		}
		// naqdusd
		if($data->chiquvchi_hisob=="naqdusd" && $data->kiruvchi_hisob=="naqdsum"){
			$naqdusd -= $data->summa;
			$naqdsum += $data->summa*$data->valyuta;
		}
		if($data->chiquvchi_hisob=="naqdusd" && $data->kiruvchi_hisob=="bank"){
			$naqdusd -= $data->summa;
			$bank += $data->summa*$data->valyuta;
		}
		if($data->chiquvchi_hisob=="naqdusd" && $data->kiruvchi_hisob=="karta"){
			$naqdusd -= $data->summa;
			$karta += $data->summa*$data->valyuta;
		}
		// bank
		if($data->chiquvchi_hisob=="bank" && $data->kiruvchi_hisob=="naqdsum"){
			$bank -= $data->summa;
			$naqdsum += $data->summa;
		}
		if($data->chiquvchi_hisob=="bank" && $data->kiruvchi_hisob=="karta"){
			$bank -= $data->summa;
			$karta += $data->summa;
		}
		if($data->chiquvchi_hisob=="bank" && $data->kiruvchi_hisob=="naqdusd"){
			$bank -= $data->summa*$data->valyuta;
			$naqdusd += $data->summa;
		}
		// karta
		if($data->chiquvchi_hisob=="karta" && $data->kiruvchi_hisob=="naqdsum"){
			$karta -= $data->summa;
			$naqdsum += $data->summa;
		}
		if($data->chiquvchi_hisob=="karta" && $data->kiruvchi_hisob=="bank"){
			$karta -= $data->summa;
			$bank += $data->summa;
		}
		if($data->chiquvchi_hisob=="karta" && $data->kiruvchi_hisob=="naqdusd"){
			$karta -= $data->summa*$data->valyuta;
			$naqdusd += $data->summa;
		}

		$sql = $asli->update('balans',[
			'naqdsum' => $naqdsum,
			'naqdusd' => $naqdusd,
			'bank' => $bank,
			'karta' => $karta
		],['id'=>1]);

		if(!$sql){
			$asli->kalit = 0;
		}
		$sql = $asli->insert('change_balans_history',[
			'chiquvchi' => $data->chiquvchi_hisob,
			'kiruvchi' => $data->kiruvchi_hisob,
			'summa' => $data->summa,
			'valyuta' => $data->valyuta,
			'izoh' => $data->izoh,
			'sana' => time(),
			'user_id' => $user['id']
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