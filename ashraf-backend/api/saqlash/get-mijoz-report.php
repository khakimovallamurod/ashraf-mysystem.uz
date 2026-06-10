<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','dostavka','kassir','saqlash','admin'];

	$asli->check_ip();

	$asli->check_method();



	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$ret = [];
	if(isset($_GET['id'])){
		
	}
	else{
		$eski_kredit = 0;
		$eski_debit = 0;
		$uk = 0;
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		$taminotchi_id = $asli->filter($_GET['taminotchi_id']);

		$pays = $asli->summaustun('pay_taminotchi_history','summa',[],"taminotchi_id='$taminotchi_id' AND sana<'$sana1' AND status='checked'");
		$eski_debit += $pays;

		$krimlar = $asli->summaustun('krimproducts','summa',[],"tashkilot_id='$taminotchi_id' AND sana<'$sana1'");
		$eski_kredit += $krimlar;
		

		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		
		$taminotchi_id = $asli->filter($_GET['taminotchi_id']);

		
		$taminotchi = $asli->getdata('taminotchi',['id'=>$taminotchi_id]);

		$ret = [];
		$jamidebit = 0;
		$jamikredit = 0;
		$i = 0;

		$pays = $asli->getdatas('pay_taminotchi_history',[],"taminotchi_id='$taminotchi_id' AND sana>='$sana1' AND sana<'$sana2' AND status='checked'");
		foreach ($pays as $key => $pay) {
			$ret[$i]['key'] = $uk;
			$ret[$i]['id'] = $pay['id'];
			$ret[$i]['summa'] = $pay['summa'];
			$ret[$i]['debit'] = $pay['summa'];
			$ret[$i]['kredit'] = 0;
			$ret[$i]['status'] = 'berilgan';
			$ret[$i]['sana'] = $pay['sana'];
			$ret[$i]['date'] = $pay['date'];
			$ret[$i]['vaqt'] = $pay['vaqt'];
			$ret[$i]['dona'] = 0;
			$i++;
			$uk++;
			$jamidebit += $pay['summa'];
		}
		$jamidona = 0;
		$krimlar = $asli->getdatas('krimproducts',[],"tashkilot_id='$taminotchi_id' AND sana>='$sana1' AND sana<'$sana2'");
		foreach ($krimlar as $key => $sale) {
			$ret[$i]['key'] = $uk;
			$ret[$i]['id'] = $sale['id'];
			$ret[$i]['kredit'] = $sale['summa'];
			$ret[$i]['debit'] = 0;
			$ret[$i]['summa'] = $sale['summa'];
			$ret[$i]['massa'] = $sale['massa'];
			$ret[$i]['status'] = 'olingan';
			$ret[$i]['sana'] = $sale['sana'];
			$ret[$i]['date'] = date("d.m.Y",$sale['sana']);
			$ret[$i]['vaqt'] = $sale['vaqt'];
			$ret[$i]['dona'] = $sale['dona'];
			$jamidona += $sale['dona'];
			$i++;
			$uk++;
			$jamikredit += $sale['summa'];
		}
		
		$taminotchi['fio'] = $asli->defilter($taminotchi['fio']);
		$ans['eski_balans'] = $eski_debit - $eski_kredit;
		$ans['taminotchi'] = $taminotchi;
		$ans['akt'] = $ret;
		$ans['jamidebit'] = $jamidebit;
		$ans['jamikredit'] = $jamikredit;
		$ans['jamidona'] = $jamidona;
		$ans['saldo'] = $ans['eski_balans'] + $jamidebit - $jamikredit;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>