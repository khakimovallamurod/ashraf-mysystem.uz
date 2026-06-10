<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['sklad','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['login'=>$data->login,'parol'=>md5($data->parol)]);
	if($user['id']>0){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$user['token'] = md5(time().uniqid());
		$ip = $asli->get_client_ip();
		$asli->update('user',['token'=>$user['token']],['id'=>$user['id']]);
		$asli->update('block_list',[
			'attemps' => 0,
			'status' => 'unblocked'
		],['ip'=>$ip]);
		$asli->resp['data'] = $user;
	}
	else{
		$ret += ['xatolik'=> 1, 'xabar' => "Login yoki parol xato!"];
		$ip = $asli->get_client_ip();
		$data = $asli->getdata('block_list',['ip'=>$ip]);
		if($data['id']>0){
			$attemp = $data['attemps'] + 1;
			if($attemp>10){
				$status = 'blocked';
			}
			else{
				$status = 'unblocked';
			}
			$asli->update('block_list',[
				'attemps' => $attemp,
				'status' => $status
			],['ip'=>$ip]);
		}
		else{
			$asli->insert('block_list',[
				'ip' => $ip,
				'attemps' => 1
			]);
		}
	}
	$asli->print_json();
?>