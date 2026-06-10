<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','maydalash','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id']) || isset($_GET['bulim_id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if(isset($_GET['sana1']) AND isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
		}
		else{
			$bugun = date("d.m.Y 00:00:00");
			$sana1 = strtotime($bugun);
			$sana2 = $sana1 + 86400;
		}
		$ret = [];
		$jami = 0;
		$maydalashlar = $asli->getdatas('zayavka_msq',[],"sana>='$sana1' AND sana<'$sana2'");
		foreach ($maydalashlar as $key => $maydalash) {
			$zayavka_id = $maydalash['id'];
			$polkalar = $asli->getdatas('polka',[],"1");
			foreach ($polkalar as $key => $polka) {
				$polka_id = $polka['id'];				
				$m = $asli->summaustun('putpolka','qoldi',[],"polka_id='$polka_id' AND zayavka_msq_id='$zayavka_id'");
				$jami += $m;
				$ret[$polka['name']] += round($m,2);
			}
		}
		$ret['jami'] = round($jami,2);
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>