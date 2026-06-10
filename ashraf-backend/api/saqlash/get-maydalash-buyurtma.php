<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sklad','admin','saqlash','maydalash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$ret = [];
	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];

		$zayavka = $asli->getdata('zayavka_msq',['id'=>$_GET['id']]);
		$maydlovchi = $asli->getdata('user',['id'=>$zayavka['maydalovchi_id']]);
		$ret['id'] = $zayavka['id'];
		$ret['partiyanomer'] = $zayavka['pnomer'];
		$ret['buyurtmamassa'] = $zayavka['massa'];
		$ret['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
		$ret['maydlovchi'] = $maydlovchi['fio'];
		$ret['status'] = $zayavka['status'];
		
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$zayavkalar = $asli->getdatas('zayavka_msq',['status'=>'new']);
		foreach ($zayavkalar as $key => $zayavka) {
			$maydlovchi = $asli->getdata('user',['id'=>$zayavka['maydalovchi_id']]);
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['partiyanomer'] = $zayavka['pnomer'];
			$ret[$i]['buyurtmamassa'] = $zayavka['massa'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
			$ret[$i]['maydlovchi'] = $maydlovchi['fio'];
			$ret[$i]['status'] = $zayavka['status'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>