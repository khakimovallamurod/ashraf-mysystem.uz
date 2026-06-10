<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if($_GET['status']=="berilgan"){
			$pay = $asli->getdata('sale_orders',['id'=>$_GET['id']]);
			$ret['id'] = $pay['id'];
			$ret['summa'] = $pay['summa'];
			$dostavka = $asli->getdata('user',['id'=>$pay['dostavka_id']]);
			$ret['dostavka'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
			$client = $asli->getdata('clients',['id'=>$pay['client_id']]);
			$ret['client'] = $asli->defilter($client['fio']);
			$ret['client_telefon'] = $client['telefon'];
			$temp = [];
			$j = 0;
			$items = $asli->getdatas('sale_order_items',['sale_order_id'=>$_GET['id']]);
			foreach ($items as $key => $item) {
				$pr = $asli->getdata('products',['id'=>$item['product_id']]);
				$temp[$j]['item_name'] = $asli->defilter($pr['name']);
				$temp[$j]['soni'] = $item['tayyorlandi'];
				$temp[$j]['price'] = $item['price'];
				$temp[$j]['summa'] = $item['summa'];
				$j++;
			}
			$ret['items'] = $temp;
			$ret['vaqt'] = date("d.m.Y",strtotime($pay['vaqt']));
			$dostavka = $asli->getdata('user',['id'=>$pay['dostavka_id']]);
			$ret['dostavka'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
		}
		if($_GET['status']=="vozvrat"){
			$pay = $asli->getdata('vozvrat',['id'=>$_GET['id']]);			
			$ret['id'] = $pay['id'];
			$ret['massa'] = $pay['massa'];
			$ret['price'] = $pay['price'];
			$ret['summa'] = $pay['summa'];
			$ret['holat'] = $pay['holat'];

			$client = $asli->getdata('clients',['id'=>$pay['client_id']]);
			$ret['client'] = $asli->defilter($client['fio']);
			$ret['client_telefon'] = $client['telefon'];

			$product = $asli->getdata('products',['id'=>$pay['product_id']]);
			$ret['product_name'] = $asli->defilter($product['name']);

			$dostavka = $asli->getdata('user',['id'=>$pay['dostavka_id']]);
			$ret['dostavka'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);

			$ret['vaqt'] = date("d.m.Y",strtotime($pay['vaqt']));
		}
		if($_GET['status']=="olingan"){
			$pay = $asli->getdata('debithistory',['id'=>$_GET['id']]);
			$ret['id'] = $pay['id'];
			$ret['naqdsum'] = $pay['naqdsum'];
			$ret['naqdusd'] = $pay['naqdusd'];
			$ret['valyuta'] = $pay['valyuta'];
			$ret['bank'] = $pay['bank'];
			$ret['karta'] = $pay['karta'];
			$ret['summa'] = $pay['naqdsum']+$pay['karta']+$pay['bank']+$pay['valyuta']*$pay['naqdusd'];
			$client = $asli->getdata('clients',['id'=>$pay['client_id']]);
			$ret['client'] = $asli->defilter($client['fio']);
			$ret['client_telefon'] = $client['telefon'];
			$dostavka = $asli->getdata('user',['id'=>$pay['dostavka_id']]);
			$ret['dostavka'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
			$ret['vaqt'] = date("d.m.Y",strtotime($pay['vaqt']));
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>