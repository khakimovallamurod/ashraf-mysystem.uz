<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$order = $asli->getdata('sale_orders',['id'=>$_GET['id']]);
		$sotuvchi = $asli->getdata('user',['id'=>$order['sotuvchi_id']]);
		$agent = $asli->getdata('user',['id'=>$order['agent_id']]);
		$client = $asli->getdata('clients',['id'=>$order['client_id']]);

		$ret['id'] = $order['id'];
		$ret['client'] = $client['fio'].", ".$client['manzil'].", ".$client['telefon'];
		$ret['sana'] = $order['sana'];
		$ret['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
		$ret['agent'] = $agent['familya']." ".$agent['ism'];
		$ret['status'] = $order['status'];
		$ret['vaqt'] = $order['vaqt'];
		$ret['izoh'] = $order['izoh'];
		$temp = [];
		$j = 0;
		$items = $asli->getdatas('sale_order_items',['sale_order_id'=>$order['id']]);
		foreach ($items as $key2 => $item) {
			$product = $asli->getdata('products',['id'=>$item['product_id']]);
			$temp[$j]['item_id'] = $item['id'];
			$temp[$j]['product_id'] = $product['id'];
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
		if(isset($_GET['dostavka_id'])){
			if($_GET['dostavka_id']>0){
				$orders = $asli->getdatas('sale_orders',['status'=>'tayyorlanmoqda','dostavka_id'=>$_GET['dostavka_id']]);
			}
			else{
				$orders = $asli->getdatas('sale_orders',['status'=>'tayyorlanmoqda']);
			}			
		}
		else{
			$orders = $asli->getdatas('sale_orders',['status'=>'tayyorlanmoqda']);
		}		
		foreach ($orders as $key => $order) {
			$sotuvchi = $asli->getdata('user',['id'=>$order['sotuvchi_id']]);
			$agent = $asli->getdata('user',['id'=>$order['agent_id']]);
			$client = $asli->getdata('clients',['id'=>$order['client_id']]);
			$yuklovchi = $asli->getdata('user',['id'=>$order['yuklovchi_id']]);
			$dostavka = $asli->getdata('user',['id'=>$order['dostavka_id']]);

			$ret[$i]['id'] = $order['id'];
			$ret[$i]['client'] = $client['fio'].", ".$client['manzil'].", ".$client['telefon'];
			$ret[$i]['sana'] = $order['sana'];
			$ret[$i]['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
			$ret[$i]['agent'] = $agent['familya']." ".$agent['ism'];
			$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret[$i]['dostavchik'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
			$ret[$i]['dostavka_id'] = $dostavka['id'];
			$ret[$i]['dostavchik_telefon'] = $dostavka['telefon'];
			$ret[$i]['status'] = $order['status'];
			$ret[$i]['vaqt'] = $order['vaqt'];
			$ret[$i]['izoh'] = $order['izoh'];
			$temp = [];
			$j = 0;
			$items = $asli->getdatas('sale_order_items',['sale_order_id'=>$order['id']]);
			foreach ($items as $key2 => $item) {
				$product = $asli->getdata('products',['id'=>$item['product_id']]);
				$temp[$j]['item_id'] = $item['id'];
				$temp[$j]['product_id'] = $product['id'];
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