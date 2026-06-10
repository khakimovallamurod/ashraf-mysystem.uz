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

	if(isset($data->id)){
		$razilka_id = intval($data->id);
		$razilka = $asli->getdata('razilka',['id'=>$razilka_id]);

		if(!($razilka['id'] > 0)){
			$asli->resp += ['success'=> false, 'message' => "Razilka elementi topilmadi!"];
			$asli->print_json();
			exit;
		}
		if($razilka['status'] !== 'razilkada'){
			$asli->resp += ['success'=> false, 'message' => "Bu element allaqachon xolodelnikka o'tkazilgan!"];
			$asli->print_json();
			exit;
		}

		$asli->begintranz();
		$asli->kalit = 1;

		// Xolodelnikka qo'shish
		$xol = $asli->getdata('xolodelnik',['product_id'=>$razilka['product_id']]);
		if($xol['id'] > 0){
			$sql = $asli->update('xolodelnik',[
				'massa' => floatval($xol['massa']) + floatval($razilka['massa'])
			],['id'=>$xol['id']]);
		} else {
			$sql = $asli->insert('xolodelnik',[
				'product_id' => $razilka['product_id'],
				'massa'      => floatval($razilka['massa'])
			]);
		}
		if(!$sql) $asli->kalit = 0;

		// Razilka statusini yangilash
		$sql = $asli->update('razilka',[
			'status' => 'xolodelnikda'
		],['id'=>$razilka_id]);
		if(!$sql) $asli->kalit = 0;

		if($asli->kalit == 1){
			$asli->endtranz();
			$asli->resp += ['success'=> true, 'message' => "Xolodelnikka muvaffaqiyatli o'tkazildi"];
		} else {
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Xatolik! O'tkazilmadi"];
		}
	} else {
		$asli->response(403);
	}
	$asli->print_json();
?>
