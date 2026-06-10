<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$products = $asli->getdatas('products',[],"1");
		$asli->begintranz();
		$asli->kalit = 1;
		$i = 0;
		foreach ($products as $key => $product){			
			$m = $asli->summaustun("putpolka",'massa',['product_id'=>$product['id']]);
			$sql = $asli->update('products',['soni'=>round($m,2)],['id'=>$product['id']]);
			if(!$sql){
				$asli->kalit = 0;
			}
			else{
				$i++;
			}
		}
		if($asli->kalit==1){
			$asli->endtranz();
			$asli->resp['data'] = "$i ta o'zgartirildi";
		}
		else{
			$asli->bekor();
			$asli->resp['data'] = "Tranzaktsiya yakunlanmadi";
		}
		
	}
	$asli->print_json();
?>