<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['maydalash','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$zayavkalar = $asli->getdatas('zayavka_msq',['status'=>'tayyorlandi']);
		foreach ($zayavkalar as $key => $zayavka) {
			$yuklovchi = $asli->getdata('user',['id'=>$zayavka['yuklovchi_id']]);
			$ret['id'] = $zayavka['id'];
			$ret['partiyanomer'] = $zayavka['pnomer'];
			$ret['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
			$ret['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret['status'] = $zayavka['status'];
			$ret['massa'] = $zayavka['massa'];
			$ret['realmassa'] = $zayavka['rmassa'];
		}
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$zayavkalar = $asli->getdatas('zayavka_msq',['status'=>'tayyorlandi']);
		foreach ($zayavkalar as $key => $zayavka) {
			$yuklovchi = $asli->getdata('user',['id'=>$zayavka['yuklovchi_id']]);
			$ret[$i]['id'] = $zayavka['id'];
			$ret[$i]['partiyanomer'] = $zayavka['pnomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$zayavka['sana']);
			$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$ret[$i]['status'] = $zayavka['status'];
			$ret[$i]['massa'] = $zayavka['massa'];
			$ret[$i]['realmassa'] = $zayavka['rmassa'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>