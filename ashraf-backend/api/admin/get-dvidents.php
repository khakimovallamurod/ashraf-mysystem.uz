<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$asli->begintranz();

			$harajat = $asli->getdata('dvident',['id'=>$_GET['id']]);

			$balans = $asli->getdata('balans',['id'=>1]);
			if($harajat['holat']=="chiqim"){
				$sql1 = $asli->update('balans',[
					'naqdsum' => $balans['naqdsum'] + $harajat['naqdsum'],
					'naqdusd' => $balans['naqdusd'] + $harajat['naqdusd'],
					'bank' => $balans['bank'] + $harajat['bank'],
					'karta' => $balans['karta'] + $harajat['karta']
				],['id'=>1]);
			}
			else{
				$sql1 = $asli->update('balans',[
					'naqdsum' => $balans['naqdsum'] - $harajat['naqdsum'],
					'naqdusd' => $balans['naqdusd'] - $harajat['naqdusd'],
					'bank' => $balans['bank'] - $harajat['bank'],
					'karta' => $balans['karta'] - $harajat['karta']
				],['id'=>1]);
			}

			if($sql1 && time()-$harajat['sana']<86400){
				$sql = $asli->delete('dvident',['id'=>$_GET['id']]);
				if($sql){
					$asli->endtranz();
					$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Xatolik malumot o'chirilmadi!"];
				}	
			}
			else{
				$asli->bekor();
				$asli->resp += ['success'=> false, 'message' => "Vaqti tugatilgan!"];
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			$i = 0;
			$harajatlar = $asli->getdatas('dvident',['id'=>$_GET['id']]);
			foreach ($harajatlar as $key => $harajat) {
				$user = $asli->getdata('user',['id'=>$harajat['user_id']]);
				$ret['id'] = $harajat['id'];
				$ret['naqdsum'] = $harajat['naqdsum'];
				$ret['naqdusd'] = $harajat['naqdusd'];
				$ret['bank'] = $harajat['bank'];
				$ret['karta'] = $harajat['karta'];
				$ret['izoh'] = $harajat['izoh'];
				$ret['javobgar'] = $user['familya']." ".$user['ism'];
				$i++;
			}
			$asli->resp['data'] = $ret;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$jaminaqd = 0;
		$jamiusd = 0;
		$jamibank = 0;
		$jamikarta = 0;
		if(isset($_GET['dvident_category_id']) AND isset($_GET['sana1']) AND isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$hid = $_GET['dvident_category_id'];
			if($hid>0){
				$harajatlar = $asli->getdatas('dvident',[],"category_id='$hid' AND sana>='$sana1' AND sana<'$sana2' AND holat='chiqim'");
			}
			else{
				$harajatlar = $asli->getdatas('dvident',[],"sana>='$sana1' AND sana<'$sana2' AND holat='chiqim'");	
			}
		}
		else{
			$bg = date("d.m.Y 00:00:00",time());
			$sana1 = strtotime($bg);
			$sana2 = $sana1 + 86400;
			$harajatlar = $asli->getdatas('dvident',[],"sana>='$sana1' AND sana<'$sana2' AND holat='chiqim'");	
		}		
		foreach ($harajatlar as $key => $harajat) {
			$user = $asli->getdata('user',['id'=>$harajat['user_id']]);
			$cat = $asli->getdata('dvident_category',['id'=>$harajat['category_id']]);
			$ret[$i]['id'] = $harajat['id'];
			$ret[$i]['naqdsum'] = $harajat['naqdsum'];
			$ret[$i]['naqdusd'] = $harajat['naqdusd'];
			$ret[$i]['bank'] = $harajat['bank'];
			$ret[$i]['karta'] = $harajat['karta'];
			$ret[$i]['izoh'] = $harajat['izoh'];
			$ret[$i]['vaqt'] = date("d.m.Y h:i:s",$harajat['sana']);
			$ret[$i]['turi'] = $asli->defilter($cat['name']);
			$ret[$i]['javobgar'] = $user['familya']." ".$user['ism'];
			$i++;
			$jaminaqd += $harajat['naqdsum'];
			$jamiusd += $harajat['naqdusd'];
			$jamibank += $harajat['bank'];
			$jamikarta += $harajat['karta'];
		}
		$ans['list'] = $ret;
		$ans['jaminaqd'] = $jaminaqd;
		$ans['jamiusd'] = $jamiusd;
		$ans['jamibank'] = $jamibank;
		$ans['jamikarta'] = $jamikarta;
		$ans['jami'] = $jaminaqd+$jamibank+$jamikarta;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>