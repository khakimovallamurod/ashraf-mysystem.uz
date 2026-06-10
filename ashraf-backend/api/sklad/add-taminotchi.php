<?php
	include_once '../header.php';
	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['sklad','admin','saqlash','sotuv'];


	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if (isset($data->fio) && isset($data->telefon)) {
		$fio = trim($data->fio);
		$telefon = trim($data->telefon);
		$telegram_id = isset($data->telegram_id) ? trim($data->telegram_id) : '';

		if ($fio === '' || $telefon === '') {
			$asli->resp += ['success' => false, 'message' => "Ma'lumotlar to'liq emas"];
			$asli->print_json();
			exit;
		}

		$exists = $asli->getdata('taminotchi', ['telefon' => $telefon]);
		if (!empty($exists['id'])) {
			$asli->resp += ['success' => false, 'message' => "Bu telefon bilan ta'minotchi allaqachon mavjud!"];
			$asli->print_json();
			exit;
		}

		$insertData = [
			'fio' => $fio,
			'telefon' => $telefon,
			'telegram_id' => $telegram_id === '' ? '-' : $telegram_id
		];

		$sql = $asli->insert('taminotchi', $insertData);

		if ($sql) {
			$asli->resp += ['success' => true, 'message' => "Ta'minotchi muvaffaqiyatli qo'shildi"];
		} else {
			$asli->resp += ['success' => false, 'message' => "Xatolik! Qo'shilmadi"];
		}
	} else {
		$asli->response(403);
	}

	$asli->print_json();
?>
