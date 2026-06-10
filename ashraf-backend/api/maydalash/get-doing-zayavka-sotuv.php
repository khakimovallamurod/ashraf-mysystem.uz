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

		$zayavka = $asli->getdata('zayavka_sotmay',['id'=>$_GET['id']]);
		$sotuvchi = $asli->getdata('user',['id'=>$zayavka['maydalovchi_id']]);
		$ret['id'] = $zayavka['id'];
		$ret['partiyanomer'] = $zayavka['nomer'];
		$ret['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
		$ret['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
		$ret['status'] = $zayavka['status'];
		$ret[$i]['izoh'] = $zayavka['izoh'];
		$j = 0;
		$temp = [];
		$products = $asli->getdatas('zayavka_sotmay_items',['zayavka_sotmay_id'=>$zayavka['id']]);
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
		$zayavkalar = $asli->getdatas('zayavka_sotmay',['status'=>'tayyorlanmoqda'],"1 ORDER BY id DESC LIMIT 150");
		foreach ($zayavkalar as $key => $zayavka) {
			$sotuvchi = $asli->getdata('user',['id'=>$zayavka['sotuvchi_id']]);
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['partiyanomer'] = $zayavka['nomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
			$ret[$i]['sotuvchi'] = $sotuvchi['familya']." ".$sotuvchi['ism'];
			$ret[$i]['status'] = $zayavka['status'];
			$ret[$i]['izoh'] = $zayavka['izoh'];			
			$j = 0;
			$temp = [];
			$products = $asli->getdatas('zayavka_sotmay_items',['zayavka_sotmay_id'=>$zayavka['id']]);
			foreach ($products as $key => $product) {
				$pr = $asli->getdata('products',['id'=>$product['product_id']]);
				$temp[$j]['product_id'] = $product['id'];
				$temp[$j]['product_name'] = $pr['name'];
				$temp[$j]['buyurtmamassa'] = $product['soni'];
				$temp[$j]['status'] = $product['status'];
				$j++;
			}
			$ret[$i]['product_list'] = $temp;
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>