<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);


	if(isset($_GET['id'])){
		$method = $asli->get_method();
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$zayavkalar = $asli->getdatas('zayavka_dostavka',['qabul_id'=>$user['id']]);
		foreach ($zayavkalar as $key => $zayavka) {
			$user = $asli->getdata('user',['id'=>$zayavka['sender_id']]);
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['dostavchik'] = $user['familya']." ".$user['ism'];
			$ret[$i]['order_id'] = $zayavka['order_id'];
			$ret[$i]['yuborilgan_vaqt'] = $zayavka['sendtime'];
			$ret[$i]['status'] = $zayavka['status'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>