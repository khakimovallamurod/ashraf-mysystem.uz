<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','maydalash','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	if(isset($_GET['polka_id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$pid = $asli->filter($_GET['polka_id']);
		$polkas = $asli->getdatas('putpolka',['polka_id'=>$_GET['polka_id']],"polka_id='$pid' AND massa>0");
		foreach ($polkas as $key => $polka) {
			if($polka['massa']==0){
				continue;
			}
			if(round($polka['massa'],2)==0){
				continue;
			}
			$product = $asli->getdata('products',['id'=>$polka['product_id']]);
			$partiya = $asli->getdata('zayavka_msq',['id'=>$polka['zayavka_msq_id']]);
			$qayta = $asli->getdata('qaytam_partiya',['id'=>$polka['qaytam_partiya_id']]);
			$vozvrat = $asli->getdata('vozvrat',['id'=>$polka['vozvrat_id']]);

			$ret[$i]['id'] = $polka['id'];
			$ret[$i]['product_id'] = $product['id'];
			$ret[$i]['product_name'] = $product['name'];
			if($polka['zayavka_msq_id']>0){
				$ret[$i]['partiyanomer'] = $partiya['pnomer'];				
			}
			else{
				if($polka['vozvrat_id']==0){
					$ret[$i]['partiyanomer'] = $qayta['nomer'];
				}
				else{
					$ret[$i]['partiyanomer'] = "V".$vozvrat['id'];
				}				
			}
			$ret[$i]['massa'] = round($polka['massa'],2);
			$ret[$i]['vaqt'] = $polka['vaqt'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>