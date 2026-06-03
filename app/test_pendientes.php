<?php
$_GET["quest"] = 'lista_comisiones_pendientes';
$_GET["user_id"] = 11;
$_GET["user_role"] = 'rh';

ob_start();
include('php/servidor.php');
$output = ob_get_clean();
echo $output;
?>
