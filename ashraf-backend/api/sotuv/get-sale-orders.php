<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','yuklovchi','admin','saqlash'];

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
		$ret['all_summa'] = $order['summa'];
		$ret['tolov'] = $order['tolov'];
		$ret['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
		$ret['agent'] = $agent['familya']." ".$agent['ism'];
		$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
		$ret['status'] = $order['status'];
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
			$temp[$j]['id'] = $item['id'];
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
		if($_GET['client_id']>0 && $_GET['client_id']!="null"){
			if(isset($_GET['sana1']) && isset($_GET['sana2'])){
				$sana1 = strtotime($_GET['sana1']);
				$sana2 = strtotime($_GET['sana2']);
				$client_id = $asli->filter($_GET['client_id']);
				$orders = $asli->getdatas('sale_orders',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			}
			else{
				$orders = $asli->getdatas('sale_orders',[],"client_id='$client_id' ORDER BY id DESC LIMIT 250");
			}			
		}
		else{
			if(isset($_GET['sana1']) && isset($_GET['sana2'])){
				$sana1 = strtotime($_GET['sana1']);
				$sana2 = strtotime($_GET['sana2']);
				$orders = $asli->getdatas('sale_orders',[],"sana>='$sana1' AND sana<'$sana2' ORDER BY id DESC");
			}
			else{
				$orders = $asli->getdatas('sale_orders',[],"1 ORDER BY id DESC LIMIT 100");
			}			
		}
		foreach ($orders as $key => $order) {
			$sotuvchi = $asli->getdata('user',['id'=>$order['sotuvchi_id']]);
			$agent = $asli->getdata('user',['id'=>$order['agent_id']]);
			$client = $asli->getdata('clients',['id'=>$order['client_id']]);
			$client['fio'] = $asli->defilter($client['fio']);
			$yuklovchi = $asli->getdata('user',['id'=>$order['yuklovchi_id']]);
			$dostavka = $asli->getdata('user',['id'=>$order['dostavka_id']]);

			$ret[$i]['id'] = $order['id'];
			$ret[$i]['client'] = $client;
			$ret[$i]['sana'] = $order['sana'];
			$ret[$i]['izoh'] = $order['izoh'];
			$ret[$i]['all_summa'] = $order['summa'];
			$ret[$i]['tolov'] = $order['tolov'];
			$ret[$i]['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
			$ret[$i]['agent'] = $agent['familya']." ".$agent['ism'];
			$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret[$i]['dostavchik'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
			$ret[$i]['dostavka_id'] = $order['dostavka_id'];
			$ret[$i]['dostavchik_telefon'] = $dostavka['telefon'];
			$ret[$i]['status'] = $order['status'];
			$ret[$i]['vaqt'] = date("d.m.Y H:i:s",strtotime($order['vaqt']));
			$ret[$i]['old_client_balans'] = $order['old_client_balans'];
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
				$temp[$j]['id'] = $item['id'];
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
			if($order['printed']=="true"){
				$ret[$i]['printed_status'] = true;	
			}
			else{
				$ret[$i]['printed_status'] = false;
			}
			$ret[$i]['after_balans'] = $order['old_client_balans'] + $order['summa'];//$client['balans'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>