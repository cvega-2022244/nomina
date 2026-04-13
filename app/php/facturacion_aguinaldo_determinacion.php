<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=facturacion_aguinaldo_determinacion.xls');

date_default_timezone_set('UTC');
date_default_timezone_set("America/Guatemala");
$hoy = date("Y") . "-" . date("m") . "-" . date("d");

// ---------------- MYSQL -------------------- //
$con = mysqli_connect("localhost", "root", "", null, 3307);
if (!$con) {
    die('Could not connect: ' . mysqli_connect_error());
}
mysqli_select_db($con, "nomina");
// ---------------- Consulta ----------------- //
$mysql = "SELECT COALESCE(sub1.empresa, sub2.empresa) AS empresa, COALESCE(sub1.julio, 0) - sub2.julio AS julio, COALESCE(sub1.agosto, 0) - sub2.agosto AS agosto, COALESCE(sub1.septiembre, 0) - sub2.septiembre AS septiembre, COALESCE(sub1.octubre, 0) - sub2.octubre AS octubre, COALESCE(sub1.noviembre, 0) - sub2.noviembre AS noviembre, COALESCE(sub1.diciembre, 0) - sub2.diciembre AS diciembre, COALESCE(sub1.enero, 0) - sub2.enero AS enero, COALESCE(sub1.febrero, 0) - sub2.febrero AS febrero, COALESCE(sub1.marzo, 0) - sub2.marzo AS marzo, COALESCE(sub1.abril, 0) - sub2.abril AS abril, COALESCE(sub1.mayo, 0) - sub2.mayo AS mayo, COALESCE(sub1.junio, 0) - sub2.junio AS junio, COALESCE(sub1.suma, 0) - sub2.suma AS suma, COALESCE(sub1.total, 0) - sub2.total AS total FROM ( SELECT em.nombre_comercial empresa, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.total_periodo) suma, SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN empresa em ON ar.id_empresa = em.id WHERE YEAR(ar.al) = ".$_GET["anio"]." GROUP BY em.id ) AS sub1 RIGHT JOIN( SELECT em.nombre_comercial empresa, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.total_periodo) suma, SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN empresa em ON ar.id_empresa = em.id WHERE YEAR(ar.al) = ".$_GET["anio"]." GROUP BY em.id ) AS sub2 ON sub1.empresa = sub2.empresa HAVING total != 0;";

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