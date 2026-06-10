<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['sklad','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();

	$ret = [];
	$asli->check_rolls();
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$n = $asli->countustun('krimproducts','id',['status'=>'joylandi']);
	if($n=="" || $n==0){
		$asli->resp += ['success'=> false, 'message' => "Siz joylashtirgan buyurtmalar mavjud emas!"];
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		if(isset($_GET['sana1']) && isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$krimlar = $asli->getdatas('krimproducts',[],"sana>='$sana1' AND sana<'$sana2' AND status='joylandi' ORDER BY id DESC");
		}
		else{
			$krimlar = $asli->getdatas('krimproducts',[],"status='joylandi' ORDER BY id DESC LIMIT 50");
		}
		$jamimassa = 0;
		$jamidona = 0;
		$jamisumma = 0;
		foreach ($krimlar as $key => $krim) {
			$taminotchi = $asli->getdata('taminotchi',['id'=>$krim['tashkilot_id']]);
			$qassob = $asli->getdata('qassoblar',['id'=>$krim['qassob_id']]);
			$ret[$i]['id'] = $krim['id'];
			$ret[$i]['taminotchi'] = $asli->defilter($taminotchi['fio']);
			$ret[$i]['qassob'] = $asli->defilter($qassob['fio']);
			$ret[$i]['partiyanomer'] = $krim['partiyanomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$krim['sana']);
			$ret[$i]['dona'] = $krim['dona'];
			$ret[$i]['massa'] = $krim['massa'];
			$ret[$i]['price'] = $krim['price'];
			$ret[$i]['summa'] = $krim['summa'];
			$ret[$i]['status'] = $krim['status'];
			$ret[$i]['javobgar'] = $user['fio'];
			$jamimassa += $krim['massa'];
			$jamidona += $krim['dona'];
			$jamisumma += $krim['summa'];
			$i++;
		}
		$ans['list'] = $ret;
		$ans['jamimassa'] = $jamimassa;
		$ans['jamidona'] = $jamidona;
		$ans['jamisumma'] = $jamisumma;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>