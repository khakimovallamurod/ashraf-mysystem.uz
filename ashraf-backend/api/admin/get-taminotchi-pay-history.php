<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();
	

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$history = $asli->getdata('pay_taminotchi_history',['id'=>$_GET['id']]);
			$ret = [];
			$taminotchi = $asli->getdata('taminotchi',['id'=>$history['taminotchi_id']]);

			$ret['summa'] = $history['summa'];
			$ret['naqdsum'] = $history['naqdsum'];
			$ret['naqdusd'] = $history['naqdusd'];
			$ret['valyuta'] = $history['valyuta'];
			$ret['bank'] = $history['bank'];
			$ret['karta'] = $history['karta'];
			$ret['izoh'] = $history['izoh'];
			$ret['taminotchi'] = $taminotchi['fio'];
			$ret['taminotchi_id'] = $taminotchi['id'];
			$ret['status'] = $history['status'];
			$ret['vaqt'] = $history['vaqt'];

			$asli->resp['data'] = $ret;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$historys = $asli->getdatas('pay_taminotchi_history',[],"1 ORDER BY id DESC");
		$ret = [];
		$i = 0;
		foreach ($historys as $key => $history) {
			$taminotchi = $asli->getdata('taminotchi',['id'=>$history['taminotchi_id']]);
			$ret[$i]['id'] = $history['id'];
			$ret[$i]['summa'] = $history['summa'];
			$ret[$i]['naqdsum'] = $history['naqdsum'];
			$ret[$i]['naqdusd'] = $history['naqdusd'];
			$ret[$i]['valyuta'] = $history['valyuta'];
			$ret[$i]['bank'] = $history['bank'];
			$ret[$i]['karta'] = $history['karta'];
			$ret[$i]['izoh'] = $history['izoh'];
			$ret[$i]['taminotchi'] = $taminotchi['fio'];
			$ret[$i]['taminotchi_id'] = $taminotchi['id'];
			$ret[$i]['status'] = $history['status'];
			$ret[$i]['vaqt'] = $history['vaqt'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>