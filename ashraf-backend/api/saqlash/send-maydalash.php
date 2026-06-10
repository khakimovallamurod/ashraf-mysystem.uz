<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['saqlash','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$ret = [];
	if(isset($data->zayavka_id) && isset($data->massa) && isset($data->polka_id) && isset($data->krim_id)){
		$asli->begintranz();		
		$zayavka = $asli->getdata('zayavka_msq',['id'=>$data->zayavka_id]);		
		if($zayavka['id']>0 && $zayavka['status']=="tayyorlanmoqda"){
			$n = $asli->summaustun('zayavka_msq_items','massa',['zayavka_msq_id'=>$data->zayavka_id]);
			if($n==""){
				$n = 0;
			}
			if($n+$data->massa<=$zayavka['massa']+100){
				$asli->kalit = 1;
				$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
				$saqlash = $asli->getdata('saqlash_bulimi',['partiya_id'=>$data->krim_id,'polka_id'=>$data->polka_id]);
				if($saqlash['qoldi']>=$data->massa){
					$asli->begintranz();
					$asli->kalit = 1;
					$krim = $asli->getdata('krimproducts',['id'=>$data->krim_id]);

					
					$sql = $asli->insert('zayavka_msq_items',[
						'krim_id' => $data->krim_id,
						'massa' => $data->massa,
						'polka_id' => $data->polka_id,
						'zayavka_msq_id	' => $data->zayavka_id
					]);
					if(!$sql){						
						$asli->kalit = 0;
					}
					if($data->isend==1 || $zayavka['massa']<=($zayavka['rmassa']+$data->massa)){
						$sql = $asli->update('zayavka_msq',[						
							'rmassa' => $zayavka['rmassa'] + $data->massa,
							'summa' => $zayavka['summa'] + $krim['price'] * $data->massa,
							'status' => 'tayyorlandi',
							'saqlashendtime' => time()
						],['id'=>$zayavka['id']]);
					}
					else{
						$sql = $asli->update('zayavka_msq',[						
							'rmassa' => $zayavka['rmassa'] + $data->massa,
							'summa' => $zayavka['summa'] + $krim['price'] * $data->massa
						],['id'=>$zayavka['id']]);						
					}
					if(!$sql){
						$asli->kalit = 0;
					}

					if($data->isendpartiya==1 || $saqlash['massa']==($saqlash['qoldi']+$data->massa)){
						$status = "tugatildi";
					}
					else{
						$status = "joylandi";						
					}

					$sql = $asli->update('saqlash_bulimi',[
						'status' => $status,
						'qoldi' => $saqlash['qoldi'] - $data->massa,
						'olindi' => $saqlash['olindi'] + $data->massa,
						'endtime' => time()
					],['partiya_id'=>$data->krim_id,'polka_id'=>$data->polka_id]);

					if(!$sql){						
						$asli->kalit = 0;
					}

					if($asli->kalit==1){
						$asli->endtranz();
						$asli->resp += ['success'=> true, 'message' => "Tranzaktsiya muvaffaqqiyatli yakunlandi!"];
					}
					else{
						$asli->bekor();
						$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
					}
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "Kechirasiz bu polkada buncha miqdor mavjud emas!"];
				}				
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Bunday massa joyizmas!"];
			}
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Bunday buyurtma mavjud emas yoki allaqachon tayyorlangan"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>