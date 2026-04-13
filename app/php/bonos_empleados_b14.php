<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=bonos_empleados.xls');

date_default_timezone_set('UTC');
date_default_timezone_set("America/Guatemala");
$hoy = date("Y") . "-" . date("m") . "-" . date("d");

$con = mysqli_connect("localhost", "root", "", null, 3307);
if (!$con) {
    die('Could not connect: ' . mysqli_connect_error());
}
mysqli_select_db($con, "nomina");
$con->set_charset("utf8");

$anio = isset($_GET["anio"]) ? intval($_GET["anio"]) : 0;
$empresa = isset($_GET["id_empresa"]) ? intval($_GET["id_empresa"]) : 0;

if ($anio === 0 || $empresa === 0) {
    die('Parámetros inválidos: anio e id_empresa son requeridos');
}

$mysql = "SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, em.nombre_comercial empresa, SUM(br.porcentaje) porcentaje, br.fecha_inicio, br.periodo_pago, br.al, br.dias_pagar, SUM(br.julio) julio, SUM(br.agosto) agosto, SUM(br.septiembre) septiembre, SUM(br.octubre) octubre, SUM(br.noviembre) noviembre, SUM(br.diciembre) diciembre, SUM(br.enero) enero, SUM(br.febrero) febrero, SUM(br.marzo) marzo, SUM(br.abril) abril, SUM(br.mayo) mayo, SUM(br.junio) junio, SUM(br.total_periodo) total_periodo, SUM(br.bono) bono, SUM(br.primer_pago) primer_pago, SUM(br.segundo_pago) segundo_pago FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN empresa em ON br.id_empresa = em.id WHERE YEAR(br.al) = " . $anio . " AND br.id_empresa = " . $empresa . "  GROUP BY e.id";

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
                <th>Julio</th>
                <th>Agosto</th>
                <th>Septiembre</th>
                <th>Octubre</th>
                <th>Noviembre</th>
                <th>Diciembre</th>
                <th>Enero</th>
                <th>Febrero</th>
                <th>Marzo</th>
                <th>Abril</th>
                <th>Mayo</th>
                <th>Junio</th>
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
                    echo '<td style="mso-number-format:\'@\'">' . $row["julio"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["agosto"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["septiembre"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["octubre"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["noviembre"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["diciembre"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["enero"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["febrero"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["marzo"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["abril"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["mayo"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["junio"] . '</td>';
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