<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	if(isset($_GET['id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		if(isset($_GET['sana1']) and isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			
			$orders = $asli->getdatas('sale_order_items',[],"sana>='$sana1' AND sana<'$sana2' ORDER BY id DESC");
		}
		else{
			$s = date("d.m.Y 00:00:00",time());
			$sana1 = strtotime($s);
			$sana2 = $sana1 + 86400;
			
			$orders = $asli->getdatas('sale_order_items',[],"sana>='$sana1' AND sana<'$sana2' ORDER BY id DESC");
		}
		$t = [];
		$t2 = [];
		foreach ($orders as $key => $item) {
			$product = $asli->getdata('products',['id'=>$item['product_id']]);
			if(!in_array($item['product_id'], $t)){
				array_push($t, $item['product_id']);
				$t2[$item['product_id']] = $i;
			}
			else{
				$in = $t2[$item['product_id']];
				$ret[$in]['massa'] += $item['soni'];
				continue;
			}
			$ret[$i]['product_id'] = $item['product_id'];
			$ret[$i]['product_name'] = $product['name'];			
			$ret[$i]['massa'] = $item['soni'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>