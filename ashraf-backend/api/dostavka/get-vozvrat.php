<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['dostavka','admin'];

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
			$vozvratlar = $asli->getdatas('vozvrat',['dostavka_id'=>$user['id'],'id'=>$_GET['id']]);
			foreach ($vozvratlar as $key => $vozvrat) {			
				$client = $asli->getdata('clients',['id'=>$vozvrat['client_id']]);
				$product = $asli->getdata('products',['id'=>$vozvrat['product_id']]);
				$ret[$i]['id'] = $vozvrat['id'];
				$ret[$i]['client'] = $client;
				$ret[$i]['sana'] = $vozvrat['sana'];			
				$ret[$i]['status'] = $vozvrat['status'];
				$ret[$i]['vaqt'] = $vozvrat['vaqt'];
				$ret[$i]['product'] = $product['name'];
				$ret[$i]['massa'] = $vozvrat['massa'];
				$ret[$i]['narx'] = $vozvrat['price'];
				$ret[$i]['summa'] = $vozvrat['summa'];
				$i++;
			}
			$asli->resp['data'] = $ret;
		}
		if ($method=="DELETE") {
			$vozvrat = $asli->getdata('vozvrat',['dostavka_id'=>$user['id'],'id'=>$_GET['id']]);
			if($vozvrat['id']>0){
				if(time()-$vozvrat['sana']<600){
					$asli->begintranz();
					$asli->kalit = 1;
					$client = $asli->getdata('clients',['id'=>$vozvrat['client_id']]);
					$sql = $asli->update('clients',['balans'=>$client['balans']+$vozvrat['summa']],['id'=>$client['id']]);
					if(!$sql){
						$asli->kalit = 0;
					}
					$sql = $asli->update('vozvrat',['status'=>'bekor_qilingan'],['id'=>$vozvrat['id']]);
					if(!$sql){
						$asli->kalit = 0;
					}
					if($asli->kalit == 1){
						$asli->endtranz();
						// sms
						$asli->sendsms($client['telefon'],"Vozvrt bekor qilindi.");
						$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
					}
					else{
						$asli->bekor();
						$asli->resp += ['success'=> false, 'message' => "Xatolik! Tranzaktsiya yakunlanmadi!"];
					}
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "O'chirib bo'lmaydi! Vaqt tugatilgan"];
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Topilmadi"];
			}
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$vozvratlar = $asli->getdatas('vozvrat',['status'=>'new','dostavka_id'=>$user['id']]);
		foreach ($vozvratlar as $key => $vozvrat) {			
			$client = $asli->getdata('clients',['id'=>$vozvrat['client_id']]);
			$product = $asli->getdata('products',['id'=>$vozvrat['product_id']]);

			$ret[$i]['id'] = $vozvrat['id'];
			$ret[$i]['client'] = $client;
			$ret[$i]['sana'] = $vozvrat['sana'];			
			$ret[$i]['status'] = $vozvrat['status'];
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