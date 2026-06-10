<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sklad','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();

	$asli->check_rolls();


	$n = $asli->countustun('zayavka_msq','id',['status'=>'new']);
	$ret = [];
	if($n=="" || $n==0){
		$asli->resp += ['success'=> false, 'message' => "Sizda buyurtmalar mavjud emas!"];
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$zayavkakalar = $asli->getdatas('zayavka_msq',['status'=>'new']);
		foreach ($zayavkakalar as $key => $zayavka) {
			$buyurtmachi = $asli->getdata('user',['id'=>$zayavka['maydalovchi_id']]);			
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['buyurtmachi'] = $buyurtmachi['familya']." ".$buyurtmachi['ism'];			
			$ret[$i]['nomer'] = $zayavka['pnomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);			
			$ret[$i]['massa'] = $zayavka['massa'];			
			$ret[$i]['status'] = $zayavka['status'];
			$ret[$i]['tayyorlandi'] = $zayavka['rmassa'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>