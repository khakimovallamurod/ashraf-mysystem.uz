<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();


	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['sotuv','yuklovchi','admin'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$sana = time();
	
	$asli->begintranz();
	$asli->kalit = 1;
	$sql = $asli->insert('zayavka_sotmay',[
		'sana' => $sana,
		'izoh' => $data->description,
		'sotuvchi_id' => $user['id']
	]);

	if($sql && count($data->product_list)>0){
		$zayavka = $asli->getdata('zayavka_sotmay',['sana'=>$sana]);
		if($zayavka['id']>0){
			$asli->update('zayavka_sotmay',['nomer'=>"S".$zayavka['id']],['id'=>$zayavka['id']]);
			$zayavka_id = $zayavka['id'];
			$products = $data->product_list;
			foreach ($products as $key => $product) {
				$product_id = $product->product_id;
				$massa = $product->massa;
				$sql = $asli->insert('zayavka_sotmay_items',[
					'zayavka_sotmay_id' => $zayavka['id'],
					'product_id' => $product_id,
					'soni' => $massa,
					'sana' => $sana
				]);
				if(!$sql){
					$asli->kalit = 0;
				}
			}
			if($asli->kalit == 1){
				$asli->endtranz();
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli saqlandi"];	
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
	}
	else{
		$asli->bekor();
		$asli->resp += ['success'=> false, 'message' => "Saqlanmadi!"];
	}
	$asli->print_json();
?>