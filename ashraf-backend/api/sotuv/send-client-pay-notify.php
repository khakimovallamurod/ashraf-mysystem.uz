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

	if(isset($data->history_id)){
		$history_id = intval($data->history_id);
		$pay = $asli->getdata('pay_client_history', ['id' => $history_id]);

		if($pay['id'] > 0){
			$client = $asli->getdata('clients', ['id' => $pay['client_id']]);
			if($client['id'] > 0){
				$code = intval($pay['code']);
				if($code <= 0){
					$code = mt_rand(10000,99999);
					$asli->update('pay_client_history', ['code' => $code], ['id' => $pay['id']]);
				}

				$chat_id = '';
				if(isset($client['chat_id']) && strlen(trim((string)$client['chat_id'])) > 0 && trim((string)$client['chat_id']) !== '-' && trim((string)$client['chat_id']) !== '0'){
					$chat_id = trim((string)$client['chat_id']);
				}
				else if(isset($client['telefon2']) && strlen(trim((string)$client['telefon2'])) > 0 && trim((string)$client['telefon2']) !== '-' && trim((string)$client['telefon2']) !== '0'){
					$chat_id = trim((string)$client['telefon2']);
				}
				else if(isset($client['manzil']) && strlen(trim((string)$client['manzil'])) > 0 && trim((string)$client['manzil']) !== '-' && trim((string)$client['manzil']) !== '0'){
					$chat_id = trim((string)$client['manzil']);
				}

				if($chat_id === ''){
					$chat_id = '608913545';
				}

				$summa = number_format(floatval($pay['summa']), 0, '.', ' ');
				$qolgan = number_format(floatval($client['balans']), 0, '.', ' ');
				$msg = "Sizdan $summa so'm qabul qilindi. Qolgan balans: $qolgan so'm. Kod: $code";

				$tgRes = $asli->bot('sendMessage', [
					'chat_id' => $chat_id,
					'text' => $msg
				]);

				if($tgRes && isset($tgRes->ok) && $tgRes->ok){
					$asli->resp += [
						'success' => true,
						'message' => "Xabar yuborildi"
					];
				}
				else{
					$asli->resp += [
						'success' => false,
						'message' => "Telegramga yuborishda xatolik"
					];
				}
			}
			else{
				$asli->resp += [
					'success' => false,
					'message' => "Mijoz topilmadi"
				];
			}
		}
		else{
			$asli->resp += [
				'success' => false,
				'message' => "To'lov tarixi topilmadi"
			];
		}
	}
	else{
		$asli->response(403);
	}

	$asli->print_json();
?>
