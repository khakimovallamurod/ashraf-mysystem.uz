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
	
	if(isset($_GET['id']) and count($data->workers)>=0){
		$krim = $asli->getdata('zayavka_msq',['id'=>$_GET['id']]);
		if($krim['status']=="tayyorlandi"){
			$sql = $asli->update('zayavka_msq',[
				'status' => 'maydalashda',
				'workers' => json_encode($data->workers),
				'maydalash_begin' => time()
			],['id'=>$_GET['id']]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qabul qilindi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Bu buyurtmani saqlash tayyor qilmagan!"];
		}	
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>