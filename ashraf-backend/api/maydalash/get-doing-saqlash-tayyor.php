<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['maydalash','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];

		$zayavka = $asli->getdata('zayavka_msq',['id'=>$_GET['id']]);
		$sotuvchi = $asli->getdata('user',['id'=>$zayavka['maydalovchi_id']]);
		$ret['id'] = $zayavka['id'];
		$ret['partiyanomer'] = $zayavka['nomer'];
		$ret['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
		$ret['sotuvchi'] = $sotuvchi['fio'];
		$ret['status'] = $zayavka['status'];
		$ret['massa'] = $zayavka['rmassa'];
		$j = 0;
		$temp = [];
		$products = $asli->getdatas('zayavka_sotmay_items',['zayavka_sotmay_id'=>$zayavka['reply_id']]);
		foreach ($products as $key => $product) {
			$pr = $asli->getdata('products',['id'=>$product['product_id']]);
			$temp[$j]['product_id'] = $pr['id'];
			$temp[$j]['product_name'] = $pr['name'];
			$temp[$j]['buyurtmamassa'] = $product['soni'];
			$temp[$j]['status'] = $product['status'];
			$j++;
		}
		$ret[$i]['product_list'] = $temp;

		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$zayavkalar = $asli->getdatas('zayavka_msq',['status'=>'maydalashda'],"1 ORDER BY id DESC LIMIT 250");
		$k = 0;
		foreach ($zayavkalar as $key => $zayavka) {
			$sotuvchi = $asli->getdata('user',['id'=>$zayavka['maydalovchi_id']]);
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['partiyanomer'] = $zayavka['pnomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
			$ret[$i]['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
			$ret[$i]['status'] = $zayavka['status'];
			$ret[$i]['massa'] = $zayavka['rmassa'];
			$j = 0;
			$jamimassa = 0;
			$temp = [];
			$t = [];
			$t2 = [];
			$products = $asli->getdatas('maydalash',['zayavka_msq_id'=>$zayavka['id']]);
			foreach ($products as $key2 => $product) {
				
				$pr = $asli->getdata('products',['id'=>$product['product_id']]);
				$pp = $asli->getdata('putpolka',['zayavka_msq_id'=>$product['zayavka_msq_id'],'product_id'=>$product['product_id']]);

				$yuklovchi = $asli->getdata('user',['id'=>$product['yuklovchi_id']]);
				
				$polka = $asli->getdata('polka',['id'=>$pp['polka_id']]);
				$jamimassa += round($product['massa'],2);
				
				if(!in_array($pr['id'], $t)){
					array_push($t, $pr['id']);
					$t2[$pr['id']] = $j;
				}
				else{
					$in = $t2[$pr['id']];
					$temp[$in]['massa'] += round($product['massa'],2);
					continue;
				}
				$temp[$j]['product_id'] = $product['id'];
				$temp[$j]['key'] = ++$k;
				$temp[$j]['product_id'] = $pr['id'];
				$temp[$j]['product_name'] = $pr['name'];
				$temp[$j]['massa'] = round($product['massa'],2);
				$temp[$j]['vaqt'] = $product['vaqt'];
				$temp[$j]['yuklovchi'] = $asli->defilter($yuklovchi['familya'])." ".$asli->defilter($yuklovchi['familya']);
				$j++;
			}
			$ret[$i]['maydalandi'] = round($jamimassa,2);
			$jm = $asli->summaustun('maydalash','massa',['zayavka_msq_id'=>$zayavka['id']]);
			if($zayavka['rmassa']>0){
				$ret[$i]['foiz'] = round($jm/$zayavka['rmassa'],2)*100;	
			}
			$ret[$i]['product_list'] = $temp;			
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>