<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['admin','sotuv','agent','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

		$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
		$isResponseSent = false;

	if(isset($data->client_id) && count($data->product_list)>0 ){
		if(!isset($data->alohida)){
			$data->alohida = false;
		}
		$client = $asli->getdata('clients',['id'=>$data->client_id]);

		$bugun = date("d.m.Y");
		$p = $asli->getdata('partiya',['kun'=>$bugun]);
		if($data->isXolodelnik==true){
			$p_id = 0;
		}
		else{
			$p_id = $p['id'];
		}
		if($client['id']>0){
			$asli->begintranz();
			$asli->kalit = 1;
			$sana = time();
			$client_id = $asli->filter($data->client_id);
			
			if($data->naqd>=0){
				$naqdsum = $data->naqd;
			}
			else{
				$naqdsum = 0;
			}
			if($data->naqdusd>=0){
				$naqdusd = $data->naqdusd;	
			}
			else{
				$naqdusd = 0;
			}
			if($data->valyuta>=0){
				$valyuta = $data->valyuta;
			}
			else{
				$valyuta = 0;
			}
			if($data->plastik>=0){
				$bank = $data->plastik;
			}
			else{
				$bank = 0;
			}
			if($data->karta>=0){
				$karta = $data->karta;
			}
			else{
				$karta = 0;
			}

			$tolov = $naqdsum + $naqdusd * $valyuta + $bank + $karta;

			if($tolov>0){
				$sql = $asli->insert('debithistory',[
					'summa' => $tolov,
					'naqdsum' => $naqdsum,
					'naqdusd' => $naqdusd,
					'valyuta' => $valyuta,
					'bank' => $bank,
					'karta' => $karta,
					'sana' => time(),
					'dostavka_id' => $user['id'],
					'client_id' => $client['id']
				]);
				if(!$sql){
					$asli->kalit = 0;
				}

				$balans = $asli->getdata('balans',['id'=>1]);
				$sql = $asli->update('balans',[
					'naqdsum' => $balans['naqdsum'] + $naqdsum,
					'naqdusd' => $balans['naqdusd'] + $naqdusd,
					'bank' => $balans['bank'] + $bank,
					'karta' => $balans['karta'] + $karta
				],['id'=>1]);
				if(!$sql){
					$asli->kalit = 0;
				}
			}

			// qarz boshlang'ich qiymati (keyinchalik qayta hisoblanadi)
			$qarz = 0;

			$order = $asli->getdata('sale_orders',[],"client_id='$client_id' AND (status='new' OR status='tayyorlanmoqda')");
			if($order['id']>0){
				$sql = true;
			}
			else{
				$isXolodelnik = isset($data->isXolodelnik) ? $data->isXolodelnik : false;
				$sql = $asli->insert('sale_orders',[
					'summa' => isset($data->summa) ? $data->summa : 0,
					'naqd' => isset($data->naqd) ? $data->naqd : 0,
					'naqdusd' => isset($data->naqdusd) ? $data->naqdusd : 0,
					'plastik' => isset($data->plastik) ? $data->plastik : 0,
					'karta' => isset($data->karta) ? $data->karta : 0,
					'valyuta' => isset($data->valyuta) ? $data->valyuta : 0,
					'qarz' => 0,
					'client_id' => $data->client_id,
					'agent_id' => 0,
					'dostavka_id' => 0,
					'yuklovchi_id' => 0,
					'confirm_code' => 0,
					'code' => 0,
					'izoh' => isset($data->izoh) ? $data->izoh : '',
					'sana' => $sana,
					'muddat' => isset($data->muddat) && $data->muddat ? strtotime($data->muddat) : 0,
					'muddat_temp' => 0,
						'status' => 'topshirilmadi',
					'sotuvchi_id' => $user['id'],
					'old_client_balans' => $client['balans'],
					'partiya_id' => $p_id,
					'xolodelnik' => $isXolodelnik ? 'xolodelnik' : 'svejiy'
				]);
				$order = $asli->getdata('sale_orders',['sana'=>$sana, 'client_id'=>$data->client_id]);
			}

			if($sql && $order['id']>0){				
				if($order['id']>0){
					$summa = 0;
					$tx = "";
					$products = $data->product_list;
					$nn = count($data->product_list);
					$k = 0;
					foreach ($products as $key => $product) {
						$k++;
						if($product->isXolodelnik==true){							
							$p_id = 0;
						}
						else{
							$p_id = $p['id'];
						}
						if($k==$nn){
							$tx .= $product->massa."x".$product->price."=";
						}
						else{
							$tx .= $product->massa."x".$product->price."+";	
						}
						$sql = $asli->insert('sale_order_items',[
							'sale_order_id' => $order['id'],
							'product_id' => $product->product_id,
							'article' => $product->article,
							'summa' => $product->price * $product->massa,
							'soni' => $product->massa,
							'tayyorlandi' => $product->massa,
							'price' => $product->price,
							'sana' => $sana,
							'agent_id' => 0,
							'dostavka_id' => 0,
							'sotuvchi_id' => $user['id'],
							'yuklovchi_id' => 0,
							'partiya_id' => $p_id,
								'status' => 'topshirilmadi'
						]);
						// 
						$summa += $product->price * $product->massa;						
						if(!$sql){
							$asli->kalit = 0;
						}
						if($data->isXolodelnik==true || $product->isXolodelnik==true){
							$xol = $asli->getdata('xolodelnik',[
								'product_id' => $product->product_id
							]);
							$sql = $asli->update('xolodelnik',[
								'massa' => $xol['massa'] - $product->massa
							],['id'=>$xol['id']]);
							if(!$sql){
								$asli->kalit = 0;
							}
							if($xol['massa']<=$product->massa){
								$asli->kalit = 15;
							}
						}
					}
					$tx .= $summa;
					$qarz = $summa - $tolov;

					$sql = $asli->update('sale_orders',['summa'=>$summa,'tolov'=>$tolov,'qarz'=>$qarz],['id'=>$order['id']]);

					if(!$sql){
						$asli->kalit = 0;
					}
					$sql = $asli->update('clients',['balans'=>$client['balans']+$qarz],['id'=>$client['id']]);
					if(!$sql){
						$asli->kalit = 0;
					}

						if($asli->kalit == 1){
							$asli->endtranz();
							$q = $client['balans'] + $qarz;
							$smsText = $tx." sum yuk berildi. Hisobingizga muvaffiqqiyatli $tolov sum krim qilindi. Qolgan summa : $q sum";
							$asli->resp += ['success'=> true, 'message' => "Barchasi muvaffiqqiyatli saqlandi"];

							// Javobni tez qaytarish: xabar jo'natish foydalanuvchini kutdirib qo'ymasligi kerak.
							if(function_exists('fastcgi_finish_request')){
								$asli->print_json();
								$isResponseSent = true;
								fastcgi_finish_request();
								$asli->sendsms($client['telefon'], $smsText);
								exit;
							}

							// fastcgi bo'lmagan muhit uchun ham kechikishni kamaytirish:
							// 2 ta alohida yuborish o'rniga bitta xabar yuboramiz.
							$asli->sendsms($client['telefon'], $smsText);
						}
					else{
						$asli->bekor();
						if($asli->kalit == 15){
							$asli->resp += ['success'=> false, 'message' => "xolodelnikda massa yetarli emas!"];
						}
						else{
							$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi!"];
						}
					}
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Buyurtma yozilmadi!"];	
				}
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Buyurtma yozilmadi!"];	
			}
		}
		else{
			$asli->resp += ['success'=> false, 'message' => "Kechirasiz mijoz topilmadi!"];
		}
	}
	else{
		$asli->response(403);
	}
		if(!$isResponseSent){
			$asli->print_json();
		}
	?>
