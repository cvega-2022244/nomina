<?php
$con = mysqli_connect("localhost", "root", "", "nomina");
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT DISTINCT DATE_FORMAT(fecha_pago_lote, '%Y-%m') as mes FROM pago_lote ORDER BY mes DESC LIMIT 10";
$result = mysqli_query($con, $sql);
$dates = [];
while ($row = mysqli_fetch_assoc($result)) {
    $dates[] = $row['mes'];
}

echo "Meses con datos disponibles en pago_lote:\n";
print_r($dates);

$sql = "SELECT MIN(fecha_pago_lote) as min_date, MAX(fecha_pago_lote) as max_date FROM pago_lote";
$result = mysqli_query($con, $sql);
$range = mysqli_fetch_assoc($result);
echo "\nRango total de fechas:\n";
print_r($range);
?>
