<?php
	include_once '../header.php';
	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['admin','sotuv','agent','saqlash'];

	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if (isset($_GET['id']) && isset($data->fio) && isset($data->telefon)) {
		$id = (int)$_GET['id'];
		$fio = trim($data->fio);
		$telefon = trim($data->telefon);
		$manzil = isset($data->manzil) ? trim($data->manzil) : '';
		$chat_id = isset($data->chat_id) ? trim($data->chat_id) : '';

		$exists = $asli->getdata('clients', [], "telefon='$telefon' AND id<>'$id'");
		if (!empty($exists['id'])) {
			$asli->resp += ['success'=> false, 'message' => "Bu mijoz allaqachon qo'shilgan!"];
		} else {
			$sql = false;
			$updates = [
				[
					'fio' => $fio,
					'telefon' => $telefon,
					'manzil' => $manzil,
					'category_id' => 1,
					'chat_id' => $chat_id
				],
				[
					'fio' => $fio,
					'telefon' => $telefon,
					'manzil' => $manzil,
					'category_id' => 1,
					'telefon2' => $chat_id
				],
				[
					'fio' => $fio,
					'telefon' => $telefon,
					'manzil' => $manzil,
					'category_id' => 1
				]
			];

			foreach ($updates as $updatePayload) {
				try {
					$sql = $asli->update('clients', $updatePayload, ['id' => $id]);
					if ($sql) break;
				} catch (Throwable $e) {}
			}

			if ($sql) {
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli saqlandi!"];
			} else {
				$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
			}
		}
	} else {
		$asli->response(403);
	}

	$asli->print_json();
?>
