<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($data->massa) && isset($data->client_id) && isset($data->product_id)){
		$asli->begintranz();
		$asli->kalit = 1;
		$client = $asli->getdata('clients',['id'=>$data->client_id]);
		if($client['id']>0){
			$category_id = $client['category_id'];
			$product_id = $data->product_id;
			
			$price_list = $asli->getdata('price_list',['product_id'=>$product_id,'category_id'=>$category_id]);
			if($price_list['id']>0){
				$summa = $data->massa * $price_list['price'];
				if($data->paterya == true){
					$sana= time();
					$sql = $asli->insert('paterya_history',[
						'user_id' => $user['id'],
						'client_id' => $data->client_id,
						'summa' => $summa,
						'price' => $price_list['price'],
						'massa' => $data->massa,
						'sana' => $sana,
						'product_id' => $data->product_id,
						'bulim' => 'dostavka'
					]);
					if(!$sql){
						$asli->kalit = 0;
					}
					$sql = $asli->insert('vozvrat',[
						'client_id' => $data->client_id,
						'product_id' => $data->product_id,
						'massa' => $data->massa,
						'price' => $price_list['price'],
						'summa' => $summa,
						'sana' => $sana,
						'dostavka_id' => $user['id'],
						'holat' => 'paterya'
					]);
				}
				else{
					$sql = $asli->insert('vozvrat',[
						'client_id' => $data->client_id,
						'product_id' => $data->product_id,
						'massa' => $data->massa,
						'price' => $price_list['price'],
						'summa' => $summa,
						'sana' => time(),
						'dostavka_id' => $user['id']
					]);	
				}				
				if(!$sql){
					$asli->kalit = 0;
				}
				$sql = $asli->update('clients',['balans'=>$client['balans']-$summa],['id'=>$client['id']]);
				if(!$sql){
					$asli->kalit = 0;
				}
				if($asli->kalit == 1){
					$asli->endtranz();
					// sms
					$asli->sendsms($client['telefon'],"Vozvrt qabul qilindi. Summa $summa. Hozirgi balans :".number_format($client['balans']));
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qo'shildi"];
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
				}
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Narx topilmadi! Sotuv bo'limiga xabar qiling!"];
			}			
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Mijoz topilmadi!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>