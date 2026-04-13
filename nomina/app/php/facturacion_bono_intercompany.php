<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=facturacion_bono_intercompany.xls');

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
$mysql = "SELECT CONCAT_WS(' ', ( SELECT e2.nombre_comercial FROM bono_real br2 INNER JOIN empresa e2 ON br2.id_empresa = e2.id WHERE br2.principal = 1 AND br2.id_empleado = br.id_empleado AND YEAR(br.al) = ".$_GET["anio"]." GROUP BY e2.nombre_comercial ), 'Debe Facturar a', e1.nombre_comercial ) factura, SUM(br.total_periodo) base, SUM(br.total_periodo) * 0.12 iva, (SUM(br.total_periodo) + (SUM(br.total_periodo) * 0.12)) total FROM bono_real br INNER JOIN empresa e1 ON br.id_empresa = e1.id WHERE br.principal = 0 AND YEAR(br.al) = ".$_GET["anio"]." GROUP BY factura HAVING total != 0";

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
                <th>Facturación</th>
                <th>Base</th>
                <th>Iva</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if (mysqli_num_rows($result) > 0) {
                $correlativo = 1;
                while ($row = mysqli_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>' . $row["factura"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["base"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["iva"] . '</td>';
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