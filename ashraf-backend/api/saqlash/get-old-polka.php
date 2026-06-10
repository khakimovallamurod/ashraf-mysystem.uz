<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();
	$ret = [];

	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['saqlash','admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	$ret = [];
	if(isset($_GET['id']) || isset($_GET['bulim_id'])){
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		if(isset($_GET['id'])){
			$polka = $asli->getdata('polka',['id'=>$_GET['id']]);
			$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);			
			$ret['id'] = $polka['id'];
			$ret['name'] = $polka['name'];
			$ret['bulim_name'] = $bulim['name'];
			$ret['bulim_id'] = $polka['bulim_id'];
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
		}
		$asli->resp['data'] = $ret;
	}
	else{
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		$i = 0;
		$jamimassa = 0;
		$jamiolindi = 0;
		$jamiqoldi = 0;
		$polkas = $asli->getdatas('polka',['bulim_id'=>1]);
		foreach ($polkas as $key => $polka) {
			$bulim = $asli->getdata('bulim',['id'=>$polka['bulim_id']]);
			$n = $asli->summaustun('saqlash_bulimi','qoldi',['status'=>'joylandi','polka_id'=>$polka['id']]);
			$ret[$i]['id'] = $polka['id'];
			$ret[$i]['name'] = $asli->defilter($polka['name']);
			$ret[$i]['bulim_name'] = $asli->defilter($bulim['name']);
			$ret[$i]['bulim_id'] = $polka['bulim_id'];
			$ret[$i]['nagruzka'] = round($n,2);
			$temp = [];
			$j = 0;
			if(isset($_GET['sana1']) && isset($_GET['sana2'])){
				$sana1 = strtotime($_GET['sana1']);
				$sana2 = strtotime($_GET['sana2']);
				$sbhistorys = $asli->getdatas('saqlash_bulimi',[],"status='tugatildi' AND polka_id='".$polka['id']."' AND endtime>='$sana1' AND endtime<'$sana2' ORDER BY vaqt ASC");
			}
			else{
				$sbhistorys = $asli->getdatas('saqlash_bulimi',[],"status='tugatildi' AND polka_id='".$polka['id']."' ORDER BY vaqt DESC LIMIT 50");
			}			
			foreach ($sbhistorys as $key => $sbhistory) {				
				$temp[$j]['id'] = $sbhistory['id'];
				$temp[$j]['pnomer'] = "K".$sbhistory['partiya_id'];
				$temp[$j]['kirish_vaqti'] = date("d.m.Y H:i:s",strtotime($sbhistory['vaqt']));
				$temp[$j]['vaqt'] = date("d.m.Y H:i:s",$sbhistory['endtime']);
				$temp[$j]['saqlangan_soat'] = round(($sbhistory['endtime']-strtotime($sbhistory['vaqt']))/3600);
				$temp[$j]['massa'] = $sbhistory['massa'];
				$temp[$j]['olindi'] = $sbhistory['olindi'];
				$temp[$j]['qoldi'] = round($sbhistory['qoldi'],2);
				$temp[$j]['paterya'] = round($sbhistory['qoldi']/$sbhistory['massa'],3)*100;
				$jamimassa += $sbhistory['massa'];
				$jamiolindi += $sbhistory['olindi'];
				$jamiqoldi += $sbhistory['qoldi'];
				$j++;
			}
			$ret[$i]['history_krim'] = $temp;
			$i++;
		}
		$ans['jami'] = round($jamimassa,2);
		$ans['jamiolindi'] = round($jamiolindi,2);
		$ans['jamiqoldi'] = round($jamiqoldi,2);
		
		if($jamimassa==0){
			$ans['paterya_foiz'] = 0;
		}
		else{
			$ans['paterya_foiz'] = round($jamiqoldi/$jamimassa,2)*100;
		}
		$ans['list'] = $ret;
		$asli->resp['data'] = $ans;
	}
	$asli->print_json();
?>