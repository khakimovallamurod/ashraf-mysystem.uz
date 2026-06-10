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
	$sana = time();
	
	$asli->begintranz();
	$asli->kalit = 1;
	
	$sql = $asli->insert('paterya_history',[
		'sana' => $sana,
		'izoh' => $data->izoh,
		'user_id' => $user['id'],
		'massa' => $data->massa,
		'putpolka_id' => $data->id,
		'product_id' => $data->product_id,
		'bulim' => $user['rol']
	]);

	$pp = $asli->getdata('putpolka',['id'=>$data->id]);
	if($pp['id']>0){				
		$sql = $asli->update('putpolka',['massa'=>$pp['massa']-$data->massa],['id'=>$pp['id']]);
		if($sql){
			$p = $asli->getdata('products',['id'=>$data->product_id]);
			if($p['id']>0){
				$sql = $asli->update('products',['soni'=>($p['soni']-$data->massa)],['id'=>$p['id']]);
				if($sql){
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
				$asli->resp += ['success'=> false, 'message' => "Mahsulot topilmadi!"];
			}				
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