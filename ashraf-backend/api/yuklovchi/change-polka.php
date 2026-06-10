<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['yuklovchi','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->polka_id) and isset($data->partiya_id) and isset($data->massa) and isset($data->polka2_id)){
		$asli->begintranz();
		$asli->kalit = 1;
		$pp = $asli->getdata('putpolka',['id'=>$data->partiya_id]);
		if($pp['massa']>=$data->massa){
			$sql = $asli->update('putpolka',['massa'=>$pp['massa']-$data->massa],['id'=>$pp['id']]);
			if(!$sql){				
				$asli->kalit = 0;
			}
			if($pp['zayavka_msq_id']>0){
				$p2p = $asli->getdata('putpolka',['product_id'=>$pp['product_id'],'polka_id'=>$data->polka2_id,'zayavka_msq_id'=>$pp['zayavka_msq_id']]);				
			}
			else{
				if($pp['qaytam_partiya_id']==0){
					$p2p = $asli->getdata('putpolka',['product_id'=>$pp['product_id'],'polka_id'=>$data->polka2_id,'vozvrat_id'=>$pp['vozvrat_id']]);
				}
				else{
					$p2p = $asli->getdata('putpolka',['product_id'=>$pp['product_id'],'polka_id'=>$data->polka2_id,'qaytam_partiya_id'=>$pp['qaytam_partiya_id']]);
				}
			}
			
			if($p2p['id']>0){
				$sql = $asli->update('putpolka',['massa'=>$p2p['massa']+$data->massa],['id'=>$p2p['id']]);
			}
			else{
				$sql = $asli->insert('putpolka',[
					'polka_id' => $data->polka2_id,
					'product_id' => $pp['product_id'],
					'massa' => $data->massa,
					'zayavka_msq_id' => $pp['zayavka_msq_id'],
					'qaytam_partiya_id' => $pp['qaytam_partiya_id'],
					'vozvrat_id' => $pp['vozvrat_id'],
					'tannarx' => $pp['tannarx']
				]);
			}
			if(!$sql){
				$asli->kalit = 0;
			}
			if($asli->kalit == 1){
				$asli->endtranz();
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli bajarildi!"];
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Bajarilmadi"];
			}
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Bu polkada buncha miqdorni olib bo'lmaydi. Massa yetarli emas!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>