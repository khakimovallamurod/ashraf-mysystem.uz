<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','admin'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if ($method=="GET") {
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$i = 0;
			$vozvratlar = $asli->getdatas('vozvrat',['id'=>$_GET['id']]);
			foreach ($vozvratlar as $key => $vozvrat) {			
				$client = $asli->getdata('clients',['id'=>$vozvrat['client_id']]);
				$product = $asli->getdata('products',['id'=>$vozvrat['product_id']]);

				$ret[$i]['id'] = $vozvrat['id'];
				$ret[$i]['client'] = $client;
				$ret[$i]['sana'] = $vozvrat['sana'];			
				$ret[$i]['status'] = $vozvrat['status'];
				$ret[$i]['holat'] = $vozvrat['holat'];
				$ret[$i]['vaqt'] = $vozvrat['vaqt'];
				$ret[$i]['product'] = $product['name'];
				$ret[$i]['massa'] = $vozvrat['massa'];
				$ret[$i]['narx'] = $vozvrat['price'];
				$ret[$i]['summa'] = $vozvrat['summa'];
				$i++;
			}
			$asli->resp['data'] = $ret;
		}
		if ($method=="PUT") {
			$vozvrat = $asli->getdata('vozvrat',['id'=>$_GET['id']]);
			if($vozvrat['id']>0){
				if($vozvrat['status']=='new'){
					$sql = $asli->update('vozvrat',['status'=>'confirmed'],['id'=>$vozvrat['id']]);
					if(!$sql){
						$asli->kalit = 0;
					}
					if($asli->kalit == 1){
						$asli->endtranz();
						// sms
						$asli->sendsms($client['telefon'],"Vozvrt bekor qilindi.");
						$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
					}
					else{
						$asli->bekor();
						$asli->resp += ['success'=> false, 'message' => "Xatolik! Tranzaktsiya yakunlanmadi!"];
					}
					
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "Allaqachon tasdiqlangan!"];
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Topilmadi"];
			}
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		if(isset($_GET['sana1']) && isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$vozvratlar = $asli->getdatas('vozvrat',[],"sana>='$sana1' AND sana<'$sana2' ORDER BY id DESC");
		}
		else{
			$vozvratlar = $asli->getdatas('vozvrat',[],"status='new' ORDER BY id DESC");
		}
		$jamivozvrat = 0;
		$jamipaterya = 0;
		$jamisummavozvrat = 0;
		$jamisummapaterya = 0;
		foreach ($vozvratlar as $key => $vozvrat) {			
			$client = $asli->getdata('clients',['id'=>$vozvrat['client_id']]);
			$client['fio'] = $asli->defilter($client['fio']);
			$product = $asli->getdata('products',['id'=>$vozvrat['product_id']]);
			$dostavka = $asli->getdata('user',['id'=>$vozvrat['dostavka_id']]);
			$ret[$i]['id'] = $vozvrat['id'];
			$ret[$i]['client'] = $client;
			$ret[$i]['sana'] = $vozvrat['sana'];			
			$ret[$i]['status'] = $vozvrat['status'];
			$ret[$i]['holat'] = $vozvrat['holat'];
			if($vozvrat['holat']=="vozvrat"){
				$jamivozvrat += $vozvrat['massa'];
				$jamisummavozvrat += $vozvrat['summa'];
			}
			else{
				$jamipaterya += $vozvrat['massa'];
				$jamisummapaterya += $vozvrat['summa'];
			}
			$ret[$i]['dostavchik'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
			$ret[$i]['vaqt'] = $vozvrat['vaqt'];
			$ret[$i]['product'] = $product['name'];
			$ret[$i]['massa'] = $vozvrat['massa'];
			$ret[$i]['narx'] = $vozvrat['price'];
			$ret[$i]['summa'] = $vozvrat['summa'];
			$i++;
		}
		$ans['jamivozvrat'] = $jamivozvrat;
		$ans['jamipaterya'] = $jamipaterya;
		$ans['jamisummavozvrat'] = $jamisummavozvrat;
		$ans['jamisummapaterya'] = $jamisummapaterya;
		$ans['list'] = $ret;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json()
?>