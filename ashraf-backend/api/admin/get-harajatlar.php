<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['admin', 'sotuv'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$asli->begintranz();

			$harajat = $asli->getdata('harajat',['id'=>$_GET['id']]);

			$balans = $asli->getdata('balans',['id'=>1]);

			$sql1 = $asli->update('balans',[
				'naqdsum' => $balans['naqdsum'] + $harajat['naqdsum'],
				'naqdusd' => $balans['naqdusd'] + $harajat['naqdusd'],
				'bank' => $balans['bank'] + $harajat['bank'],
				'karta' => $balans['karta'] + $harajat['karta']
			],['id'=>1]);

			if($sql1){
				$sql = $asli->delete('harajat',['id'=>$_GET['id']]);
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
			$harajatlar = $asli->getdatas('harajat',['id'=>$_GET['id']]);
			foreach ($harajatlar as $key => $harajat) {
				$user = $asli->getdata('user',['id'=>$harajat['user_id']]);
				
				$ret[$i]['id'] = $harajat['id'];
				$ret[$i]['naqdsum'] = $harajat['naqdsum'];
				$ret[$i]['naqdusd'] = $harajat['naqdusd'];
				$ret[$i]['bank'] = $harajat['bank'];
				$ret[$i]['karta'] = $harajat['karta'];
				$ret[$i]['izoh'] = $harajat['izoh'];
				$ret[$i]['javobgar'] = $user['familya']." ".$user['ism'];
				$i++;
			}
			$asli->resp['data'] = $ret;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
        $shart = "1 ORDER BY id DESC LIMIT 100";
        if(isset($_GET['sana1']) AND isset($_GET['sana2'])){
            $sana1 = strtotime($_GET['sana1']);
            $sana2 = strtotime($_GET['sana2']);
            $hid = isset($_GET['harajat_category_id']) ? (int) $_GET['harajat_category_id'] : 0;
            if($sana1 > 0 && $sana2 > 0){
                $base = "sana>='$sana1' AND sana<='$sana2'";
                if($hid > 0){
                    $base .= " AND category_id='$hid'";
                }
                $shart = $base . " ORDER BY id DESC LIMIT 100";
            }
        }
		$harajatlar = $asli->getdatas('harajat',[],$shart);
		foreach ($harajatlar as $key => $harajat) {
			$user = $asli->getdata('user',['id'=>$harajat['user_id']]);
			
			$ret[$i]['id'] = $harajat['id'];
			$ret[$i]['naqdsum'] = $harajat['naqdsum'];
			$ret[$i]['naqdusd'] = $harajat['naqdusd'];
			$ret[$i]['bank'] = $harajat['bank'];
			$ret[$i]['karta'] = $harajat['karta'];
			$ret[$i]['izoh'] = $harajat['izoh'];
			$ret[$i]['javobgar'] = $user['familya']." ".$user['ism'];
			$i++;
		}
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>
