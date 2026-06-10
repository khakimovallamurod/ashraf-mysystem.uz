<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['admin','saqlash','sotuv','kassir'];

	$asli->check_ip();

	$asli->check_method();


// 	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['sana1']) && isset($_GET['sana2'])){
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
	}
	else{
		$sana1 = strtotime(date("d.m.Y"));
		$sana2 = $sana1 + 86400;
	}
	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
	$i = 0;
	$partiyalar = $asli->getdatas('partiya',[],"sana>='$sana1' AND sana<'$sana2'");
	foreach ($partiyalar as $key => $p) {
		$krim_massa = $asli->summaustun('krimproducts','massa',['partiya_id'=>$p['id']]);
		$sotuv_massa = $asli->summaustun('sale_order_items','tayyorlandi',['partiya_id'=>$p['id']]);
		$xolodelnik_massa = $asli->summaustun('xolodelnik_krim','massa',['partiya_id'=>$p['id']]);
		$ret[$i]['id'] = $p['id'];
		$ret[$i]['sana'] = $p['kun'];
		$ret[$i]['krim_massa'] = round($krim_massa,2);
		$ret[$i]['sotuv_massa'] = round($sotuv_massa,2);
		$ret[$i]['xolodelnik_massa'] = round($xolodelnik_massa,2);
		if($krim_massa==0){
			$ret[$i]['foiz'] = 0;
		}
		else{
			$ret[$i]['foiz'] = round(($xolodelnik_massa+$sotuv_massa)/$krim_massa,2) * 100;
		}
		$i++;
	}
	$asli->resp['data'] = $ret;
	$asli->print_json();
?>