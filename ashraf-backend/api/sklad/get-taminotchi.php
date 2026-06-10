<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sklad','admin','saqlash','kassir'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$sql = $asli->delete('taminotchi',['id'=>$_GET['id']]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Xatolik malumot o'chirilmadi!"];
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$taminotchi = $asli->getdata('taminotchi',['id'=>$_GET['id']]);
			$asli->resp['data'] = $taminotchi;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$taminotchi = $asli->getdatas('taminotchi',[],"1");
		foreach ($taminotchi as $key => $f) {
			$taminotchi[$key]['fio'] = $asli->defilter($f['fio']);
		}
		$asli->resp['data'] = $taminotchi;
	}
	$asli->print_json();
?>