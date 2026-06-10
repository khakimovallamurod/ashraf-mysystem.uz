<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET','DELETE','PUT'];
	$asli->allow_rolls = ['sklad','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$sql = $asli->delete('user',['id'=>$_GET['id']]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Xatolik malumot o'chirilmadi!"];
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$user = $asli->getdata('user',['id'=>$_GET['id']]);
			$asli->resp['data'] = $asli->sanitize_user($user);
		}
		if($method=="PUT"){
			if($data->changepass){
				$sql = $asli->update('user',[
					'login' => $data->login,
					'parol' => md5($data->parol),
					'rol' => $data->rol,
					'familya' => $data->familya,
					'ism' => $data->ism,
					'telefon' => $asli->filterphone($data->telefon)
				],['id'=>$data->id]);
			}
			else{
				$sql = $asli->update('user',[
					'login' => $data->login,
					'rol' => $data->rol,
					'familya' => $data->familya,
					'ism' => $data->ism,
					'telefon' => $asli->filterphone($data->telefon)
				],['id'=>$data->id]);
			}

			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'zgartirildi!"];
			$user = $asli->getdata('user',['id'=>$data->id]);
			$asli->resp['data'] = $asli->sanitize_user($user);
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$user = $asli->getdatas('user',['status'=>'aktiv']);
        $ret = [];
        foreach ($user as $item) {
            $ret[] = $asli->sanitize_user($item);
        }
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>
