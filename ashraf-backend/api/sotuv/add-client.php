<?php
	include_once '../header.php';
	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['admin','sotuv','agent','saqlash'];

	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if (isset($data->fio) && isset($data->telefon)) {
		$telefon = $asli->filterphone($data->telefon);
		$chat_id = isset($data->chat_id) ? trim($data->chat_id) : '';
		$client = $asli->getdata('clients', ['telefon' => $telefon]);

		if ($client['id'] > 0) {
			$asli->resp += ['success'=> false, 'message' => "Bu mijoz allaqachon qo'shilgan!"];
		} else {
			$sql = false;
			$payloads = [
				[
					'fio' => trim($data->fio),
					'telefon' => $telefon,
					'chat_id' => $chat_id,
					'category_id' => 1,
					'manzil' => $data->manzil ?? '',
					'viloyat_id' => 0,
					'tuman_id' => 0,
					'yaqin_muddat' => 0,
					'dostavka_id' => 0,
					'client_type' => 0,
					'chek_tartib' => 0
				],
				[
					'fio' => trim($data->fio),
					'telefon' => $telefon,
					'telefon2' => $chat_id,
					'category_id' => 1,
					'manzil' => $data->manzil ?? '',
					'viloyat_id' => 0,
					'tuman_id' => 0,
					'yaqin_muddat' => 0,
					'dostavka_id' => 0,
					'client_type' => 0,
					'chek_tartib' => 0
				],
				[
					'fio' => trim($data->fio),
					'telefon' => $telefon,
					'category_id' => 1,
					'manzil' => $data->manzil ?? '',
					'viloyat_id' => 0,
					'tuman_id' => 0,
					'yaqin_muddat' => 0,
					'dostavka_id' => 0,
					'client_type' => 0,
					'chek_tartib' => 0
				]
			];

			foreach ($payloads as $payload) {
				try {
					$sql = $asli->insert('clients', $payload);
					if ($sql) break;
				} catch (Throwable $e) {}
			}

			if ($sql) {
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qo'shildi"];
			} else {
				$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
			}
		}
	} else {
		$asli->response(403);
	}

	$asli->print_json();
?>
