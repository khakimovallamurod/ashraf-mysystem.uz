<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();


	function getnarx($zayavka_id,$product_id)
	{
		$asli2 = new Cyber();
		$z = $asli2->getdata('zayavka_msq',['id'=>$zayavka_id]);
		$p = $asli2->getdata('products',['id'=>$product_id]);
		if($z['rmassa']==0){
			return 0;
		}
		else{
			return round((($z['summa']+$z['rmassa']*500)/$z['rmassa']) * $p['pr_koef'],2);
		}		
	}

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id']) or isset($_GET['bulim_id'])){
		
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$jamisumma = 0;
		$polkas = $asli->getdatas('polka',[],"1");
		foreach ($polkas as $key => $polka) {
			$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);
			$products = $asli->getdatas('products',[],"1");
			$temp = [];
			$j = 0;
			$jami = 0;
			$summa = 0;
			foreach ($products as $key2 => $product) {
				$product_id = $product['id'];
				$polka_id = $polka['id'];
				$massa = $asli->summaustun('putpolka','massa',[],"product_id='$product_id' AND polka_id='$polka_id' AND massa>0");
				if(round($massa,2)==0){
					continue;
				}
				
				$pps = $asli->getdatas('putpolka',[],"product_id='$product_id' AND polka_id='$polka_id' AND massa>0");
				foreach ($pps as $key => $pp) {
					$massa = $pp['massa'];
					if(round($massa,2)==0){
						continue;
					}
					$summa += round($massa * getnarx($pp['zayavka_msq_id'],$product_id),2);
				}				
			}
			$jamisumma += $summa;
		}
		$sqb = $asli->getdatas('saqlash_bulimi',['status'=>'joylandi']);
		foreach ($sqb as $key => $sq) {
			$krim = $asli->getdata('krimproducts',['id'=>$sq['partiya_id']]);
			$jamisumma += $krim['price'] * $sq['qoldi'];
		}

		$eski_jamidebit = 0;
		$eski_jamikredit = 0;
		$jamidebit = 0;
		$jamikredit = 0;
		$sana1 = time()-86400;
		$sana2 = time()+86400;

		$pays = $asli->summaustun('debithistory','summa',[],"sana<'$sana1'");
		$eski_jamikredit += $pays;

		$vozvrats = $asli->summaustun('vozvrat','summa',[],"sana<'$sana1'");
		$eski_jamikredit += $vozvrats;

		$sales = $asli->summaustun('sale_orders','summa',[],"sana<'$sana1'");
		$eski_jamidebit += $sales;


		$pays = $asli->summaustun('debithistory','summa',[],"sana>='$sana1'");
		$jamikredit += $pays;

		$vozvrats = $asli->summaustun('vozvrat','summa',[],"sana>='$sana1'");
		$jamikredit += $vozvrats;
		
		$sales = $asli->summaustun('sale_orders','summa',[],"sana>='$sana1'");
		$jamidebit += $sales;

		$balans = $asli->getdata('balans',['id'=>1]);

		$balans = $balans['naqdsum'] + $balans['bank'] + $balans['karta'] + $balans['naqdusd'] * 12500;

		$sana1 = time();
		$pays = $asli->summaustun('pay_taminotchi_history','summa',[],"sana<='$sana1' AND status='checked'");
		$jdebit = $pays;

		$sales = $asli->summaustun('krimproducts','summa',[],"sana<='$sana1'");
		$jkredit = $sales;	

		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		
		$harajat = $asli->summaustun('harajat','naqdsum',[],"(category_id<23 OR category_id>25) AND sana>='$sana1' AND sana<'$sana2'");
		$harajat += $asli->summaustun('harajat','naqdusd',[],"(category_id<23 OR category_id>25) AND sana>='$sana1' AND sana<'$sana2'")*12500;
		$harajat += $asli->summaustun('harajat','bank',[],"(category_id<23 OR category_id>25) AND sana>='$sana1' AND sana<'$sana2'");
		$harajat += $asli->summaustun('harajat','karta',[],"(category_id<23 OR category_id>25) AND sana>='$sana1' AND sana<'$sana2'");
			

		$ans['ostatka'] = $jamisumma;
		$ans['saldo'] = round($eski_jamidebit - $eski_jamikredit + $jamidebit - $jamikredit,2);
		$ans['balans'] = $balans;
		$ans['taminotchi'] = $jkredit - $jdebit;
		$ans['harajat'] = $harajat;
		$ans['foyda'] = round($jamisumma + $ans['saldo'] + $balans - $ans['taminotchi'] - $harajat,2);
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>