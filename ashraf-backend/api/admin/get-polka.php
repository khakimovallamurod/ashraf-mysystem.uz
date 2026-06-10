<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['admin', 'sotuv'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id']) or isset($_GET['bulim_id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$sql = $asli->delete('polka',['id'=>$_GET['id']]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Xatolik malumot o'chirilmadi!"];
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			if(isset($_GET['id'])){				
				$polka = $asli->getdata('polka',['id'=>$_GET['id']]);
				$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);			
				$ret['id'] = $polka['id'];
				$ret['name'] = $polka['name'];
				$ret['bulim_name'] = $bulim['name'];
				$ret['bulim_id'] = $polka['bulim_id'];
				$asli->resp['data'] = $ret;
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
				$asli->resp['data'] = $ret;
			}
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$polkas = $asli->getdatas('polka',[],"1");
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
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>