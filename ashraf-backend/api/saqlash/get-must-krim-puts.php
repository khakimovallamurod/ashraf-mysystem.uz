<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sklad','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();
	$ret = [];
	$n = $asli->countustun('krimproducts','id',['status'=>'new']);
	if($n=="" || $n==0){
		$asli->resp += ['success'=> false, 'message' => "Sizda joylanayotgan buyurtmalar mavjud emas!"];
	}
	else{
		$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$krimlar = $asli->getdatas('krimproducts',['status'=>'new']);
		foreach ($krimlar as $key => $krim) {
			$taminotchi = $asli->getdata('taminotchi',['id'=>$krim['tashkilot_id']]);
			$qassob = $asli->getdata('qassoblar',['id'=>$krim['qassob_id']]);
			$ret[$i]['id'] = $krim['id'];
			$ret[$i]['taminotchi'] = $taminotchi['fio'];
			$ret[$i]['qassob'] = $qassob['fio'];
			$ret[$i]['partiyanomer'] = $krim['partiyanomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$krim['sana']);
			$ret[$i]['dona'] = $krim['dona'];
			$ret[$i]['massa'] = $krim['massa'];
			$ret[$i]['price'] = $krim['price'];
			$ret[$i]['summa'] = $krim['summa'];
			$ret[$i]['status'] = $krim['status'];
			$ret[$i]['joylandi'] = 0;
			$ret[$i]['qoldi'] = $krim['massa'];
			$ret[$i]['javobgar'] = $user['fio'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>