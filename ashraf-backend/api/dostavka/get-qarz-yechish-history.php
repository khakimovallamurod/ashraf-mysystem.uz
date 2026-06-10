<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin','sotuv','saqlash'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($_GET['sana1']) and isset($_GET['sana2'])){
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		$dostavka_id = $user['id'];
		$historys = $asli->getdatas('debithistory',[],"sana>='$sana1' AND sana<'$sana2'");
	}
	else{
		$s = date("d.m.Y 00:00:00",time());
		$sana1 = strtotime($s);
		$sana2 = $sana1 + 86400;
		$dostavka_id = $user['id'];
		$historys = $asli->getdatas('debithistory',[],"sana>='$sana1' AND sana<'$sana2'");
		// $historys = $asli->getdatas('debithistory',['dostavka_id'=>$user['id']]);	
	}
	// print_r($history);
	if(count($historys)>0){
		$asli->resp += ['success'=> true, 'message' => "Mijozlardan olinga pullar ro'yxati"];
		$ret = [];
		$i=0;
		$jami = 0;
		foreach ($historys as $key => $history) {
			$client = $asli->getdata('clients',['id'=>$history['client_id']]);
			$ret[$i]['id'] = $history['id'];
			$summa = $history['naqdsum'] + $history['bank'] + $history['karta'];
			if($history['naqdusd']>0){
				$summa += $history['naqdusd']*$history['valyuta'];
			}
			$jami += $summa;
			$ret[$i]['summa'] = $summa;
			$ret[$i]['naqdsum'] = $history['naqdsum'];
			$ret[$i]['naqdusd'] = $history['naqdusd'];
			$ret[$i]['valyuta'] = $history['valyuta'];
			$ret[$i]['bank'] = $history['bank'];
			$ret[$i]['karta'] = $history['karta'];
			$ret[$i]['client'] = $asli->defilter($client['fio']);
			$ret[$i]['telefon'] = $client['telefon'];
			$ret[$i]['vaqt'] = $history['vaqt'];
			$i++;
		}
		$ans['itog'] = $jami;
		$ans['list'] = $ret;
		$asli->resp['data'] = $ans;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda sizda balans mavjud emas!"];
	}
	$asli->print_json();
?>