<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=facturacion_b14.xls');

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
$mysql = $_GET["query"];

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
                <th>Empleado</th>
                <th>Empresa Deudora</th>
                <th>Empresa Acreedora</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if (mysqli_num_rows($result) > 0) {
                $correlativo = 1;
                while ($row = mysqli_fetch_array($result)) {
                    echo '<tr>';
                    echo '<td>' . $row["empleado"] . '</td>';
                    echo '<td>' . $row["empresa_deudora"] . '</td>';
                    echo '<td>' . $row["empresa_acreedora"] . '</td>';
                    echo '<td style="mso-number-format:\'@\'">' . $row["total_salario_periodo"] . '</td>';
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