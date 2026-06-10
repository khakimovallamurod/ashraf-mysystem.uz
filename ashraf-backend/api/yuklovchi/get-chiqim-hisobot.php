<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','maydalash','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id']) || isset($_GET['bulim_id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if(isset($_GET['sana1']) AND isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
		}
		else{
			$bugun = date("d.m.Y 00:00:00");
			$sana1 = strtotime($bugun);
			$sana2 = $sana1 + 86400;
		}
		$ret = [];
		$jami = 0;
		$jami2 = 0;
		$mahsulot = [];
		$items = $asli->getdatas('sale_order_items',[],"sana>='$sana1' AND sana<'$sana2'");
		foreach ($items as $key => $item) {
			$jami2 += $item['soni'];
			$jami += $item['tayyorlandi'];
			$mahsulot[$item['product_id']] += $item['tayyorlandi'];
		}
		$m = [];
		$i = 0;
		foreach ($mahsulot as $item_id => $soni) {
			$item = $asli->getdata('products',['id'=>$item_id]);
			$m[$i]['item_id'] = $item_id;
			$m[$i]['name'] = $asli->defilter($item['name']);
			$m[$i]['soni'] = round($soni,2);
			$i++;
		}
		$ret['items_list'] = $m;
		$ret['jami'] = round($jami,2);
		$ret['jami2'] = round($jami2,2);
		$ret['sana1'] = $sana1;
		$ret['sana2'] = $sana2;
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>