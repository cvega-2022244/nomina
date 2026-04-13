<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=plantilla_unhesa.xls');

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
$mysql = "SELECT tc.nombre tipo_cuenta, pl.no_cuenta cuenta, concat_ws(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, pl.liquido, l.nombre lote FROM pago_lote pl LEFT JOIN empleado e on e.id = pl.id_empleado LEFT JOIN lote l on l.id = pl.id_lote LEFT JOIN empresa emp on emp.id = pl.id_empresa LEFT JOIN tipo_cuenta tc on tc.id = pl.id_tipo_cuenta WHERE l.id_estado = 1 and pl.cheque = 2 and emp.nombre_comercial like '%UNHESA%'";

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
                <th>Tipo de cuenta</th>
                <th>Número de cuenta</th>
                <th>Empleado</th>
                <th>Líquido</th>
                <th>Lote</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if (mysqli_num_rows($result) > 0) {
                $correlativo = 1;
                while ($row = mysqli_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>' . $correlativo++ . '</td>';
                    echo '<td>' . $row["tipo_cuenta"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'>' . $row["cuenta"] . '</td>';
                    echo '<td>' . $row["empleado"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["liquido"] . '</td>';
                    echo '<td>' . $row["lote"] . '</td>';
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
// header("Location: ../index.html")
?>