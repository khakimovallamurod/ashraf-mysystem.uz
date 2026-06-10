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
	$n = $asli->countustun('krimproducts','id',['user_id'=>$user['id'],'status'=>'joylanmoqda']);

	if($n=="" || $n==0){
		$asli->resp += ['success'=> false, 'message' => "Sizda joylanayotgan buyurtmalar mavjud emas!"];
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$krimlar = $asli->getdatas('krimproducts',['user_id'=>$user['id'],'status'=>'joylanmoqda']);
		foreach ($krimlar as $key => $krim) {
			$m = $asli->summaustun('saqlash_bulimi','massa',['user_id'=>$user['id'],'partiya_id'=>$krim['id']]);
			$taminotchi = $asli->getdata('taminotchi',['id'=>$krim['tashkilot_id']]);
			$qassob = $asli->getdata('qassoblar',['id'=>$krim['qassob_id']]);
			$ret[$i]['id'] = $krim['id'];
			$ret[$i]['taminotchi'] = $taminotchi['fio'];
			$ret[$i]['qassob'] = $qassob['fio'];
			$ret[$i]['partiyanomer'] = $qassob['partiyanomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$krim['sana']);
			$ret[$i]['dona'] = $krim['dona'];
			$ret[$i]['massa'] = $krim['massa'];
			$ret[$i]['price'] = $krim['price'];
			$ret[$i]['summa'] = $krim['summa'];
			$ret[$i]['status'] = $krim['status'];
			$ret[$i]['joylandi'] = $m;
			$ret[$i]['joylangani'] = $krim['joylangani'];
			$ret[$i]['qoldi'] = $krim['massa']-$m;
			$ret[$i]['javobgar'] = $user['fio'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>