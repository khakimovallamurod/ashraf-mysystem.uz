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
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		
		$taminotchi_id = $asli->filter($_GET['taminotchi_id']);
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		if($_GET['taminotchi_id']>0){
			$taminotchilar = $asli->getdatas('taminotchi',['id'=>$_GET['taminotchi_id']]);
		}
		else{
			$taminotchilar = $asli->getdatas('taminotchi',[],"1");
		}

		$ret = [];
		$i = 0;
		$jk = 0;
		$jd = 0;
		$jq = 0;
		$jami_qarzdorlik = 0;
		foreach ($taminotchilar as $key => $mijoz) {
			$jamidebit = 0;
			$jamikredit = 0;
			$eski_jamidebit = 0;
			$eski_jamikredit = 0;

			$taminotchi_id = $mijoz['id'];

			$pays = $asli->summaustun('pay_taminotchi_history','summa',[],"taminotchi_id='$taminotchi_id' AND sana<'$sana1' AND status='checked'");
			$eski_jamidebit += $pays;

			$sales = $asli->summaustun('krimproducts','summa',[],"tashkilot_id='$taminotchi_id' AND sana<'$sana1'");
			$eski_jamikredit += $sales;	

			$pays = $asli->summaustun('pay_taminotchi_history','summa',[],"taminotchi_id='$taminotchi_id' AND sana>='$sana1' AND sana<'$sana2' AND status='checked'");
			$jamidebit += $pays;

			$sales = $asli->summaustun('krimproducts','summa',[],"tashkilot_id='$taminotchi_id' AND sana>='$sana1' AND sana<'$sana2'");
			$jamikredit += $sales;
			
			$ret[$i]['fio'] = $asli->defilter($mijoz['fio']);
			$ret[$i]['eski_qarz'] = $eski_jamidebit - $eski_jamikredit;
			$ret[$i]['debit'] = $jamidebit;
			$ret[$i]['jamikredit'] = $jamikredit;
			$ret[$i]['saldo'] = $eski_jamidebit - $eski_jamikredit + $jamidebit - $jamikredit;
			$jk += $jamikredit;
			$jd += $jamidebit;
			$jq += $ret[$i]['eski_qarz'];
			$jami_qarzdorlik += $ret[$i]['saldo'];
			$i++;
		}
		$ans = [];
		$ans['jami_eski_qarz'] = $jq;
		$ans['jamikredit'] = $jk;
		$ans['jamidebit'] = $jd;		
		$ans['jami_qarzdorlik'] = $jami_qarzdorlik;
		$ans['akt'] = $ret;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>