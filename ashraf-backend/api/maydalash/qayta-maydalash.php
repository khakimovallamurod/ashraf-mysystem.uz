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
	
	if(isset($data->zayavka_id) && count($data->products)>=0){
		$zayavka = $asli->getdata('qaytam_partiya',['id'=>$data->zayavka_id]);
		if($zayavka['status']=="maydalashda"){			
			$asli->begintranz();
			$products = $data->products;
			$asli->kalit = 1;
			$sana = time();
			$mz = $asli->summaustun('qaytam_items','massa',['qaytam_partiya_id'=>$data->zayavka_id]);
			$my = $asli->summaustun('qaytamaydalash_items','massa',['qaytam_partiya_id'=>$data->zayavka_id]);
			foreach ($products as $key => $product) {
				$mx += $product->massa;
			}
			if($my+$mx>$mz*1.1){
				$asli->kalit = 2;
			}
			foreach ($products as $key => $product) {				
				if(false){ //$product->bulim_id==2					
					$sql = $asli->insert('qaytamaydalash_items',[
						'product_id' => $product->product_id,
						'massa' => $product->massa,
						'qaytam_partiya_id' => $data->zayavka_id,
						'maydalovchi_id' => $user['id'],
						'sana' => time()
					]);
					if (!$sql) {
						$asli->kalit = 0;
					}
				}
				else{
					$p = $asli->getdata('products',['id'=>$product->product_id]);
					$sql = $asli->update('products',[
						'soni' => $p['soni'] + $product->massa
					],['id'=>$product->product_id]);
					if (!$sql) {						
						$asli->kalit = 0;
					}

					$sql = $asli->insert('qaytamaydalash_items',[
						'product_id' => $product->product_id,
						'massa' => $product->massa,
						'qaytam_partiya_id' => $data->zayavka_id,
						'maydalovchi_id' => $user['id'],
						'sana' => time(),
						'polka_id' => $product->polka_id,
						'status' => 'joylandi'
					]);
					if (!$sql) {
						$asli->kalit = 0;
					}

					$pp = $asli->getdata('putpolka',['polka_id'=>$product->polka_id,'product_id'=>$product->product_id,'qaytam_partiya_id'=>$zayavka['id']]);
					if($pp['id']>0){
						$sql = $asli->update('putpolka',[
							'massa' => $pp['massa'] + $product->massa,
							'qoldi' => $pp['qoldi'] + $product->massa
						],['id'=>$pp['id']]);
						if (!$sql) {
							$asli->kalit = 0;
						}
					}
					else{
						$qm = $asli->getdata('qaytam_items',['qaytam_partiya_id'=>$zayavka['id']]);
						$sql = $asli->insert('putpolka',[
							'polka_id' => $product->polka_id,
							'product_id' => $product->product_id,
							'massa' => $product->massa,
							'qoldi' => $product->massa,
							'tannarx' => $qm['summa']/$qm['massa'],
							'qaytam_partiya_id' => $qm['id']
						]);
						if (!$sql) {							
							$asli->kalit = 0;
						}						
					}					
				}				
			}
			if($data->isend == 1){

				$sql = $asli->update('qaytam_partiya',[
					'status' => 'bajarildi',
					'endvaqt' => time()
				],['id'=>$zayavka['id']]);

				if (!$sql) {
					$asli->kalit = 0;
				}

				// ish haqqi yozamiz
				$workers = json_decode(htmlspecialchars_decode($zayavka['workers']));
				$massa = $asli->summaustun('maydalash','massa',['zayavka_msq_id'=>$zayavka['id']]);
				$ishhaqi = $asli->getdata('ishhaqqi', ['id'=>2]);
				$summa = $ishhaqi['fee'] * $massa;
				$izoh = $ishhaqi['izoh']." Massa : $massa"." kg, Summa : ".$summa." so'm qo'shildi.";
				foreach ($workers as $key => $worker) {
					$w = $asli->getdata('workers',['id'=>$worker->worker_id]);
					$sql = $asli->update('workers',[
						'balans' => $w['balans']+$summa
					],['id'=>$w['id']]);
					if(!$sql){
						$asli->kalit = 0;
					}
					$sql = $asli->insert('works',[
						'izoh' => $izoh,
						'worker_id' => $w['id'],
						'summa' => $summa,
						'sana' => $sana,
						'zayavka_id' => $data->zayavka_id
					]);
					if(!$sql){
						$asli->kalit = 0;
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
					$asli->resp += ['success'=> false, 'message' => "Ishingga masulyatsizlik bilan kirishmoqdasan. Keyingi safar yaxshi gap eshitmaysan!!!"];
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];	
				}				
			}
		}
		else{			
			$asli->resp += ['success'=> false, 'message' => "Allaqachon bajarilgan!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>