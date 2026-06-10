<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['maydalash','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id']) || isset($_GET['bulim_id'])){
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$polkas = $asli->getdatas('polka',['bulim_id'=>3]);
		foreach ($polkas as $key => $polka) {
			$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);
			$n = $asli->summaustun('putpolka','massa',['status'=>'active','polka_id'=>$polka['id']]);
			$ret[$i]['id'] = $polka['id'];
			$ret[$i]['name'] = $polka['name'];
			$ret[$i]['bulim_name'] = $bulim['name'];
			$ret[$i]['bulim_id'] = $polka['bulim_id'];
			$ret[$i]['nagruzka'] = $n;
			$temp = [];
			$j = 0;
			$t = [];
			$t2 = [];
			$sbhistorys = $asli->getdatas('putpolka',['polka_id'=>$polka['id']]);
			foreach ($sbhistorys as $key => $sbhistory) {
				$product = $asli->getdata('products',['id'=>$sbhistory['product_id']]);
				if(!in_array($product['id'], $t)){
					array_push($t, $product['id']);
					$t2[$product['id']]['index'] = $j;
				}
				else{
					$in = $t2[$product['id']]['index'];
					$temp[$in]['massa'] += $sbhistory['massa'];
					continue;
				}
				$temp[$j]['id'] = $sbhistory['id'];
				$temp[$j]['product_id'] = $product['id'];
				$temp[$j]['product_name'] = $product['name'];
				$temp[$j]['pnomer'] = "P".$sbhistory['zayavka_msq_id'];
				$temp[$j]['qnomer'] = "Q".$sbhistory['qaytam_partiya_id'];
				$temp[$j]['vaqt'] = $sbhistory['vaqt'];
				$temp[$j]['massa'] = $sbhistory['massa'];
				$j++;
			}
			$ret[$i]['history_krim'] = $temp;
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>