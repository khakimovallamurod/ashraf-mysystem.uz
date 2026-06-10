<?php
	include_once '../header.php';
	include_once '../config.php';

	$asli = new Cyber();
	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','admin'];
	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	$sana1         = isset($_GET['sana1']) ? $asli->filter($_GET['sana1']) : '';
	$sana2         = isset($_GET['sana2']) ? $asli->filter($_GET['sana2']) : '';
	$status_filter = isset($_GET['status']) ? $asli->filter($_GET['status']) : '';

	$shart = "1";
	if(strlen($sana1) > 0 && strlen($sana2) > 0){
		$ts1 = strtotime($sana1);
		$ts2 = strtotime($sana2);
		$shart .= " AND r.sana>='$ts1' AND r.sana<'$ts2'";
	}
	if(strlen($status_filter) > 0){
		$shart .= " AND r.status='$status_filter'";
	}

	$sql = $asli->query("SELECT r.* FROM razilka r WHERE $shart ORDER BY r.id DESC");
	$ret = [];
	while($item = mysqli_fetch_assoc($sql)){
		$product = $asli->getdata('products',['id'=>$item['product_id']]);

		// Chiqim mahsulotlari
		$out_sql = $asli->query("SELECT ro.*, p.name as pname FROM razilka_output ro
			LEFT JOIN products p ON p.id = ro.product_id
			WHERE ro.razilka_id='".$item['id']."'");
		$outputs = [];
		if($out_sql){
			while($out = mysqli_fetch_assoc($out_sql)){
				$outputs[] = [
					'id'           => intval($out['id']),
					'product_id'   => intval($out['product_id']),
					'product_name' => $asli->defilter($out['pname'] ?? $out['product_name']),
					'massa'        => floatval($out['massa']),
					'manzil'       => $out['manzil'],
					'vaqt'         => $out['vaqt'],
				];
			}
		}

		$ret[] = [
			'id'           => intval($item['id']),
			'product_id'   => intval($item['product_id']),
			'product_name' => $asli->defilter($product['name'] ?? $item['product_name']),
			'massa'        => floatval($item['massa']),
			'manba'        => $item['manba'],
			'status'       => $item['status'],
			'izoh'         => $item['izoh'],
			'vaqt'         => $item['vaqt'],
			'outputs'      => $outputs,
		];
	}

	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
	$asli->resp['data'] = $ret;
	$asli->print_json();
?>
