<?php
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['kassir','admin','sotuv','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$balans = $asli->getdata('balans',['id'=>1]);

	if($balans['id']>0){		
		$asli->resp += ['success'=> true, 'message' => "OK"];
		if(isset($_GET['sana1']) && isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
		}
		else{
			$s = date("d.m.Y 00:00:00",time());
			$sana1 = strtotime($s);
			$sana2 = $sana1 + 86400;
		}

		$naqdsum = $asli->summaustun('debithistory','naqdsum',[],"sana>='$sana1' AND sana<'$sana2'");
		$naqdusd = $asli->summaustun('debithistory','naqdusd',[],"sana>='$sana1' AND sana<'$sana2'");
		$bank = $asli->summaustun('debithistory','bank',[],"sana>='$sana1' AND sana<'$sana2'");
		$karta = $asli->summaustun('debithistory','karta',[],"sana>='$sana1' AND sana<'$sana2'");
		$ret['naqdsum'] = $naqdsum;
		$ret['naqdusd'] = $naqdusd;
		$ret['bank'] = $bank;
		$ret['karta'] = $karta;
		$ans['kunlik_krim'] = $ret;

		$naqdsum = $asli->summaustun('harajat','naqdsum',[],"sana>='$sana1' AND sana<'$sana2'");
		$naqdusd = $asli->summaustun('harajat','naqdusd',[],"sana>='$sana1' AND sana<'$sana2'");
		$bank = $asli->summaustun('harajat','bank',[],"sana>='$sana1' AND sana<'$sana2'");
		$karta = $asli->summaustun('harajat','karta',[],"sana>='$sana1' AND sana<'$sana2'");
		$ret['naqdsum'] = $naqdsum;
		$ret['naqdusd'] = $naqdusd;
		$ret['bank'] = $bank;
		$ret['karta'] = $karta;
		$ans['chiqim_harajat'] = $ret;

		$naqdsum = $asli->summaustun('qassob_pay_history','naqdsum',[],"sana>='$sana1' AND sana<'$sana2'");
		$naqdusd = $asli->summaustun('qassob_pay_history','naqdusd',[],"sana>='$sana1' AND sana<'$sana2'");
		$bank = $asli->summaustun('qassob_pay_history','bank',[],"sana>='$sana1' AND sana<'$sana2'");
		$karta = $asli->summaustun('qassob_pay_history','karta',[],"sana>='$sana1' AND sana<'$sana2'");

		$naqdsum += $asli->summaustun('worker_pay_history','naqdsum',[],"sana>='$sana1' AND sana<'$sana2'");
		$naqdusd += $asli->summaustun('worker_pay_history','naqdusd',[],"sana>='$sana1' AND sana<'$sana2'");
		$bank += $asli->summaustun('worker_pay_history','bank',[],"sana>='$sana1' AND sana<'$sana2'");
		$karta += $asli->summaustun('worker_pay_history','karta',[],"sana>='$sana1' AND sana<'$sana2'");
		$ret['naqdsum'] = $naqdsum;
		$ret['naqdusd'] = $naqdusd;
		$ret['bank'] = $bank;
		$ret['karta'] = $karta;
		$ans['chiqim_oylik'] = $ret;

		$naqdsum = $asli->summaustun('pay_taminotchi_history','naqdsum',[],"sana>='$sana1' AND sana<'$sana2' AND status='checked'");
		$naqdusd = $asli->summaustun('pay_taminotchi_history','naqdusd',[],"sana>='$sana1' AND sana<'$sana2' AND status='checked'");
		$bank = $asli->summaustun('pay_taminotchi_history','bank',[],"sana>='$sana1' AND sana<'$sana2' AND status='checked'");
		$karta = $asli->summaustun('pay_taminotchi_history','karta',[],"sana>='$sana1' AND sana<'$sana2' AND status='checked'");
		$ret['naqdsum'] = $naqdsum;
		$ret['naqdusd'] = $naqdusd;
		$ret['bank'] = $bank;
		$ret['karta'] = $karta;
		$ans['chiqim_taminotchi'] = $ret;

		

		$naqd = $asli->summaustun('sale_orders','naqd',[],"sana>='$sana1' AND sana<'$sana2'");
		if($naqd == ""){
			$naqd = 0;
		}
		$ret['naqdsum'] = $naqd;
		$naqdusd = $asli->summaustun('sale_orders','naqdusd',[],"sana>='$sana1' AND sana<'$sana2'");
		if($naqdusd == ""){
			$naqdusd = 0;
		}
		$ret['naqdusd'] = $naqdusd;
		$bank = $asli->summaustun('sale_orders','plastik',[],"sana>='$sana1' AND sana<'$sana2'");
		if($bank == ""){
			$bank = 0;
		}
		$ret['bank'] = $bank;
		$karta = $asli->summaustun('sale_orders','karta',[],"sana>='$sana1' AND sana<'$sana2'");
		if($karta == ""){
			$karta = 0;
		}
		$ret['karta'] = $karta;

		$ans['qoldiq_balans'] = $ret;

		$ans['kb'] = $ret;

		$ans['kb_naqdsum'] = $ret['naqdsum'];
		$ans['kb_naqdusd'] = $ret['naqdusd'];
		$ans['kb_bank'] = $ret['bank'];
		$ans['kb_karta'] = $ret['karta'];
		// jami_hisobot: {
	    //   	jami_debet: number;
	    //   	jami_kredit: number;
	    //   	ostatka: number;
	    //   	balans: number;
	    // }
	    $ret = [];
	    $jd = round($asli->summaustun('clients','balans',[],"1"),2);
	   // round($asli->summaustun('sale_orders','summa',[],"sana>='$sana1' AND sana<'$sana2'"),2);
	    if($jd==""){
	    	$ret['jami_debet'] = 0;
	    }
	    else{
	    	$ret['jami_debet'] = $jd;
	    }
	    $jk = round($asli->summaustun('taminotchi','balans',[],"1"),2);
	   // round($asli->summaustun('krimproducts','summa',[],"sana>='$sana1' AND sana<'$sana2'"),2);
	    if($jk==""){
	    	$ret['jami_kredit'] = 0;
	    }
	    else{
	    	$ret['jami_kredit'] = $jk;
	    }
	    $sm = 0;
	    $gg = $asli->getdatas('products',[],"id>1");
	    foreach ($gg as $key => $g) {
	    	$m = $asli->summaustun('xolodelnik','massa',['product_id'=>$g['id']]);
	    	$sm += $g['price'] * round($m,2);
	    }
	    $vv = file_get_contents("https://cbu.uz/uz/arkhiv-kursov-valyut/json/");
	    $v = json_decode($vv);
	    $ret['ostatka'] = round($sm,2);
	    $ret['umumiy_balans'] = 0; //$v[0]->Rate * $balans['naqdusd'] + $balans['naqdsum'] + $balans['bank'] + $balans['karta'] + $ret['jami_debet'] - $ret['jami_kredit'] + $ret['ostatka'] ;
	    $ret['balans'] = $ret['jami_debet'] - $ret['jami_kredit'] + $ret['ostatka'] + $v[0]->Rate * $balans['naqdusd'] + $balans['naqdsum'] + $balans['bank'] + $balans['karta']  ;
	    $ans['jami_hisobot'] = $ret;
		$asli->resp['data'] = $ans;
	}
	else{
		$asli->resp += ['success'=> false, 'message' => "Kechirasiz hozirda sizda balans mavjud emas!"];
	}
	$asli->print_json();
?>