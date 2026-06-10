<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['kassir','admin','sotuv'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0; //'rol'=>'dostavka'
		$jaminaqd = 0;
		$jamiusd = 0;
		$jamibank = 0;
		$jamikarta = 0;
		$users = $asli->getdatas('user',[],"rol='dostavka' OR rol='sotuv' OR rol='admin'");
		foreach ($users as $key => $user) {
			$balans = $asli->getdata('dostavka_krim',['dostavka_id'=>$user['id']]);
			$ret[$i]['id'] = $user['id'];
			$ret[$i]['dostavchik'] = $user['familya']." ".$user['ism'];
			$ret[$i]['naqdsum'] = $balans['naqdsum'];
			$ret[$i]['naqdusd'] = $balans['naqdusd'];
			$ret[$i]['bank'] = $balans['bank'];
			$ret[$i]['karta'] = $balans['karta'];
			$jaminaqd += $balans['naqdsum'];
			$jamiusd += $balans['naqdusd'];
			$jamibank += $balans['bank'];
			$jamikarta += $balans['karta'];
			$i++;
		}
		$ans['list'] = $ret;
		$ans['jaminaqd'] = $jaminaqd;
		$ans['jamiusd'] = $jamiusd;
		$ans['jamibank'] = $jamibank;
		$ans['jamikarta'] = $jamikarta;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>