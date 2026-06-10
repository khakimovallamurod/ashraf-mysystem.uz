<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['kassir','admin','sotuv'];

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
		$cc = $asli->getdatas('client_category',[],"1");
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$products = $asli->getdatas('products',[],"id>1");
		$asli->resp['data'] = $products;
		$ret = [];
		$i = 0;
		foreach ($products as $key => $product) {
			$ret[$i]['id'] = $product['id'];
			$ret[$i]['article'] = $product['article'];
			$ret[$i]['barcode'] = $product['barcode'];
			$ret[$i]['name'] = $product['name'];
			$ret[$i]['soni'] = $product['soni'];
			$ret[$i]['price'] = $product['price'];
			$ret[$i]['category_id'] = $product['category_id'];
			$temp = [];
			$j = 0;
			foreach ($cc as $key2 => $c) {
				$prl = $asli->getdata('price_list',[
					'product_id' => $product['id'],
					'category_id' => $c['id']
				]);
				if($prl['id']>0){
					$temp[$j]['client_category_id'] = $prl['category_id'];
					$temp[$j]['price'] = $prl['price'];
				}
				$j++;
			}
			$ret[$i]['price_list'] = $temp;
			$i++;
		}
		$asli->resp['data'] = $ret;		
	}
	$asli->print_json();
?>