<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['kassir','admin','sotuv','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();
	

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if(isset($_GET['worker_id']) && isset($_GET['sana1']) && isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$hid = $_GET['harajat_category_id'];
			if($_GET['worker_id']>0){
				$wid = $_GET['worker_id'];
				$historys = $asli->getdatas('worker_pay_history',[],"worker_id='$wid' AND sana>='$sana1' AND sana<'$sana2'");
			}
			else{
				$historys = $asli->getdatas('worker_pay_history',[],"sana>='$sana1' AND sana<'$sana2'");
			}
		}
		else{
			$bg = date("d.m.Y 00:00:00",time());
			$sana1 = strtotime($bg);
			$sana2 = $sana1 + 86400;
			$historys = $asli->getdatas('worker_pay_history',[],"sana>='$sana1' AND sana<'$sana2'");
		}		
		$ret = [];
		$i = 0;
		$jaminaqd = 0;
		$jamiusd = 0;
		$jamibank = 0;
		$jamikarta = 0;
		foreach ($historys as $key => $history) {
			$worker = $asli->getdata('workers',['id'=>$history['worker_id']]);
			$ret[$i]['id'] = $history['id'];
			$ret[$i]['summa'] = $history['summa'];
			$ret[$i]['naqdsum'] = $history['naqdsum'];
			$ret[$i]['naqdusd'] = $history['naqdusd'];
			$ret[$i]['valyuta'] = $history['valyuta'];
			$ret[$i]['bank'] = $history['bank'];
			$ret[$i]['karta'] = $history['karta'];
			$ret[$i]['izoh'] = $history['izoh'];
			$ret[$i]['worker'] = $worker['fio'];
			$ret[$i]['worker_id'] = $worker['id'];
			$ret[$i]['vaqt'] = $history['vaqt'];
			$jaminaqd += $history['naqdsum'];
			$jamiusd += $history['naqdusd'];
			$jamibank += $history['bank'];
			$jamikarta += $history['karta'];
			$i++;
		}
		$ans['list'] = $ret;
		$ans['jaminaqd'] = $jaminaqd;
		$ans['jamiusd'] = $jamiusd;
		$ans['jamibank'] = $jamibank;
		$ans['jamikarta'] = $jamikarta;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>