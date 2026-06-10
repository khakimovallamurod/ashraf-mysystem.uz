<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','dostavka','kassir','saqlash','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$ret = [];
	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if($_GET['status']=="olingan"){
			$krim = $asli->getdata('krimproducts',['id'=>$_GET['id']]);

			$taminotchi = $asli->getdata('taminotchi',['id'=>$krim['tashkilot_id']]);
			$qassob = $asli->getdata('qassoblar',['id'=>$krim['qassob_id']]);
			$ret['id'] = $krim['id'];
			$ret['taminotchi'] = $asli->defilter($taminotchi['fio']);
			$ret['taminotchi_telefon'] = $taminotchi['telefon'];
			$ret['qassob'] = htmlspecialchars_decode($qassob['fio'],ENT_QUOTES);
			$ret['partiyanomer'] = $krim['partiyanomer'];
			$ret['sana'] = date("d.m.Y h:i:s",$krim['sana']);
			$ret['dona'] = $krim['dona'];
			$ret['massa'] = $krim['massa'];
			$ret['price'] = $krim['price'];
			$ret['summa'] = $krim['summa'];
			$ret['status'] = $krim['status'];
			$ret['malumot'] = $asli->defilter($krim['malumot']);
		}
		if($_GET['status']=="berilgan"){
			$pay = $asli->getdata('pay_taminotchi_history',['id'=>$_GET['id']]);
			$ret['id'] = $pay['id'];
			$ret['summa'] = $pay['summa'];
			$ret['naqdsum'] = $pay['naqdsum'];
			$ret['naqdusd'] = $pay['naqdusd'];
			$ret['valyuta'] = $pay['valyuta'];
			$ret['bank'] = $pay['bank'];
			$ret['karta'] = $pay['karta'];
			$javobgar = $asli->getdata('user',['id'=>$pay['user_id']]);
			$ret['javobgar'] = $asli->defilter($javobgar['familya'])." ".$asli->defilter($javobgar['ism']);
			$ret['vaqt'] = $pay['vaqt'];
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>