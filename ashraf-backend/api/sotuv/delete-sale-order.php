<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['DELETE'];
	$asli->allow_rolls = ['admin','sotuv','agent','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($_GET['id'])){
		$asli->begintranz();
		$asli->kalit = 1;

		$order = $asli->getdata('sale_orders',['id'=>$_GET['id']]);
		$client = $asli->getdata('clients',['id'=>$order['client_id']]);

		if($client['id']>0 && time()-$order['sana']<=10*86400){
			$sana = time();
			$client_id = $client['id'];

			$tolov = $order['summa'];

			
			$items = $asli->getdatas('sale_order_items',['sale_order_id'=>$order['id']]);
			$sql = $asli->delete('sale_order_items',['sale_order_id'=>$order['id']]);
			if(!$sql){
				$asli->kalit = 0;
			}
			$sql = $asli->delete('sale_orders',['id'=>$order['id']]);
			if(!$sql){
				$asli->kalit = 0;
			}
			$sql = $asli->update('clients',['balans'=>$client['balans']-$tolov],['id'=>$client['id']]);			
			$summa = $order['summa'];
			if(!$sql){
				$asli->kalit = 0;
			}
			else{
				//$t = $asli->sendsms($client['telefon'],"Hisobingizga $summa so'mlik buyurtma bekor qilindi");
				$q = $client['balans'] - $summa;
				//$t = $asli->sendsms($client['telefon'],"Qoldiq qarz : $q so'm");
			}
			foreach ($items as $key => $item) {
				if($item['partiya_id']==0){
					$xol = $asli->getdata('xolodelnik',[
						'product_id' => $item['product_id']
					]);
					$sql = $asli->update('xolodelnik',[
						'massa' => $xol['massa'] + $item['soni']
					],['id'=>$xol['id']]);
					if(!$sql){
						$asli->kalit = 0;
					}
				}				
			}

			if($asli->kalit==1){
				$asli->endtranz();
				$asli->resp += ['success'=> true, 'message' => "Muvaffaqqiyatli o'chirildi!"];
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Buyurtma yozilmadi!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Kechirasiz vaqti tugagan!"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>