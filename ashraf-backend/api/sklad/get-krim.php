<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['sklad','admin','saqlash','sotuv'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($_GET['id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$krim = $asli->getdata('krimproducts',['id'=>$_GET['id']]);
			if(time()-$krim['sana']<300000 && ($krim['status']=='new' || $krim['status']=='joylandi')){
				$asli->begintranz();				
				$taminotchi = $asli->getdata('taminotchi',['id'=>$krim['tashkilot_id']]);
				$sql = $asli->update('taminotchi',[
					'balans' => $taminotchi['balans'] - $krim['summa']
				],['id'=>$krim['tashkilot_id']]);

				$qassob = $asli->getdata('qassoblar',['id'=>$krim['qassob_id']]);
				$sql2 = $asli->update('qassoblar',[
					'balans' => $qassob['balans'] - $qassob['kpi'] * $krim['dona']
				],['id'=>$krim['qassob_id']]);

				$product = $asli->getdata('products',['article'=>'t-1']);
				$sql3 = $asli->update('products',[
					'soni' => $product['soni'] - $krim['massa']
				],['article'=>'t-1']);

				if($sql && $sql2 && $sql3){
					$sql1 = $asli->delete('saqlash_bulimi',['partiya_id'=>$_GET['id']]);
					$sql2 = $asli->delete('krimproducts',['id'=>$_GET['id']]);
					if($sql1 && $sql2){
						$asli->endtranz();
						$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
					}
					else{
						$asli->bekor();
						$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi."];
					}
				}
				else{
					$asli->bekor();
					$asli->resp += ['success'=> false, 'message' => "Tranzaktsiya yakunlanmadi."];
				}
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Kechirasiz o'chirish vaqti tugagan!"];				
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];

			$krim = $asli->getdata('krimproducts',['id'=>$_GET['id']]);
			$taminotchi = $asli->getdata('taminotchi',['id'=>$krim['tashkilot_id']]);
			$qassob = $asli->getdata('qassoblar',['id'=>$krim['qassob_id']]);
			$ret['taminotchi'] = htmlspecialchars_decode($taminotchi['fio'],ENT_QUOTES);
			$ret['qassob'] = htmlspecialchars_decode($qassob['fio'],ENT_QUOTES);
			$ret['partiyanomer'] = $krim['partiyanomer'];
			$ret['sana'] = date("d.m.Y h:i:s",$krim['sana']);
			$ret['dona'] = $krim['dona'];
			$ret['massa'] = $krim['massa'];
			$ret['price'] = $krim['price'];
			$ret['summa'] = $krim['summa'];
			$ret['status'] = $krim['status'];

			$asli->resp['data'] = $ret;
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$jamisumma = 0;
		$jamidona = 0;
		$jamimassa = 0;

		if(isset($_GET['sana1']) && isset($_GET['sana2'])){
			$sana1 = strtotime($_GET['sana1']);
			$sana2 = strtotime($_GET['sana2']);
			$krimlar = $asli->getdatas('krimproducts',[],"sana>='$sana1' AND sana<'$sana2'");
		}
		else{
			$krimlar = $asli->getdatas('krimproducts',[],"1 ORDER BY id DESC LIMIT 250");
		}		
		foreach ($krimlar as $key => $krim) {
			$jamimassa += $krim['massa'];
			$jamidona += $krim['dona'];
			$jamisumma += $krim['summa'];
			$taminotchi = $asli->getdata('taminotchi',['id'=>$krim['tashkilot_id']]);
			$qassob = $asli->getdata('qassoblar',['id'=>$krim['qassob_id']]);
			$ret[$i]['id'] = $krim['id'];
			$ret[$i]['taminotchi'] = htmlspecialchars_decode($taminotchi['fio'],ENT_QUOTES);
			$ret[$i]['qassob'] = htmlspecialchars_decode($qassob['fio'],ENT_QUOTES);
			$ret[$i]['partiyanomer'] = $krim['partiyanomer'];
			$ret[$i]['sana'] = date("d.m.Y h:i:s",$krim['sana']);
			$ret[$i]['dona'] = $krim['dona'];
			$ret[$i]['massa'] = $krim['massa'];
			$ret[$i]['price'] = $krim['price'];
			$ret[$i]['summa'] = $krim['summa'];
			$ret[$i]['status'] = $krim['status'];
			$ret[$i]['malumot'] = $asli->defilter($krim['malumot']);
			$i++;
		}
		$ans['krim_list'] = $ret;
		$ans['jamisumma'] = $jamisumma;
		$ans['jamidona'] = $jamidona;
		$ans['jamimassa'] = $jamimassa;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json()
?>
