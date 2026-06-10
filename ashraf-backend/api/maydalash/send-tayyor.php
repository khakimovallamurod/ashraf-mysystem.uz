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

	
	if(isset($data->zayavka_id) && count($data->products)>0){
		$asli->begintranz();
		$products = $data->products;
		$asli->kalit = 1;
		$sana = time();
		$zmq = $asli->getdata('zayavka_msq',['id'=>$data->zayavka_id]);
		foreach ($products as $key => $product) {
			$mx += $product->massa;
		}
		$my = $asli->summaustun('maydalash','massa',['zayavka_msq_id'=>$data->zayavka_id]);
		if(($my+$mx)>=$zmq['rmassa']*1.1){
			$asli->kalit = 2;
		}
		foreach ($products as $key => $product) {
			if($product->bulim_id==2){
				$sql = $asli->insert('maydalash',[
					'product_id' => $product->product_id,
					'article' => $product->article,
					'tannarx' => $zmq['summa']/$zmq['rmassa'],
					'massa' => $product->massa,
					'zayavka_msq_id' => $data->zayavka_id,
					'user_id' => $user['id'],
					'yuklovchi_id' => $user['id'],
					'sana' => $sana
				]);
				if (!$sql){					
					$asli->kalit = 0;
				}
				$xp = $asli->getdata('products',['id'=>$product->product_id]);
				$sql = $asli->update('products',[
					'soni' => $xp['soni'] + $product->massa
				],['id'=>$xp['id']]);

				if(!$sql){					
					$asli->kalit = 0;
				}

				$pp = $asli->getdata('putpolka',['polka_id'=>$product->polka_id,'product_id'=>$product->product_id]);

				if($pp['id']>0){
					$sql = $asli->update('putpolka',[
						'massa' => floatval($pp['massa']) + floatval($product->massa),
						'qoldi' => $pp['qoldi'] + $product->massa
					],['id'=>$pp['id']]);
					if(!$sql){
						$asli->kalit = 0;
					}
				}
				else{					
					$sql = $asli->insert('putpolka',[
						'polka_id' => $product->polka_id,
						'product_id' => $product->product_id,
						'massa' => $product->massa,
						'qoldi' => $product->massa,
						'tannarx' => $zmq['summa']/$zmq['rmassa']
					]);
					if(!$sql){						
						$asli->kalit = 0;
					}
				}
			}
			else{
				$sql = $asli->insert('maydalash',[
					'product_id' => $product->product_id,
					'article' => $product->article,
					'tannarx' => $zmq['summa']/$zmq['rmassa'],
					'massa' => $product->massa,
					'zayavka_msq_id' => $data->zayavka_id,
					'user_id' => $user['id'],
					'yuklovchi_id' => $user['id'],
					'sana' => $sana,
					'status' => 'joylandi'
				]);
				if (!$sql){					
					$asli->kalit = 0;
				}
				$xp = $asli->getdata('xolodelnik',['product_id'=>$product->product_id]);
				if($xp['id']>0){
					$sql = $asli->update('xolodelnik',[
						'massa' => $xp['massa'] + $product->massa
					],['id'=>$xp['id']]);

					if(!$sql){					
						$asli->kalit = 0;
					}
				}
				else{
					$sql = $asli->insert('xolodelnik',[
						'product_id' => $product->product_id,
						'massa' => $product->massa
					]);

					if(!$sql){					
						$asli->kalit = 0;
					}
				}
			}
		}
		

		if($asli->kalit == 1){			
			$asli->endtranz();
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli saqlandi!"];
		}
		else{
			$asli->bekor();
			if($asli->kalit == 2){
				$asli->resp += ['success'=> false, 'message' => "Massa limitidan o'tib ketyapsiz!"];	
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
			}
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>