<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin','kassir','sotuv','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if(isset($_GET['sana1']) and isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$historys = $asli->getdatas('change_balans_history',[],"sana>='$sana1' AND sana<'$sana2'");
		}
		else{
			// $s = date("d.m.Y 00:00:00",time());
			// $sana1 = strtotime($s);
			// $sana2 = $sana1 + 86400;
			// $historys = $asli->getdatas('get_dostavka_balans_history',[],"sana>='$sana1' AND sana<'$sana2'");
			$historys = $asli->getdatas('change_balans_history',[],"1 ORDER BY id DESC LIMIT 250");
		}		
		$i = 0;
		foreach ($historys as $key => $history) {
			$dostavka = $asli->getdata('user',['id'=>$history['user_id']]);
			$ret[$i]['javobgar'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);

			$ret[$i]['chiquvchi'] = $history['chiquvchi'];
			$ret[$i]['kiruvchi'] = $history['kiruvchi'];
			$ret[$i]['summa'] = $history['summa'];
			$ret[$i]['valyuta'] = $history['valyuta'];
			$ret[$i]['izoh'] = $history['izoh'];			
			$ret[$i]['vaqt'] = $history['vaqt'];
			$ret[$i]['sana'] = $history['sana'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>