<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['PUT'];
	$asli->allow_rolls = ['saqlash','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();
	$ret = [];
	if(isset($_GET['id'])){
		$krim = $asli->getdata('krimproducts',['id'=>$_GET['id']]);
		if($krim['id']>0){
			if($krim['status']=="new"){
				$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
				$n = $asli->countustun('krimproducts','id',['user_id'=>$user['id'],'status'=>'joylanmoqda']);
				if($n=="" || $n==0){
					$sql = $asli->update('krimproducts',[
						'status' => 'joylanmoqda',
						'user_id' => $user['id']
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