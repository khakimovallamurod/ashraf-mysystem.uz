<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();


	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['yuklovchi','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$sana = time();
	
	$asli->begintranz();
	$asli->kalit = 1;

	$item = $asli->getdata('sale_order_items',['id'=>$data->sale_order_item_id]);

	$order = $asli->getdata('sale_orders',['id'=>$data->sale_order_id]);

	if($order['status']=="new" || $order['status']=="tayyorlanmoqda"){
		// || $order['status']=="tayyorlandi"
		$asli->kalit = 1;
	}
	else{
		$asli->kalit = 0;
	}

	$sql = $asli->insert('spam_orders',[
		'sana' => $sana,
		'izoh' => $data->izoh,
		'sale_order_id' => $data->sale_order_id,
		'sale_order_item_id' => $data->sale_order_item_id,
		'user_id' => $user['id'],
		'massa' => $item['tayyorlandi'],
		'product_id' => $item['product_id']
	]);
	$product_id = $item['product_id'];
	$p = $asli->getdata('products',['id'=>$product_id]);
	$sql = $asli->update('products',[
		'soni' => $p['soni'] + $item['tayyorlandi']
	],['id'=>$item['product_id']]);
	if(!$sql){
		$asli->kalit = 0;
	}
	$pp = $asli->getdata('putpolka',[],"product_id='$product_id' ORDER BY id DESC");
	if($pp['id']>0){
		$sql = $asli->update('putpolka',[
			'massa' => ($pp['massa'] + $item['tayyorlandi'])
		],['id'=>$pp['id']]);
		if(!$sql){
			$asli->kalit = 0;
		}
	}
	else{
		// $asli->kalit = 0;
	}
	
	if($sql){
		$sql = $asli->delete('sale_order_items',['id'=>$data->sale_order_item_id]);
		if(!$sql){
			$asli->kalit = 0;
		}
		$n = $asli->countustun('sale_order_items','id',['sale_order_id'=>$data->sale_order_id]);
		if($n==0){
			$sql = $asli->update('sale_orders',['summa'=>0,'status'=>'tugatildi'],['id'=>$data->sale_order_id]);
			if(!$sql){
				$asli->kalit = 0;
			}
		}
		if($asli->kalit == 1){
			$asli->endtranz();
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirild"];	
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
		}
	}
	else{
		$asli->bekor();
		$asli->resp += ['success'=> false, 'message' => "Saqlanmadi!"];
	}
	$asli->print_json();
?>