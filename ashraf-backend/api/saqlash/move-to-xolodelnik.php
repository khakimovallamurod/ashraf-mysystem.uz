<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['sklad','admin','saqlash','sotuv'];


	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$ret = [];
	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($data->product_id) && isset($data->massa)){
		$asli->begintranz();
		$asli->kalit = 1;
		$bugun = date("d.m.Y");
		$p = $asli->getdata('partiya',['kun'=>$bugun]);
		$p_id = $p['id'];

		$sql = $asli->insert('xolodelnik_krim',[
			'partiya_id' => $p['id'],
			'product_id' => $data->product_id,
			'massa' => $data->massa,
			'sana' => time(),
			'user_id' => $user['id']
		]);
		if(!$sql){
			$asli->kalit = 0;
		}

		$xol = $asli->getdata('xolodelnik',[
			'product_id' => $data->product_id
		]);
		if($xol['id']>0){
			$sql = $asli->update('xolodelnik',[
				'massa' => $xol['massa'] + $data->massa
			],['id'=>$xol['id']]);
		}
		else{
			$sql = $asli->insert('xolodelnik',[
				'product_id' => $data->product_id,
				'massa' => $xol['massa'] + $data->massa
			]);
		}

		if(!$sql){
			$asli->kalit = 0;
		}

		if($asli->kalit == 1){
			$asli->endtranz();
			$asli->resp += ['success'=> true, 'message' => "Barchasi muvaffiqqiyatli saqlandi"];
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> true, 'message' => "Yakunlanmadi"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>