<?php
	include_once '../header.php';
	include_once '../config.php';

	function send_fast_sms($asli, $telefon, $msg){
		$telefon = $asli->filterphone($telefon);
		if(strlen($telefon) < 9){
			return false;
		}

		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_URL => "http://91.204.239.44/broker-api/send",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 3,
			CURLOPT_CONNECTTIMEOUT => 2,
			CURLOPT_TIMEOUT => 6,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => "{ \"messages\": [ { \"recipient\": \"$telefon\", \"message-id\": \"2016256\", \"sms\": { \"originator\": \"3700\", \"content\": { \"text\": \"ASHRAF-777 $msg\" } } } ] }",
			CURLOPT_HTTPHEADER => array(
				"Authorization: Basic c2FtZHU6eDlBYWJDTkZa",
				"Cache-Control: no-cache",
				"Content-Type: application/json",
			),
		));
		curl_exec($curl);
		$err = curl_error($curl);
		curl_close($curl);

		return !$err;
	}

	function send_fast_notice($asli, $telefon, $msg, $telegram_id = ''){
		$telegram_id = trim((string)$telegram_id);
		if($telegram_id !== '' && $telegram_id !== '0' && $telegram_id !== '-'){
			$res = $asli->bot('sendMessage', [
				'chat_id' => $telegram_id,
				'text' => $msg
			]);
			if($res && isset($res->ok) && $res->ok){
				return true;
			}
		}
		return send_fast_sms($asli, $telefon, $msg);
	}

	$asli = new Cyber();
	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['sklad','admin','saqlash','sotuv'];

	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$sms_after_response = [];

	if(isset($data->id) && $data->id > 0){
		$krim = $asli->getdata('krimproducts',['id'=>$data->id]);
		if($krim['id']>0){
			$taminotchi = $asli->getdata('taminotchi',['id'=>$krim['tashkilot_id']]);
			$qassob = $asli->getdata('qassoblar',['id'=>$krim['qassob_id']]);
			$qassob_summa = floatval($qassob['kpi']) * floatval($krim['dona']);

			if(strlen($qassob['telefon']) > 0){
				$sms_after_response[] = [
					'telefon' => $qassob['telefon'],
					'telegram_id' => '',
					'message' => "Yuk qabul qilinidi. Kirib kelgan tovuqlar soni : ".$krim['dona']." dona. Summa : ".number_format($qassob_summa,2).""
				];
			}

			if(strlen($taminotchi['telefon']) > 0){
				$sms_after_response[] = [
					'telefon' => $taminotchi['telefon'],
					'telegram_id' => isset($taminotchi['telegram_id']) ? $taminotchi['telegram_id'] : '',
					'message' => "Yuk qabul qilinidi. Massa : ".$krim['massa']." kg. Dona :".$krim['dona']." ta. Narxi : ".number_format($krim['price'],2)." so'm. Summa :".number_format($krim['summa'],2)." usm. Balans : ".number_format($taminotchi['balans'],2).""
				];
			}

			if(!empty($sms_after_response)){
				$asli->resp += ['success'=> true, 'message' => "SMS xabarnoma yuborishga qabul qilindi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Telefon yoki telegram ma'lumotlarini tekshiring!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Kirim topilmadi!"];
		}
	}
	else{
		$asli->response(403);
	}

	$asli->print_json();
	if(!empty($sms_after_response)){
		if(function_exists('fastcgi_finish_request')){
			fastcgi_finish_request();
		}
		else{
			ignore_user_abort(true);
			if(function_exists('ob_flush')){
				@ob_flush();
			}
			@flush();
		}
		foreach ($sms_after_response as $sms) {
			send_fast_notice($asli, $sms['telefon'], $sms['message'], $sms['telegram_id']);
		}
	}
?>
