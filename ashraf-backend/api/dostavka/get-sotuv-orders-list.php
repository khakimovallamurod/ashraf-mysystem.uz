<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$order = $asli->getdata('sale_orders',['id'=>$_GET['id']]);
		$sotuvchi = $asli->getdata('user',['id'=>$order['sotuvchi_id']]);
		$agent = $asli->getdata('user',['id'=>$order['agent_id']]);
		$client = $asli->getdata('clients',['id'=>$order['client_id']]);

		$ret['id'] = $order['id'];
		$ret['client'] = $client;
		$ret['sana'] = $order['sana'];
		$ret['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
		$ret['agent'] = $agent['familya']." ".$agent['ism'];
		$ret['status'] = $order['status'];
		$ret['vaqt'] = $order['vaqt'];
		
		$temp = [];
		$j = 0;
		$items = $asli->getdatas('sale_order_items',['sale_order_id'=>$order['id']]);
		foreach ($items as $key2 => $item) {
			$product = $asli->getdata('products',['id'=>$item['product_id']]);
			$temp[$j]['product_name'] = $product['name'];
			$temp[$j]['article'] = $product['article'];
			$temp[$j]['massa'] = $item['soni'];
			$temp[$j]['price'] = $item['price'];
			$temp[$j]['summa'] = $item['summa'];
			$temp[$j]['status'] = $item['status'];
			$temp[$j]['tayyorlandi'] = $item['tayyorlandi'];
			$j++;
		}
		$ret[$i]['product_list'] = $temp;
		
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
		$orders = $asli->getdatas('sale_orders',['dostavka_id'=>$user['id'],'status'=>'tayyorlandi',]);
		foreach ($orders as $key => $order) {
			$sotuvchi = $asli->getdata('user',['id'=>$order['sotuvchi_id']]);
			$agent = $asli->getdata('user',['id'=>$order['agent_id']]);
			$yuklovchi = $asli->getdata('user',['id'=>$order['yuklovchi_id']]);
			$client = $asli->getdata('clients',['id'=>$order['client_id']]);

			$ret[$i]['id'] = $order['id'];
			$ret[$i]['client'] = $client;
			$ret[$i]['sana'] = $order['sana'];
			$ret[$i]['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
			$ret[$i]['agent'] = $agent['familya']." ".$agent['ism'];
			$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret[$i]['status'] = $order['status'];
			$ret[$i]['vaqt'] = $order['vaqt'];
			
			$temp = [];
			$j = 0;
			$items = $asli->getdatas('sale_order_items',['sale_order_id'=>$order['id']]);
			foreach ($items as $key2 => $item) {
				$product = $asli->getdata('products',['id'=>$item['product_id']]);
				$temp[$j]['product_name'] = $product['name'];
				$temp[$j]['article'] = $product['article'];
				$temp[$j]['massa'] = $item['soni'];
				$temp[$j]['price'] = $item['price'];
				$temp[$j]['summa'] = $item['summa'];
				$temp[$j]['status'] = $item['status'];
				$temp[$j]['tayyorlandi'] = $item['tayyorlandi'];
				$j++;
			}
			$ret[$i]['product_list'] = $temp;
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>