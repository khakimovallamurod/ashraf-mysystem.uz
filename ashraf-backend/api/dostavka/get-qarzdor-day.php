<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	$s = date("d.m.Y 00:00:00",time());
	$sana1 = strtotime($s);
	$sana2 = $sana1 + 86400;

	$list = $asli->getdatas('sale_orders',[],"muddat>='$sana1' AND muddat<'$sana2'");

	if($n!=0){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli!"];
		$ret = [];
		$i = 0;
		foreach ($list as $key => $value) {
			$client = $asli->getdata('clients',['id'=>$value['client_id']]);
			$ret[$i]['client_id'] = $client['id'];
			$ret[$i]['client_telefon'] = $client['telefon'];
			$ret[$i]['client_name'] = $asli->defilter($client['fio']);
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda savdo bo'limdan so'rov mavjud emas!"];
	}
	$asli->print_json();
?>