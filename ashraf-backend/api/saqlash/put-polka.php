<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['saqlash','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();
	$ret = [];
	$data = file_get_contents("php://input");
	$data = json_decode($data);
	if(isset($data->krim_id) && isset($data->massa) && isset($data->polka_id)){
		$asli->begintranz();		
		$krim = $asli->getdata('krimproducts',['id'=>$data->krim_id]);		
		if($krim['id']>0 && $krim['status']=="joylanmoqda"){
			$n = $asli->summaustun('saqlash_bulimi','massa',['partiya_id'=>$data->krim_id]);
			if($n==""){
				$n = 0;
			}
			if($n+$data->massa<=$krim['massa']){
				$asli->kalit = 1;
				$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
				$saqlash = $asli->getdata('saqlash_bulimi',['partiya_id'=>$data->krim_id,'polka_id'=>$data->polka_id]);
				if($saqlash['id']>0){
					$sql = $asli->update('saqlash_bulimi',[						
						'massa' => $saqlash['massa'] + $data->massa,
						'qoldi' => $saqlash['qoldi'] + $data->massa
					],['id'=>$saqlash['id']]);
				}
				else{
					$sql = $asli->insert('saqlash_bulimi',[
						'partiya_id' => $data->krim_id,
						'massa' => $data->massa,
						'qoldi' => $data->massa,
						'polka_id' => $data->polka_id,
						'user_id' => $user['id']
					]);	
				}				
				if(!$sql){
					$asli->kalit = 0;
				}
				$sql = $asli->update('krimproducts',['joylangani'=>$krim['joylangani']+$data->massa],['id'=>$krim['id']]);
				if(!$sql){
					$asli->kalit = 0;
				}
				if($n+$data->massa==$krim['massa']){
					$sql = $asli->update('krimproducts',['status'=>'joylandi'],['id'=>$data->krim_id]);
					if(!$sql){
						$asli->kalit = 0;
					}
				}
				if($asli->kalit==1){
					$asli->endtranz();
					$asli->resp += ['success'=> true, 'message' => "Tranzaktsiya muvaffaqqiyatli yakunlandi!"];
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!".$n+$data->massa." kg"];
				}
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Bunday massa joyizmas!"];
			}
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Bunday krim mavjud emas yoki allaqachon joylashtirilgan"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>