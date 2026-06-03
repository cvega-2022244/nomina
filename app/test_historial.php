<?php
$_GET["quest"] = 'historial_completo_bonos';
$_GET["user_id"] = 11;
$_GET["user_role"] = 'rh';

ob_start();
include('servidor-bonos.php');
$output = ob_get_clean();
echo $output;
?>
