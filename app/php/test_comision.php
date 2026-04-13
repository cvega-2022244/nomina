<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$con = mysqli_connect("localhost", "root", "", null, 3307);
if (!$con) {
    echo json_encode(['error' => 'Error de conexión MySQL: ' . mysqli_connect_error()]);
    exit;
}
mysqli_select_db($con, "nomina");
$con->set_charset("utf8");

$id_empleado = isset($_GET['id_empleado']) ? intval($_GET['id_empleado']) : 152;

// Verificar bonos en tabla comision
$sql1 = "SELECT c.*, eb.nombre estado_nombre 
         FROM comision c 
         LEFT JOIN estado_bono eb ON eb.id = c.id_estado
         WHERE c.id_empleado = $id_empleado 
         AND c.tipo_registro = 'bono'
         ORDER BY c.id DESC";

$result1 = mysqli_query($con, $sql1);
$comisiones = [];
while ($row = mysqli_fetch_assoc($result1)) {
    $comisiones[] = $row;
}

// Verificar bonos en tabla bono
$sql2 = "SELECT b.*, eb.nombre estado_nombre, bpl.id_pago_lote 
         FROM bono b 
         LEFT JOIN estado_bono eb ON eb.id = b.id_estado
         LEFT JOIN bonos_pago_lote bpl ON bpl.id_bono = b.id
         WHERE b.id_empleado = $id_empleado
         ORDER BY b.id DESC";

$result2 = mysqli_query($con, $sql2);
$bonos = [];
while ($row = mysqli_fetch_assoc($result2)) {
    $bonos[] = $row;
}

// Verificar el valor guardado en pago_lote
$sql3 = "SELECT pl.id, pl.id_lote, pl.bonos, pl.fecha_pago_lote, l.nombre lote_nombre
         FROM pago_lote pl 
         LEFT JOIN lote l ON l.id = pl.id_lote
         WHERE pl.id_empleado = $id_empleado AND pl.bonos > 0
         ORDER BY pl.id DESC";

$result3 = mysqli_query($con, $sql3);
$pago_lotes = [];
while ($row = mysqli_fetch_assoc($result3)) {
    $pago_lotes[] = $row;
}

echo json_encode([
    'id_empleado' => $id_empleado,
    'comisiones_tipo_bono' => $comisiones,
    'bonos_tabla_bono' => $bonos,
    'pago_lotes_con_bonos' => $pago_lotes
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

mysqli_close($con);
?>
