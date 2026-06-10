<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['saqlash','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	if(isset($_GET['id'])){
		$krim = $asli->getdata('zayavka_msq',['id'=>$_GET['id']]);
		if($krim['id']>0){
			if($krim['status']=="new"){
				$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
				$n = $asli->countustun('zayavka_msq','id',['yuklovchi_id'=>$user['id'],'status'=>'tayyorlanmoqda']);
				if($n=="" || $n==0){
					$sql = $asli->update('zayavka_msq',[
						'status' => 'tayyorlanmoqda',
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
					$asli->resp += ['success'=> false, 'message' => "Sizda $n joylashtirish jarayonidagi buyurtma mavjud! Qabul qilish uchun avvalgi ishingizni tugating!"];
				}				
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Bu krim qabul qilingan!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Bunday krim mavjud emas!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>