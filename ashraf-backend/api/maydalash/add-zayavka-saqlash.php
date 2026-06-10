<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();


	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['maydalash','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$sana = time();
	$asli->begintranz();
	$asli->kalit = 1;
	$bugun = date("d.m.Y");
	$p = $asli->getdata('partiya',['kun'=>$bugun]);
	$p_id = $p['id'];
	$sql = $asli->insert('zayavka_msq',[
		'massa' => $data->massa + $data->xol_massa,
		'rmassa' => $data->massa + $data->xol_massa,
		'sana' => $sana,
		'maydalovchi_id' => $user['id'],
		'status' => 'maydalashda'
	]);
	if($sql){			
		$z = $asli->getdata('zayavka_msq',['sana'=>$sana]);

		$asli->update('zayavka_msq',['pnomer'=>"P".$z['id']],['id'=>$z['id']]);
		
		if($data->xol_massa>0){
			$saqlash = $asli->getdata('xolodelnik',['product_id'=>$data->product_id]);
			if($saqlash['massa']>=$data->xol_massa){
				$sql = $asli->insert('zayavka_msq_items',[
					'massa' => $data->xol_massa,					
					'product_id' => $data->product_id,
					'zayavka_msq_id	' => $z['id'],
					'partiya_id' => 0,
					'sana' => $sana
				]);
				if(!$sql){						
					$asli->kalit = 0;
				}
				$sql = $asli->update('xolodelnik',[
					'massa' => $saqlash['massa'] - $data->xol_massa
				],['id'=>$saqlash['id']]);	
				if(!$sql){
					$asli->kalit = 0;
				}
			}
		}
		if($data->massa>0){
			$sql = $asli->insert('zayavka_msq_items',[
				'massa' => $data->massa,					
				'product_id' => $data->product_id,
				'zayavka_msq_id	' => $z['id'],
				'partiya_id' => $p_id,
				'sana' => $sana
			]);
			if(!$sql){						
				$asli->kalit = 0;
			}
		}
		if($asli->kalit==1){
			$asli->endtranz();
			$asli->resp += ['success'=> true, 'message' => "Tranzaktsiya muvaffaqqiyatli yakunlandi!"];
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
		}
	}
	else{
		$asli->bekor();
		$asli->resp += ['success'=> false, 'message' => "Saqlanmadi!"];
	}
	$asli->print_json();
?>