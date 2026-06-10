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

		$zayavka = $asli->getdata('qaytam_partiya',['id'=>$_GET['id']]);
		$yuklovchi = $asli->getdata('user',['id'=>$zayavka['yuklovchi_id']]);

		$ret['id'] = $zayavka['id'];
		$ret['partiyanomer'] = $zayavka['nomer'];
		$ret['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
		$ret['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
		$ret['status'] = $zayavka['status'];
		$ret['izoh'] = $zayavka['izoh'];			
		$j = 0;
		$temp = [];
		$products = $asli->getdatas('qaytam_items',['qaytam_partiya_id'=>$zayavka['id']]);
		foreach ($products as $key => $product) {
			$pr = $asli->getdata('products',['id'=>$product['product_id']]);
			$temp[$j]['product_id'] = $pr['id'];
			$temp[$j]['product_name'] = $pr['name'];
			$temp[$j]['massa'] = $product['massa'];
			$temp[$j]['status'] = $product['status'];
			$j++;
		}
		$ret[$i]['product_list'] = $temp;

		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$zayavkalar = $asli->getdatas('qaytam_partiya',['status'=>'maydalashda'],"status='maydalashda' order by id DESC");
		foreach ($zayavkalar as $key => $zayavka) {
			$yuklovchi = $asli->getdata('user',['id'=>$zayavka['yuklovchi_id']]);
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['partiyanomer'] = $zayavka['nomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
			$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret[$i]['status'] = $zayavka['status'];
			$ret[$i]['izoh'] = $zayavka['izoh'];			
			$j = 0;
			$temp = [];
			$products = $asli->getdatas('qaytam_items',['qaytam_partiya_id'=>$zayavka['id']]);
			foreach ($products as $key => $product) {
				$pr = $asli->getdata('products',['id'=>$product['product_id']]);
				$temp[$j]['product_id'] = $pr['id'];
				$temp[$j]['product_name'] = $pr['name'];
				$temp[$j]['massa'] = $product['massa'];
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