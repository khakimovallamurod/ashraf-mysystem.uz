<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['admin','sotuv','agent'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);

	if(isset($data->fio) && strlen($data->fio)>2 && isset($data->telefon) && isset($data->korxona) && isset($data->manzil)){
		$client = $asli->getdata('clients',['telefon'=>$asli->filterphone($data->telefon)]);
		if($client['id']>0){
			$asli->resp += ['success'=> false, 'message' => "Bu mijoz allaqachon qo'shilgan!"];
		}
		else{			
			$sql = $asli->insert('clients',[
				'fio' => $data->fio,
				'telefon' => $data->telefon,
				'telefon2' => $data->telefon2,
				'telefon3' => $data->telefon3,
				'korxona' => $data->korxona,
				'manzil' => $data->manzil,
				'lokatsiya' => $data->lokatsiya,
				'latitude' => $data->latitude,
				'longitude' => $data->longitude,
				'viloyat_id' => $data->viloyat_id,
				'tuman_id' => $data->tuman_id,
				'category_id' => $data->category_id,
				'dostavka_id' => $data->dostavka_id
			]);
			if($sql){
				$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qo'shildi"];
			}
			else{
				$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
			}
		}		
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>