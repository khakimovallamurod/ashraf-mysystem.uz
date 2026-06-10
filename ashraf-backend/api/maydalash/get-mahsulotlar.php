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
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if(isset($_GET['id'])){
			$polka = $asli->getdata('polka',['id'=>$_GET['id']]);
			$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);			
			$ret['id'] = $polka['id'];
			$ret['name'] = $polka['name'];
			$ret['bulim_name'] = $bulim['name'];
			$ret['bulim_id'] = $polka['bulim_id'];
		}
		if(isset($_GET['bulim_id'])){
			$i = 0;
			$polkas = $asli->getdatas('polka',['bulim_id'=>$_GET['bulim_id']]);
			foreach ($polkas as $key => $polka) {
				$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);
				$n = $asli->summaustun('saqlash_bulimi','qoldi',['status'=>'progres','polka_id'=>$polka['id']]);
				$ret[$i]['id'] = $polka['id'];
				$ret[$i]['name'] = $polka['name'];
				$ret[$i]['bulim_name'] = $bulim['name'];
				$ret[$i]['bulim_id'] = $polka['bulim_id'];
				$ret[$i]['nagruzka'] = $n;
				$i++;
			}
		}
		$asli->resp['data'] = $ret;
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
			$pid = $polka['id'];
			$sbhistorys = $asli->getdatas('putpolka',['polka_id'=>$polka['id']],"polka_id='$pid' AND massa>0");
			foreach ($sbhistorys as $key => $sbhistory) {
				if($sbhistory['massa']==0){
					continue;
				}
				$product = $asli->getdata('products',['id'=>$sbhistory['product_id']]);
				$temp[$j]['id'] = $sbhistory['id'];
				$temp[$j]['product_id'] = $product['id'];
				$temp[$j]['polka_id'] = $sbhistory['polka_id'];
				$temp[$j]['product_name'] = $product['name'];
				
				if($sbhistory['zayavka_msq_id']>0){
					$temp[$j]['pnomer'] = "P".$sbhistory['zayavka_msq_id'];
				}
				else{
					if($sbhistory['qaytam_partiya_id']==0){
						$temp[$j]['pnomer'] = "V".$sbhistory['vozvrat_id'];
					}
					else{
						$temp[$j]['pnomer'] = "Qm".$sbhistory['qaytam_partiya_id'];		
					}					
				}				
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