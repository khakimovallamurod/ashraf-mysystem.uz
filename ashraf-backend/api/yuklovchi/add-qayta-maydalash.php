<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();


	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['yuklovchi','maydalash','saqlash'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$sana = time();
	
	$asli->begintranz();
	$asli->kalit = 1;
	$sql = $asli->insert('qaytam_partiya',[
		'sana' => $sana,
		'izoh' => $data->description,
		'yuklovchi_id' => $user['id']
	]);

	if($sql && count($data->product_list)>0){
		$zayavka = $asli->getdata('qaytam_partiya',['sana'=>$sana]);
		if($zayavka['id']>0){
			$asli->update('qaytam_partiya',['nomer'=>"Qm".$zayavka['id']],['id'=>$zayavka['id']]);
			$zayavka_id = $zayavka['id'];
			$products = $data->product_list;
			foreach ($products as $key => $product) {
				
				$massa = $product->massa;
				
				$polka = $asli->getdata('putpolka',['id'=>$product->partiya_id]);
				$product_id = $polka['product_id'];
				if($polka['qaytam_partiya_id']==0){
					$zmsq = $asli->getdata('zayavka_msq',['id'=>$polka['zayavka_msq_id']]);
					$summa = $zmsq['summa'] / $zmsq['rmassa'] * $massa;
				}
				else{
					$qmp = $asli->getdata('qaytam_items',['qaytam_partiya_id'=>$polka['qaytam_partiya_id']]);
					$summa = $qmp['summa'] / $qmp['massa'] * $massa;
				}
				$sql = $asli->insert('qaytam_items',[
					'qaytam_partiya_id' => $zayavka['id'],
					'product_id' => $product_id,
					'polka_id' => $product->polka_id,
					'massa' => $massa,
					'summa' => $summa
				]);
				if(!$sql){					
					$asli->kalit = 0;
				}
				if($polka['massa']>=$massa){

					$sql = $asli->update('putpolka',['massa'=>$polka['massa']-$massa],['id'=>$polka['id']]);
					
					if(!$sql){						
						$asli->kalit = 0;
					}
					$pr = $asli->getdata('products',['id'=>$polka['product_id']]);

					$sql = $asli->update('products',['soni'=>$pr['soni']-$massa],['id'=>$pr['id']]);
					
					if(!$sql){						
						$asli->kalit = 0;
					}
				}
				else{
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