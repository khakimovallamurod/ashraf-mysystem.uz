<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	// $asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		
		$client_id = $asli->filter($_GET['client_id']);
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		if($_GET['dostvka_id']>0){
			// $clients = $asli->getdatas('clients',[],"1");
			$clients = $asli->getdatas('clients',['dostavka_id'=>$_GET['dostvka_id']]);
		}
		else{
			$clients = $asli->getdatas('clients',[],"1");
		}		
		$ret = [];
		$i = 0;
		$jk = 0;
		$jd = 0;
		foreach ($clients as $key => $mijoz) {
			$eski_jamidebit = 0;
			$eski_jamikredit = 0;
			$jamidebit = 0;
			$jamikredit = 0;
			$client_id = $mijoz['id'];

			$pays = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$eski_jamikredit += $pays;
			$sales = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$eski_jamidebit += $sales;
			$vozvrats = $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$eski_jamikredit += $vozvrats;

			$pays = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jamikredit += $pays;
			$sales = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jamidebit += $sales;
			$vozvrats = $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jamikredit += $vozvrats;
			
			$ret[$i]['fio'] = $asli->defilter($mijoz['fio']);
			$ret[$i]['eski_qarz'] = $eski_jamidebit-$eski_jamikredit;
			$ret[$i]['debit'] = $jamidebit;
			$ret[$i]['jamikredit'] = $jamikredit;
			$ret[$i]['saldo'] = $eski_jamidebit - $eski_jamikredit + $jamidebit - $jamikredit;
			$saldo = $ret[$i]['saldo'];
			$sql = $asli->update('clients',['balans'=>$saldo],['id'=>$client_id]);
			if(!$sql){
				echo $client_id;
				exit;
			}
			$jk += $jamikredit;
			$jd += $jamidebit;
			$i++;
		}
		$ans = [];
		$ans['jamikredit'] = $jk;
		$ans['jamidebit'] = $jd;
		$ans['akt'] = $ret;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>