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

	if(isset($data->order_id)){
		$asli->begintranz();
		$asli->kalit = 1;
		$order = $asli->getdata('sale_orders',['id'=>$data->order_id]);		
		$summa = $asli->summaustun('sale_order_items','summa',['sale_order_id'=>$data->order_id]);
		$summa = round($summa,2);
		$client = $asli->getdata('clients',['id'=>$order['client_id']]);

		$sql = $asli->update('clients',['balans'=>$client['balans']+$summa],['id'=>$client['id']]);
		if(!$sql){
			$asli->kalit = 0;
		}

		$sql = $asli->update('sale_orders',['status'=>'tayyorlandi','endtime'=>time(),'summa'=>$summa],['id'=>$data->order_id]);
		if(!$sql){
			$asli->kalit = 0;
		}

		if($asli->kalit == 1){
			$asli->endtranz();
			$sql = $asli->update('sale_order_items',['status'=>'tayyorlandi'],['sale_order_id'=>$data->order_id]);
			$order = $asli->getdata('sale_orders',['id'=>$data->order_id]);
			$sotuvchi = $asli->getdata('user',['id'=>$order['sotuvchi_id']]);
			$agent = $asli->getdata('user',['id'=>$order['agent_id']]);
			$client = $asli->getdata('clients',['id'=>$order['client_id']]);
			$yuklovchi = $asli->getdata('user',['id'=>$order['yuklovchi_id']]);
			$dostavka = $asli->getdata('user',['id'=>$order['dostavka_id']]);

			$ret['id'] = $order['id'];
			$ret['client'] = $client;
			$ret['sana'] = $order['sana'];
			$ret['izoh'] = $order['izoh'];
			$ret['all_summa'] = $order['summa'];
			$ret['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
			$ret['agent'] = $agent['familya']." ".$agent['ism'];
			$ret['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret['dostavchik'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
			$ret['dostavchik_telefon'] = $dostavka['telefon'];
			$ret['status'] = $order['status'];
			$ret['vaqt'] = date("d.m.Y",strtotime($order['vaqt']));
			$ret['old_client_balans'] = $order['old_client_balans'];
			if($order['status']=="tayyorlandi" || $order['status']=="end"){
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
			$ret['product_list'] = $temp;
			if($order['printed']=="true"){
				$ret['printed_status'] = true;	
			}
			else{
				$ret['printed_status'] = false;
			}
			$ret['after_balans'] = $order['old_client_balans'] + $order['summa'];//$client['balans'];
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$asli->resp['data'] = $ret;
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Tugatilmadi!"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>