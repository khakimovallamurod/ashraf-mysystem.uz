<?php
	include_once '../api/config.php';

	include_once 'bot.php';
	
	$input = json_decode();
	
	$asli = new Cyber();
	$bot = new BotCyber(file_get_contents('php://input'));

	
	// MENYU
	$m = [];
	$m[0] = "💸 Qarzdorlik"; $m[1] = "🧾 Sotuvlar tarixi 📑"; 
	$m[2] = "☎️ Aloqa"; $m[3] = "❓ Murojaat";
	// MENYU
	$menyukey = json_encode([
        'resize_keyboard'=>true,
        'keyboard'=>[
            [['text'=>$m[0]]],
            [['text'=>$m[1]],['text'=>$m[2]]], 
            [['text'=>$m[3]]],
        ]
    ]);
    $chat_id = $bot->getChatId();
	$user = $asli->getdata('clients',['telefon2'=>$bot->getChatId()],"telefon2='$chat_id' or manzil='$chat_id'");
    
	if(!($user['id']>0)){		
		$bot->send('sendMessage', [
	        'chat_id' => $bot->getChatId(),
	        'text' => "🕊🕸. Sizning id raqamingiz : ".$bot->getChatId()." \n Iltimos Ashraf-777 ga aloqaga chiqing va id raqamingizni yuboring yoki shu xabarni ularga jo'nating",
	    ]);
	    exit;
	}
	
	$worker = $asli->getdata('clients',['telefon2'=>$bot->getChatId()],"telefon2='$chat_id' or manzil='$chat_id'");
	if(!($worker['id']>0)){		
		$bot->send('sendMessage', [
            'chat_id' => $bot->getChatId(),
            'text' => "Kechirasiz siz ro'yxatdan o'tgansiz. Lekin ishchilar ro'yxatidan topilmadingiz! Adminga xabar bering telefon raqamlarni bir xil kiritishi lozim"
        ]);
        exit;
	}
    
	if($bot->getXabar()=="start" || $bot->getXabar()=="/start"){

		$user = $asli->getdata('clients',['telefon2'=>$bot->getChatId()],"telefon2='$chat_id' or manzil='$chat_id'");

		if($user['id']>0){
			$worker = $asli->getdata('clients',['id'=>$user['id']]);
			if($worker['id']>0){
				$bot->send('sendMessage', [
		            'chat_id' => $bot->getChatId(),
		            'text' => " Assalomu alaykum.".$user['fio']." Iltimos menyuni tanlang!",
		            'resize_keyboard'=>true,
            		'reply_markup'=>$menyukey
		        ]);
			}
			else{
				$bot->send('sendMessage', [
			        'chat_id' => $bot->getChatId(),
			        'text' => "🕊🕸. Sizga ruhsat etilmagan",
			    ]);
			}
		}
		else{
			$bot->send('sendMessage', [
		        'chat_id' => $bot->getChatId(),
		        'text' => "🕊🕸. Sizga ruhsat etilmagan",
		    ]);
		}
		exit;
	}

	if($bot->getXabar()==$m[0]){
		$worker_id = $worker['id'];
		$sana1 = strtotime(date("01.m.Y 00:00:00"));
		$sana2 = strtotime(date("d.m.Y 00:00:00"),time()+86400);
		$summa = $worker['balans'];
		$bot->send('sendMessage', [
            'chat_id' => $bot->getChatId(),
            'text' => "Sizning joriy qarzdorlik balansingiz : ".number_format($summa,2,".",","),
            'resize_keyboard'=>true,
    		'reply_markup'=>$menyukey
        ]);
        exit;
	}
	
	
	if($bot->getXabar()==$m[1]){
		$bot->send('sendMessage', [
		    'chat_id' => $bot->getChatId(),
		    'text' =>"Iltimos davrni tanlang",
		    'parse_mode' => 'markdown',
		    'reply_markup' => json_encode([
		        'inline_keyboard' => [
		            [
		            	['text' => "Yanvar",'callback_data'=>'yanvar_oylik'],
		            	['text' => "Fevral",'callback_data'=>'fevral_oylik'],
		            	['text' => "Mart",'callback_data'=>'mart_oylik'],
		            	['text' => "Aprel",'callback_data'=>'aprel_oylik']
		            ],
		            [
		            	['text' => "May",'callback_data'=>'may_oylik'],
		            	['text' => "Iyun",'callback_data'=>'iyun_oylik'],
		            	['text' => "Iyul",'callback_data'=>'iyul_oylik'],
		            	['text' => "Avgust",'callback_data'=>'avgust_oylik']
		            ],
		            [
		            	['text' => "Sentabr", 'callback_data'=>'sentabr_oylik'],
		            	['text' => "Oktabr", 'callback_data'=>'oktabr_oylik'],
		            	['text' => "Noyabr", 'callback_data'=>'noyabr_oylik'],
		            	['text' => "Dekabr", 'callback_data'=>'dekabr_oylik']
		            ]
		        ],                               
		    ]),
		]);
		exit;
	}

	$call = $bot->getCallback();

	if($call['isCall']){
		$bot->send('deleteMessage',[
			'chat_id' => $bot->getChatId(),
		    'message_id' => $bot->getMesgID()
		]);
		exit;
		$worker = $asli->getdata('workers',['telegram_id'=>$bot->getChatId()]);
		$oylar = [
			'yanvar_oylik' => [
				'sana1' => date("01.01.Y 00:00:00"),
				'sana2' => date("01.02.Y 00:00:00")
			],
			'fevral_oylik' => [
				'sana1' => date("01.02.Y 00:00:00"),
				'sana2' => date("01.03.Y 00:00:00")
			],
			'mart_oylik' => [
				'sana1' => date("01.03.Y 00:00:00"),
				'sana2' => date("01.04.Y 00:00:00")
			],
			'aprel_oylik' => [
				'sana1' => date("01.04.Y 00:00:00"),
				'sana2' => date("01.05.Y 00:00:00")
			],
			'may_oylik' => [
				'sana1' => date("01.05.Y 00:00:00"),
				'sana2' => date("01.06.Y 00:00:00")
			],
			'iyun_oylik' => [
				'sana1' => date("01.06.Y 00:00:00"),
				'sana2' => date("01.07.Y 00:00:00")
			],
			'iyul_oylik' => [
				'sana1' => date("01.07.Y 00:00:00"),
				'sana2' => date("01.08.Y 00:00:00")
			],
			'avgust_oylik' => [
				'sana1' => date("01.08.Y 00:00:00"),
				'sana2' => date("01.09.Y 00:00:00")
			],
			'sentabr_oylik' => [
				'sana1' => date("01.09.Y 00:00:00"),
				'sana2' => date("01.10.Y 00:00:00")
			],
			'oktabr_oylik' => [
				'sana1' => date("01.10.Y 00:00:00"),
				'sana2' => date("01.11.Y 00:00:00")
			],
			'noyabr_oylik' => [
				'sana1' => date("01.11.Y 00:00:00"),
				'sana2' => date("01.12.Y 00:00:00")
			],
			'dekabr_oylik' => [
				'sana1' => date("01.12.Y 00:00:00"),
				'sana2' => date("01.01.Y 00:00:00",time()+365*86400)
			]
		];
		$worker_id = $worker['id'];
		$sana1 = strtotime($oylar[$call['data']]['sana1']);
		$sana2 = strtotime($oylar[$call['data']]['sana2']);
		$bot->send('sendMessage', [
            'chat_id' => $bot->getChatId(),
            'text' => "Hisoblanmoqda. Iltimos kutib turing..."
        ]);
		$summa = $asli->summaustun('works','summa',[],"sana>='$sana1' AND sana<'$sana2' AND worker_id='$worker_id'");
		file_put_contents("summa.txt","Summa ".$summa);
		$ws = $asli->getdatas('works',[],"sana>='$sana1' AND sana<'$sana2' AND worker_id='$worker_id'");
		$tx = "";
		// Natijani ko'rsatish
		foreach ($ws as $item) {
		    $tx .= "ID: " . $item['id'] . "\n";
		    $tx .= "Summa: " . $item['summa'] . "\n";
		    $tx .= "Izoh: " . $item['izoh'] . "\n";
		    $tx .= "Sana: " . date('Y-m-d', $item['sana']) . "\n";
		    $tx .= "Vaqt: " . $item['vaqt'] . "\n";
		    $tx .= "--------------\n";
		}
		$filePath = $bot->getChatId()."-ishlar.txt";
		file_put_contents($filePath, $tx);
		$bot->send('sendDocument', [
            'chat_id' => $bot->getChatId(),
            'document' => new CURLFile($filePath),
            'caption' => "Davrda hisoblangan summa : ".number_format($summa,2,".",",")
        ]);
        // unlink($filePath);
        exit;
	}
?>    