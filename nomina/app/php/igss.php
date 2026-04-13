<?php
header("Content-Type: application/ms-excel; charset=utf-8");
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=IGSS.xls');

include("servidor.php");
?>
<!DOCTYPE html>

<head>
    <meta content="charset=utf-8" />
</head>

<body style="border: 0.1pt solid #ccc; text-align:left; font-size:11pt;">
    <form>
        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0" style="font-size:12pt;">
            <thead>
                <tr>
                    <th>Correlativo</th>
                    <th>Primer nombre</th>
                    <th>Segundo nombre</th>
                    <th>Otro nombre</th>
                    <th>Primer apellido</th> 
                    <th>Segundo apellido</th>
                    <th>Apellido de casada</th>
                    <th>Sueldo ordinario</th>
                    <th>Fecha de alta</th>
                    <th>Fecha de baja</th>
                    <th>Nit</th>
                    <th>Condición laboral</th>
                    <th>Tipo de pago</th>
                    <th>Horas laboradas</th>
                    <th>Días laboradas</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    $sql = "SELECT e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada, e.sueldo_ordinario, e.fecha_inicio, e.fecha_baja, e.nit, cl.nombre condicion_laboral, tp.nombre tipo_de_pago, (pl.dias_laborados * 8) horas_laboradas, pl.dias_laborados dias_laborados FROM empleado e INNER JOIN condicion_laboral cl ON e.condicion_laboral = cl.id INNER JOIN tipo_pago tp ON e.tipo_de_pago = tp.id INNER JOIN pago_lote pl ON e.id = pl.id_empleado INNER JOIN lote l ON pl.id_lote = l.id LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE MONTH(pl.fecha_pago_lote) = MONTH(l.fecha) AND l.id = ".$_GET["lote"]." AND emp.id = ".$_GET["empresa"];
                    $correlativo = 0;
                    $resultado = mysqli_query($con, $sql);
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $correlativo = $correlativo + 1;
                        echo "<tr>";
                        echo "<td>" . $correlativo . "</td>";
                        echo "<td>" . $fila["primer_nombre"] . "</td>";
                        echo "<td>" . $fila["segundo_nombre"] . "</td>";
                        echo "<td>" . $fila["otro_nombre"] . "</td>";
                        echo "<td>" . $fila["primer_apellido"] . "</td>";
                        echo "<td>" . $fila["segundo_apellido"] . "</td>";
                        echo "<td>" . $fila["apellido_casada"] . "</td>";
                        echo "<td>" . $fila["sueldo_ordinario"] . "</td>";
                        echo "<td>" . $fila["fecha_inicio"] . "</td>";
                        echo "<td>" . $fila["fecha_baja"] . "</td>";
                        echo "<td>" . $fila["nit"] . "</td>";
                        echo "<td>" . $fila["condicion_laboral"] . "</td>";
                        echo "<td>" . $fila["tipo_de_pago"] . "</td>";
                        echo "<td>" . $fila["horas_laboradas"] . "</td>";
                        echo "<td>" . $fila["dias_laborados"] . "</td>";
                        echo "</tr>";
                    }
                ?>
            </tbody>
        </table>
    </form>
</body>

</html>
<?php exit; ?>