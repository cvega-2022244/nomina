<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=aguinaldo_empleados.xls');

date_default_timezone_set('UTC');
date_default_timezone_set("America/Guatemala");
$hoy = date("Y") . "-" . date("m") . "-" . date("d");

// ---------------- MYSQL -------------------- //
$con = mysqli_connect("192.168.0.7", "admin", "");
if (!$con) {
    die('Could not connect: ' . mysqli_connect_error());
}
mysqli_select_db($con, "nomina");
// ---------------- Consulta ----------------- //
$mysql = "SELECT CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, em.nombre_comercial empresa, SUM(ar.porcentaje) porcentaje, ar.fecha_inicio, ar.periodo_pago, ar.al, ar.dias_pagar, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.total_periodo) total_periodo, SUM(ar.bono) bono, SUM(ar.primer_pago) primer_pago, SUM(ar.segundo_pago) segundo_pago FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN empresa_empleado ee ON ar.id_empleado = ee.id_empleado AND ee.principal = 1 and ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(ar.al) = " . $_GET["anio"] . " AND em.id = " . $_GET["id_empresa"] . " GROUP BY e.id";

//echo $mysql;
$result = mysqli_query($con, $mysql);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta content="charset=utf-8" />
</head>

<body style="border: 0.1pt solid #ccc; text-align:left; font-size:11pt;">
    <table>
        <thead>
            <tr>
                <th>Correlativo</th>
                <th>Empleado</th>
                <th>Empresa</th>
                <th>Porcentaje</th>
                <th>Inicio de labores</th>
                <th>Periodo de pago</th>
                <th>Al</th>
                <th>Días a pagar</th>
                <th>Diciembre</th>
                <th>Enero</th>
                <th>Febrero</th>
                <th>Marzo</th>
                <th>Abril</th>
                <th>Mayo</th>
                <th>Junio</th>
                <th>Julio</th>
                <th>Agosto</th>
                <th>Septiembre</th>
                <th>Octubre</th>
                <th>Noviembre</th>
                <th>Total del periodo</th>
                <th>Bono</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if (mysqli_num_rows($result) > 0) {
                $correlativo = 1;
                while ($row = mysqli_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>' . $correlativo++ . '</td>';
                    echo '<td>' . $row["empleado"] . '</td>';
                    echo '<td>' . $row["empresa"] . '</td>';
                    echo '<td>' . $row["porcentaje"] . '</td>';
                    echo '<td>' . $row["fecha_inicio"] . '</td>';
                    echo '<td>' . $row["periodo_pago"] . '</td>';
                    echo '<td>' . $row["al"] . '</td>';
                    echo '<td>' . $row["dias_pagar"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["diciembre"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["enero"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["febrero"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["marzo"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["abril"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["mayo"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["junio"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["julio"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["agosto"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["septiembre"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["octubre"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["noviembre"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["total_periodo"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["bono"] . '</td>';
                    echo '</tr>';
                }
            } else {
                echo 'No hay registros';
            }
            ?>
        </tbody>
    </table>
</body>

</html>
<?php
?>