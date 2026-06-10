<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$sales = $asli->getdatas('sale_orders',[],"sana>0 AND status<>'new' AND status<>'tayyorlanmoqda'");
		$asli->begintranz();
		$asli->kalit = 1;
		$i = 0;
		foreach ($sales as $key => $order){
			$i++;
			$summa = 0;
			$items = $asli->getdatas('sale_order_items',['sale_order_id'=>$order['id']]);
			foreach ($items as $key2 => $item) {
				$summa += $item['summa'];				
			}
			$sql = $asli->update('sale_orders',['summa'=>$summa],['id'=>$order['id']]);
			if(!$sql){
				$asli->kalit = 0;
			}
		}
		if($asli->kalit==1){
			$asli->endtranz();
			$asli->resp['data'] = "$i ta o'zgartirildi";
		}
		else{
			$asli->bekor();
			$asli->resp['data'] = "Tranzaktsiya yakunlanmadi";
		}
		
	}
	$asli->print_json();
?>