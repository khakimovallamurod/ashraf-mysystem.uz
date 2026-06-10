<?php
include_once '../header.php';
include_once '../config.php';

$asli = new Cyber();
$ret = [];

$asli->allow_method = ['GET'];
$asli->allow_rolls = ['sotuv', 'admin'];

$asli->check_ip();
$asli->check_method();
$asli->check_rolls();

$client_id = isset($_GET['client_id']) ? intval($_GET['client_id']) : 0;
$sana1 = isset($_GET['sana1']) ? $asli->filter($_GET['sana1']) : '';
$sana2 = isset($_GET['sana2']) ? $asli->filter($_GET['sana2']) : '';

$shart = "1";
if($client_id > 0){
    $shart .= " AND client_id='$client_id'";
}
if(strlen($sana1)>0 && strlen($sana2)>0){
    $ts1 = strtotime($sana1);
    $ts2 = strtotime($sana2);
    $shart .= " AND sana>='$ts1' AND sana<'$ts2'";
}
$shart .= " ORDER BY id DESC";

$asli->resp += ['success' => true, 'message' => "Muvaffiqqiyatli"];
$historys = $asli->getdatas('pay_client_history', [], $shart);
$ret = [];
$i = 0;
foreach ($historys as $key => $history) {
    $client = $asli->getdata('clients', ['id' => $history['client_id']]);
    $ret[$i]['id'] = $history['id'];
    $ret[$i]['client_id'] = $history['client_id'];
    $ret[$i]['mijoz'] = $asli->defilter($client['fio']);
    $ret[$i]['summa'] = $history['summa'];
    $ret[$i]['naqdsum'] = $history['naqdsum'];
    $ret[$i]['naqdusd'] = $history['naqdusd'];
    $ret[$i]['valyuta'] = $history['valyuta'];
    $ret[$i]['bank'] = $history['bank'];
    $ret[$i]['karta'] = $history['karta'];
    $ret[$i]['izoh'] = $history['izoh'];
    $ret[$i]['code'] = $history['code'];
    $ret[$i]['status'] = $history['status'];
    $ret[$i]['sana'] = $history['sana'];
    $ret[$i]['vaqt'] = $history['created_at'];
    $i++;
}

$asli->resp['data'] = $ret;
$asli->print_json();
?>