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

	if(isset($data->maydalash_id) && isset($data->polka_id)){
		$maydalash = $asli->getdata('maydalash',['id'=>$data->maydalash_id]);
		if($maydalash['status']=="joylanmoqda"){
			$product = $asli->getdata('products',['id'=>$maydalash['product_id']]);
			if($product['id']>0){
				$asli->begintranz();
				$sql = $asli->update('products',[
					'soni' => $product['soni'] + $maydalash['massa']
				],['id'=>$product['id']]);
				if($sql){
					$sql = $asli->update('maydalash',['status'=>'joylandi'],['id'=>$maydalash['id']]);
					if($sql){
						$asli->endtranz();
						$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
						// $pp = $asli->getdata('putpolka',['polka_id'=>$data->polka_id,'product_id'=>$maydalash['product_id'],'zayavka_msq_id'=>$maydalash['zayavka_msq_id']]);
						// if($pp['id']>0){
						// 	$sql = $asli->update('putpolka',[
						// 		'massa' => $pp['massa'] + $maydalash['massa']
						// 	],['id'=>$pp['id']]);
						// }
						// else{
						// 	$sql = $asli->insert('putpolka',[
						// 		'polka_id' => $data->polka_id,
						// 		'product_id' => $maydalash['product_id'],
						// 		'massa' => $maydalash['massa'],
						// 		'qoldi' => $maydalash['massa'],
						// 		'tannarx' => $maydalash['tannarx'],
						// 		'zayavka_msq_id' => $maydalash['zayavka_msq_id']
						// 	]);
						// }
						// if($sql){
						// 	$asli->endtranz();
						// 	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
						// }
						// else{
						// 	$asli->bekor();
						// 	$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
						// }
					}
					else{
						$asli->bekor();
						$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
					}
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
				}				
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Mahsulot topilmadi"];
			}			
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Allaqachon joylashgan yoki mavjud emas!"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>