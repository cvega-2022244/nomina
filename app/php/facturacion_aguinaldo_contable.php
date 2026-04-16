<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=facturacion_aguinaldo_contable.xls');

date_default_timezone_set('UTC');
date_default_timezone_set("America/Guatemala");
$hoy = date("Y") . "-" . date("m") . "-" . date("d");

// ---------------- MYSQL -------------------- //
$con = mysqli_connect("localhost", "root", "", null, 3306);
if (!$con) {
    die('Could not connect: ' . mysqli_connect_error());
}
mysqli_select_db($con, "nomina");
// ---------------- Consulta ----------------- //
        $mysql = "SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.total_periodo) suma, SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa em ON ar.id_empresa = em.id WHERE YEAR(ar.al) = " . $_GET["anio"]." AND ar.bono != 0 GROUP BY em.id, d.id, cc.id, d3, d4, d5";

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