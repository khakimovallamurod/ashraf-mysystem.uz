<?php
	include_once '../header.php';
	include_once '../config.php';

	$asli = new Cyber();
	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','dostavka','admin','saqlash'];

	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	if(isset($_GET['id'])){
		$asli->resp += ['success'=> false, 'message' => "Not implemented"];
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];

		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		$dostavkaId = isset($_GET['dostavka_id']) ? intval($_GET['dostavka_id']) : 0;

		if($dostavkaId > 0){
			$clients = $asli->getdatas('clients',[],'1');
		}
		else{
			$clients = $asli->getdatas('clients',[],'1');
		}

		$ret = [];
		$i = 0;
		$jamiEskiQarz = 0;
		$jamiDebit = 0;
		$jamiKredit = 0;
		$jamiQaytarilgan = 0;

		foreach ($clients as $mijoz) {
			$client_id = $mijoz['id'];

			$oldDebit = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$oldKredit = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$oldQaytarilgan = $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana<'$sana1'");
			$eskiQarz = $oldDebit - $oldKredit - $oldQaytarilgan;

			$debit = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$kredit = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
			$qaytarilgan = $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");

			$saldo = $eskiQarz + $debit - $kredit - $qaytarilgan;

			$ret[$i]['fio'] = $asli->defilter($mijoz['fio']);
			$ret[$i]['eski_qarz'] = round($eskiQarz,2);
			$ret[$i]['debit'] = round($debit,2);
			$ret[$i]['jamikredit'] = round($kredit,2);
			$ret[$i]['qaytarilgan'] = round($qaytarilgan,2);
			$ret[$i]['saldo'] = round($saldo,2);

			$jamiEskiQarz += $eskiQarz;
			$jamiDebit += $debit;
			$jamiKredit += $kredit;
			$jamiQaytarilgan += $qaytarilgan;
			$i++;
		}

		$ans = [];
		$ans['jami_eski_qarz'] = round($jamiEskiQarz,2);
		$ans['jamidebit'] = round($jamiDebit,2);
		$ans['jamikredit'] = round($jamiKredit,2);
		$ans['jamiqaytarilgan'] = round($jamiQaytarilgan,2);
		$ans['jami_saldo'] = round($jamiEskiQarz + $jamiDebit - $jamiKredit - $jamiQaytarilgan,2);

		// Old frontend compatibility
		$ans['jamitolov'] = $ans['jamikredit'];
		$ans['jamiberilganyuk'] = $ans['jamidebit'];

		$ans['akt'] = $ret;
		$asli->resp['data'] = $ans;
	}

	$asli->print_json();
?>
