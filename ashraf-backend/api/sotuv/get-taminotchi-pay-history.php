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

	$taminotchi_id = isset($_GET['taminotchi_id']) ? intval($_GET['taminotchi_id']) : 0;
	$sana1 = isset($_GET['sana1']) ? $asli->filter($_GET['sana1']) : '';
	$sana2 = isset($_GET['sana2']) ? $asli->filter($_GET['sana2']) : '';

	$shart = "1";
	if($taminotchi_id > 0){
		$shart .= " AND taminotchi_id='$taminotchi_id'";
	}
	if(strlen($sana1)>0 && strlen($sana2)>0){
		$ts1 = strtotime($sana1);
		$ts2 = strtotime($sana2);
		$shart .= " AND sana>='$ts1' AND sana<'$ts2'";
	}
	$shart .= " ORDER BY id DESC";

	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
	$historys = $asli->getdatas('pay_taminotchi_history',[],$shart);
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
		$ret[$i]['taminotchi'] = $asli->defilter($taminotchi['fio']);
		$ret[$i]['taminotchi_id'] = $taminotchi['id'];
		$ret[$i]['status'] = $history['status'];
		$ret[$i]['vaqt'] = $history['vaqt'];
		$i++;
	}
	$asli->resp['data'] = $ret;
	$asli->print_json();
?>
