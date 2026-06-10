<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['kassir','admin','sotuv','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->taminotchi_id) && isset($data->code)){
		$taminotchi_id = $asli->filter($data->taminotchi_id);
		$code = $asli->filter($data->code);
		
		$pay = $asli->getdata('pay_taminotchi_history',[],"taminotchi_id='$taminotchi_id' ORDER BY id DESC");

		if($pay['status']=="nochecked" && $pay['code']==$data->code){
			$asli->begintranz();
			$asli->kalit = 1;
			$taminotchi = $asli->getdata('taminotchi',['id'=>$taminotchi_id]);
			if($taminotchi['id']>0){
				$sql = $asli->update('taminotchi',[
					'balans' => $taminotchi['balans']-$pay['summa']
				],['id'=>$taminotchi_id]);
				if(!$sql){
					$asli->kalit = 0;
				}
				$sql = $asli->update('pay_taminotchi_history',[
					'status' => 'checked'
				],['id'=>$pay['id']]);
				if(!$sql){
					$asli->kalit = 0;
				}
				$b = $taminotchi['balans']-$pay['summa'];
				$send = $asli->sendsms($taminotchi['telefon'],"Muvaffaqqiyatli tasdiqlandi. Qoldiq balans : ".$b);
				
				$balans = $asli->getdata('balans',['id'=>1]);
				$sql = $asli->update('balans',[
					'naqdsum' => $balans['naqdsum'] - $pay['naqdsum'],
					'naqdusd' => $balans['naqdusd'] - $pay['naqdusd'],
					'bank' => $balans['bank'] - $pay['bank'],
					'karta' => $balans['karta'] - $pay['karta']
				],['id'=>1]);
				if(!$sql){
					$asli->kalit = 0;
				}
				if($asli->kalit==1){
					$asli->endtranz();
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli tasdiqlandi!"];
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
				}
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Taminotchi topilmadi!"];
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Tasdiqlash kodi xato! Yoki bu buyurtma allaqachon tugatilgan!"];
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>