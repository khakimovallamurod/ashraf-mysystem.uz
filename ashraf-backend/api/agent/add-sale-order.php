<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['admin','sotuv','agent'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($data->client_id) && count($data->product_list)>0 ){
		$client = $asli->getdata('clients',['id'=>$data->client_id]);
		if($client['id']>0){
			$asli->begintranz();
			$asli->kalit = 1;
			$sana = time();
			$sql = $asli->insert('sale_orders',[
				'summa' => $data->summa,
				'naqd' => $data->naqd,
				'naqdusd' => $data->naqdusd,
				'plastik' => $data->plastik,
				'karta' => $data->karta,
				'valyuta' => $data->valyuta,
				'qarz' => $data->qarz,
				'client_id' => $data->client_id,
				'izoh' => $data->izoh,
				'muddat' => strtotime($data->muddat),
				'sana' => $sana,
				'agent_id' => $user['id']
			]);
			$tolov = $data->naqd + $data->naqdusd*$data->valyuta + $data->plastik + $data->karta;
			if($sql){
				if(strtotime($data->muddat)<$client['yaqin_muddat'] || $client['yaqin_muddat']==0){
					$sql = $asli->update('clients',['yaqin_muddat'=>strtotime($data->muddat)],['id'=>$client['id']]);
					if(!$sql){
						$asli->kalit = 0;
					}
				}
				$order = $asli->getdata('sale_orders',['sana'=>$sana, 'client_id'=>$data->client_id]);
				if($order['id']>0){
					$summa = 0;
					$products = $data->product_list;
					foreach ($products as $key => $product) {
						$sql = $asli->insert('sale_order_items',[
							'sale_order_id' => $order['id'],
							'product_id' => $product->product_id,
							'article' => $product->article,
							'soni' => $product->soni,
							'soni' => $product->massa,
							'price' => $product->price,
							'summa' => $product->price * $product->massa,
							'sana' => $sana,
							'agent_id' => $user['id']
						]);
						$summa += $product->price * $product->massa;
						if(!$sql){
							$asli->kalit = 0;
						}						
					}
					$qarz = $summa - $tolov;
					$sql = $asli->update('sale_orders',['summa'=>$summa,'tolov'=>$tolov,'qarz'=>$qarz],['id'=>$order['id']]);

					if(!$sql){
						$asli->kalit = 0;
					}
					// $sql = $asli->update('clients',['balans'=>$client['balans']+$qarz],['id'=>$client['id']]);
					// if(!$sql){
					// 	$asli->kalit = 0;
					// }
					//klentga sms jo'natiladi

					if($asli->kalit == 1){
						$asli->endtranz();
						$asli->resp += ['success'=> true, 'message' => "Barchasi muvaffiqqiyatli saqlandi"];
					}
					else{
						$asli->bekor();
						$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
					}
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Buyurtma yozilmadi!"];	
				}
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Buyurtma yozilmadi!"];	
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Kechirasiz mijoz topilmadi!"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>