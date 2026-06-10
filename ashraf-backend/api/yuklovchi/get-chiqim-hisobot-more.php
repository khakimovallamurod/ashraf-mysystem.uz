<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','maydalash','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id']) || isset($_GET['bulim_id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$sana1 = $_GET['sana1'];
		$sana2 = $_GET['sana2'];
		$ret = [];
		$jami = 0;
		$m = [];
		$i = 0;
		$item_id = $asli->filter($_GET['item_id']);
		$items = $asli->getdatas('sale_order_items',[],"product_id='$item_id' AND sana>='$sana1' AND sana<'$sana2'");
		foreach ($items as $key => $item) {
			$jami += $item['tayyorlandi'];
			$pr = $asli->getdata('products',['id'=>$item['product_id']]);
			$order = $asli->getdata('sale_orders',['id'=>$item['sale_order_id']]);
			$client = $asli->getdata('clients',['id'=>$order['client_id']]);
			$dostavka = $asli->getdata('user',['id'=>$order['dostavka_id']]);
			$m[$i]['id'] = $item['id'];
			$m[$i]['name'] = $asli->defilter($pr['name']);
			$m[$i]['soni'] = $item['tayyorlandi'];
			$m[$i]['client'] = $asli->defilter($client['fio']);
			$m[$i]['dostavchik'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
			$m[$i]['sana'] = date("d.m.Y H:i:s", $order['sana']);
			$i++;
		}
		$ret['items_list'] = $m;
		$ret['jami'] = round($jami,2);
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>