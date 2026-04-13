<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=cumpleaneros_'.$_GET["mes_texto"].'_'.$_GET["anio"].'.xls');

date_default_timezone_set('UTC');
date_default_timezone_set("America/Guatemala");
// ---------------- MYSQL -------------------- //
$con = mysqli_connect("localhost", "root", "", null, 3307);
if (!$con) {
    die('Could not connect: ' . mysqli_connect_error());
}
mysqli_select_db($con, "nomina");

$sql = "SELECT e.id, primer_nombre, segundo_nombre, otro_nombre, primer_apellido, e.segundo_apellido, date_format(DATE_ADD( e.fecha_nacimiento, INTERVAL( ".$_GET["anio"]." - YEAR(e.fecha_nacimiento)) YEAR ), '%m/%d') fecha_nacimiento, d.nombre FROM empleado e INNER JOIN departamento d ON e.departamento_laboral = d.id WHERE MONTH(fecha_nacimiento) = ".$_GET["mes"]." and e.estado = 1 ORDER BY fecha_nacimiento";

$result = mysqli_query($con, $sql);

// Función para formatear el nombre del empleado
function formatearNombreEmpleado($item) {
    $nombre_empleado = $item['primer_nombre'] .
                       (!empty($item['segundo_nombre']) ? " " . $item['segundo_nombre'] : '') .
                       (!empty($item['otro_nombre']) ? " " . $item['otro_nombre'] : '') .
                       (!empty($item['primer_apellido']) ? " " . $item['primer_apellido'] : '') .
                       (!empty($item['segundo_apellido']) ? " " . $item['segundo_apellido'] : '');
    return trim($nombre_empleado);
}

// Función para formatear la fecha
function formatearFecha($fecha) {
    return date('d', strtotime($fecha));
}

// Función para ajustar la fecha
function ajustarFecha($fecha) {
    $fechaNacimiento = strtotime($fecha);
    $diaSemana = date('w', $fechaNacimiento);

    if ($diaSemana == 6) { // Sábado
        $fechaNacimiento = strtotime('-1 day', $fechaNacimiento);
    } else if ($diaSemana == 0) { // Domingo
        $fechaNacimiento = strtotime('+1 day', $fechaNacimiento);
    }

    return date('d', $fechaNacimiento);
}

$cumpleaneros = [];
while ($row = $result->fetch_assoc()) {
    $cumpleaneros[] = $row;
}

echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta content="charset=utf-8" />
</head>
<body style="border: 0.1pt solid #ccc; text-align:left; font-size:11pt;">
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Área</th>
                <th>Día de cumpleaños</th>
                <th>Día de Descanso</th>
            </tr>
        </thead>
        <tbody>';

foreach ($cumpleaneros as $item) {
    echo "<tr>";
    echo "<td>" . formatearNombreEmpleado($item) . "</td>";
    echo "<td>" . $item['nombre'] . "</td>";
    echo "<td>" . formatearFecha($item['fecha_nacimiento']) . "</td>";
    echo "<td>" . ajustarFecha($item['fecha_nacimiento']) . "</td>";
    echo "</tr>";
}

echo '</tbody>
    </table>
</body>
</html>';
?>
