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
	$n = $asli->countustun('saqlash_bulimi','id',['polka_id'=>$_GET['id'],'status'=>'joylandi']);
	if($n=="" || $n==0){
		$asli->resp += ['success'=> false, 'message' => "Bu polkada partiya mavjud emas!"];
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$krimlar = $asli->getdatas('saqlash_bulimi',['polka_id'=>$_GET['id'],'status'=>'joylandi']);
		foreach ($krimlar as $key => $krim) {
			$partiya = $asli->getdata('krimproducts',['id'=>$krim['partiya_id']]);
			$ret[$i]['id'] = $partiya['id'];
			$ret[$i]['partiya'] = $partiya['partiyanomer'];
			$ret[$i]['krim_id'] = $partiya['id'];
			$ret[$i]['massa'] = $krim['qoldi'];			
			$ret[$i]['sana'] = $krim['vaqt'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>