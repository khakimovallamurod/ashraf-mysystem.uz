<?php
	include_once 'config.php';
	$asli = new Cyber();
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Hisobot oborotka</title>
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/2.1.5/css/dataTables.dataTables.css">
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/3.1.2/css/buttons.dataTables.css">
</head>
<body>
	<form action="farq.php" method="GET">
		<select name="agent_id">
			<option value="-1">~ Tanlang ~</option>
			<?php
				$users = $asli->getdatas('user',['rol'=>'agent']);
				foreach ($users as $key => $user) {
					?>
					<option <?if($_GET['agent_id']==$user['id']){echo "selected";}?> value="<?=$user['id']?>">
						<?=$asli->defilter($user['familya']." ".$user['familya'])?>
					</option>
					<?
				}
			?>
		</select>
		<select name="dostavka_id">
			<option value="-1">~ Tanlang ~</option>
			<?php
				$users = $asli->getdatas('user',['rol'=>'dostavka']);
				foreach ($users as $key => $user) {
					?>
					<option <?if($_GET['dostavka_id']==$user['id']){echo "selected";}?> value="<?=$user['id']?>">
						<?=$asli->defilter($user['familya']." ".$user['familya'])?>
					</option>
					<?
				}
			?>
		</select>
		<input type="date" name="sana1" value="<?=$_GET['sana1']?>">
		<input type="date" name="sana2" value="<?=$_GET['sana2']?>">
		<button type="submit">Filtrlash</button>
	</form>
	<table id="example" class="display nowrap" style="width:100%">
        <thead>
            <tr>
                <th>Id</th>
                <th>Sales ID</th>
                <th>Mijoz</th>
                <th>Eski qarz</th>
                <th>Debet</th>
                <th>Kredit</th>
                <th>Saldo</th>
            </tr>
        </thead>
        <tbody>
    
