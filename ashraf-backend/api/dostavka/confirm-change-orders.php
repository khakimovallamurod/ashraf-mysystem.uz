<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();
	
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		if($data->getOrder){
			$order = $asli->getdata('zayavka_dostavka',['id'=>$_GET['id']]);
			if($order['status']=="new" && $user['id']==$order['qabul_id']){
				$asli->begintranz();
				$asli->kalit = 1;
				$sql = $asli->update('sale_orders',['dostavka_id'=>$user['id']],['id'=>$order['order_id']]);
				if(!$sql){
					$asli->kalit = 0;
				}
				$sql = $asli->update('zayavka_dostavka',['status'=>'confirmed','confirmtime'=>time()],['id'=>$_GET['id']]);
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
				$asli->resp += ['success'=> false, 'message' => "Bu buyurtma sizga tegishli emas!"];
			}
		}
		else{
			$order = $asli->getdata('zayavka_dostavka',['id'=>$_GET['id']]);
			if($order['status']=="new" && $user['id']==$order['qabul_id']){
				$asli->begintranz();
				$asli->kalit = 1;
				$sql = $asli->update('zayavka_dostavka',['status'=>'bekor_qilingan','confirmtime'=>time()],['id'=>$_GET['id']]);
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
				$asli->resp += ['success'=> false, 'message' => "Bu buyurtma sizga tegishli emas!"];
			}
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>