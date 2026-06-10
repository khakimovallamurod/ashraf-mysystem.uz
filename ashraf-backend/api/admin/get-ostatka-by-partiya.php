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

	function getnarx($zayavka_id,$product_id)
	{
		$asli2 = new Cyber();
		$z = $asli2->getdata('zayavka_msq',['id'=>$zayavka_id]);
		$p = $asli2->getdata('products',['id'=>$product_id]);
		return round((($z['summa']+$z['rmassa']*500)/$z['rmassa']) * $p['pr_koef'],2);
	}

	if(isset($_GET['id']) or isset($_GET['bulim_id'])){
		$method = $asli->get_method();
		if($method=="DELETE"){
			$sql = $asli->delete('polka',['id'=>$_GET['id']]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli o'chirildi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Xatolik malumot o'chirilmadi!"];
			}
		}
		if($method=="GET"){
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
			if(isset($_GET['id'])){				
				$polka = $asli->getdata('polka',['id'=>$_GET['id']]);
				$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);			
				$ret['id'] = $polka['id'];
				$ret['name'] = $polka['name'];
				$ret['bulim_name'] = $bulim['name'];
				$ret['bulim_id'] = $polka['bulim_id'];
				$asli->resp['data'] = $ret;
			}
			if(isset($_GET['bulim_id'])){				
				$i = 0;
				$polkas = $asli->getdatas('polka',['bulim_id'=>$_GET['bulim_id']]);
				foreach ($polkas as $key => $polka) {
					$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);
					$n = $asli->summaustun('saqlash_bulimi','qoldi',['status'=>'progres','polka_id'=>$polka['id']]);
					$ret[$i]['id'] = $polka['id'];
					$ret[$i]['name'] = $polka['name'];
					$ret[$i]['bulim_name'] = $bulim['name'];
					$ret[$i]['bulim_id'] = $polka['bulim_id'];
					$ret[$i]['nagruzka'] = $n;
					$i++;
				}
				$asli->resp['data'] = $ret;
			}
		}
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$product_id = $_GET['product_id'];
		$polka_id = $_GET['polka_id'];

		$pps = $asli->getdatas('putpolka',[],"product_id='$product_id' AND polka_id='$polka_id' AND massa>0");
		$product = $asli->getdata('products',['id'=>$_GET['product_id']]);
		$temp = [];
		$j = 0;
		$jami = 0;
		$ret['product'] = $asli->defilter($product['name']);
		foreach ($pps as $key => $pp) {
			$massa = $pp['massa'];
			if(round($massa,2)==0){
				continue;
			}
			if($pp['zayavka_msq_id']==0){
				if($pp['vozvrat_id']==0){
					$temp[$j]['partiya_nomer'] = "Qm".$pp['qaytam_partiya_id'];
				}
				else{
					$temp[$j]['partiya_nomer'] = "V".$pp['vozvrat_id'];
				}
			}
			else{
				$temp[$j]['partiya_nomer'] = "P".$pp['zayavka_msq_id'];
				$temp[$j]['narxi'] = getnarx($pp['zayavka_msq_id'],$product_id);
			}
			$temp[$j]['massa'] = round($massa,2);
			$jami += $temp[$j]['massa'];
			$j++;
		}
		$ret['jami'] = round($jami,2);
		$ret['list'] = $temp;
		$i++;
		$asli->resp['data'] = $ret;
	}
	$asli->print_json();
?>