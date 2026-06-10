<?php
	include_once '../header.php';
	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['admin', 'sotuv'];

	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if (
		isset($data->fio) &&
		isset($data->telefon) &&
		isset($data->bulim_id)
	) {
		$fio = trim($data->fio);
		$telefon = trim($data->telefon);
		$bulim_id = (int)$data->bulim_id;
		$chat_id = isset($data->chat_id) ? trim($data->chat_id) : "";

		if ($fio === '' || $telefon === '' || $bulim_id <= 0) {
			$asli->resp += ['success' => false, 'message' => "Ma'lumotlar to'liq emas"];
			$asli->print_json();
			exit;
		}

		try {
			$worker = $asli->getdata('workers', ['telefon' => $telefon]);
			if (!empty($worker['id'])) {
				$asli->resp += ['success' => false, 'message' => "Bu telefon bilan ishchi allaqachon mavjud!"];
				$asli->print_json();
				exit;
			}
		} catch (Throwable $e) {
			// Telefon bo'yicha tekshiruv xatosi bo'lsa ham insert fallback orqali davom etamiz.
		}

		if ($chat_id !== '') {
			try {
				$workerByChat = $asli->getdata('workers', ['chat_id' => $chat_id]);
				if (!empty($workerByChat['id'])) {
					$asli->resp += ['success' => false, 'message' => "Bu chat id allaqachon ishlatilgan!"];
					$asli->print_json();
					exit;
				}
			} catch (Throwable $e) {
				// Eski bazalarda chat_id ustuni bo'lmasligi mumkin.
			}
		}

		$inserted = false;
		$insertPayloads = [
			[
				'fio' => $fio,
				'telefon' => $telefon,
				'bulim_id' => $bulim_id,
				'chat_id' => $chat_id,
				'oylik_id' => 0
			],
			[
				'fio' => $fio,
				'telefon' => $telefon,
				'bulim_id' => $bulim_id,
				'oylik_id' => 0
			],
			[
				'fio' => $fio,
				'telefon' => $telefon,
				'bulim_id' => $bulim_id
			],
			[
				'fio' => $fio,
				'telefon' => $telefon,
				'oylik_id' => 0
			],
			[
				'fio' => $fio,
				'telefon' => $telefon
			]
		];

		foreach ($insertPayloads as $payload) {
			try {
				$sql = $asli->insert('workers', $payload);
				if ($sql) {
					$inserted = true;
					break;
				}
			} catch (Throwable $e) {
				// Keyingi fallback insert varianti bilan davom etamiz.
			}
		}

		if ($inserted) {
			$asli->resp += ['success' => true, 'message' => "Ishchi muvaffaqiyatli qo'shildi"];
		} else {
			$asli->resp += ['success' => false, 'message' => "Bazaga qo'shilmadi. Jadval ustunlari (bulim_id/chat_id/oylik_id) va DB holatini tekshiring."];
		}
	} else {
		$asli->response(403);
	}

	$asli->print_json();
?>
