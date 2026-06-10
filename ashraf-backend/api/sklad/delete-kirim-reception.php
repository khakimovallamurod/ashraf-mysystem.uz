<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['DELETE'];
	$asli->allow_rolls = ['sklad','admin','saqlash'];

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
		
	}
	else{
		$asli->response(403);		
	}
	$asli->print_json()
?>