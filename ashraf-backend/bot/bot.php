<?php

	/**
	 * 
	 */
	class BotCyber
	{
		private $token = "7576501480:AAH0JgzA9VUXZl7dyljKd-CJ0ypbzhAjH24";
		public $update;
		public $input;

		function __construct($input)
		{
			file_put_contents("input.txt", $input);
			$this->input = $input;
			$this->update = json_decode($input);
		}

		public function getXabar()
		{
			return $message = $this->update->message->text;
		}

		public function getChatId()
		{
			if (isset($this->update->callback_query)){
				return $this->update->callback_query->message->chat->id;
			}
			else{
				return $cid = $this->update->message->chat->id;	
			}			
		}

		public function getInput()
		{
			return $this->input;
		}
		public function getCallback()
		{
			$ret = [];
			// Callback ma'lumotlari
			if (isset($this->update->callback_query)) {
				$ret['isCall'] = true;
				$chatId = $this->update->callback_query->message->chat->id;
			    $callbackData = $this->update->callback_query->data; // Foydalanuvchi tanlagan callback
			    $callbackId = $update->callback_query->id; // Callback so'rov IDsi
				$ret['data'] = $callbackData;
				$ret['chatId'] = $chatId;
				$ret['id'] = $callbackId;
			}
			else{
				$ret['isCall'] = false;
			    // return false; //"Callback query mavjud emas.\n"
			}

			return $ret;
		}
		public function send($method,$datas=[]){
	        $url = "https://api.telegram.org/bot".$this->token."/".$method;
	        $ch = curl_init();
	        curl_setopt($ch,CURLOPT_URL,$url);
	        curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
	        curl_setopt($ch,CURLOPT_POSTFIELDS,$datas);
	        $res = curl_exec($ch);
	        if(curl_error($ch)){
	            var_dump(curl_error($ch));
	        }else{
	            return json_decode($res);
	        }
	    }
	    public function getMesgID()
	    {
	    	if(isset($this->update->callback_query)){
	    		return $this->update->callback_query->message->message_id;
	    	}
	    	else{
	    		return $this->update->message->message_id;;
	    	}	    	
	    }
	}

?>