<?php
	include_once '../header.php';
	include_once '../config.php';

	$asli = new Cyber();
	$asli->allow_method = ['GET'];
	$asli->allow_rolls = ['sotuv','admin'];
	$asli->check_ip();
	$asli->check_method();
	$asli->check_rolls();

	// Razilka jadvali yo'q bo'lsa yaratish
	$asli->query("CREATE TABLE IF NOT EXISTS razilka (
		id INT PRIMARY KEY AUTO_INCREMENT,
		product_id INT NOT NULL,
		product_name VARCHAR(255) DEFAULT '',
		massa FLOAT NOT NULL DEFAULT 0,
		manba VARCHAR(20) DEFAULT 'xolodelnik',
		user_id INT DEFAULT 0,
		sana BIGINT DEFAULT 0,
		vaqt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		status VARCHAR(20) DEFAULT 'razilkada',
		izoh TEXT
	)");

	$bugun = date("d.m.Y");
	$p = $asli->getdata('partiya',['kun'=>$bugun]);

	$ret = [];
	$products = $asli->getdatas('products',[],"id>1");

	foreach ($products as $key => $product) {
		// Xolodelnikdagi massa
		$xol = $asli->getdata('xolodelnik',['product_id'=>$product['id']]);
		$xol_massa = round(floatval($xol['massa'] ?? 0), 2);

		// Bugungi svejiy (krimproducts) massa
		$svejiy_massa = 0;
		if($p['id'] > 0){
			$svejiy_massa = round(floatval($asli->summaustun('krimproducts','massa',['product_id'=>$product['id'],'partiya_id'=>$p['id']])), 2);
		}

		$ret[] = [
			'id'          => intval($product['id']),
			'name'        => $asli->defilter($product['name']),
			'article'     => $product['article'],
			'xol_massa'   => $xol_massa,
			'svejiy_massa'=> $svejiy_massa,
		];
	}

	$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
	$asli->resp['data'] = $ret;
	$asli->print_json();
?>
