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

	if(isset($_GET['partiya_id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$zayavkalar = $asli->getdatas('zayavka_msq',['id'=>$_GET['partiya_id']]);
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
			
			$products = $asli->getdatas('maydalash',['zayavka_msq_id'=>$zayavka['id'],'product_id'=>$_GET['product_id']]);
			foreach ($products as $key2 => $product) {
				
				$pr = $asli->getdata('products',['id'=>$product['product_id']]);
				$yuklovchi = $asli->getdata('user',['id'=>$product['yuklovchi_id']]);
				$jamimassa += floatval($product['massa']);

				$temp[$j]['product_id'] = $product['id'];
				$temp[$j]['key'] = ++$k;
				$temp[$j]['product_id'] = $pr['id'];
				$temp[$j]['product_name'] = $pr['name'];
				$temp[$j]['massa'] = $product['massa'];
				$temp[$j]['status'] = $product['status'];
				$temp[$j]['vaqt'] = $product['vaqt'];
				$temp[$j]['yuklovchi'] = $asli->defilter($yuklovchi['familya'])." ".$asli->defilter($yuklovchi['familya']);
				$j++;
			}
			$ret[$i]['maydalandi'] = number_format($jamimassa,2);
			$ret[$i]['product_list'] = $temp;
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->response(403);
	}
	$asli->print_json()
?>