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
		
		$clients = $asli->getdatas('clients',['dostavka_id'=>$user['id']]);
		$jamichiqim = 0;
		$jamikrim = 0;
		foreach ($clients as $key => $client) {
			$client_id = $client['id'];
			$s = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$x = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jamichiqim += $s;
			$jamikrim += $x;
		}
		$ret['xodim'] = $asli->defilter($user['familya'])." ".$asli->defilter($user['ism']);
		$ret['jami_berilgan_yuk'] = $jamichiqim;
		$ret['jami_terilgan_pullar'] = $jamikrim;
		if($jamichiqim==0){
			$ret['bajarilish_foizi'] = 0;
			$ret['ortda_qolish_foizi'] = 100;
		}
		else{
			$ret['bajarilish_foizi'] = round($jamikrim/$jamichiqim,2)*100;
			$ret['ortda_qolish_foizi'] = 100-round($jamikrim/$jamichiqim,2)*100;	
		}		
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->response('403');
	}
	$asli->print_json();
?>