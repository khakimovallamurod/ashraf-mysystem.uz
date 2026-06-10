<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);


	if(true){ //isset($_GET['sana1']) && isset($_GET['sana2'])
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$sana1 = date("Y-m-d 00:00:00");
		$sana1 = strtotime($sana1);
		$sana2 = $sana1 + 86400;
		$orders = $asli->getdatas('sale_orders',['dostavka_id'=>$user['id']],"muddat>='$sana1' AND muddat<'$sana2'");
		$list = [];
		$i = 0;
		foreach ($orders as $key => $order) {
			$client = $asli->getdata('clients',['id'=>$order['client_id']]);
			if($client['dostavka_id']!=$user['id'] || $client['balans']<=0){
				continue;
			}
			$list[$i]['id'] = $order['id'];
			$list[$i]['client'] = $asli->defilter($client['fio']);
			$list[$i]['client_telefon'] = $client['telefon'];
			$list[$i]['client_id'] = $order['client_id'];
			$list[$i]['berishi_kerak_summa'] = $order['summa'];
			$list[$i]['qarz'] = $client['balans'];
			$i++;
		}
		$asli->resp['data'] = $list;
	}
	else{
		$asli->response('403');
	}
	$asli->print_json();
?>