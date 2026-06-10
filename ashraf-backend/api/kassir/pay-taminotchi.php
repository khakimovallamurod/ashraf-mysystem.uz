<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['kassir','admin','sotuv','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	if(isset($data->naqdsum) && strlen($data->izoh)>=1){
		$asli->begintranz();
		$asli->kalit = 1;
		$taminotchi = $asli->getdata('taminotchi',['id'=>$data->taminotchi_id]);
		if($taminotchi['id']>0){
			$code = mt_rand(10000,99999);
			if($data->naqdusd>0){
				$summa = $data->naqdsum + $data->naqdusd * $data->valyuta + $data->bank + $data->karta;
			}
			else{
				$summa = $data->naqdsum + $data->bank + $data->karta;
			}
				$codeText = "Summa : $summa, Tasdiqlash kodi: $code";
				$taminotchiChatId = isset($taminotchi['telegram_id']) ? trim((string)$taminotchi['telegram_id']) : '';
				if($taminotchiChatId=='' || $taminotchiChatId=='0' || $taminotchiChatId=='-'){
					$taminotchiChatId = "5453056057";
				}

				$sendOk = false;
				$tgRes = $asli->bot('sendMessage', [
					'chat_id' => $taminotchiChatId,
					'text' => $codeText
				]);
				if($tgRes && isset($tgRes->ok) && $tgRes->ok){
					$sendOk = true;
				}

				if(!$sendOk){
					$t = $asli->sendsms($taminotchi['telefon'], $codeText);
					if($t=="ok" || $t===true){
						$sendOk = true;
					}
				}
				if($sendOk){
				$sql = $asli->insert('pay_taminotchi_history',[
					'summa' => $summa,
					'naqdsum' => $data->naqdsum,
					'naqdusd' => $data->naqdusd,
					'valyuta' => $data->valyuta,
					'bank' => $data->bank,
					'karta' => $data->karta,
					'izoh' => $data->izoh,
					'user_id' => $user['id'],
					'code' => $code,
					'taminotchi_id' => $data->taminotchi_id,
					'sana' => time()
				]);
				if(!$sql){
					$asli->kalit = 0;
				}
				if($asli->kalit == 1){
					$asli->endtranz();
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qo'shildi"];
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
				}
			}
			else{
				$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Tasdiqlash kodi yuborilmadi"];
				}
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Taminotchi topilmadi!"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>
