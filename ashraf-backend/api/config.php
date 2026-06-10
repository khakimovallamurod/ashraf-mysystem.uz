<?php
	date_default_timezone_set("Asia/Tashkent");
    error_reporting(0);
	class Cyber
    {
        private $url;
        private $host;
        private $user_db;
        private $password;
        private $db;
        private $link;
        private $api_key;
        public $kalit;
        private $tokentime = 7200;
        public $allow_method = array('POST','GET');
        public $allow_rolls = array('*');
        public $resp = array();

        function __construct(){
            $this->url = "http://brothers-system.uz/";
            $this->host = "localhost";
            $this->user_db = "root";
            $this->password = "";
            $this->db = "ashrafdb";
            $this->api_key = '7576501480:AAH0JgzA9VUXZl7dyljKd-CJ0ypbzhAjH24';
            $this->link = mysqli_connect($this->host, $this->user_db, $this->password, $this->db);
            mysqli_set_charset($this->link, "utf8");
            $this->resp['data'] = [];
            $this->getostatka();
        }
        public function gettokentime()
        {
            return $this->tokentime;
        }
        public function begintranz()
        {
            return mysqli_begin_transaction($this->link);
        }
        public function endtranz()
        {
            return mysqli_commit($this->link);
        }
        public function bekor()
        {
            return mysqli_rollback($this->link);
        }
        public function insert($table,$arr){
            $sql = "INSERT INTO $table ";
            $sqltxt1 = "";
            $sqltxt2 = "";
            $n = count($arr);
            $i=0;
            foreach ($arr as $key => $value) {
                $i++;
                if($i==$n){
                    $sqltxt1 .= "$key";
                    $sqltxt2 .= "'".$this->filter($value)."'";
                }
                else{
                    $sqltxt1 .= "$key,";
                    $sqltxt2 .= "'".$this->filter($value)."',";
                }                
            }
            $sql .= "($sqltxt1) VALUES ($sqltxt2)";
            return $this->query($sql);
        }
        public function update($table,$arr,$cond,$shart="no"){
            $sql = "UPDATE $table SET ";            
            $n = count($arr);
            $i=0;
            foreach ($arr as $key => $value) {
                $i++;
                if($i==$n){
                    $sql .= "$key="."'".$this->filter($value)."'";                    
                }
                else{
                    $sql .= "$key="."'".$this->filter($value)."',";
                }                
            }
            
            if($shart=="no"){
                $sql .= " WHERE ";
                foreach ($cond as $key => $value) {
                    $sql .= " $key='".$value."'";
                    break;
                }
            }
            else{
                $sql .= "WHERE $shart";
            }
            return $this->query($sql);
        }
        public function delete($table,$cond,$shart="no"){
            $sql = "DELETE FROM $table ";
            if($shart=="no"){
                $sql .= "WHERE ";
                $i = 0;
                foreach ($cond as $key => $value) {
                    $i++;
                    if($i>=2){
                        $sql .= "AND $key='".$this->filter($value)."'";
                    }
                    else{
                        $sql .= " $key='".$this->filter($value)."'";
                    }                    
                }
            }
            else{
                $sql .= "WHERE ".$this->filter($shart);
            }
            return $this->query($sql);
        }
        public function select($table,$cond,$shart="no"){
            $sql = "SELECT * FROM $table ";
            if($shart=="no"){
                $sql .= " WHERE ";
                foreach ($cond as $key => $value) {
                    $sql .= " $key='".$this->filter($value)."'";
                    break;
                }
            }
            else{
                $sql .= "WHERE ".$this->filter($shart);
            }
            return $this->query($sql);
        }
        public function getdata($table,$cond,$shart="no"){
            $sql = "SELECT * FROM $table ";
            if($shart=="no"){
                $sql .= " WHERE ";
                $i = 0;
                foreach ($cond as $key => $value) {
                    $i++;
                    if($i>=2){
                        $sql .= "AND $key='".$this->filter($value)."'";
                    }
                    else{
                        $sql .= " $key='".$this->filter($value)."'";
                    }                    
                }
            }
            else{
                $sql .= "WHERE ".$shart;
            }            
            $sql = $this->query($sql);
            $fetch = mysqli_fetch_assoc($sql);
            
            return $fetch;
        }
        public function getdatas($table,$cond,$shart="no"){
            $sql = "SELECT * FROM $table ";
            if($shart=="no"){
                $sql .= " WHERE ";
                $i = 0;                
                foreach ($cond as $key => $value) {
                    $i++;
                    if($i>=2){
                        $sql .= "AND $key='".$this->filter($value)."'";
                    }
                    else{
                        $sql .= " $key='".$this->filter($value)."'";
                    }                    
                }
            }
            else{
                $sql .= "WHERE ".$shart;
            }            
            $result = array();
            $sql = $this->query($sql);
            while ($fetch = mysqli_fetch_assoc($sql)){
                array_push($result, $fetch);
                // $result += $fetch;
            }
            return $result;
        }
        public function getdatalast($table,$cond,$shart="no"){
            $sql = "SELECT * FROM $table ";
            if($shart=="no"){
                $sql .= " WHERE ";
                foreach ($cond as $key => $value) {
                    $sql .= " $key='".$this->filter($value)."'";
                    break;
                }
            }
            else{
                $sql .= "WHERE ".$shart;
            }
            $result = array();
            $sql .= " ORDER BY id DESC";
            $sql = $this->query($sql);
            while ($fetch = mysqli_fetch_assoc($sql)){   
                array_push($result, $fetch);
                // $result += $fetch;                
            }
            return $result;
        }
        public function gettabledata($table){
            $sql = "SELECT * FROM $table";
            $result = array();
            $sql = $this->query($sql);
            while ($fetch = mysqli_fetch_assoc($sql)){
                array_push($result, $fetch);
                // $result += $fetch;
            }
            return $result;
        }
        public function getdatajson($table,$cond,$shart="no"){
            $sql = "SELECT * FROM $table ";
            if($shart=="no"){
                $sql .= " WHERE ";
                foreach ($cond as $key => $value) {
                    $sql .= " $key='".$this->filter($value)."'";
                    break;
                }
            }
            else{
                $sql .= "WHERE ".$shart;
            }
            $result = array();
            while ($fetch = mysqli_fetch_assoc($this->query($sql))) {
                $result += $fetch;
            }
            $json = json_encode($result);
            return $json;
        }
        public function getostatka(){
            $bugun = date("d.m.Y");
            $p = $this->getdata('partiya',['kun'=>$bugun]);
            if($p['id']>0){
                $p_id = $p['id'];
            }
            else{
                $sql = $this->insert('partiya',[
                    'kun' => $bugun,
                    'sana' => time()
                ]);
                if(!$sql){
                    exit('Kun yozilmadi');
                }                
            }
            $sana = date("Y-m-d 00:00:00");
            $sana = strtotime($sana);
            $sanatext = date("d.m.Y");
            $polkas = $this->getdatas('polka',[],"1");
            $ds = $this->getdatas('history_day_qoldiq',['sana' => $sana,
                    'sanatext' => $sanatext]);
            if(count($polkas)==count($ds)){
                return true;
            }
            else{
                foreach ($polkas as $key => $polka) {
                    $d = $this->getdata('history_day_qoldiq',[
                        'polka_id' => $polka['id'],
                        'sana' => $sana,
                        'sanatext' => $sanatext
                    ]);
                    if($d['id']>0){
                        continue;
                    }
                    else{
                        $polka_id = $polka['id'];
                        $datas = $this->getdatas('putpolka',[],"polka_id='$polka_id' AND massa>0");
                        $temp = [];
                        $i = 0;
                        $jami = 0;
                        foreach ($datas as $key => $data) {
                            if(round($data['massa'],2)==0){
                                continue;
                            }
                            $product = $this->getdata('products',['id'=>$data['product_id']]);
                            $temp[$i]['product_id'] = $data['product_id'];
                            $temp[$i]['product_name'] = $this->defilter($product['name']);
                            if($data['zayavka_msq_id']>0){
                                $temp[$i]['partiya'] = "P".$data['zayavka_msq_id'];    
                            }
                            if($data['qaytam_partiya_id']>0){
                                $temp[$i]['partiya'] = "Qm".$data['qaytam_partiya_id'];    
                            }
                            if($data['vozvrat_id']>0){
                                $temp[$i]['partiya'] = "V".$data['qaytam_partiya_id'];    
                            }
                            $temp[$i]['putpolka_id'] = $data['id'];
                            $temp[$i]['massa'] = round($data['massa'],2);
                            $jami += $data['massa'];
                            $i++;
                        }
                        $ans['jami'] = round($jami,2);
                        $ans['ostatka'] = $temp;
                        $sql = $this->insert('history_day_qoldiq',[
                            'sana' => $sana,
                            'massa' => $jami,
                            'sanatext' => $sanatext,
                            'ostatka' => json_encode($ans),
                            'polka_id' => $polka_id
                        ]);
                    }
                }
            }
        }
        public function filter($s){
            $s = trim($s);
            $s = htmlspecialchars($s, ENT_QUOTES);
            // $s = str_replace("'", "\'", $s);
            return $s;
        }
        public function defilter($s){
            // $s = str_replace("'", "\'", $s);
            return htmlspecialchars_decode($s, ENT_QUOTES);
        }
        public function filterphone($telefon){
            $arr = array("0","1","2","3","4","5","6","7","8","9");
            $ret = "";
            for ($i=0; $i < strlen($telefon); $i++) { 
                if(in_array($telefon[$i], $arr)){
                    $ret .= $telefon[$i];
                }                
            }

            return $ret;
        }
        public function bot($method,$datas=[]){
            $url = "https://api.telegram.org/bot".$this->api_key."/".$method;
            $ch = curl_init();
            curl_setopt($ch,CURLOPT_URL,$url);
            curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
            curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,3);
            curl_setopt($ch,CURLOPT_TIMEOUT,5);
            curl_setopt($ch,CURLOPT_POSTFIELDS,$datas);
            $res = curl_exec($ch);
            if(curl_error($ch)){
                curl_close($ch);
                return false;
            }
            curl_close($ch);
            return json_decode($res);
        }
        public function sendsms($telefon, $msg){
            $client = $this->getdata('clients',['telefon'=>$telefon]);

            if(strlen($client['telefon2'])>0 OR strlen($client['manzil'])>0){

                if(strlen($client['manzil'])>0){
                    $chat_id = $client['manzil'];
                }
                if(strlen($client['telefon2'])>0){
                    $chat_id = $client['telefon2'];
                }
                $this->bot('sendMessage', [
                    'chat_id' => "608913545",
                    'text' => "Salom $msg"
                ]);
                $this->bot('sendMessage', [
                    'chat_id' => $chat_id,
                    'text' => $msg
                ]);
                return true;
            }
            $taminotchi = $this->getdata('taminotchi',['telefon'=>$telefon]);
            if(strlen($taminotchi['telegram_id'])>0){

                $this->bot('sendMessage', [
                    'chat_id' => "608913545",
                    'text' => "Salom $msg"
                ]);
                $this->bot('sendMessage', [
                    'chat_id' => $taminotchi['telegram_id'],
                    'text' => $msg
                ]);
                return true;
            }
            $telefon = $this->filterphone($telefon);
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => "http://91.204.239.44/broker-api/send",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "{ \"messages\": [ { \"recipient\": \"$telefon\", \"message-id\": \"2016256\", \"sms\": { \"originator\": \"3700\", \"content\": { \"text\": \"ASHRAF-777 $msg\" } } } ] }",
                CURLOPT_HTTPHEADER => array(
                 "Authorization: Basic c2FtZHU6eDlBYWJDTkZa",
                  "Cache-Control: no-cache",
                  "Content-Type: application/json",
                ),
            ));
            // dmFraGlkb3Zncm91cGx0ZDpQQzh6eFB4SGc4Iyg=
            // Samdu c2FtZHU6eDlBYWJDTkZa
            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                return $err;
            }
            else {
                return "ok";
            }
        }
        public function summaustun($table,$ustun,$cond,$shart="no")
        {
            $sql = "SELECT SUM($ustun) AS s FROM $table ";
            if($shart=="no"){
                $sql .= " WHERE ";
                $i = 0;
                foreach ($cond as $key => $value) {
                    $i++;
                    if($i>=2){
                        $sql .= "AND $key='".$this->filter($value)."'";
                    }
                    else{
                        $sql .= " $key='".$this->filter($value)."'";
                    }                    
                }
            }
            else{
                $sql .= "WHERE ".$shart;
            }
            $sql = $this->query($sql);
            $fetch = mysqli_fetch_assoc($sql);
            
            return $fetch['s'];
        }
        public function countustun($table,$ustun,$cond,$shart="no")
        {
            $sql = "SELECT COUNT($ustun) AS s FROM $table ";
            if($shart=="no"){
                $sql .= " WHERE ";
                $i = 0;
                foreach ($cond as $key => $value) {
                    $i++;
                    if($i>=2){
                        $sql .= "AND $key='".$this->filter($value)."'";
                    }
                    else{
                        $sql .= " $key='".$this->filter($value)."'";
                    }                    
                }
            }
            else{
                $sql .= "WHERE ".$shart;
            }            
            $sql = $this->query($sql);
            $fetch = mysqli_fetch_assoc($sql);
            
            return $fetch['s'];
        }
        public function getAuthorizationHeader($value='')
        {
        	$headers = null;
		    if (isset($_SERVER['Authorization'])) {
		        $headers = trim($_SERVER["Authorization"]);
		    }
		    else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
		        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
		    } elseif (function_exists('apache_request_headers')) {
		        $requestHeaders = apache_request_headers();
		        // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
		        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
		        //print_r($requestHeaders);
		        if (isset($requestHeaders['Authorization'])) {
		            $headers = trim($requestHeaders['Authorization']);
		        }
		    }
		    return $headers;
        }
        public function getBearerToken()
        {
        	$headers = $this->getAuthorizationHeader();
		    // HEADER: Get the access token from the header
		    if (!empty($headers)) {
		        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
		            return $matches[1];
		        }
		    }
		    return null;
        }
        public function get_json_input($assoc = false)
        {
            static $cache = null;
            static $assocCache = null;

            if ($cache === null) {
                $raw = file_get_contents("php://input");
                $cache = json_decode($raw);
                $assocCache = json_decode($raw, true);
            }

            return $assoc ? ($assocCache ?: []) : ($cache ?: (object) []);
        }
        public function is_token_valid($user)
        {
            return isset($user['id']) && $user['id'] > 0 && isset($user['tokentime']) && (time() - (int) $user['tokentime'] < $this->gettokentime());
        }
        public function get_auth_user()
        {
            $token = $this->getBearerToken();
            if (!$token) {
                return [];
            }

            return $this->getdata('user',['token'=>$token]);
        }
        public function sanitize_user($user)
        {
            if (!is_array($user) || !isset($user['id'])) {
                return [];
            }

            unset($user['parol']);
            unset($user['tokentime']);
            unset($user['token']);
            return $user;
        }
        public function getrol()
        {
        	$data = $this->get_auth_user();
        	if($this->is_token_valid($data)){
        		return $data['rol'];
        	}
		    else{
		    	return "UNKNOWN";
		    }
        }
        public function get_client_ip() {
		    $ipaddress = '';
		    if (getenv('HTTP_CLIENT_IP'))
		        $ipaddress = getenv('HTTP_CLIENT_IP');
		    else if(getenv('HTTP_X_FORWARDED_FOR'))
		        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
		    else if(getenv('HTTP_X_FORWARDED'))
		        $ipaddress = getenv('HTTP_X_FORWARDED');
		    else if(getenv('HTTP_FORWARDED_FOR'))
		        $ipaddress = getenv('HTTP_FORWARDED_FOR');
		    else if(getenv('HTTP_FORWARDED'))
		       $ipaddress = getenv('HTTP_FORWARDED');
		    else if(getenv('REMOTE_ADDR'))
		        $ipaddress = getenv('REMOTE_ADDR');
		    else
		        $ipaddress = 'UNKNOWN';
		    return $ipaddress;
		}
		public function response($code)
        {
            switch ($code) {
                case 100: $text = 'Continue'; break;
                case 101: $text = 'Switching Protocols'; break;
                case 200: $text = 'OK'; break;
                case 201: $text = 'Created'; break;
                case 202: $text = 'Accepted'; break;
                case 203: $text = 'Non-Authoritative Information'; break;
                case 204: $text = 'No Content'; break;
                case 205: $text = 'Reset Content'; break;
                case 206: $text = 'Partial Content'; break;
                case 300: $text = 'Multiple Choices'; break;
                case 301: $text = 'Moved Permanently'; break;
                case 302: $text = 'Moved Temporarily'; break;
                case 303: $text = 'See Other'; break;
                case 304: $text = 'Not Modified'; break;
                case 305: $text = 'Use Proxy'; break;
                case 400: $text = 'Bad Request'; break;
                case 401: $text = 'Unauthorized'; break;
                case 402: $text = 'Payment Required'; break;
                case 403: $text = 'Forbidden'; break;
                case 404: $text = 'Not Found'; break;
                case 405: $text = 'Method Not Allowed'; break;
                case 406: $text = 'Not Acceptable'; break;
                case 407: $text = 'Proxy Authentication Required'; break;
                case 408: $text = 'Request Time-out'; break;
                case 409: $text = 'Conflict'; break;
                case 410: $text = 'Gone'; break;
                case 411: $text = 'Length Required'; break;
                case 412: $text = 'Precondition Failed'; break;
                case 413: $text = 'Request Entity Too Large'; break;
                case 414: $text = 'Request-URI Too Large'; break;
                case 415: $text = 'Unsupported Media Type'; break;
                case 500: $text = 'Internal Server Error'; break;
                case 501: $text = 'Not Implemented'; break;
                case 502: $text = 'Bad Gateway'; break;
                case 503: $text = 'Service Unavailable'; break;
                case 504: $text = 'Gateway Time-out'; break;
                case 505: $text = 'HTTP Version not supported'; break;
                default:
                    exit('Unknown http status code "' . htmlentities($code) . '"');
                break;
            }

            $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
            header($protocol . ' ' . $code . ' ' . $text);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['success' => false, 'message' => $text, "error_code" => $code]);
            // http_response_code($code);
            exit;
        }
        public function check_ip()
        {
        	$ip = $this->get_client_ip();
        	$data = $this->getdata('block_list',['ip'=>$ip]);
        	if($data['status']=='blocked'){
        		$this->response(403);
        	}
        }
        public function check_method()
        {
        	$method = $this->get_method();
        	if(!in_array($method, $this->allow_method)){
        		$this->response(405);
        	}
        }
        public function check_rolls()
        {
        	$rol = $this->getrol();
        	if(!in_array($rol, $this->allow_rolls)){
        		$this->response(401);
        	}
        	else{
        		$token = $this->getBearerToken();
                if($token){
        		    $data = $this->update('user',['tokentime'=>time()],['token'=>$token]);
                }
        	}
        }
        public function get_method()
        {
        	return $_SERVER['REQUEST_METHOD'];
        }
        public function print_json()
        {
            if($this->resp['data']==""){
                $this->resp['data'] = [];
            }
            echo json_encode($this->resp);
        }
        public function query($sql)
        {
            return mysqli_query($this->link,"$sql");
        }
        function __destruct() {
            mysqli_close($this->link);
        }
    }
