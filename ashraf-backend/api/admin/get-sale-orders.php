<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$order = $asli->getdata('sale_orders',['id'=>$_GET['id']]);

		$sotuvchi = $asli->getdata('user',['id'=>$order['sotuvchi_id']]);
		$agent = $asli->getdata('user',['id'=>$order['agent_id']]);
		$client = $asli->getdata('clients',['id'=>$order['client_id']]);
		$yuklovchi = $asli->getdata('user',['id'=>$order['yuklovchi_id']]);
		
		$ret['id'] = $order['id'];
		$ret['client'] = $client;
		$ret['sana'] = $order['sana'];
		$ret['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
		$ret['agent'] = $agent['familya']." ".$agent['ism'];
		$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
		$ret['status'] = $order['status'];
		$ret['summa'] = $order['summa'];
		$ret['naqd'] = $order['naqd'];
		$ret['naqdusd'] = $order['naqdusd'];
		$ret['plastik'] = $order['plastik'];
		$ret['karta'] = $order['karta'];
		$ret['valyuta'] = $order['valyuta'];
		$ret['vaqt'] = $order['vaqt'];
		if($order['status']=="tayyorlandi" || $order['status']=="topshirildi" || $order['status']=="dostavka"){
			$ret['print'] = true;
		}
		else{
			$ret['print'] = false;
		}
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
			$temp[$j]['foyda'] = $item['foyda'];
			$temp[$j]['tannarx'] = $item['tannarx'];
			$j++;
		}
		$ret[$i]['product_list'] = $temp;
		
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if(isset($_GET['sana1']) && isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$orders = $asli->getdatas('sale_orders',[],"sana>='$sana1' AND sana<'$sana2' ORDER BY id DESC");
		}
		else{
			$orders = $asli->getdatas('sale_orders',[],"1 ORDER BY id DESC");
		}
		$i = 0;		
		foreach ($orders as $key => $order) {
			$sotuvchi = $asli->getdata('user',['id'=>$order['sotuvchi_id']]);
			$agent = $asli->getdata('user',['id'=>$order['agent_id']]);
			$client = $asli->getdata('clients',['id'=>$order['client_id']]);
			$yuklovchi = $asli->getdata('user',['id'=>$order['yuklovchi_id']]);

			$ret[$i]['id'] = $order['id'];
			$ret[$i]['client'] = $client;
			$ret[$i]['sana'] = $order['sana'];
			$ret[$i]['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
			$ret[$i]['agent'] = $agent['familya']." ".$agent['ism'];
			$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret[$i]['status'] = $order['status'];
			$ret['summa'] = $order['summa'];
			$ret['naqd'] = $order['naqd'];
			$ret['naqdusd'] = $order['naqdusd'];
			$ret['plastik'] = $order['plastik'];
			$ret['karta'] = $order['karta'];
			$ret['valyuta'] = $order['valyuta'];
			$ret[$i]['vaqt'] = $order['vaqt'];
			if($order['status']=="tayyorlandi" || $order['status']=="end"){
				$ret[$i]['print'] = true;
			}
			else{
				$ret[$i]['print'] = false;
			}
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
				$temp[$j]['foyda'] = $item['foyda'];
				$temp[$j]['tannarx'] = $item['tannarx'];
				$j++;
			}
			$ret[$i]['product_list'] = $temp;
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>