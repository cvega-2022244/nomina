<?php
$_GET["quest"] = 'lista_horas_pendientes';
$_GET["user_id"] = 11;
$_GET["user_role"] = 'rh';

ob_start();
include('php/servidor.php');
$output = ob_get_clean();
echo $output;
?>
