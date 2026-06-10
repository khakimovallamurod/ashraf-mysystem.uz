<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if ($method=="GET") {
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$i = 0;
			$vozvratlar = $asli->getdatas('vozvrat',['id'=>$_GET['id']]);
			foreach ($vozvratlar as $key => $vozvrat) {			
				$client = $asli->getdata('clients',['id'=>$vozvrat['client_id']]);
				$product = $asli->getdata('products',['id'=>$vozvrat['product_id']]);

				$ret[$i]['id'] = $vozvrat['id'];
				$ret[$i]['client'] = $client;
				$ret[$i]['sana'] = $vozvrat['sana'];			
				$ret[$i]['status'] = $vozvrat['status'];
				$ret[$i]['holat'] = $vozvrat['holat'];
				$ret[$i]['vaqt'] = $vozvrat['vaqt'];
				$ret[$i]['product'] = $product['name'];
				$ret[$i]['massa'] = $vozvrat['massa'];
				$ret[$i]['narx'] = $vozvrat['price'];
				$ret[$i]['summa'] = $vozvrat['summa'];
				$i++;
			}
			$asli->resp['data'] = $ret;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$vozvratlar = $asli->getdatas('vozvrat',['status'=>'confirmed']);
		foreach ($vozvratlar as $key => $vozvrat) {			
			$client = $asli->getdata('clients',['id'=>$vozvrat['client_id']]);
			$product = $asli->getdata('products',['id'=>$vozvrat['product_id']]);

			$ret[$i]['id'] = $vozvrat['id'];
			$ret[$i]['client'] = $client;
			$ret[$i]['sana'] = $vozvrat['sana'];			
			$ret[$i]['status'] = $vozvrat['status'];
			$ret[$i]['holat'] = $vozvrat['holat'];
			$ret[$i]['vaqt'] = $vozvrat['vaqt'];
			$ret[$i]['product'] = $product['name'];
			$ret[$i]['massa'] = $vozvrat['massa'];
			$ret[$i]['narx'] = $vozvrat['price'];
			$ret[$i]['summa'] = $vozvrat['summa'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>