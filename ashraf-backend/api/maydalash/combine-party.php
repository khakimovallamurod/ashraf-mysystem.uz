<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();


	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['maydalash','admin','saqlash']; //,'saqlash','yuklovchi'

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$sana = time();
	if($data->massa>=0){
		$massa = $data->massa;
		$asli->begintranz();
		$sql = $asli->insert('combine_history',[
			'chiquvchi_id' => $data->chiquvchi_id,
			'kiruvchi_id' => $data->kiruvchi_id,
			'massa' => $data->massa,
			'product_id' => $data->product_id,
			'user_id' => $user['id'],
			'sana' => time()
		]);
		if($sql){
			$chiquvchi = $data->chiquvchi_id;
			$kiruvchi = $data->kiruvchi_id;
			$product_id = $data->product_id;
			$ch = $asli->getdata('putpolka',['id'=>$chiquvchi,'product_id'=>$product_id]);
			print_r($ch);
			$k = $asli->getdata('putpolka',['id'=>$kiruvchi,'product_id'=>$product_id]);		
			if($ch['id']>0 && $k['id']>0 && $ch['massa']>=$massa){
				exit;
				$asli->kalit = 1;
				$sql = $asli->update('putpolka',['massa'=>$ch['massa']-$massa],['id'=>$ch['id']]);
				$sql2 = $asli->update('putpolka',['massa'=>$k['massa']+$massa],['id'=>$k['id']]);
				if($sql && $sql2){
					$asli->endtranz();
					$asli->resp += ['success'=> true, 'message' => "OK"];
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
				}
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Bunday partiyalar mavjud emas! Yoki chiquvchi partiyada buncha miqdor mavjud emas!"];
			}
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Saqlanmadi!"];
		}		
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Miqdor noto'g'ri kiritilgan"];
	}	
	$asli->print_json();
?>