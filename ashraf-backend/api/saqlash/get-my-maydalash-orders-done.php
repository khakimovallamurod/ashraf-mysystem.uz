<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['sklad','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();

	$ret = [];
	$asli->check_rolls();
	$user = $asli->getdata('user',['token'=>$asli->getBearerToken()]);
	$n = $asli->countustun('zayavka_msq','id',['status'=>'bajarildi']);
	if($n=="" || $n==0){
		$asli->resp += ['success'=> false, 'message' => "Sizda bajarilgan buyurtmalar mavjud emas!"];
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		if(isset($_GET['sana1']) && isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$zayavkakalar = $asli->getdatas('zayavka_msq',['status'=>'bajarildi'],"status='bajarildi' AND sana>='$sana1' AND sana<'$sana2' ORDER BY id DESC");
		}
		else{
			$zayavkakalar = $asli->getdatas('zayavka_msq',['status'=>'bajarildi'],"status='bajarildi' ORDER BY id DESC LIMIT 50");	
		}
		$jami = 0;
		$jamidone = 0;
		foreach ($zayavkakalar as $key => $zayavka) {
			$buyurtmachi = $asli->getdata('user',['id'=>$zayavka['maydalovchi_id']]);
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['buyurtmachi'] = $asli->defilter($buyurtmachi['familya']." ".$buyurtmachi['ism']);			
			$ret[$i]['nomer'] = $zayavka['pnomer'];
			$ret[$i]['sana'] = date("d.m.Y H:i:s",$zayavka['sana']);			
			$ret[$i]['massa'] = $zayavka['massa'];			
			$ret[$i]['status'] = $zayavka['status'];
			$ret[$i]['tayyorlandi'] = $zayavka['rmassa'];
			if($zayavka['massa']!=0){
				$ret[$i]['foiz'] = round($zayavka['rmassa']/$zayavka['massa'],2)*100;	
			}
			else{
				$ret[$i]['foiz'] = 0;
			}
			$jami += $zayavka['massa'];
			$jamidone += $zayavka['rmassa'];
			$i++;
		}
		$ans['list'] = $ret;
		$ans['jami'] = round($jami,2);
		$ans['jamidone'] = round($jamidone,2);
		if($jami!=0){
			$ans['foizda'] = round($jamidone/$jami,2)*100;	
		}
		else{
			$ans['foizda'] = 0;
		}
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>