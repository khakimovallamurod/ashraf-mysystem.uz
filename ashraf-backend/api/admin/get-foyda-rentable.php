<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['sana1']) or isset($_GET['sana2'])){
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
	}
	else{
		$sana1 = strtotime(date("d.m.Y"));
		$sana2 = $sana1 + 86400;
	}
	$partiyalar = $asli->getdatas('partiya',[],"sana>='$sana1' AND sana<'$sana2'");

	$products = $asli->getdatas('products',[],"1");
	$min_price = [];
	foreach ($products as $key => $product) {
		$min_price[$product['id']] = $product['price'];
	}
	$krim_massa = 0;
	$krim_summa = 0;
	$jami_dona = 0;
	$xol_massa = 0;
	$sotuv_massa = 0;
	$sotuv_summa = 0;
	$xol_summa = 0;
	$vv = file_get_contents("https://cbu.uz/uz/arkhiv-kursov-valyut/json/");
	$v = json_decode($vv);
	$v = $v[0]->Rate;

	foreach ($partiyalar as $key => $p) {
		$krim_massa += $asli->summaustun('krimproducts','massa',['partiya_id'=>$p['id']]);
		$krim_summa += $asli->summaustun('krimproducts','summa',['partiya_id'=>$p['id']]);
		$jami_dona += $asli->summaustun('krimproducts','dona',['partiya_id'=>$p['id']]);
		$xol_massa += $asli->summaustun('xolodelnik_krim','massa',['partiya_id'=>$p['id']]);
		$sotuv_massa += $asli->summaustun('sale_order_items','soni',['partiya_id'=>$p['id']]);
		$sotuv_summa += $asli->summaustun('sale_order_items','summa',['partiya_id'=>$p['id']]);
		$xols = $asli->getdatas('xolodelnik_krim',['partiya_id'=>$p['id']]);
		foreach ($xols as $key2 => $xol) {
			$xol_summa += $xol['massa'] * $min_price[$xol['product_id']];
		}
	}
	$jami_harajat = $asli->summaustun('harajat','naqdsum',[],"sana>='$sana1' AND sana<'$sana2'");
	$jami_harajat += $asli->summaustun('harajat','naqdusd',[],"sana>='$sana1' AND sana<'$sana2'")*$v;
	$jami_harajat += $asli->summaustun('harajat','bank',[],"sana>='$sana1' AND sana<'$sana2'");
	$jami_harajat += $asli->summaustun('harajat','karta',[],"sana>='$sana1' AND sana<'$sana2'");
	$ret['jami_krim_massa'] = round($krim_massa,2);
	$ret['jami_krim_summa'] = round($krim_summa,2);
	$ret['jami_dona'] = round($jami_dona,2);
	$ret['xolodelnik_massa'] = round($xol_massa,2);
	$ret['jami_sotuv_summa'] = round($sotuv_summa,2);
	$ret['xolodelnik_summa'] = round($xol_summa,2);
	if($krim_massa!=0){
		$ret['foiz'] = round(round(($xol_massa+$sotuv_massa)/$krim_massa,2)*100,2);	
	}
	else{
		$ret['foiz'] = 0;
	}
	$ret['qassob_harajat'] = round($jami_dona,2) * 800;
	$f = $sotuv_summa + $xol_summa - $krim_summa - round($jami_dona,2) * 800;
	$ret['bugungi_foyda'] = round($f,2);
	$ret['jami_harajat'] = round($jami_harajat,2);
	
	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
	$asli->resp['data'] = $ret;
	$asli->print_json();
?>