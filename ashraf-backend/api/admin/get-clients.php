<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

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
				$client = $asli->getdata('client',['id'=>$_GET['id']]);
				$viloyat = $asli->getdata('viloyat',['id'=>$client['viloyat_id']]);
				$tuman = $asli->getdata('tuman',['id'=>$client['tuman_id']]);
				$ret[$i]['id'] = $client['id'];
				$ret[$i]['fio'] = $client['fio'];
				$ret[$i]['korxona'] = $client['korxona'];
				$ret[$i]['balans'] = $client['balans'];
				$ret[$i]['rasm'] = $client['rasm'];
				$ret[$i]['manzil'] = $client['manzil'];
				$ret[$i]['lokatsiya'] = $client['lokatsiya'];
				$ret[$i]['latitude'] = $client['latitude'];
				$ret[$i]['registertime'] = $client['vaqt'];
				$ret[$i]['viloyat'] = $viloyat['name'];
				$ret[$i]['tuman'] = $tuman['name'];
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
					$ret[$i]['rasm'] = $client['rasm'];
					$ret[$i]['manzil'] = $client['manzil'];
					$ret[$i]['lokatsiya'] = $client['lokatsiya'];
					$ret[$i]['latitude'] = $client['latitude'];
					$ret[$i]['registertime'] = $client['vaqt'];
					$ret[$i]['viloyat'] = $viloyat['name'];
					$ret[$i]['tuman'] = $tuman['name'];
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
					$ret[$i]['rasm'] = $client['rasm'];
					$ret[$i]['manzil'] = $client['manzil'];
					$ret[$i]['lokatsiya'] = $client['lokatsiya'];
					$ret[$i]['latitude'] = $client['latitude'];
					$ret[$i]['registertime'] = $client['vaqt'];
					$ret[$i]['viloyat'] = $viloyat['name'];
					$ret[$i]['tuman'] = $tuman['name'];
					$i++;
				}
				$asli->resp['data'] = $ret;
			}
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$clients = $asli->getdatas('clients',[],"1");
		foreach ($clients as $key => $client) {
			$viloyat = $asli->getdata('viloyat',['id'=>$client['viloyat_id']]);
			$tuman = $asli->getdata('tuman',['id'=>$client['tuman_id']]);
			$ret[$i]['id'] = $client['id'];
			$ret[$i]['fio'] = $client['fio'];
			$ret[$i]['korxona'] = $client['korxona'];
			$ret[$i]['balans'] = $client['balans'];
			$ret[$i]['rasm'] = $client['rasm'];
			$ret[$i]['manzil'] = $client['manzil'];
			$ret[$i]['lokatsiya'] = $client['lokatsiya'];
			$ret[$i]['latitude'] = $client['latitude'];
			$ret[$i]['registertime'] = $client['vaqt'];
			$ret[$i]['viloyat'] = $viloyat['name'];
			$ret[$i]['tuman'] = $tuman['name'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>