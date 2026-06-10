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

	if (isset($data->name) && strlen(trim($data->name)) > 2 && isset($data->article)) {
		$name = trim($data->name);
		$article = trim($data->article);
		$barcode = isset($data->barcode) && trim($data->barcode) !== '' ? trim($data->barcode) : $article;
		$category_id = isset($data->category_id) ? (int)$data->category_id : 0;

		$product = $asli->getdata('products', ['article' => $article]);
		if (!empty($product['id'])) {
			$asli->resp += ['success'=> false, 'message' => "Bu article bilan mahsulot allaqachon mavjud!"];
			$asli->print_json();
			exit;
		}

		$sql = $asli->insert('products', [
			'name' => $name,
			'article' => $article,
			'barcode' => $barcode,
			'price' => $data->price ?? 0,
			'category_id' => $category_id
		]);

		if ($sql) {
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qo'shildi"];
		} else {
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
		}
	} else {
		$asli->response(403);
	}

	$asli->print_json();
?>
