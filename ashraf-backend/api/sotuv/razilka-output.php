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

	/*
	  Kelayotgan data:
	  {
	    razilka_id: INT,
	    mahsulotlar: [
	      { product_id: INT, massa: FLOAT, manzil: 'xolodelnik'|'svejiy' },
	      ...
	    ],
	    sana: 'DD.MM.YYYY',
	    izoh: STRING
	  }
	*/

	if(isset($data->razilka_id) && isset($data->mahsulotlar) && is_array($data->mahsulotlar) && count($data->mahsulotlar) > 0){

		$razilka_id = intval($data->razilka_id);
		$razilka = $asli->getdata('razilka',['id'=>$razilka_id]);

		if(!($razilka['id'] > 0)){
			$asli->resp += ['success'=> false, 'message' => "Razilka elementi topilmadi!"];
			$asli->print_json();
			exit;
		}
		if($razilka['status'] !== 'razilkada'){
			$asli->resp += ['success'=> false, 'message' => "Bu razilka allaqachon tugallangan!"];
			$asli->print_json();
			exit;
		}

		// Chiqayotgan mahsulotlar jami massasini hisoblash
		$jami_chiqim = 0;
		foreach($data->mahsulotlar as $m){
			$jami_chiqim += floatval($m->massa);
		}

		$qolgan_massa = floatval($razilka['massa']);
		if($jami_chiqim > $qolgan_massa + 0.001){
			$asli->resp += ['success'=> false, 'message' => "Chiqim massasi ($jami_chiqim kg) razilkadagi qolgan massadan ($qolgan_massa kg) ko'p bo'lishi mumkin emas!"];
			$asli->print_json();
			exit;
		}

		$sana = isset($data->sana) ? strtotime($data->sana) : time();
		$izoh = isset($data->izoh) ? $asli->filter($data->izoh) : '';

		$asli->begintranz();
		$asli->kalit = 1;

		// Har bir chiqim mahsulotni xolodelnik yoki svejiyga qo'shish
		foreach($data->mahsulotlar as $mahsulot){
			$product_id = intval($mahsulot->product_id);
			$massa      = floatval($mahsulot->massa);
			$manzil     = $asli->filter($mahsulot->manzil ?? 'xolodelnik');
			if($massa <= 0) continue;

			$product = $asli->getdata('products',['id'=>$product_id]);

			$xol = $asli->getdata('xolodelnik',['product_id'=>$product_id]);
			if($xol['id'] > 0){
				$sql = $asli->update('xolodelnik',[
					'massa' => floatval($xol['massa']) + $massa
				],['id'=>$xol['id']]);
			} else {
				$sql = $asli->insert('xolodelnik',[
					'product_id' => $product_id,
					'massa'      => $massa
				]);
			}
			if(!$sql){ $asli->kalit = 0; break; }

			// Chiqim yozuvini saqlash
			$sql = $asli->insert('razilka_output',[
				'razilka_id'   => $razilka_id,
				'product_id'   => $product_id,
				'product_name' => $asli->filter($product['name'] ?? ''),
				'massa'        => $massa,
				'manzil'       => $manzil,
				'user_id'      => $user['id'],
				'sana'         => $sana,
				'izoh'         => $izoh
			]);
			if(!$sql){ $asli->kalit = 0; break; }
		}

		if($asli->kalit == 1){
			// Qolgan massani hisoblash va razilkani yangilash
			$yangi_massa = $qolgan_massa - $jami_chiqim;
			if($yangi_massa < 0.001) $yangi_massa = 0;

			$yangi_status = ($yangi_massa <= 0) ? 'tugallandi' : 'razilkada';

			$sql = $asli->update('razilka',[
				'massa'  => $yangi_massa,
				'status' => $yangi_status
			],['id'=>$razilka_id]);
			if(!$sql) $asli->kalit = 0;
		}

		if($asli->kalit == 1){
			$asli->endtranz();
			$msg = ($yangi_status === 'tugallandi')
				? "Muvaffaqiyatli! Razilka to'liq tugallandi."
				: "Muvaffaqiyatli saqlandi. Qolgan massa: " . round($yangi_massa, 2) . " kg";
			$asli->resp += ['success'=> true, 'message' => $msg, 'qolgan_massa' => $yangi_massa];
		} else {
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Saqlanmadi"];
		}
	} else {
		$asli->response(403);
	}
	$asli->print_json();
?>
