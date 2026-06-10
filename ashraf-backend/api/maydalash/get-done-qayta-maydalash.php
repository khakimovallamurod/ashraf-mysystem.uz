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
		$zayavkalar = $asli->getdatas('qaytam_partiya',[],"1 ORDER BY id DESC LIMIT 150");
		foreach ($zayavkalar as $key => $zayavka) {
			$sotuvchi = $asli->getdata('user',['id'=>$zayavka['yuklovchi_id']]);
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['partiyanomer'] = $zayavka['nomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
			$ret[$i]['yuklovchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
			$ret[$i]['status'] = $zayavka['status'];			
			$j = 0;
			$jamimassa = 0;
			$temp = [];
			$products = $asli->getdatas('qaytamaydalash_items',['qaytam_partiya_id'=>$zayavka['id']]);
			foreach ($products as $key => $product) {
				$temp[$j]['product_id'] = $product['id'];
				$pr = $asli->getdata('products',['id'=>$product['product_id']]);
				$pp = $asli->getdata('putpolka',['qaytam_partiya_id'=>$product['qaytam_partiya_id'],'product_id'=>$product['product_id']]);
				$maydalovchi = $asli->getdata('user',['id'=>$product['yuklovchi_id']]);
				$polka = $asli->getdata('polka',['id'=>$pp['polka_id']]);
				$temp[$j]['product_id'] = $pr['id'];
				$temp[$j]['product_name'] = $pr['name'];
				$temp[$j]['polka_id'] = $polka['id'];
				$temp[$j]['polka_name'] = $polka['name'];
				$temp[$j]['massa'] = $product['massa'];
				$temp[$j]['status'] = $product['status'];
				$temp[$j]['vaqt'] = $product['vaqt'];
				$temp[$j]['maydalovchi'] = $asli->defilter($maydalovchi['familya'])." ".$asli->defilter($maydalovchi['familya']);
				$temp[$j]['yuklangan_vaqt'] = $pp['vaqt'];
				$jamimassa += $product['massa'];
				$j++;				
			}
			$jm = $asli->summaustun('qaytam_items','massa',['qaytam_partiya_id'=>$zayavka['id']]);
			$ret[$i]['massa'] = round($jm,2);
			$ret[$i]['maydalandi'] = $jamimassa;
			if($jm>0){
				$ret[$i]['foiz'] = round($jamimassa/$jm,2)*100;
			}
			else{
				$ret[$i]['foiz'] = round($jamimassa/0.001,2)*100;
			}
			$ret[$i]['product_list'] = $temp;
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>