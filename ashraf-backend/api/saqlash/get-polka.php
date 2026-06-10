<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['saqlash','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$ret = [];
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
		$polkas = $asli->getdatas('polka',['bulim_id'=>1]);
		foreach ($polkas as $key => $polka) {
			$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);
			$n = $asli->summaustun('saqlash_bulimi','qoldi',['status'=>'joylandi','polka_id'=>$polka['id']]);
			$ret[$i]['id'] = $polka['id'];
			$ret[$i]['name'] = $polka['name'];
			$ret[$i]['bulim_name'] = $bulim['name'];
			$ret[$i]['bulim_id'] = $polka['bulim_id'];
			$ret[$i]['nagruzka'] = round($n,2);
			$temp = [];
			$j = 0;
			$sbhistorys = $asli->getdatas('saqlash_bulimi',[],"status='joylandi' AND polka_id='".$polka['id']."' ORDER BY vaqt ASC");
			foreach ($sbhistorys as $key => $sbhistory) {
				$temp[$j]['id'] = $sbhistory['id'];
				$temp[$j]['pnomer'] = "K".$sbhistory['partiya_id'];
				$temp[$j]['vaqt'] = $sbhistory['vaqt'];
				$temp[$j]['massa'] = $sbhistory['massa'];
				$temp[$j]['qoldi'] = $sbhistory['qoldi'];
				$j++;
			}
			$ret[$i]['history_krim'] = $temp;
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>