<?php	
	include_once '../header.php';

	include_once '../config.php';
	
	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['*'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	
	if($user['id']>0 && time()-$user['tokentime']<$asli->gettokentime()){
		$ip = $asli->get_client_ip();
		$asli->update('user',['tokentime'=>time()],['id'=>$user['id']]);
		$asli->update('block_list',[
			'attemps' => 0,
			'status' => 'unblocked'
		],['ip'=>$ip]);
		$asli->resp += ['success'=> true, 'message' => "Barchasi muvaffiqqiyatli"];
		unset($user['id']);
		unset($user['parol']);
		unset($user['tokentime']);
		$asli->resp['data'] = $user;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Xatolik!"];
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