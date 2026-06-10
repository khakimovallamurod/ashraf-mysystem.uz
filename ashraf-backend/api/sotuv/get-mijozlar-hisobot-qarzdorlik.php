<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','dostavka','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

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
		$jknaqd = 0;
		$jd = 0;
		$jeq = 0;
		$jsaldo = 0;
		$jv = 0;
		$jamimassa = 0;
		$jamimassavozvrat = 0;
		foreach ($clients as $key => $mijoz) {
			$eski_jamidebit = 0;
			$eski_jamikredit = 0;
			$jamidebit = 0;
			$jamikredit = 0;
			$client_id = $mijoz['id'];
			$jamieskipul = 0;

			$pays = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$eski_jamikredit += $pays;

			$sales = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$eski_jamidebit += $sales;

			$vozvrats = $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$eski_jamikredit += $vozvrats;

			$pays = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");			
			$jamikredit += $pays;
			$jknaqd += $pays;

			$sales = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jamidebit += $sales;

			$vozvrats = $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jv += $vozvrats;
			$jamikredit += $vozvrats;

			$massavozvrat = $asli->summaustun('vozvrat','massa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jamimassavozvrat += $massavozvrat;

			$ret[$i]['fio'] = $asli->defilter($mijoz['fio']);
			$ret[$i]['eski_qarz'] = $eski_jamidebit-$eski_jamikredit;
			$ret[$i]['debit'] = $jamidebit;
			$ret[$i]['jamikredit'] = $jamikredit;
			$ret[$i]['massavozvrat'] = round($massavozvrat,2);
			$ret[$i]['saldo'] = $eski_jamidebit - $eski_jamikredit + $jamidebit - $jamikredit;
			$jk += $jamikredit;
			$jd += $jamidebit;
			$jeq += $ret[$i]['eski_qarz'];
			$jsaldo += $ret[$i]['saldo'];
			$i++;
		}
		$jamimassa = $asli->summaustun('sale_order_items','tayyorlandi',[],"sana>='$sana1' AND sana<'$sana2'");
		$jamivozvratmassa = $asli->summaustun('vozvrat','massa',[],"sana>='$sana1' AND sana<'$sana2' AND holat='vozvrat'");
		$jamipaterya = $asli->summaustun('vozvrat','massa',[],"sana>='$sana1' AND sana<'$sana2' AND holat='paterya'");

		$jamimassasumma = $asli->summaustun('sale_order_items','summa',[],"sana>='$sana1' AND sana<'$sana2'");
		$jamivozvratsumma = $asli->summaustun('vozvrat','summa',[],"sana>='$sana1' AND sana<'$sana2' AND holat='vozvrat'");
		$jamipateryasumma = $asli->summaustun('vozvrat','summa',[],"sana>='$sana1' AND sana<'$sana2' AND holat='paterya'");
		$ans = [];
		$ans['jami_eski_qarz'] = $jeq;
		$ans['jamitolov'] = $jk - $jv;
		$ans['jamivozvrat'] = $jv;
		$ans['jamikredit_naqd'] = $jknaqd;
		$ans['jamiberilganyuk'] = $jd-$jv;
		$ans['jami_saldo'] = $jsaldo;
		$ans['massa']['chiqqan'] = round($jamimassa,2);
		$ans['massa']['vozvrat'] = round($jamivozvratmassa,2);
		$ans['massa']['paterya'] = round($jamipaterya,2);
		$ans['summa']['chiqqan'] = round($jamimassasumma,2);
		$ans['summa']['vozvrat'] = round($jamivozvratsumma,2);
		$ans['summa']['paterya'] = round($jamipateryasumma,2);
		$ans['jamimassavozvrat'] = round($jamimassavozvrat,2);
		$ans['akt'] = $ret;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>