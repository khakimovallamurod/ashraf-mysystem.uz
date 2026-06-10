<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sklad','admin','saqlash','sotuv'];


	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();
	$ret = [];
	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
	$i = 0;
	$krimlar = $asli->getdatas('xolodelnik_krim',[],"1 ORDER BY id DESC LIMIT 150");
	foreach ($krimlar as $key => $krim) {
		$product = $asli->getdata('products',['id'=>$krim['product_id']]);
		$user = $asli->getdata('user',['id'=>$krim['user_id']]);

		$ret[$i]['id'] = $krim['id'];
		$ret[$i]['partiya_kun'] = date("d.m.Y", $krim['sana']);
		$ret[$i]['partiya_id'] = $krim['partiya_id'];
		$ret[$i]['product'] = $asli->defilter($product['name']);
		$ret[$i]['massa'] = $krim['massa'];
		$ret[$i]['javobgar'] = $asli->defilter($user['familya']." ".$user['familya']);
		$ret[$i]['vaqt'] = date("d.m.Y H:i:s", $krim['sana']);
		$i++;
	}
	$asli->resp['data'] = $ret;
	$asli->print_json();
?>