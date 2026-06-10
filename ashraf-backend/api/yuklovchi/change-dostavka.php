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

	if(isset($_GET['order_id'])){
		$order = $asli->getdata('sale_orders',['id'=>$_GET['order_id']]);
		if($order['id']>0){
			if($order['status']=="new" || $order['status']=="tayyorlanmoqda" || $order['status']=="tayyorlandi"){
				
				$asli->begintranz();

				$sql = $asli->update('sale_orders',[					
					'dostavka_id' => $data->dostavka_id
				],['id'=>$_GET['order_id']]);

				$sql2 = $asli->update('sale_order_items',[
					'dostavka_id' => $data->dostavka_id
				],['sale_order_id'=>$_GET['order_id']]);

				if($sql && $sql2){
					$asli->endtranz();
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qabul qilindi"];
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Bu so'rov qabul qilingan!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Bunday buyurtma mavjud emas!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>