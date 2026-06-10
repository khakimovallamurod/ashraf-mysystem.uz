<?php
	include_once '../header.php';
	include_once '../config.php';

	$asli = new Cyber();
	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['sotuv','admin'];
	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	$data = json_decode(file_get_contents("php://input"));
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($data->product_id) && isset($data->massa) && $data->massa > 0 && isset($data->manba)){
		$product_id = intval($data->product_id);
		$massa      = floatval($data->massa);
		$manba      = $asli->filter($data->manba); // 'svejiy' yoki 'xolodelnik'
		$izoh       = isset($data->izoh) ? $asli->filter($data->izoh) : '';

		$asli->begintranz();
		$asli->kalit = 1;

		// Manbadan ayirish: ikki holda ham xolodelnik.massa dan ayiramiz
		$xol = $asli->getdata('xolodelnik',['product_id'=>$product_id]);

		if(!($xol['id'] > 0)){
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Mahsulot xolodelnikda topilmadi!"];
			$asli->print_json();
			exit;
		}
		if(floatval($xol['massa']) < $massa){
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Xolodelnikda massa yetarli emas! (mavjud: ".round($xol['massa'],2)." kg)"];
			$asli->print_json();
			exit;
		}

		$product = $asli->getdata('products',['id'=>$product_id]);

		// Xolodelnikdan ayirish
		$sql = $asli->update('xolodelnik',[
			'massa' => floatval($xol['massa']) - $massa
		],['id'=>$xol['id']]);
		if(!$sql) $asli->kalit = 0;

		// Razilkaga qo'shish
		$sql = $asli->insert('razilka',[
			'product_id'   => $product_id,
			'product_name' => $asli->filter($product['name'] ?? ''),
			'massa'        => $massa,
			'manba'        => $manba,
			'user_id'      => $user['id'],
			'sana'         => time(),
			'status'       => 'razilkada',
			'izoh'         => $izoh
		]);
		if(!$sql) $asli->kalit = 0;

		if($asli->kalit == 1){
			$asli->endtranz();
			$asli->resp += ['success'=> true, 'message' => "Razilkaga muvaffaqiyatli qo'shildi"];
		} else {
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Saqlanmadi"];
		}
	} else {
		$asli->response(403);
	}
	$asli->print_json();
?>
