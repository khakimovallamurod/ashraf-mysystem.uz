<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sklad','admin','sotuv','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);


	if(isset($_GET['id'])){		
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$products = $asli->getdata('products',['id'=>$_GET['id']]);
			$asli->resp['data'] = $products;			
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		
		
		$ret = [];
		$i = 0;
		$bugun = date("d.m.Y");
		$p = $asli->getdata('partiya',['kun'=>$bugun]);
		$jm = 0;
		$jami = $asli->summaustun('krimproducts','massa',['partiya_id'=>$p['id']]);
		$ans['jami_krim_mass'] = round($jami,2);
		$products = $asli->getdatas('products',[],"id>1");
		foreach ($products as $key => $product) {
			$m = $asli->summaustun('sale_order_items','soni',['product_id'=>$product['id'],'partiya_id'=>$p['id']]);
			$ret[$i]['id'] = intval($product['id']);
			$ret[$i]['article'] = $product['article'];
			$ret[$i]['barcode'] = $product['barcode'];
			$ret[$i]['name'] = $asli->defilter($product['name']);
			$ret[$i]['massa'] = round($m,2);
			if($product['id']==2){
				$jm += $ret[$i]['massa'];
			}			
			$i++;
		}
		$ans['svejiy'] = $ret;
		$ret = [];
		$i = 0;
		$jami = $asli->summaustun('xolodelnik','massa',[],"1");
		foreach ($products as $key => $product) {
			$m = $asli->summaustun('xolodelnik','massa',['product_id'=>$product['id']]);
			$ret[$i]['id'] = intval($product['id']);
			$ret[$i]['article'] = $product['article'];
			$ret[$i]['barcode'] = $product['barcode'];
			$ret[$i]['name'] = $asli->defilter($product['name']);
			$ret[$i]['massa'] = round($m,2);
			if($jami==0){
				$ret[$i]['foiz'] = 0;
			}
			else{
				$ret[$i]['foiz'] = round($m/$jami * 100,2);	
			}
			$i++;
		}
		$ans['xolodelnik'] = $ret;

		// Bugungi kirim (tirik tovuq) bo'yicha toza go'sht hisobi
		$today_kirim_live = $asli->summaustun('krimproducts', 'massa', ['partiya_id' => $p['id']]);
		$toza_gosht = $today_kirim_live * 0.77;
		
		$ans['umumiy_massa'] = round($today_kirim_live, 2);
		$ans['toza_gosht'] = round($toza_gosht, 2);
		$ans['gosh_foizi'] = 77; // Qoldirish (ixtiyoriy)

		// Eski foiz (qoldirish)
		$m = $asli->summaustun('xolodelnik_krim','massa',['product_id'=>16,'partiya_id'=>$p['id']]);
		$jm += $m;
		if($ans['jami_krim_mass']==0){
			$ans['foiz'] = 0;
		}
		else{
			$ans['foiz'] = round(round($jm/$ans['jami_krim_mass'],4)*100,2);
		}
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>