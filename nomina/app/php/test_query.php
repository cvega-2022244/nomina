<?php
// Archivo de prueba para verificar la consulta
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include_once('conexion.php');

// Obtener parámetros de prueba
$id_lote = isset($_GET['id_lote']) ? $_GET['id_lote'] : 63;
$id_empresa = isset($_GET['id_empresa']) ? $_GET['id_empresa'] : 1;

// Si id_empresa no es numérico, buscar por nombre
if (!is_numeric($id_empresa)) {
    $sql_empresa = "SELECT id FROM empresa WHERE nombre_comercial LIKE '%" . $id_empresa . "%' LIMIT 1";
    $res_empresa = mysqli_query($con, $sql_empresa);
    if ($row_emp = mysqli_fetch_assoc($res_empresa)) {
        $id_empresa = $row_emp['id'];
    }
}

// Consulta SIN GROUP BY para ver todos los registros
$sql_sin_group = "SELECT pl.id correlativo, pl.id_empleado, pl.id_lote, 
        CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.primer_apellido, e.segundo_apellido) empleado, 
        emp.nombre_comercial
        FROM pago_lote pl 
        LEFT JOIN empleado e ON e.id = pl.id_empleado 
        LEFT JOIN empresa emp ON emp.id = pl.id_empresa 
        WHERE pl.id_lote = " . $id_lote . " AND emp.id = " . $id_empresa;

// Consulta CON GROUP BY para ver resultado agrupado
$sql_con_group = "SELECT pl.id correlativo, pl.id_empleado, pl.id_lote, 
        CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.primer_apellido, e.segundo_apellido) empleado, 
        emp.nombre_comercial
        FROM pago_lote pl 
        LEFT JOIN empleado e ON e.id = pl.id_empleado 
        LEFT JOIN empresa emp ON emp.id = pl.id_empresa 
        WHERE pl.id_lote = " . $id_lote . " AND emp.id = " . $id_empresa . " 
        GROUP BY pl.id_empleado, pl.id_lote 
        ORDER BY pl.id";

// Ejecutar consulta SIN GROUP BY
$result_sin = mysqli_query($con, $sql_sin_group);
$count_sin = $result_sin ? mysqli_num_rows($result_sin) : 0;

// Ejecutar consulta CON GROUP BY
$result_con = mysqli_query($con, $sql_con_group);
$count_con = 0;
$datos = [];
if ($result_con) {
    while ($row = mysqli_fetch_assoc($result_con)) {
        $datos[] = $row;
        $count_con++;
    }
}

echo json_encode([
    'parametros' => [
        'id_lote' => $id_lote,
        'id_empresa' => $id_empresa
    ],
    'total_SIN_group_by' => $count_sin,
    'total_CON_group_by' => $count_con,
    'reduccion' => $count_sin . ' -> ' . $count_con . ' registros',
    'primeros_10_registros' => array_slice($datos, 0, 10)
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
