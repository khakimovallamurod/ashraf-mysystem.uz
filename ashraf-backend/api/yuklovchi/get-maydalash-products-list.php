<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$zayavkalar = $asli->getdatas('maydalash',['id'=>$_GET['id']]);
		foreach ($zayavkalar as $key => $zayavka) {
			$yuklovchi = $asli->getdata('user',['id'=>$zayavka['yuklovchi_id']]);
			$product = $asli->getdata('products',['id'=>$zayavka['product_id']]);

			$ret['id'] = $zayavka['id'];
			$ret['product_name'] = $product['name'];
			$ret['massa'] = $zayavka['massa'];
			$ret['sana'] = $zayavka['sana'];
			$ret['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret['status'] = $zayavka['status'];
		}
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$zayavkalar = $asli->getdatas('maydalash',['status'=>'new']);
		foreach ($zayavkalar as $key => $zayavka) {
			$yuklovchi = $asli->getdata('user',['id'=>$zayavka['yuklovchi_id']]);
			$product = $asli->getdata('products',['id'=>$zayavka['product_id']]);

			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['product_name'] = $product['name'];
			$ret[$i]['massa'] = $zayavka['massa'];
			$ret[$i]['sana'] = $zayavka['sana'];
			$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret[$i]['status'] = $zayavka['status'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>