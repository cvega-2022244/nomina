<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header('Content-Disposition: attachment; filename=Informe_Mintrab.xls');

date_default_timezone_set("America/Guatemala");

// Conexión a la base de datos
$con = mysqli_connect("localhost", "root", "", null, 3307);
if (!$con) {
    die('Could not connect: ' . mysqli_connect_error());
}
mysqli_select_db($con, "nomina");
$con->set_charset("utf8");

// Validar parámetros
$lote = isset($_GET["lote"]) ? intval($_GET["lote"]) : 0;
$empresa = isset($_GET["empresa"]) ? intval($_GET["empresa"]) : 0;

if ($lote == 0 || $empresa == 0) {
    die('Parámetros inválidos: lote y empresa son requeridos');
}
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
                    <th>Nacionalidad</th>
                    <th>Discapacidad</th>
                    <th>Estado civil</th>
                    <th>Número de documento</th>
                    <th>Pais</th>
                    <th>Origen</th>
                    <th>Nit</th>
                    <th>Afiliación</th>
                    <th>Género</th>
                    <th>Fecha de nacimiento</th>
                    <th>Primaria</th>
                    <th>Grado de primaria</th>
                    <th>Secundaria</th>
                    <th>Grado de secundaria</th>
                    <th>Diversificado</th>
                    <th>Universidad</th>
                    <th>Departamento originario</th>
                    <th>Municipio originario</th>
                    <th>Cantidad hijos</th>
                    <th>Condición laboral</th>
                    <th>Fecha alta</th>
                    <th>Fecha baja</th>
                    <th>Puesto</th>
                    <th>Jornada</th>
                    <th>Días laborados al año</th>
                    <th>Sueldo ordinario</th>
                    <th>Salario anual</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    $sql = "SELECT 
                        e.primer_nombre, 
                        e.segundo_nombre, 
                        e.otro_nombre, 
                        e.primer_apellido, 
                        e.segundo_apellido, 
                        e.apellido_casada, 
                        e.nacionalidad, 
                        e.discapacidad, 
                        ec.nombre estado, 
                        e.dpi numero_documento, 
                        e.nacionalidad pais, 
                        e.region_originario origen, 
                        e.nit, 
                        e.afiliacion, 
                        g.nombre genero, 
                        e.fecha_nacimiento, 
                        CASE WHEN e.primaria = 0 THEN 'no hay registros' ELSE e.primaria END primaria, 
                        e.grado_primaria, 
                        CASE WHEN e.secundaria = 0 THEN 'no hay registros' ELSE e.secundaria END secundaria, 
                        e.grado_secundaria, 
                        CASE WHEN e.diversificado = 0 THEN 'no hay registros' ELSE e.diversificado END diversificado, 
                        CASE WHEN e.universidad = 0 THEN 'no hay registros' ELSE e.universidad END universidad, 
                        e.departamento_originario, 
                        e.municipio_originario, 
                        COALESCE((SELECT COUNT(*) FROM hijo h WHERE h.id_empleado = e.id), 0) cantidad_hijos, 
                        cl.nombre condicion_laboral, 
                        e.fecha_inicio fecha_alta, 
                        e.fecha_baja, 
                        e.puesto, 
                        CASE WHEN e.jornada = 0 THEN 'Diurna' ELSE 'Nocturna' END jornada, 
                        SUM(pl.dias_laborados) dias_laborados_anio, 
                        e.sueldo_ordinario, 
                        SUM(pl.sueldo_quincenal) salario_anual 
                    FROM pago_lote pl 
                    INNER JOIN empleado e ON e.id = pl.id_empleado 
                    INNER JOIN lote l ON pl.id_lote = l.id 
                    LEFT JOIN estado_civil ec ON e.estado_civil = ec.id 
                    LEFT JOIN genero g ON e.genero = g.id 
                    LEFT JOIN condicion_laboral cl ON e.condicion_laboral = cl.id 
                    LEFT JOIN empresa emp ON emp.id = pl.id_empresa 
                    WHERE l.id = " . $lote . " 
                    AND pl.id_empresa = " . $empresa . " 
                    GROUP BY e.id";
                    
                    $correlativo = 0;
                    $resultado = mysqli_query($con, $sql);
                    
                    if (!$resultado) {
                        echo "<tr><td colspan='34'>Error en la consulta: " . mysqli_error($con) . "</td></tr>";
                    } else if (mysqli_num_rows($resultado) == 0) {
                        echo "<tr><td colspan='34'>No hay datos para este lote y empresa</td></tr>";
                    } else {
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
                            echo "<td>" . $fila["nacionalidad"] . "</td>";
                            echo "<td>" . $fila["discapacidad"] . "</td>";
                            echo "<td>" . $fila["estado"] . "</td>";
                            echo '<td style="mso-number-format:\'@\'">' . $fila["numero_documento"] . "</td>";
                            echo "<td>" . $fila["pais"] . "</td>";
                            echo "<td>" . $fila["origen"] . "</td>";
                            echo '<td style="mso-number-format:\'@\'">' . $fila["nit"] . "</td>";
                            echo '<td style="mso-number-format:\'@\'">' . $fila["afiliacion"] . "</td>";
                            echo "<td>" . $fila["genero"] . "</td>";
                            echo "<td>" . $fila["fecha_nacimiento"] . "</td>";
                            echo "<td>" . $fila["primaria"] . "</td>";
                            echo "<td>" . $fila["grado_primaria"] . "</td>";
                            echo "<td>" . $fila["secundaria"] . "</td>";
                            echo "<td>" . $fila["grado_secundaria"] . "</td>";
                            echo "<td>" . $fila["diversificado"] . "</td>";
                            echo "<td>" . $fila["universidad"] . "</td>";
                            echo "<td>" . $fila["departamento_originario"] . "</td>";
                            echo "<td>" . $fila["municipio_originario"] . "</td>";
                            echo "<td>" . $fila["cantidad_hijos"] . "</td>";
                            echo "<td>" . $fila["condicion_laboral"] . "</td>";
                            echo "<td>" . $fila["fecha_alta"] . "</td>";
                            echo "<td>" . $fila["fecha_baja"] . "</td>";
                            echo "<td>" . $fila["puesto"] . "</td>";
                            echo "<td>" . $fila["jornada"] . "</td>";
                            echo "<td>" . $fila["dias_laborados_anio"] . "</td>";
                            echo "<td>" . $fila["sueldo_ordinario"] . "</td>";
                            echo "<td>" . $fila["salario_anual"] . "</td>";
                            echo "</tr>";
                        }
                    }
                ?>
            </tbody>
        </table>
    </form>
</body>

</html>
<?php 
mysqli_close($con);
exit; 
?>