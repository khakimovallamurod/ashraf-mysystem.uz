<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET', 'DELETE'];
	$asli->allow_rolls = ['sotuv','dostavka','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$sql = $asli->delete('clients',['id'=>$_GET['id']]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Xatolik malumot o'chirilmadi!"];
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			if(isset($_GET['id'])){				
				$client = $asli->getdata('clients',['id'=>$_GET['id']]);
				$viloyat = $asli->getdata('viloyat',['id'=>$client['viloyat_id']]);
				$tuman = $asli->getdata('tuman',['id'=>$client['tuman_id']]);
				$ret['id'] = $client['id'];
				$ret['fio'] = $client['fio'];
				$ret['korxona'] = $client['korxona'];
				$ret['balans'] = $client['balans'];
				$ret['telefon'] = $client['telefon'];
				$ret['chat_id'] = isset($client['chat_id']) ? $client['chat_id'] : (isset($client['telefon2']) ? $client['telefon2'] : '');
				$ret['rasm'] = $client['rasm'];
				$ret['manzil'] = $client['manzil'];
				$ret['lokatsiya'] = $client['lokatsiya'];
				$ret['latitude'] = $client['latitude'];
				$ret['registertime'] = $client['vaqt'];
				$ret['viloyat'] = $viloyat['nomi'];
				$ret['tuman'] = $tuman['nomi'];
				$ret['category_id'] = $client['category_id'];
				$ret['dostavka_id'] = $client['dostavka_id'];
				$ret['viloyat_id'] = $client['viloyat_id'];
				$ret['tuman_id'] = $client['tuman_id'];
				$asli->resp['data'] = $ret;
			}
			if(isset($_GET['viloyat_id'])){				
				$i = 0;
				$clients = $asli->getdatas('clients',['viloyat_id'=>$_GET['viloyat_id']]);
				foreach ($clients as $key => $client) {
					$viloyat = $asli->getdata('viloyat',['id'=>$client['viloyat_id']]);
					$tuman = $asli->getdata('tuman',['id'=>$client['tuman_id']]);
					$ret[$i]['id'] = $client['id'];
					$ret[$i]['fio'] = $client['fio'];
					$ret[$i]['korxona'] = $client['korxona'];
					$ret[$i]['balans'] = $client['balans'];
					$ret[$i]['telefon'] = $client['telefon'];
					$ret[$i]['chat_id'] = isset($client['chat_id']) ? $client['chat_id'] : (isset($client['telefon2']) ? $client['telefon2'] : '');
					$ret[$i]['rasm'] = $client['rasm'];
					$ret[$i]['manzil'] = $client['manzil'];
					$ret[$i]['lokatsiya'] = $client['lokatsiya'];
					$ret[$i]['latitude'] = $client['latitude'];
					$ret[$i]['registertime'] = $client['vaqt'];
					$ret[$i]['viloyat'] = $viloyat['nomi'];
					$ret[$i]['tuman'] = $tuman['nomi'];
					$ret[$i]['category_id'] = $client['category_id'];
					$ret[$i]['dostavka_id'] = $client['dostavka_id'];
					$ret[$i]['viloyat_id'] = $client['viloyat_id'];
					$ret[$i]['tuman_id'] = $client['tuman_id'];
					$i++;
				}
				$asli->resp['data'] = $ret;
			}
			if(isset($_GET['tuman_id'])){				
				$i = 0;
				$clients = $asli->getdatas('clients',['tuman_id'=>$_GET['tuman_id']]);
				foreach ($clients as $key => $client) {
					$viloyat = $asli->getdata('viloyat',['id'=>$client['viloyat_id']]);
					$tuman = $asli->getdata('tuman',['id'=>$client['tuman_id']]);
					$ret[$i]['id'] = $client['id'];
					$ret[$i]['fio'] = $client['fio'];
					$ret[$i]['korxona'] = $client['korxona'];
					$ret[$i]['balans'] = $client['balans'];
					$ret[$i]['telefon'] = $client['telefon'];
					$ret[$i]['chat_id'] = isset($client['chat_id']) ? $client['chat_id'] : (isset($client['telefon2']) ? $client['telefon2'] : '');
					$ret[$i]['rasm'] = $client['rasm'];
					$ret[$i]['manzil'] = $client['manzil'];
					$ret[$i]['lokatsiya'] = $client['lokatsiya'];
					$ret[$i]['latitude'] = $client['latitude'];
					$ret[$i]['registertime'] = $client['vaqt'];
					$ret[$i]['viloyat'] = $viloyat['nomi'];
					$ret[$i]['tuman'] = $tuman['nomi'];
					$ret[$i]['category_id'] = $client['category_id'];
					$ret[$i]['dostavka_id'] = $client['dostavka_id'];
					$ret[$i]['viloyat_id'] = $client['viloyat_id'];
					$ret[$i]['tuman_id'] = $client['tuman_id'];
					$i++;
				}
				$asli->resp['data'] = $ret;
			}
		}
	}
	else{

		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		if($user['rol']=="dostavka"){
			$clients = $asli->getdatas('clients',[],"1 ORDER BY fio ASC");	
			// $d = $user['id'];
			// $clients = $asli->getdatas('clients',[],"dostavka_id='$d' ORDER BY fio ASC");
		}
		else{
			$clients = $asli->getdatas('clients',[],"1 ORDER BY fio ASC");	
		}		
		foreach ($clients as $key => $client) {
			$viloyat = $asli->getdata('viloyat',['id'=>$client['viloyat_id']]);
			$tuman = $asli->getdata('tuman',['id'=>$client['tuman_id']]);
			$ret[$i]['id'] = $client['id'];
			$ret[$i]['fio'] = $asli->defilter($client['fio']);
			$ret[$i]['korxona'] = $asli->defilter($client['korxona']);
			$ret[$i]['balans'] = $client['balans'];
			$ret[$i]['telefon'] = $client['telefon'];
			$ret[$i]['chat_id'] = isset($client['chat_id']) ? $client['chat_id'] : (isset($client['telefon2']) ? $client['telefon2'] : '');
			$ret[$i]['rasm'] = $client['rasm'];
			$ret[$i]['manzil'] = $client['manzil'];
			$ret[$i]['lokatsiya'] = $client['lokatsiya'];
			$ret[$i]['latitude'] = $client['latitude'];
			$ret[$i]['registertime'] = $client['vaqt'];
			$ret[$i]['viloyat'] = $viloyat['nomi'];
			$ret[$i]['tuman'] = $tuman['nomi'];
			$ret[$i]['category_id'] = $client['category_id'];
			$ret[$i]['dostavka_id'] = $client['dostavka_id'];
			$ret[$i]['viloyat_id'] = $client['viloyat_id'];
			$ret[$i]['tuman_id'] = $client['tuman_id'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>
