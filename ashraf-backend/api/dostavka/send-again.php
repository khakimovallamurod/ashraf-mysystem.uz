<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$order = $asli->getdata('sale_orders',['id'=>$_GET['id']]);
		if($order['status']=="dostavka"){
			$asli->begintranz();
			$sql = $asli->update('sale_orders',['status'=>"topshirildi",'endtime'=>time()],['id'=>$_GET['id']]);
			if($sql){
				$dkrim = $asli->getdata('dostavka_krim',['dostavka_id'=>$order['dostavka_id']]);
				if($dkrim['id']>0){
					$sql = $asli->update('dostavka_krim',[
						'naqdsum' => $dkrim['naqdsum'] + $order['naqd'],
						'naqdusd' => $dkrim['naqdusd'] + $order['naqdusd'],
						'bank' => $dkrim['bank'] + $order['plastik'],
						'karta' => $dkrim['karta'] + $order['karta']					
					],['dostavka_id' => $order['dostavka_id']]);
				}
				else{
					$sql = $asli->insert('dostavka_krim',[
						'dostavka_id' => $order['dostavka_id'],
						'naqdsum' => $order['naqd'],
						'naqdusd' => $order['naqdusd'],
						'bank' => $order['plastik'],
						'karta' => $order['karta']
					]);
				}
				if($sql){
					$asli->endtranz();
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli tasdiqlandi!"];
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> true, 'message' => "Tranzaktsiya yakunlanmadi!"];
				}
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Tasdiqlash kodi xato! Yoki bu buyurtma allaqachon tugatilgan!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>