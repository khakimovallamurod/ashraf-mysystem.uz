<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$products = $asli->getdatas('products',[],"1");

	if(count($products)>0){
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		$j = 0;
		$zmsq = $asli->getdatas('zayavka_msq',[],"sana>='$sana1' AND sana<'$sana2'");
		foreach ($zmsq as $key => $zm) {
			$price = round( ($zm['summa'] + $zm['rmassa'] * 500) / $zm['rmassa'],2);
			$maydalash = $asli->getdatas('maydalash',['zayavka_msq_id'=>$zm['id']]);
			$items = [];
			$jm = 0;
			foreach ($maydalash as $key2 => $m) {
				$items[$m['product_id']] += $m['massa'];
				$jm += $m['massa'];
			}
			$ans = [];
			$vsumma = 0;
			$i = 0;			
			foreach ($items as $product_id => $massa) {
				$pr = $asli->getdata('products',['id'=>$product_id]);
				$ans[$i]['id'] = $product_id;
				$ans[$i]['product_name'] = $asli->defilter($pr['name']);
				$ans[$i]['massa'] = $massa;
				$ans[$i]['tannarx'] = round($price * $pr['pr_koef'],2);
				$vsumma += $massa * $ans[$i]['tannarx'];
				$i++;
			}
			$ret[$j]['id'] = $zm['id'];
			$ret[$j]['partiya'] = $zm['pnomer'];
			$ret[$j]['sana'] = date("d.m.Y",$zm['sana']);
			$ret[$j]['massa'] = round($zm['rmassa'],2);
			$ret[$j]['maydalandi'] = round($jm,2);
			$ret[$j]['price'] = $price;
			$ret[$j]['summa'] = round($zm['summa'],2);
			$ret[$j]['v_summa'] = round($vsumma,2);
			$ret[$j]['list'] = $ans;
			$j++;
		}
		$asli->resp += ['success'=> true, 'message' => "Kassaga topshirilishi lozim pullar"];
		
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda sizda balans mavjud emas!"];
	}
	$asli->print_json();
?>