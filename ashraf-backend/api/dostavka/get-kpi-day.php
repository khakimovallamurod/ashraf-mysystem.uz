<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['dostavka','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);

	if(isset($_GET['sana1']) && isset($_GET['sana2'])){
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		/*==============================================*/
		$clients = $asli->getdatas('clients',['dostavka_id'=>$user['id']]);
		$jamichiqim = 0;
		$jamikrim = 0;
		foreach ($clients as $key => $client) {
			$client_id = $client['id'];
			$s = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$x = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jamichiqim += $s;
			$jamikrim += $x;
		}
		$foiz = round($jamikrim/$jamichiqim,2)*100;
		if($foiz>=100){
			$plan = 10 + $foiz - 100;
		}
		else{
			if($foiz>90){
				$plan = $foiz-90;
			}
			else{
				$plan = 0;
			}
		}
		$bonus = 2000000 / 10;
		/*==============================================*/
		$fee = 5000000 / 27;
		$damkun = 0;
		$salary = 0;
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$j = 0;
		$ans = [];
		$t = 0;
		while($sana1<$sana2){			
			$dostavka_id = $user['id'];
			$orders = [];
			$i = 0;
			$s2 = $sana1 + 86400;
			$sales = $asli->getdatas('sale_orders',[],"dostavka_id='$dostavka_id' AND sana>='$sana1' AND sana<'$s2'");
			foreach ($sales as $key => $sale) {
				$client = $asli->getdata('clients',['id'=>$sale['client_id']]);
				$dostavka = $asli->getdata('user',['id'=>$sale['dostavka_id']]);
				$orders[$i]['id'] = $sale['id'];
				$orders[$i]['mijoz'] = $asli->defilter($client['fio']);
				$orders[$i]['summa'] = $sale['summa'];
				$orders[$i]['dostavchik'] = $asli->defilter($dostavka['familya'])." ".$asli->defilter($dostavka['ism']);
				$orders[$i]['status'] = $sale['status'];
				$orders[$i]['dostavka_id'] = $sale['dostavka_id'];
				$orders[$i]['sana'] = date("d.m.Y H:i:s",$sale['sana']);
				$i++;
			}
			$ans[$j]['id'] = ++$t;
			$ans[$j]['kun'] = date("d.m.Y", $sana1);
			$ans[$j]['bajarilgan_buyurtma'] = $i;
			if($i<10){
				if($i>0){
					$ans[$j]['kunlik_maosh'] = round($fee/2,2);
					$salary += $ans[$j]['kunlik_maosh'];					
				}
				else{
					$ans[$j]['kunlik_maosh'] = 0;
					$damkun++;	
				}
			}
			else{				
				$ans[$j]['kunlik_maosh'] = round($fee,2);
				$salary += $ans[$j]['kunlik_maosh'];
			}			
			$ans[$j]['buyurtmalar'] = $orders;
			$j++;
			$sana1 += 86400; 
		}		
		$ret['xodim'] = $asli->defilter($user['familya'])." ".$asli->defilter($user['ism']);
		$ret['dostavka_id'] = $user['id'];
		$ret['maosh'] = round($salary,2);
		$ret['bonus'] = $plan * $bonus;
		$ret['plan'] = $foiz;
		$ret['dam_olish_kunlar'] = $damkun;
		$ret['jami_maosh'] = round(round($salary,2) + $plan * $bonus,2);
		$ret['hisobot'] = $ans;
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->response('403');
	}
	$asli->print_json();
?>