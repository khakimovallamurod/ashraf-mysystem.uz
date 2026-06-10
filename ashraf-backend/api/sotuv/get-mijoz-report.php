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
		$eski_kredit = 0;
		$eski_debit = 0;
		$client_id = $asli->filter($_GET['client_id']);
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		
		$client_id = $asli->filter($_GET['client_id']);
		$pays = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana<'$sana1'");
		$eski_kredit += $pays;
		$sales = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana<'$sana1'");
		$eski_debit += $sales;
		$vozvrats = $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana<'$sana1'");
		$eski_kredit += $vozvrats;

		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		
		
		$client = $asli->getdata('clients',['id'=>$client_id]);
		$ret = [];
		$jamidebit = 0;
		$jamikredit = 0;
		$i = 0;
		$uk = 0;
		$jv = 0;
		$jamimassa = 0;
		$jamiqaytarilgan = 0;
		$jamipaterya = 0;
		$jamitolov = 0;

		$pays = $asli->getdatas('debithistory',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
		foreach ($pays as $key => $pay) {
			$ret[$i]['key'] = $uk;
			$ret[$i]['id'] = $pay['id'];
			$ret[$i]['summa'] = $pay['summa'];
			$ret[$i]['debit'] = 0;
			$ret[$i]['vozvrat'] = 0;
			$ret[$i]['kredit'] = $pay['summa'];
			$ret[$i]['status'] = 'olingan';
			$ret[$i]['sana'] = $pay['sana'];
			$ret[$i]['date'] = $pay['date'];
			$ret[$i]['vaqt'] = $pay['vaqt'];
			$ret[$i]['izoh'] = $pay['izoh'];
			$i++;
			$uk++;
			$jamikredit += $pay['summa'];
			$jamitolov += $pay['summa'];
		}
		$sales = $asli->getdatas('sale_orders',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
		foreach ($sales as $key => $sale) {
			$m = $asli->summaustun('sale_order_items','tayyorlandi',['sale_order_id'=>$sale['id']]);
			$jamimassa += $m;
			$ret[$i]['key'] = $uk;
			$ret[$i]['id'] = $sale['id'];
			$ret[$i]['debit'] = $sale['summa'];
			$ret[$i]['kredit'] = 0;
			$ret[$i]['vozvrat'] = 0;
			$ret[$i]['summa'] = $sale['summa'];
			$ret[$i]['status'] = 'berilgan';
			$ret[$i]['order_status'] = $sale['status'];
			$ret[$i]['sana'] = $sale['sana'];
			$ret[$i]['date'] = date("d.m.Y",$sale['sana']);
			$ret[$i]['vaqt'] = $sale['vaqt'];
			$ret[$i]['izoh'] = $asli->defilter($sale['izoh']);
			$i++;
			$uk++;
			$jamidebit += $sale['summa'];
		}
		$jamimassa = round($jamimassa,2);

		$vozvrats = $asli->getdatas('vozvrat',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
		foreach ($vozvrats as $key => $vozvrat) {
			if($vozvrat['holat']=="vozvrat"){
				$jamiqaytarilgan += $vozvrat['massa'];				
			}
			else{
				$jamipaterya += $vozvrat['massa'];
			}
			$ret[$i]['key'] = $uk;
			$ret[$i]['id'] = $vozvrat['id'];
			$ret[$i]['debit'] = 0;
			$ret[$i]['kredit'] = 0;
			$ret[$i]['vozvrat'] = $vozvrat['summa'];			
			$ret[$i]['summa'] = $vozvrat['summa'];
			$ret[$i]['status'] = 'vozvrat';
			$ret[$i]['sana'] = $vozvrat['sana'];
			$ret[$i]['date'] = date("d.m.Y",$vozvrat['sana']);
			$ret[$i]['vaqt'] = $vozvrat['vaqt'];
			$ret[$i]['izoh'] = $asli->defilter($vozvrat['izoh']);
			$i++;
			$uk++;
			$jamikredit += $vozvrat['summa'];
			$jv += $vozvrat['summa'];
			$jvmassa += $vozvrat['massa'];
		}
		
		$client['fio'] = $asli->defilter($client['fio']);
		$ans['eski_balans'] = $eski_debit - $eski_kredit;
		$ans['client'] = $client;
		$ans['akt'] = $ret;
		$ans['jamidebit'] = $jamidebit - $jv;
		$ans['jamikredit'] = $jamikredit;
		$ans['jamitolov'] = $jamitolov;
		$ans['jamivozvratsumma'] = $jv;
		$ans['saldo'] = $ans['eski_balans'] + $jamidebit - $jamikredit;
		$ans['jamimassa'] = $jamimassa;
		$ans['jamiqaytarilgan'] = $jamiqaytarilgan;
		$ans['jamipaterya'] = $jamipaterya;
		$ans['jamitozamassa'] = $jamimassa-$jamiqaytarilgan-$jamipaterya;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>