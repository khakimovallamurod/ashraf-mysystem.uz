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
	if(isset($data->massa) && isset($data->price) && $data->massa > 0 && $data->price > 0 && isset($data->taminotchi_id) && isset($data->qassob_id) && isset($data->dona) && isset($data->product_id)){
		$asli->begintranz();
		$sana = time();
		$bugun = date("d.m.Y");
		$p = $asli->getdata('partiya',['kun'=>$bugun]);
		$partiya_id = isset($p['id']) && $p['id'] > 0 ? $p['id'] : 0;
		if($data->product_id>1){
			$partiya_id = 0;
			$x = $asli->getdata('xolodelnik',[
				'product_id' => $data->product_id
			]);
			if($x['id']>0){
				$sql = $asli->update('xolodelnik',[
					'massa' => $x['massa'] + $data->massa
				],['id'=>$x['id']]);
			}
			else{
				$sql = $asli->insert('xolodelnik',[
					'product_id' => $data->product_id,
					'massa' => $data->massa
				]);
			}
			if(!$sql){
				$asli->kalit = 0;
			}
		}
		$summa = $data->massa * $data->price;
		$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
		$sql = $asli->insert('krimproducts',[
			'tashkilot_id' => $data->taminotchi_id,
			'qassob_id' => $data->qassob_id,
			'sana' => $sana,
			'dona' => $data->dona,
			'massa' => $data->massa,
			'price' => $data->price,
			'product_id' => $data->product_id,
			'summa' => $summa,
			'malumot' => json_encode($data->malumot),
			'user_id' => $user['id'],
			'status' => 'joylandi',
			'yuklovchi_id' => 0,
			'partiya_id' => $partiya_id
		]);
		$dt = $asli->getdata('krimproducts',[],"sana='$sana' AND user_id='{$user['id']}' ORDER BY id DESC LIMIT 1");
		$asli->update('krimproducts',['partiyanomer'=>"K".$dt['id']],['id'=>$dt['id']]);
		if($sql && $data->massa>0){
			$taminotchi = $asli->getdata('taminotchi',['id'=>$data->taminotchi_id]);
			$sql = $asli->update('taminotchi',[
				'balans' => $taminotchi['balans'] + $summa
			],['id'=>$data->taminotchi_id]);
			$taminotchi['balans'] += $summa;
			$qassob = $asli->getdata('qassoblar',['id'=>$data->qassob_id]);
			$sql2 = $asli->update('qassoblar',[
				'balans' => $qassob['balans'] + $qassob['kpi'] * $data->dona
			],['id'=>$data->qassob_id]);

			$product = $asli->getdata('products',['article'=>'t-1']);
			$sql3 = $asli->update('products',[
				'soni' => $product['soni'] + $data->massa
			],['article'=>'t-1']);
			if($sql2 && $sql3){
				$asli->endtranz();
				$asli->resp += ['success'=> true, 'message' => "Barchasi muvaffiqqiyatli"];
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
			}
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>
