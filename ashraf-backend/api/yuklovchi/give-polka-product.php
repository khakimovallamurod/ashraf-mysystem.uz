<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['yuklovchi','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($data->order_id) && isset($data->order_item_id) && isset($data->polka_id) && isset($data->partiya_id) && isset($data->massa) && isset($data->partiya_id)){

		$order = $asli->getdata('sale_orders',['id'=>$data->order_id]);
		$item = $asli->getdata('sale_order_items',['id'=>$data->order_item_id]);

		$polka = $asli->getdata('putpolka',['id'=>$data->partiya_id]);
		if($polka['product_id']==$item['product_id']){
			if($polka['qaytam_partiya_id']==0){
				$ishhaqi = $asli->getdata('ishhaqqi',['id'=>1]);
				$fee = $ishhaqi['fee'];
				$zmsq = $asli->getdata('zayavka_msq',['id'=>$polka['zayavka_msq_id']]);
				$tannarx = $data->massa * ($zmsq['summa'] / $zmsq['rmassa']) + $data->massa*$fee;
			}
			else{
				$ishhaqi = $asli->getdata('ishhaqqi',['id'=>2]);
				$fee = $ishhaqi['fee'];
				$qmp = $asli->getdata('qaytam_items',['qaytam_partiya_id'=>$polka['qaytam_partiya_id']]);
				$tannarx = $data->massa * ($qmp['summa'] / $qmp['massa']) + $data->massa * $fee;
			}
			if(($item['status']=="tayyorlanmoqda" || $item['status']=="new") && $polka['massa']>=$data->massa && $order['id']==$item['sale_order_id']){

				$foyda = ($item['price'] * $data->massa - $tannarx) ;
				$product = $asli->getdata('products',['id'=>$item['product_id']]);

				if($product['id']>0){
					$asli->begintranz();
					$asli->kalit = 1;
					$sql = $asli->insert('chiqim_history',[
						'product_id' => $polka['product_id'],
						'order_id' => $data->order_id,
						'order_item_id' => $data->order_item_id,
						'polka_id' => $data->polka_id,
						'partiya_id' => $data->partiya_id,
						'massa' => $data->massa,
						'user_id' => $user['id'],
						'sana' => time()
					]);
					if (!$sql) {
						$asli->kalit = 0;
					}
					$sql = $asli->update('products',[
						'soni' => $product['soni'] - $data->massa
					],['id'=>$product['id']]);
					if($sql){
						if($item['tayyorlandi']+$data->massa>=$item['soni'] || $data->isEnd==1){
							$sql = $asli->update('sale_order_items',[
										'status'=>'tayyorlandi',
										'tayyorlandi'=>$item['tayyorlandi']+$data->massa,
										'tannarx'=>$item['tannarx']+$tannarx,
										'foyda'=>$item['foyda']+$foyda,
										'summa'=>($item['tayyorlandi']+$data->massa)*$item['price']
									],['id'=>$item['id']]);
						}
						else{						
							$sql = $asli->update('sale_order_items',[
										'tayyorlandi'=>$item['tayyorlandi']+$data->massa,
										'tannarx'=>$item['tannarx']+$tannarx,
										'foyda'=>$item['foyda']+$foyda,
										'summa'=>($item['tayyorlandi']+$data->massa)*$item['price']
									],['id'=>$item['id']]);
						}
						if(!$sql){
							$asli->kalit = 0;
						}
						if($sql){
							if($data->isEndOrder==1){								
								$sql2 = $asli->update('sale_order_items',['status'=>'tayyorlandi'],['sale_order_id'=>$data->order_id]);
								if(!$sql2){
									$asli->kalit = 0;
								}
								$summa = $asli->summaustun('sale_order_items','summa',['sale_order_id'=>$data->order_id]);
								$sql = $asli->update('sale_orders',['status'=>'tayyorlandi','summa'=>$summa],['id'=>$data->order_id]);
								if(!$sql){
									$asli->kalit = 0;
								}								
							}
							$sql = $asli->update('putpolka',['massa'=>$polka['massa']-$data->massa],['id'=>$polka['id']]);
							if(!$sql){
								$asli->kalit = 0;
							}
							if($asli->kalit == 1){
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
							$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi2!"];
						}
					}
					else{
						$asli->bekor();
						$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
					}				
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "Mahsulot topilmadi!"];
				}			
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Allaqachon tayyorlangan yoki bunday miqdor ayni vaqtda mavjud emas!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Bu mahsulotni yecha olmaysiz bundan buyurtma bo'lmagan"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>