<?php
header('Content-Type: text/html; charset=UTF-8');
$con = mysqli_connect("localhost", "root", "", null, 3306);
if (!$con) { die("Error conexion: " . mysqli_connect_error()); }
mysqli_select_db($con, "nomina");
$con->set_charset("utf8");

echo "<h2>1. Lotes activos</h2>";
$r = mysqli_query($con, "SELECT id, nombre, id_estado, quincena, fecha FROM lote ORDER BY id DESC LIMIT 5");
echo "<table border='1'><tr><th>id</th><th>nombre</th><th>id_estado</th><th>quincena</th><th>fecha</th></tr>";
while ($row = mysqli_fetch_assoc($r)) {
    echo "<tr><td>{$row['id']}</td><td>{$row['nombre']}</td><td>{$row['id_estado']}</td><td>{$row['quincena']}</td><td>{$row['fecha']}</td></tr>";
}
echo "</table>";

// Get active lote
$r2 = mysqli_query($con, "SELECT * FROM lote WHERE id_estado = 1 ORDER BY id DESC LIMIT 1");
$lote_activo = mysqli_fetch_assoc($r2);
echo "<h2>2. Lote activo seleccionado</h2>";
echo "<pre>"; print_r($lote_activo); echo "</pre>";

if (!$lote_activo) {
    echo "<h2 style='color:red'>NO HAY LOTE ACTIVO (id_estado=1)</h2>";
    exit;
}

$lote_id = $lote_activo['id'];
$lote_quincena = $lote_activo['quincena'];
echo "<p>Lote ID: {$lote_id}, Quincena: {$lote_quincena}</p>";

// Check pago_lote records for the active lote
echo "<h2>3. Registros en pago_lote para lote activo (id={$lote_id})</h2>";
$r3 = mysqli_query($con, "SELECT COUNT(*) as total FROM pago_lote WHERE id_lote = {$lote_id}");
$count = mysqli_fetch_assoc($r3);
echo "<p>Total registros en pago_lote para lote {$lote_id}: <b>{$count['total']}</b></p>";

// Check first fortnight lote
echo "<h2>4. Lote de primera quincena anterior</h2>";
$r4 = mysqli_query($con, "SELECT MAX(id) as max_id FROM lote WHERE quincena = 0 AND id < {$lote_id}");
$pq = mysqli_fetch_assoc($r4);
echo "<p>MAX lote primera quincena (quincena=0, id < {$lote_id}): <b>{$pq['max_id']}</b></p>";

if ($pq['max_id']) {
    $r5 = mysqli_query($con, "SELECT COUNT(*) as total FROM pago_lote WHERE id_lote = {$pq['max_id']}");
    $count_pq = mysqli_fetch_assoc($r5);
    echo "<p>Total registros en pago_lote para lote {$pq['max_id']}: <b>{$count_pq['total']}</b></p>";
    
    // Show sample liquido values from primera quincena
    $r6 = mysqli_query($con, "SELECT pl.id_empleado, pl.liquido, pl.dias_laborados, pl.sueldo_quincenal FROM pago_lote pl WHERE pl.id_lote = {$pq['max_id']} LIMIT 5");
    echo "<h3>Muestra de datos primera quincena (lote {$pq['max_id']}):</h3>";
    echo "<table border='1'><tr><th>id_empleado</th><th>liquido</th><th>dias_laborados</th><th>sueldo_quincenal</th></tr>";
    while ($row = mysqli_fetch_assoc($r6)) {
        echo "<tr><td>{$row['id_empleado']}</td><td>{$row['liquido']}</td><td>{$row['dias_laborados']}</td><td>{$row['sueldo_quincenal']}</td></tr>";
    }
    echo "</table>";
}

// Test the simplified main query for ONE employee
echo "<h2>5. Test de query simplificado (primer empleado activo)</h2>";
$r7 = mysqli_query($con, "SELECT e.id FROM empleado e WHERE e.estado = 1 LIMIT 1");
$emp = mysqli_fetch_assoc($r7);
if ($emp) {
    $eid = $emp['id'];
    echo "<p>Empleado de prueba ID: {$eid}</p>";
    
    $test_sql = "SELECT 
        e.id,
        CONCAT_WS(' ', e.primer_nombre, e.primer_apellido) AS nombre,
        l.id AS lote_id,
        l.quincena AS lote_quincena,
        l.id_estado AS lote_estado,
        pl.id AS pl_id,
        pl.id_lote AS pl_id_lote,
        pl.liquido AS pl_liquido,
        pla.id AS pla_id,
        pla.id_lote AS pla_id_lote,
        pla.liquido AS pla_liquido,
        e.sueldo_ordinario,
        e.dias_laborados,
        COALESCE(pl.dias_laborados, e.dias_laborados) AS pl_dias_used,
        COALESCE(pla.dias_laborados, 0) AS pla_dias_used,
        CASE WHEN l.quincena = 0 OR l.quincena IS NULL THEN 'PRIMERA (WHEN)' ELSE 'SEGUNDA (ELSE)' END AS branch_used,
        CASE WHEN l.quincena = 0 OR l.quincena IS NULL THEN 0 
        ELSE 
            (
                (e.sueldo_ordinario / 30) * (COALESCE(pl.dias_laborados, e.dias_laborados) + COALESCE(pla.dias_laborados, 0))
            ) - COALESCE(pla.liquido, 0)
        END AS segunda_quincena_simplified
    FROM empleado e 
    INNER JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 
    INNER JOIN empresa emp ON emp.id = ee.id_empresa 
    LEFT JOIN (SELECT * FROM lote WHERE id_estado = 1 ORDER BY id DESC LIMIT 1) l ON 1=1 
    LEFT JOIN pago_lote pl ON pl.id_empleado = e.id AND pl.id_lote = l.id 
    LEFT JOIN (SELECT * FROM pago_lote) pla ON pla.id_empleado = e.id AND pla.id_lote = (SELECT MAX(id) FROM lote WHERE quincena = 0 AND id < l.id)
    WHERE e.estado = 1 AND e.id = {$eid}
    GROUP BY e.id";
    
    $r8 = mysqli_query($con, $test_sql);
    if (!$r8) {
        echo "<p style='color:red'>ERROR en query: " . mysqli_error($con) . "</p>";
    } else {
        $row = mysqli_fetch_assoc($r8);
        echo "<table border='1'>";
        foreach ($row as $key => $val) {
            echo "<tr><td><b>{$key}</b></td><td>{$val}</td></tr>";
        }
        echo "</table>";
    }
}

echo "<h2>6. Version MySQL</h2>";
$r9 = mysqli_query($con, "SELECT VERSION() as v");
$ver = mysqli_fetch_assoc($r9);
echo "<p>MySQL: {$ver['v']}</p>";

mysqli_close($con);
?>