<?php

	function get_akt($client_id,$sana1,$sana2){
		$asli = new Cyber();
		$client_id = $asli->filter($client_id);
		$eski_kredit = 0;
		$eski_debit = 0;
		$pays = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana<'$sana1'");
		$eski_kredit += $pays;
		$sales = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana<'$sana1'");
		$eski_debit += $sales;
		$vozvrats = $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana<'$sana1'");
		$eski_kredit += $vozvrats;
		$eski_balans = round($eski_debit - $eski_kredit,2);
		$jamidebit = $asli->summaustun('sale_orders','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
		$jamitolov = $asli->summaustun('debithistory','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
		$jamikredit = $jamitolov;
		$jamikredit += $asli->summaustun('vozvrat','summa',[],"client_id='$client_id' AND sana>='$sana1' AND sana<'$sana2'");
		$saldo = round($eski_balans + $jamidebit - $jamikredit,2);
		$ret['eski_balans'] = $eski_balans;
		$ret['jamidebit'] = $jamidebit;
		$ret['jamikredit'] = $jamikredit;
		$ret['jamitolov'] = $jamitolov;
		$ret['saldo'] = $saldo;
		return $ret;
		/*
		$sql = $asli->update('clients',[
			'balans' => round($saldo,2)
		],['id'=>$client_id]);
		$ch = $asli->getdata('sale_orders',[],"client_id='$client_id' AND (status='tekshirildi' OR status='tayyorlanmoqda' OR status='new' OR status='tayyorlandi' OR status='tekshirilmoqda' OR  status='dostavka') ORDER BY id DESC LIMIT 1");
		if($ch['id']>0){
			if($ch['status']=='tekshirildi' || $ch['status']=='dostavka'){
				$sql = $asli->update('sale_orders',[
					'old_client_balans' => round($saldo - $ch['summa'],2)
				],['id'=>$ch['id']]);	
			}
			else{
				$sql = $asli->update('sale_orders',[
					'old_client_balans' => round($saldo,2)
				],['id'=>$ch['id']]);	
			}
		}

		*/
	}
	if(isset($_GET['sana1']) && isset($_GET['sana2'])){
		
		$sana1 = strtotime($_GET['sana1']);
		$sana2 = strtotime($_GET['sana2']);
		
		$asli->resp += ['success'=> true, 'message' => "Muvaffiqqiyatli"];
		
		if($_GET['agent_id']>0 && $_GET['dostavka_id']>0){
			$clients = $asli->getdatas('clients',[
				'agent_id' => $_GET['agent_id'],
				'dostavka_id' => $_GET['dostavka_id']
			]);
		}
		else{
			if($_GET['agent_id']>0){
				$clients = $asli->getdatas('clients',[
					'agent_id' => $_GET['agent_id']
				]);
			}
			else{
				if($_GET['dostavka_id']>0){
					$clients = $asli->getdatas('clients',[
						'dostavka_id' => $_GET['dostavka_id']
					]);
				}
				else{
					$clients = $asli->getdatas('clients',[],"1");		
				}
			}
		}
		$i = 0;
		$eski_balans = 0;
		$jamidebit = 0;
		$jamikredit = 0;
		$jamitolov = 0;
		$saldo = 0;
		foreach ($clients as $key => $client) {
			$ret[$i]['id'] = $client['id'];
			$ret[$i]['sd_code'] = $client['sd_code'];
			$ret[$i]['fio'] = $asli->defilter($client['fio']);
			$akt = get_akt($client['id'],$sana1,$sana2);
			$ret[$i]['eski_balans'] = round($akt['eski_balans'],2);
			$ret[$i]['jamidebit'] = round($akt['jamidebit'],2);
			$ret[$i]['jamikredit'] = round($akt['jamikredit'],2);
			$ret[$i]['saldo'] = round($akt['saldo'],2);
			if($client['balans']!=$akt['saldo']){
				$color = "red";
			}
			else{
				$color = "#ececec";
			}
			?>
			<tr bgcolor="<?=$color?>">
                <td><?=$client['id']?></td>
                <td>Aslida <?=$akt['saldo']?> Lekin balansda <?=$client['balans']?> Farq : <?=($client['balans']-$akt['saldo'])?></td>
                <td><?=$ret[$i]['fio']?></td>
                <td><?=number_format($ret[$i]['eski_balans'],2)?></td>
                <td><?=number_format($ret[$i]['jamidebit'],2)?></td>
                <td><?=number_format($ret[$i]['jamikredit'],2)?></td>
                <td><?=number_format($ret[$i]['saldo'],2)?></td>
            </tr>
			<?
			$eski_balans += $akt['eski_balans'];
			$jamidebit += $akt['jamidebit'];
			$jamikredit += $akt['jamikredit'];
			$jamitolov += $akt['jamitolov'];
			$saldo += $akt['saldo'];
			$i++;
		}
		$ans['eski_balans'] = round($eski_balans,2);
		$ans['jamidebit'] = round($jamidebit,2);
		$ans['jamikredit'] = round($jamikredit,2);
		$ans['jamitolov'] = round($jamitolov,2);
		$ans['saldo'] = round($saldo,2);
		$ans['list'] = $ret;
	}
	else{
		?>
			<tr>
                <td><h1>Iltimos oraliqni tanlang</h1></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
		<?
	}
	?>
		</tbody>
		<tfoot>
			<tr>
				<th>Jami</th>
                <th></th>
                <th></th>
                <th><?=number_format($ans['eski_balans'],2)?></th>
                <th><?=number_format($ans['jamidebit'],2)?></th>
                <th><?=number_format($ans['jamikredit'],2)?></th>
                <th><?=number_format($ans['saldo'],2)?></th>
			</tr>
		</tfoot>
	</table>
	<h1>Jami to'lov <?=number_format($ans['jamitolov'],2)?></h1>
	<?
?>
	<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
	<script src="https://cdn.datatables.net/2.1.5/js/dataTables.js"></script>
	<script src="https://cdn.datatables.net/buttons/3.1.2/js/dataTables.buttons.js"></script>
	<script src="https://cdn.datatables.net/buttons/3.1.2/js/buttons.dataTables.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
	<script src="https://cdn.datatables.net/buttons/3.1.2/js/buttons.html5.min.js"></script>
	<script src="https://cdn.datatables.net/buttons/3.1.2/js/buttons.print.min.js"></script>
	<script type="text/javascript">
		// $('#example').DataTable({
		//     layout: {
		//         topStart: {
		//             buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
		//         }
		//     }
		// });
	</script>
</body>
</html>