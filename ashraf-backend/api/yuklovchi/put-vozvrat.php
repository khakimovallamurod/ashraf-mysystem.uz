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

	if(isset($data->vozvrat_id) && isset($data->polka_id)){
		$vozvrat = $asli->getdata('vozvrat',['id'=>$data->vozvrat_id]);
		if($vozvrat['status']=="confirmed"){
			$product = $asli->getdata('products',['id'=>$vozvrat['product_id']]);
			if($product['id']>0){
				$asli->begintranz();
				$sql = $asli->update('products',[
					'soni' => $product['soni'] + $vozvrat['massa']
				],['id'=>$product['id']]);
				if($sql){
					$sql = $asli->update('vozvrat',['status'=>'joylandi'],['id'=>$vozvrat['id']]);
					if($sql){
						$sql = $asli->insert('putpolka',[
							'polka_id' => $data->polka_id,
							'product_id' => $vozvrat['product_id'],
							'massa' => $vozvrat['massa'],
							'qoldi' => $vozvrat['massa'],
							'tannarx' => $vozvrat['summa']/$vozvrat['massa'],
							'vozvrat_id' => $vozvrat['id']
						]);
						if($sql){
							$asli->endtranz();
							$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
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