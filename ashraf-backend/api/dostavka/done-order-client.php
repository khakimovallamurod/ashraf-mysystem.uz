<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['dostavka','sotuv','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
																																																																																																																																																																																																																						
	$data = file_get_contents("php://input");
	$data = json_decode($data);

		if(isset($_GET['id'])){
			$autoConfirm = false;
			if(isset($data->auto_confirm)){
				$autoConfirm = ($data->auto_confirm===true || $data->auto_confirm==="true" || $data->auto_confirm===1 || $data->auto_confirm==="1");
			}

			$order = [];
		if($user['rol']=="dostavka"){
			$order = $asli->getdata('sale_orders',['id'=>$_GET['id'],'dostavka_id'=>$user['id']]);
		}
		else{
			$order = $asli->getdata('sale_orders',['id'=>$_GET['id']]);
		}

			if($order['id']>0){
				if($order['status']=="dostavka" || $order['status']=="tayyorlandi" || $order['status']=="topshirilmadi"){
				$asli->kalit = 1;
				$asli->begintranz();
				$client = $asli->getdata('clients',['id'=>$order['client_id']]);

				$naqd = isset($data->naqd) ? (float)$data->naqd : 0;
				$naqdusd = isset($data->naqdusd) ? (float)$data->naqdusd : 0;
				$valyuta = isset($data->valyuta) ? (float)$data->valyuta : 0;
				$plastik = isset($data->plastik) ? (float)$data->plastik : 0;
				$karta = isset($data->karta) ? (float)$data->karta : 0;
				$muddat = isset($data->muddat) ? strtotime($data->muddat) : 0;
				if($muddat<=time()){
					$muddat = time() + 86400;
				}
				if($muddat>time()+86400*25){
					$muddat = time()+86400*25;
				}

				if($naqdusd>0){
					$qarz = $order['summa'] - $naqd - $naqdusd * $valyuta - $plastik - $karta;
				}
				else{
					$qarz = $order['summa'] - $naqd - $plastik - $karta;
				}

				$code = mt_rand(10000,99999);
					$sql = $asli->update('sale_orders',[
						'naqd'=>$naqd,
						'naqdusd'=> $naqdusd,
						'valyuta'=> $valyuta,
						'plastik'=> $plastik,
						'karta'=> $karta,
						'muddat'=> $muddat,
						'qarz'=> $qarz,
						'confirm_code'=>$code
					],['id'=>$order['id']]);

					if($sql){
						$summa = $naqdusd * $valyuta + $naqd + $plastik + $karta;
						$q = $order['summa'] - $summa;
						$xabar = "Buyurtma summasi : ".$order['summa']." usm. ";
						$xabar .= "Avans : $summa usm. Qoldiq : $q usm. ";
						$smsText = $xabar."Tasdiqlash kodi : $code";
						
						if($autoConfirm){
							$sql = $asli->update('sale_orders',['status'=>"topshirildi",'endtime'=>time()],['id'=>$order['id']]);
							if($sql && $order['dostavka_id']>0){
								$dkrim = $asli->getdata('dostavka_krim',['dostavka_id'=>$order['dostavka_id']]);
								if($dkrim['id']>0){
									$sql = $asli->update('dostavka_krim',[
										'naqdsum' => $dkrim['naqdsum'] + $naqd,
										'naqdusd' => $dkrim['naqdusd'] + $naqdusd,
										'bank' => $dkrim['bank'] + $plastik,
										'karta' => $dkrim['karta'] + $karta
									],['dostavka_id' => $order['dostavka_id']]);
								}
								else{
									$sql = $asli->insert('dostavka_krim',[
										'dostavka_id' => $order['dostavka_id'],
										'naqdsum' => $naqd,
										'naqdusd' => $naqdusd,
										'bank' => $plastik,
										'karta' => $karta
									]);
								}
							}
						}

						if(!$sql){
							$asli->bekor();
							$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
							$asli->print_json();
							exit;
						}
						
						$asli->endtranz();

						$clientChatId = "0";
						if(isset($client['chat_id'])){
							$clientChatId = trim((string)$client['chat_id']);
						}

							$finalText = $smsText;
							if($autoConfirm){
								$finalText = $xabar."Buyurtma tasdiqlandi.";
							}
							$notifyPrefix = $autoConfirm ? "Mijozga xabar: " : "Mijoz tasdiqlash kodi: ";

							if($clientChatId!="" && $clientChatId!="0"){
								$asli->bot('sendMessage', [
									'chat_id' => $clientChatId,
									'text' => $finalText
								]);
							}
								else{
									$asli->bot('sendMessage', [
										'chat_id' => "5453056057",
										'text' => $notifyPrefix.$finalText
									]);
								}
						if($autoConfirm){
							$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli tasdiqlandi!"];
						}
						else{
							$asli->resp += ['success'=> true, 'message' => "Tasdiqlash kodi yuborildi"];
						}
					}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi"];
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Bu buyurtma tasdiqlash holatida emas!"];
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
