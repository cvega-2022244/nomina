<?php
header('Content-Type: application/json');

$con = mysqli_connect("localhost", "root", "", null, 3306);
if (!$con) {
    echo json_encode(['error' => 'Error de conexión MySQL: ' . mysqli_connect_error()]);
    exit;
}
mysqli_select_db($con, "nomina");
$con->set_charset("utf8");

// Parámetros
$id_pago_lote = isset($_GET['id']) ? intval($_GET['id']) : 0;
$nuevo_valor = isset($_GET['valor']) ? floatval($_GET['valor']) : 0;
$confirmar = isset($_GET['confirmar']) ? $_GET['confirmar'] : 'no';

if ($id_pago_lote == 0) {
    echo json_encode(['error' => 'Debes proporcionar el ID del pago_lote. Uso: ?id=1976&valor=2000&confirmar=si']);
    exit;
}

// Primero mostrar el valor actual
$sql_ver = "SELECT pl.id, pl.id_empleado, pl.bonos valor_actual, 
            CONCAT_WS(' ', e.primer_nombre, e.primer_apellido) empleado,
            l.nombre lote
            FROM pago_lote pl 
            LEFT JOIN empleado e ON e.id = pl.id_empleado
            LEFT JOIN lote l ON l.id = pl.id_lote
            WHERE pl.id = $id_pago_lote";

$result = mysqli_query($con, $sql_ver);
$registro = mysqli_fetch_assoc($result);

if (!$registro) {
    echo json_encode(['error' => 'No se encontró el registro con id ' . $id_pago_lote]);
    exit;
}

if ($confirmar == 'si' && $nuevo_valor > 0) {
    // Actualizar el valor
    $sql_update = "UPDATE pago_lote SET bonos = $nuevo_valor WHERE id = $id_pago_lote";
    $result_update = mysqli_query($con, $sql_update);
    
    if ($result_update) {
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Valor actualizado correctamente',
            'registro' => $registro,
            'valor_anterior' => $registro['valor_actual'],
            'valor_nuevo' => $nuevo_valor
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'Error al actualizar: ' . mysqli_error($con)]);
    }
} else {
    echo json_encode([
        'mensaje' => 'Vista previa - Para confirmar agrega &confirmar=si',
        'registro_actual' => $registro,
        'valor_propuesto' => $nuevo_valor,
        'url_confirmar' => "?id=$id_pago_lote&valor=$nuevo_valor&confirmar=si"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

mysqli_close($con);
?>
