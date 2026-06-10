<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$my = $asli->getdata('user',['token'=>$asli->getBearerToken()]);


	if(isset($_GET['id'])){
		$method = $asli->get_method();
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$users = $asli->getdatas('user',['rol'=>'dostavka']);
		foreach ($users as $key => $user) {
			if($user['id']==$my['id']){
				continue;
			}
			$ret[$i]['id'] = $user['id'];
			$ret[$i]['dostavchik'] = $user['familya']." ".$user['ism'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>