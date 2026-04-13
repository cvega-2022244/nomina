<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=facturacion_bono_real.xls');

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
$mysql = "SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(br.julio) julio, SUM(br.agosto) agosto, SUM(br.septiembre) septiembre, SUM(br.octubre) octubre, SUM(br.noviembre) noviembre, SUM(br.diciembre) diciembre, SUM(br.enero) enero, SUM(br.febrero) febrero, SUM(br.marzo) marzo, SUM(br.abril) abril, SUM(br.mayo) mayo, SUM(br.junio) junio, SUM(br.total_periodo) suma, SUM(br.bono) total FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa em ON br.id_empresa = em.id WHERE YEAR(br.al) = ".$_GET["anio"]." AND br.bono != 0 GROUP BY em.id, d.id, cc.id, d3, d4, d5";

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
                <th>Empresa</th>
                <th>Departamento</th>
                <th>Área</th>
                <th>División</th>
                <th>Sub División</th>
                <th>Nivel 5</th>
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
                <th>Suma</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if (mysqli_num_rows($result) > 0) {
                $correlativo = 1;
                while ($row = mysqli_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>' . $row["empresa"] . '</td>';
                    echo '<td>' . $row["d1"] . '</td>';
                    echo '<td>' . $row["d2"] . '</td>';
                    echo '<td>' . $row["d3"] . '</td>';
                    echo '<td>' . $row["d4"] . '</td>';
                    echo '<td>' . $row["d5"] . '</td>';
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
                    echo '<td style="mso-number-format:\'@\'">' . $row["suma"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["total"] . '</td>';
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