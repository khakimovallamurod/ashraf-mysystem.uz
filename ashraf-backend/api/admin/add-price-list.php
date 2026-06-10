<?php	
	include_once '../header.php';

	include_once '../config.php';

	$asli = new Cyber();

	$asli->allow_method = ['POST'];
	$asli->allow_rolls = ['admin'];

	$asli->check_ip();

	$asli->check_method();


	$asli->check_rolls();

	$data = file_get_contents("php://input");
	$data = json_decode($data);
	
	if(isset($data->category_id) && count($data->products_list)>0){
		$asli->begintranz();
		$asli->kalit = 1;
		$categorys = $data->products_list;
		foreach ($categorys as $key => $category) {
			$prl = $asli->getdata('price_list',['product_id'=>$category->product_id,'category_id'=>$data->category_id]);
			if($prl['id']>0){
				$sql = $asli->update('price_list',['price'=>$category->price],['id'=>$prl['id']]);
			}
			else{
				$sql = $asli->insert('price_list',[
					'price'=>$category->price,
					'category_id'=>$data->category_id,
					'product_id'=>$category->product_id
				]);
			}
			if(!$sql){
				$asli->kalit = 0;
			}
		}
		if($asli->kalit==1){
			$asli->endtranz();
			$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli qo'shildi"];
		}
		else{
			$asli->bekor();
			$asli->resp += ['success'=> false, 'message' => "Xatolik! Qo'shilmadi"];
		}
	}
	else{
		$asli->response(403);
	}
	$asli->print_json();
?>