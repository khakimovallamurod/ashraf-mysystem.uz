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

	if(isset($_GET['id'])){
		$krim = $asli->getdata('zayavka_sotmay',['id'=>$_GET['id']]);
		if($krim['id']>0){
			if($krim['status']=="new"){
				$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
				$sql = $asli->update('zayavka_sotmay',[
					'status' => 'tayyorlanmoqda',
					'maydalovchi_id' => $user['id']
				],['id'=>$_GET['id']]);
				$sql2 = $asli->update('zayavka_sotmay_items',[
					'status' => 'tayyorlanmoqda'
				],['zayavka_sotmay_id'=>$_GET['id']]);
				if($sql && $sql2){
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qabul qilindi"];
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Bu buyurtma qabul qilingan!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Bunday buyurtma mavjud emas!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>