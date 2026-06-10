<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['maydalash','admin','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$maydalash = $asli->getdata('maydalash',['id'=>$_GET['id']]);
			if($maydalash['status']=="new" && time()-$maydalash['sana']<600){
				$sql = $asli->delete('maydalash',['id'=>$_GET['id']]);
				if($sql){
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi!"];
				}
				else{
					$asli->resp += ['success'=> false, 'message' => "Xatolik o'cirilmadi"];
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "O'chirib bo'lmaydi"];
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$i = 0;
			$maydalashlar = $asli->getdatas('maydalash',['id'=>$_GET['id']]);
			foreach ($maydalashlar as $key => $maydalash) {
				$maydalovchi = $asli->getdata('user',['id'=>$maydalash['user_id']]);
				$yuklovchi = $asli->getdata('user',['id'=>$maydalash['yuklovchi_id']]);
				$product = $asli->getdata('products',['id'=>$maydalash['product_id']]);
				$partiya = $asli->getdata('zayavka_msq',['id'=>$maydalash['zayavka_msq_id']]);

				$ret[$i]['id'] = $maydalash['id'];
				$ret[$i]['partiyanomer'] = $partiya['pnomer'];
				$ret[$i]['sana'] = date("d.m.Y h:i:s",$maydalash['sana']);
				$ret[$i]['product_name'] = $product['name'];
				$ret[$i]['massa'] = $maydalash['massa'];
				$ret[$i]['status'] = $maydalash['status'];
				$ret[$i]['maydalovchi'] = $maydalovchi['familya']." ".$maydalovchi['ism'];
				$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
				$i++;
			}
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$maydalashlar = $asli->getdatas('maydalash',[],"1 ORDER BY id DESC");
		foreach ($maydalashlar as $key => $maydalash) {
			$maydalovchi = $asli->getdata('user',['id'=>$maydalash['user_id']]);
			$yuklovchi = $asli->getdata('user',['id'=>$maydalash['yuklovchi_id']]);
			$product = $asli->getdata('products',['id'=>$maydalash['product_id']]);
			$partiya = $asli->getdata('zayavka_msq',['id'=>$maydalash['zayavka_msq_id']]);

			$ret[$i]['id'] = $maydalash['id'];
			$ret[$i]['partiyanomer'] = $partiya['pnomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$maydalash['sana']);
			$ret[$i]['product_name'] = $product['name'];
			$ret[$i]['massa'] = $maydalash['massa'];
			$ret[$i]['status'] = $maydalash['status'];
			$ret[$i]['maydalovchi'] = $maydalovchi['familya']." ".$maydalovchi['ism'];
			$ret[$i]['yuklovchi'] = $yuklovchi['familya']." ".$yuklovchi['ism'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json()
?>