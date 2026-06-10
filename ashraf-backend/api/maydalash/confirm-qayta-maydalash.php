<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['maydalash','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();


	$data = file_get_contents("php://input");
	$data = json_decode($data);
	
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($_GET['id']) and count($data->workers)>=0){
		
		$asli->kalit = 1;
		$krim = $asli->getdata('qaytam_partiya',['id'=>$_GET['id']]);
		if($krim['status']=="new"){
			$asli->begintranz();
			$sql = $asli->update('qaytam_partiya',[
				'status' => 'maydalashda',
				'workers' => json_encode($data->workers),
				'beginvaqt' => time(),
				'maydalovchi_id' => $user['id']
			],['id'=>$_GET['id']]);

			if(!$sql){
				$asli->kalit = 0;
			}
			$sql = $asli->update('qaytam_items',[
				'status' => 'maydalashda'
			],['qaytam_partiya_id'=>$_GET['id']]);
			if(!$sql){
				$asli->kalit = 0;
			}
			if($asli->kalit == 1){
				$asli->endtranz();
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qabul qilindi"];
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
			}
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Bu buyurtmani saqlash tayyor qilmagan!"];
		}	
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>