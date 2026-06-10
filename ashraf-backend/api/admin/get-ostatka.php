<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['GET','DELETE'];
	$asli->allow_rolls = ['admin','yuklovchi','maydalash','saqlash'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();


	function getnarx($zayavka_id,$product_id)
	{
		$asli2 = new Cyber();
		$z = $asli2->getdata('zayavka_msq',['id'=>$zayavka_id]);
		$p = $asli2->getdata('products',['id'=>$product_id]);
		if($z['rmassa']==0){
			return 0;
		}
		else{
			return round((($z['summa']+$z['rmassa']*500)/$z['rmassa']) * $p['pr_koef'],2);
		}		
	}

	$data = file_get_contents("php://input");
	$data = json_decode($data);

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
		$jamisumma = 0;
		$polkas = $asli->getdatas('polka',[],"1");
		foreach ($polkas as $key => $polka) {
			$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);
			$ret[$i]['id'] = $polka['id'];
			$ret[$i]['name'] = $polka['name'];
			$ret[$i]['bulim_name'] = $bulim['name'];
			$ret[$i]['bulim_id'] = $polka['bulim_id'];
			$products = $asli->getdatas('products',[],"1");
			$temp = [];
			$j = 0;
			$jami = 0;
			$summa = 0;
			foreach ($products as $key2 => $product) {
				$product_id = $product['id'];
				$polka_id = $polka['id'];
				$massa = $asli->summaustun('putpolka','massa',[],"product_id='$product_id' AND polka_id='$polka_id' AND massa>0");
				if(round($massa,2)==0){
					continue;
				}
				$jm = 0;
				$temp[$j]['product_id'] = $product_id;
				$temp[$j]['product_name'] = $asli->defilter($product['name']);
				$pps = $asli->getdatas('putpolka',[],"product_id='$product_id' AND polka_id='$polka_id' AND massa>0");
				foreach ($pps as $key => $pp) {
					$massa = $pp['massa'];
					if(round($massa,2)==0){
						continue;
					}
					$jm += $massa;
					$summa += round($massa * getnarx($pp['zayavka_msq_id'],$product_id),2);
				}
				
				$temp[$j]['massa'] = round($jm,2);
				$temp[$j]['summa'] = round($summa,2);
				$jami += round($massa,2);
				$j++;
			}
			$jamisumma += $summa;
			$ret[$i]['nagruzka'] = round($jami,2);
			$ret[$i]['summa'] = round($summa,2);
			$ret[$i]['mahsulotlar'] = $temp;
			$i++;
		}
		$ans['summa'] = $jamisumma;
		$ans['ostatka'] = $ret;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>