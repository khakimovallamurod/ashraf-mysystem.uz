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
				$n = $asli->summaustun('putpolka','massa',['polka_id'=>$polka['id']]);
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
		$polkas = $asli->getdatas('polka',[],"1"); //'bulim_id'=>2
		foreach ($polkas as $key => $polka) {
			$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);
			$n = $asli->summaustun('putpolka','massa',['polka_id'=>$polka['id']]);
			$ret[$i]['id'] = $polka['id'];
			$ret[$i]['name'] = $polka['name'];
			$ret[$i]['bulim_name'] = $bulim['name'];
			$ret[$i]['bulim_id'] = $polka['bulim_id'];
			$ret[$i]['nagruzka'] = round($n,2);			
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>