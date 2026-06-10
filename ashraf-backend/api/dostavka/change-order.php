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
	
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->order_id) && isset($data->dostavka_id)){
		$order = $asli->getdata('sale_orders',['id'=>$data->order_id]);
		if($order['dostavka_id']==$user['id']){
			if($order['status']=="dostavka"){
				$zd = $asli->getdata('zayavka_dostavka',['order_id'=>$data->order_id]);
				if($zd['status']=='new'){
					$asli->resp += ['success'=> false, 'message' => "So'rov allaqachon berilgan. Iltimos ikkinchi tomonning tasdiqlashini kuting!"];
				}
				else{
					$sql = $asli->insert('zayavka_dostavka',[
						'order_id' => $data->order_id,
						'sender_id' => $user['id'],
						'qabul_id' => $data->dostavka_id
					]);
					if($sql){
						$asli->resp += ['success'=> true, 'message' => "So'rov muvaffaqqiyatli yuborildi!"];
					}
					else{
						$asli->resp += ['success'=> false, 'message' => "So'rov yuborilmadi!"];
					}
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Kechirasiz bu buyurtmani almashib bo'lmaydi. Bu dostavka holatida emas!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Bu buyurtma sizga tegishli emas!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>