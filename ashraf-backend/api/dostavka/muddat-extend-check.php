<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);


	if(isset($_GET['code']) && isset($_GET['id'])){	 
		$order = $asli->getdata('sale_orders',['id'=>$_GET['id']]);
		if($order['id']>0){
			if($order['muddat_code']==$_GET['code']){
				$sql = $asli->update('sale_orders',['muddat' => $order['muddat_temp']],['id'=>$_GET['id']]);
				if($sql){					
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "O'zgarmadi"];
				}
				$asli->resp['data'] = [];		
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "SMS kod to'g'ri kiritilmadi!"];
			}
		}
	 	else{
	 		$asli->resp += ['success'=> false, 'message' => "Bunday buyurtma mavjud emas!"];
	 	}
	}
	else{
		$asli->response('403');
	}
	$asli->print_json();
?>