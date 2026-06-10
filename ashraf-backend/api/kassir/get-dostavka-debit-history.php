<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin','kassir','sotuv'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if(isset($_GET['sana1']) and isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$dostavka_id = $_GET['dostavka_id'];
			if($dostavka_id>0){
				$historys = $asli->getdatas('debithistory',[],"dostavka_id='$dostavka_id' AND sana>='$sana1' AND sana<'$sana2'");
			}
			else{
				$historys = $asli->getdatas('debithistory',[],"sana>='$sana1' AND sana<'$sana2'");
			}
		}
		else{
			$s = date("d.m.Y 00:00:00",time());
			$sana1 = strtotime($s);
			$sana2 = $sana1 + 86400;
			$historys = $asli->getdatas('debithistory',[],"sana>='$sana1' AND sana<'$sana2'");
			// $historys = $asli->getdatas('debithistory',[],"1");
		}		
		$i = 0;
		$jamisum = 0;
		$jaminaqd = 0;
		$jamiusd = 0;
		$jamibank = 0;
		$jamikarta = 0;

		foreach ($historys as $key => $history) {
			$dostavka = $asli->getdata('user',['id'=>$history['dostavka_id']]);
			$client = $asli->getdata('clients',['id'=>$history['client_id']]);

			$ret[$i]['dostavchik'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
			
			$ret[$i]['client'] = $asli->defilter($client['fio']);

			$ret[$i]['naqdsum'] = $history['naqdsum'];
			$ret[$i]['naqdsum'] = $history['naqdsum'];
			$ret[$i]['naqdusd'] = $history['naqdusd'];
			$ret[$i]['valyuta'] = $history['valyuta'];
			$ret[$i]['bank'] = $history['bank'];
			$ret[$i]['karta'] = $history['karta'];
			$ret[$i]['vaqt'] = date("d.m.Y h:i:s",$history['sana']);
			$jamisum += $history['summa'];
			$jaminaqd += $history['naqdsum'];
			$jamiusd += $history['naqdusd'];
			$jamibank += $history['bank'];
			$jamikarta += $history['karta'];
			$i++;
		}
		$ans['jamisum'] = $jamisum;
		$ans['jaminaqd'] = $jaminaqd;
		$ans['jamiusd'] = $jamiusd;
		$ans['jamibank'] = $jamibank;
		$ans['jamikarta'] = $jamikarta;
		$ans['list'] = $ret;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>