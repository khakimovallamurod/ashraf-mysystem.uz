<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['yuklovchi','maydalash','saqlash','admin'];

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
		$jamimassa = 0;
		$i = 0;
		if(isset($_GET['sana1']) and isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
		}
		else{
			$bugun = date("d.m.Y 00:00:00",time());
			$sana1 = strtotime($bugun);
			$sana2 = $sana1+86400;
		}
		$rol = $user['rol'];
		
		$pateryalar = $asli->getdatas('paterya_history',[],"bulim='$rol' AND sana>='$sana1' AND sana<'$sana2'");
		$temp = [];
		foreach ($pateryalar as $key => $paterya) {			
			if(isset($temp[$paterya['product_id']])){
				$index = $temp[$paterya['product_id']];
				$ret[$index]['massa'] += $paterya['massa'];
				$jamimassa += $paterya['massa'];
				$t = ['massa' => $paterya['massa'], 'izoh' => $paterya['izoh'], 'vaqt' => $paterya['vaqt']];
				array_push($ret[$index]['list'], $t);
				continue;
			}
			else{
				$temp[$paterya['product_id']] = $i;	
			}
			$product = $asli->getdata('products',['id'=>$paterya['product_id']]);			
			$ret[$i]['id'] = $paterya['id'];
			$ret[$i]['product_id'] = $paterya['product_id'];
			$ret[$i]['izoh'] = $asli->defilter($product['izoh']);
			$ret[$i]['product_name'] = $asli->defilter($product['name']);
			$ret[$i]['product_id'] = $paterya['product_id'];
			$ret[$i]['massa'] = round($paterya['massa'],2);
			$ret[$i]['vaqt'] = $paterya['vaqt'];
			$ret[$i]['list'] = [];
			$jamimassa += $paterya['massa'];
			$t = ['massa' => round($paterya['massa'],2), 'izoh' => $paterya['izoh'], 'vaqt' => $paterya['vaqt']];
			array_push($ret[$i]['list'], $t);
			$i++;
		}
		$ans['jamimassa'] = round($jamimassa,2);
		$ans['sana1'] = $sana1;
		$ans['sana2'] = $sana2;
		$ans['list'] = $ret;

		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>