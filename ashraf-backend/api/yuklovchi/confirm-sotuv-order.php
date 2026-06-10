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

	if(isset($_GET['id'])){
		$order = $asli->getdata('sale_orders',['id'=>$_GET['id']]);
		if($order['id']>0){
			if($order['status']=="new"){
				$items = $asli->getdatas('sale_order_items',['sale_order_id'=>$_GET['id']]);
				$asli->kalit = 1;
				foreach ($items as $key => $item) {
					$product_id = $item['product_id'];
					$product = $asli->getdata('products',['id'=>$product_id]);
					$m = $asli->summaustun('putpolka','massa',['product_id'=>$product_id]);
					if(!($m>=$item['soni'])){
						$asli->kalit = 0;
					}
				}
				if($asli->kalit==1){
					$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
					$asli->begintranz();
					$sql = $asli->update('sale_orders',[
						'status' => 'tayyorlanmoqda',
						'yuklovchi_id' => $user['id']
					],['id'=>$_GET['id']]);

					$sql2 = $asli->update('sale_order_items',[
						'status' => 'tayyorlanmoqda',
						'yuklovchi_id' => $user['id']
					],['sale_order_id'=>$_GET['id']]);

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
					$asli->resp += ['success'=> false, 'message' => "Polkalarda buncha mahsulot yo'q. Bu buyurtmani tayyor qila olmaysiz!"];
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