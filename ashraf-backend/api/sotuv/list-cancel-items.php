<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$user_id = $user['id'];

	if(isset($_GET['id'])){		
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$products = $asli->getdata('products',['id'=>$_GET['id']]);
			$asli->resp['data'] = $products;			
		}
	}
	else{		
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$items = $asli->getdatas('spam_orders',[],"user_id<>'$user_id' AND status='nochecked'");
		$ret = [];
		$i = 0;
		foreach ($items as $key => $item) {			
			$product = $asli->getdata('products',['id'=>$item['product_id']]);
			$order = $asli->getdata('sale_orders',['id'=>$item['sale_order_id']]);
			$client = $asli->getdata('clients',['id'=>$order['client_id']]);
			
			$ret[$i]['id'] = $item['id'];
			$ret[$i]['article'] = $asli->defilter($product['name']);
			$ret[$i]['massa'] = $item['massa'];
			$ret[$i]['izoh'] = $item['izoh'];
			$ret[$i]['client'] = $asli->defilter($client['fio']);
			$ret[$i]['client_telefon'] = $client['telefon'];
			$ret[$i]['vaqt'] = $item['vaqt'];
			$ret[$i]['sana'] = $item['sana'];
			$i++;
		}
		$asli->resp['data'] = $ret;		
	}
	$asli->print_json();
?>