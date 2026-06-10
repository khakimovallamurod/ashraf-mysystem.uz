<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['yuklovchi','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	if(isset($_GET['id'])){
		$maydlash = $asli->getdata('qaytamaydalash_items',['id'=>$_GET['id']]);
		if($maydlash['id']>0){
			if($maydlash['status']=="new"){
				$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

				$sql = $asli->update('qaytamaydalash_items',[
					'status' => 'joylanmoqda',
					'yuklovchi_id' => $user['id']
				],['id'=>$_GET['id']]);

				if($sql){
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qabul qilindi"];
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Bu so'rov qabul qilingan!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Bunday mahsulot maydalashdan chiqgan emas!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>