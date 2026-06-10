<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['kassir','admin','sotuv'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();
	

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$history = $asli->getdata('qassob_pay_history',['id'=>$_GET['id']]);
			$ret = [];
			$qassob = $asli->getdata('qassoblar',['id'=>$history['qassob_id']]);

			$ret['summa'] = $history['summa'];
			$ret['naqdsum'] = $history['naqdsum'];
			$ret['naqdusd'] = $history['naqdusd'];
			$ret['valyuta'] = $history['valyuta'];
			$ret['bank'] = $history['bank'];
			$ret['karta'] = $history['karta'];
			$ret['izoh'] = $history['izoh'];
			$ret['qassob'] = $qassob['fio'];
			$ret['qassob_id'] = $qassob['id'];
			$ret['status'] = $history['status'];
			$ret['vaqt'] = "Kod: ".$history['code']." | ".$history['vaqt'];

			$asli->resp['data'] = $ret;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$historys = $asli->getdatas('qassob_pay_history',[],"1 ORDER BY id DESC");
		$ret = [];
		$i = 0;
		foreach ($historys as $key => $history) {
			$qassob = $asli->getdata('qassoblar',['id'=>$history['qassob_id']]);
			$ret[$i]['id'] = $history['id'];
			$ret[$i]['summa'] = $history['summa'];
			$ret[$i]['naqdsum'] = $history['naqdsum'];
			$ret[$i]['naqdusd'] = $history['naqdusd'];
			$ret[$i]['valyuta'] = $history['valyuta'];
			$ret[$i]['bank'] = $history['bank'];
			$ret[$i]['karta'] = $history['karta'];
			$ret[$i]['izoh'] = $history['izoh'];
			$ret[$i]['qassob'] = $qassob['fio'];
			$ret[$i]['qassob_id'] = $qassob['id'];
			$ret[$i]['status'] = $history['status'];
			$ret[$i]['vaqt'] = "Kod: ".$history['code']." | ".$history['vaqt'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>