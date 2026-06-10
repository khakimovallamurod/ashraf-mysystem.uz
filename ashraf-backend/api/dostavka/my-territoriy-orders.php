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


	if(isset($_GET['sana1']) && isset($_GET['sana2'])){
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$orders = [];
		$i=0;
		$clients = $asli->getdatas('clients',['dostavka_id'=>$user['id']]);
		foreach ($clients as $key => $client) {
			$client_id = $client['id'];
			$sales = $asli->getdatas('sale_orders',['client_id'=>$client_id],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			foreach ($sales as $key => $sale) {
				if($sale['dostavka_id']==$user['id']){
					continue;
				}
				$dostavka = $asli->getdata('user',['id'=>$sale['dostavka_id']]);
				$orders[$i]['mijoz'] = $asli->defilter($client['fio']);
				$orders[$i]['summa'] = $sale['summa'];
				$orders[$i]['dostavchik'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
				$orders[$i]['status'] = $sale['status'];
				$orders[$i]['dostavka_id'] = $sale['dostavka_id'];
				$orders[$i]['sana'] = date("d.m.Y H:i:s",$sale['sana']);
				$i++;
			}
		}
		$ret['xodim'] = $asli->defilter($user['familya'])." ".$asli->defilter($user['ism']);
		$ret['dostavka_id'] = $user['id'];
		$ret['orders'] = $orders;
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->response('403');
	}
	$asli->print_json();
?>