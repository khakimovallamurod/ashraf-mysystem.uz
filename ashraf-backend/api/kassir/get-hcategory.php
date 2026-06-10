<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin','kassir','sotuv','saqlash'];
	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$sql = $asli->delete('harajat_category',['id'=>$_GET['id']]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Xatolik malumot o'chirilmadi!"];
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$hcategory = $asli->getdata('harajat_category',['id'=>$_GET['id']]);
			$asli->resp['data'] = $hcategory;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$hcategory = $asli->getdatas('harajat_category',[],"1");
		$ret = [];
		$i = 0;
		foreach ($hcategory as $key => $value) {
			$ret[$i]['id'] = $value['id'];
			$ret[$i]['name'] = $asli->defilter($value['name']);
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>