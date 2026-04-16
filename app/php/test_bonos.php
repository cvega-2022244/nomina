<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$con = mysqli_connect("localhost", "root", "", null, 3306);
if (!$con) {
    echo json_encode(['error' => 'Error de conexión MySQL: ' . mysqli_connect_error()]);
    exit;
}
mysqli_select_db($con, "nomina");
$con->set_charset("utf8");

$id_lote = isset($_GET['id_lote']) ? intval($_GET['id_lote']) : 63;
$id_empresa = isset($_GET['id_empresa']) ? intval($_GET['id_empresa']) : 3;

// Verificar los bonos directamente en pago_lote
$sql1 = "SELECT pl.id, pl.id_empleado, pl.id_lote, pl.bonos, 
         CONCAT_WS(' ', e.primer_nombre, e.primer_apellido) empleado,
         l.quincena, pl.fecha_pago_lote
         FROM pago_lote pl
         LEFT JOIN empleado e ON e.id = pl.id_empleado
         LEFT JOIN lote l ON l.id = pl.id_lote
         WHERE pl.id_lote = $id_lote AND pl.id_empresa = $id_empresa
         AND pl.bonos > 0";

$result1 = mysqli_query($con, $sql1);
$bonos_directos = [];
while ($row = mysqli_fetch_assoc($result1)) {
    $bonos_directos[] = $row;
}

// Verificar si hay lotes anteriores del mismo mes que causen el duplicado
$sql2 = "SELECT pl.id pl_id, pl.id_empleado, pl.bonos pl_bonos, 
         pla.id pla_id, pla.bonos pla_bonos, pla.id_lote pla_lote,
         CONCAT_WS(' ', e.primer_nombre, e.primer_apellido) empleado,
         l.quincena
         FROM pago_lote pl
         LEFT JOIN pago_lote pla ON 
             MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) 
             AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) 
             AND pla.id_empleado = pl.id_empleado 
             AND pla.id_lote != pl.id_lote
         LEFT JOIN empleado e ON e.id = pl.id_empleado
         LEFT JOIN lote l ON l.id = pl.id_lote
         WHERE pl.id_lote = $id_lote AND pl.id_empresa = $id_empresa
         AND (pl.bonos > 0 OR pla.bonos > 0)";

$result2 = mysqli_query($con, $sql2);
$bonos_con_join = [];
while ($row = mysqli_fetch_assoc($result2)) {
    $bonos_con_join[] = $row;
}

// Verificar bonos en tabla bono
$sql3 = "SELECT b.id, b.id_empleado, b.monto, b.id_estado,
         CONCAT_WS(' ', e.primer_nombre, e.primer_apellido) empleado,
         bpl.id_pago_lote
         FROM bono b
         LEFT JOIN bonos_pago_lote bpl ON bpl.id_bono = b.id
         LEFT JOIN empleado e ON e.id = b.id_empleado
         WHERE bpl.id_pago_lote = $id_lote";

$result3 = mysqli_query($con, $sql3);
$bonos_tabla = [];
while ($row = mysqli_fetch_assoc($result3)) {
    $bonos_tabla[] = $row;
}

echo json_encode([
    'parametros' => ['id_lote' => $id_lote, 'id_empresa' => $id_empresa],
    'bonos_en_pago_lote' => $bonos_directos,
    'bonos_con_join_pla' => $bonos_con_join,
    'bonos_en_tabla_bono' => $bonos_tabla,
    'explicacion' => 'Si pla_bonos tiene valor, se está sumando pl_bonos + pla_bonos causando el duplicado'
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

mysqli_close($con);
?>
