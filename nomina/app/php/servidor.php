<?php
header('Content-Type: text/html; charset=UTF-8');
date_default_timezone_set('UTC');
date_default_timezone_set("America/Guatemala");
session_start();
$hoy = date("Y") . "-" . date("m") . "-" . date("d");

// ---------------- SQL SERVER -------------------- //
$dsn = "Driver={SQL Server};Server=192.168.0.7;Port=1433;Database=Permisos";
$data_source = 'zzzz';
$user = 'sa';
$password = 'grueconsa';

$conn = odbc_connect($dsn, $user, $password);
if (!$conn) {
    if (phpversion() < '4.0') {
        exit("Connection Failed: . $php_errormsg");
    } else {
        exit("Connection Failed:" . odbc_errormsg());
    }
}
// ---------------- MYSQL SISTEMAS -------------------- //

$con = mysqli_connect("192.168.0.7", "admin", "");
if (!$con) {
    die('Could not connect: ' . mysqli_connect_error());
}
mysqli_select_db($con, "nomina");
$con->set_charset("utf8");

// ----------------------- CONSULTAS ------------------------ //
// --------------------- GET -------------------------- //
if (isset($_GET)) {
    if (isset($_GET["quest"])) {
        if ($_GET["quest"] == 'login') {
            $sql = "SELECT * FROM usuario where usuario = '" . $_GET["usuario"] . "' AND contrasena = '" . $_GET["contrasena"] . "'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'credenciales incorrectas';
            }
        }

        if ($_GET["quest"] == 'cumpleañeros') {
            $sql = "SELECT e.id, primer_nombre, segundo_nombre, otro_nombre, primer_apellido, e.segundo_apellido, DATE_ADD( e.fecha_nacimiento, INTERVAL( ".$_GET["anio"]." - YEAR(e.fecha_nacimiento)) YEAR ) fecha_nacimiento, d.nombre FROM empleado e INNER JOIN departamento d ON e.departamento_laboral = d.id WHERE MONTH(fecha_nacimiento) = ".$_GET["mes"]." and e.estado = 1 ORDER BY fecha_nacimiento";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'primer_nombre' => $row["primer_nombre"],
                        'segundo_nombre' => $row["segundo_nombre"],
                        'otro_nombre' => $row["otro_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'segundo_apellido' => $row["segundo_apellido"],
                        'fecha_nacimiento' => $row["fecha_nacimiento"],
                        'departamento' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_libros') {
            $sql = "SELECT '' no_orden, CONCAT( MONTH(pl.fecha_pago_lote), '/', YEAR(pl.fecha_pago_lote) ) periodo_trabajo, SUM(pl.sueldo_quincenal) salario, SUM(pl.dias_laborados) dias_trabajados, SUM((pl.dias_laborados * 8)) horas_ordinarias, SUM( ( pl.cantidad_horas_dia + pl.cantidad_horas_noche ) ) horas_extraordinarias, SUM(pl.sueldo_quincenal) salario_ordinario, SUM(pl.horas_dia + pl.horas_noche) salario_extraordinario, CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN ((e.sueldo_ordinario / 30) * " . $_GET["enero"] . ") WHEN MONTH(pl.fecha_pago_lote) = 2 THEN ((e.sueldo_ordinario / 30) * " . $_GET["febrero"] . ") WHEN MONTH(pl.fecha_pago_lote) = 3 THEN ((e.sueldo_ordinario / 30) * " . $_GET["marzo"] . ") WHEN MONTH(pl.fecha_pago_lote) = 4 THEN ((e.sueldo_ordinario / 30) * " . $_GET["abril"] . ") WHEN MONTH(pl.fecha_pago_lote) = 5 THEN ((e.sueldo_ordinario / 30) * " . $_GET["mayo"] . ") WHEN MONTH(pl.fecha_pago_lote) = 6 THEN ((e.sueldo_ordinario / 30) * " . $_GET["junio"] . ") WHEN MONTH(pl.fecha_pago_lote) = 7 THEN ((e.sueldo_ordinario / 30) * " . $_GET["julio"] . ") WHEN MONTH(pl.fecha_pago_lote) = 8 THEN ((e.sueldo_ordinario / 30) * " . $_GET["agosto"] . ") WHEN MONTH(pl.fecha_pago_lote) = 9 THEN ((e.sueldo_ordinario / 30) * " . $_GET["septiembre"] . ") WHEN MONTH(pl.fecha_pago_lote) = 10 THEN ((e.sueldo_ordinario / 30) * " . $_GET["octubre"] . ") WHEN MONTH(pl.fecha_pago_lote) = 11 THEN ((e.sueldo_ordinario / 30) * " . $_GET["noviembre"] . ") WHEN MONTH(pl.fecha_pago_lote) = 12 THEN ((e.sueldo_ordinario / 30) * " . $_GET["diciembre"] . ") END septimo_asuesto, '' vacaciones, ( SUM(pl.sueldo_quincenal) + SUM(pl.horas_dia) + SUM(pl.horas_noche) ) salario_total, SUM(pl.igss) igss, ( SUM(pl.egresos_tot) - SUM(pl.igss) ) otras_deducciones, SUM(pl.egresos_tot) total_deducciones, CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN COALESCE( ( SELECT SUM(primer_pago) FROM aguinaldo_real WHERE id_empleado = 1 AND YEAR(al) =(YEAR(pl.fecha_pago_lote) -1) ), 0 ) WHEN MONTH(pl.fecha_pago_lote) = 7 THEN COALESCE( ( SELECT SUM(primer_pago) + SUM(segundo_pago) FROM bono_real WHERE id_empleado = 1 AND YEAR(al) = YEAR(pl.fecha_pago_lote) ), 0 ) WHEN MONTH(pl.fecha_pago_lote) = 12 THEN COALESCE( ( SELECT SUM(segundo_pago) FROM aguinaldo_real WHERE id_empleado = 1 AND YEAR(al) = YEAR(pl.fecha_pago_lote) ), 0 ) ELSE '0' END aguinaldo_otros, ( SUM(pl.bon_tot) + SUM(pl.bon_dec_tot) ) bon_incentivo, SUM(pl.liquido) +( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN COALESCE( ( SELECT SUM(primer_pago) FROM aguinaldo_real WHERE id_empleado = 1 AND YEAR(al) =(YEAR(pl.fecha_pago_lote) -1) ), 0 ) WHEN MONTH(pl.fecha_pago_lote) = 7 THEN COALESCE( ( SELECT SUM(primer_pago) + SUM(segundo_pago) FROM bono_real WHERE id_empleado = 1 AND YEAR(al) = YEAR(pl.fecha_pago_lote) ), 0 ) WHEN MONTH(pl.fecha_pago_lote) = 12 THEN COALESCE( ( SELECT SUM(segundo_pago) FROM aguinaldo_real WHERE id_empleado = 1 AND YEAR(al) = YEAR(pl.fecha_pago_lote) ), 0 ) ELSE 0 END ) liquido FROM pago_lote pl LEFT JOIN empleado e ON e.id = pl.id_empleado WHERE pl.id_empleado = " . $_GET["id_empleado"] . " AND pl.fecha_pago_lote BETWEEN '" . $_GET["fecha_inicio"] . "' AND '" . $_GET["fecha_final"] . "' GROUP BY MONTH(pl.fecha_pago_lote)";

            // echo $sql;
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'periodo_trabajo' => $row["periodo_trabajo"],
                        'salario' => $row["salario"],
                        'dias_trabajados' => $row["dias_trabajados"],
                        'horas_ordinarias' => $row["horas_ordinarias"],
                        'horas_extraordinarias' => $row["horas_extraordinarias"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'salario_extraordinario' => $row["salario_extraordinario"],
                        'septimo_asuesto' => $row["septimo_asuesto"],
                        'vacaciones' => $row["vacaciones"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'otras_deducciones' => $row["otras_deducciones"],
                        'total_deducciones' => $row["total_deducciones"],
                        'aguinaldo_otros' => $row["aguinaldo_otros"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'liquido' => $row["liquido"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo $sql;
            }
        }

        if ($_GET["quest"] == 'usuarios_salario') {

            $sql = "SELECT e.id id_empleado, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre, e.edad edad, g.nombre sexo, e.nacionalidad nacionalidad, e.puesto puesto, e.afiliacion afilacion, e.dpi dpi, DATE_FORMAT(e.fecha_inicio, '%d/%m%/%Y') fecha_ingreso, DATE_FORMAT(e.fecha_baja, '%d/%m%/%Y') fecha_finalizacion FROM empleado e LEFT JOIN genero g ON g.id = e.genero WHERE e.estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_empleado' => $row["id_empleado"],
                        'nombre' => $row["nombre"],
                        'edad' => $row["edad"],
                        'sexo' => $row["sexo"],
                        'nacionalidad' => $row["nacionalidad"],
                        'puesto' => $row["puesto"],
                        'afilacion' => $row["afilacion"],
                        'dpi' => $row["dpi"],
                        'fecha_ingreso' => $row["fecha_ingreso"],
                        'fecha_finalizacion' => $row["fecha_finalizacion"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                $_GET["query"];
            }
        }

        if ($_GET["quest"] == 'buscar_empleado_dpi') {
            $sql = "SELECT COUNT(*) cantidad FROM empleado WHERE LOWER(TRIM(dpi)) = LOWER('" . $_GET["dpi"] . "')";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'cantidad' => $row["cantidad"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'bajas_altas') {
            $sql = "SELECT e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada, e.fecha_baja, d.nombre departamento FROM empleado e INNER JOIN departamento d ON e.departamento_laboral = d.id WHERE MONTH(e.fecha_baja) = " . $_GET["mes"] . " AND YEAR(e.fecha_baja) = " . $_GET["anio"] . "";
            // echo $sql;
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'primer_nombre' => $row["primer_nombre"],
                        'segundo_nombre' => $row["segundo_nombre"],
                        'otro_nombre' => $row["otro_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'segundo_apellido' => $row["segundo_apellido"],
                        'apellido_casada' => $row["apellido_casada"],
                        'fecha_baja' => $row["fecha_baja"],
                        'departamento' => $row["departamento"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'altas_bajas') {
            $sql = "SELECT e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada, e.fecha_inicio, d.nombre departamento FROM empleado e INNER JOIN departamento d ON e.departamento_laboral = d.id WHERE MONTH(e.fecha_inicio) = " . $_GET["mes"] . " AND YEAR(e.fecha_inicio) = " . $_GET["anio"] . "";
            // echo $sql;
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'primer_nombre' => $row["primer_nombre"],
                        'segundo_nombre' => $row["segundo_nombre"],
                        'otro_nombre' => $row["otro_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'segundo_apellido' => $row["segundo_apellido"],
                        'apellido_casada' => $row["apellido_casada"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'departamento' => $row["departamento"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'datos_empleado_disciplinaria') {
            $sql = "SELECT concat_ws(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) nombre, e.puesto cargo, emp.nombre_comercial empresa FROM empleado e LEFT JOIN empresa_empleado ee on ee.id_empleado = e.id LEFT JOIN empresa emp on emp.id = ee.id_empresa WHERE ee.principal = 1 and ee.activo = 1 and e.id = " . $_GET["id_empleado"];
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'nombre' => $row["nombre"],
                        'cargo' => $row["cargo"],
                        'empresa' => $row["empresa"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'reporte_bono') {

            $result = mysqli_query($con, $_GET["query2"]);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_empleado' => $row["id"],
                        'id_empresa' => $row["id_empresa"],
                        'porcentaje' => $row["porcentaje"],
                        'principal' => $row["principal"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'periodo_pago' => $row["periodo_pago"],
                        'al' => $row["AL"],
                        'dias_pagar' => $row["dias_pagar"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'total_periodo' => $row["total_periodo"],
                        'bono' => $row["bono"],
                        'primer_pago' => $row["primer_pago"],
                        'segundo_pago' => $row["segundo_pago"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'reporte_aguinaldo') {

            $result = mysqli_query($con, $_GET["query2"]);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_empleado' => $row["id"],
                        'id_empresa' => $row["id_empresa"],
                        'porcentaje' => $row["porcentaje"],
                        'principal' => $row["principal"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'periodo_pago' => $row["periodo_pago"],
                        'al' => $row["AL"],
                        'dias_pagar' => $row["dias_pagar"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'total_periodo' => $row["total_periodo"],
                        'bono' => $row["bono"],
                        'primer_pago' => $row["primer_pago"],
                        'segundo_pago' => $row["segundo_pago"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lista_empresa') {
            $sql = "SELECT * FROM empresa";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre_comercial"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'cambios_personal') {

            $result = mysqli_query($con, $_GET["query"]);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empleado' => $row["empleado"],
                        'empresa' => $row["empresa"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'periodo_pago' => $row["periodo_pago"],
                        'al' => $row["AL"],
                        'dias_pagar' => $row["dias_pagar"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'total' => $row["total_salario_periodo"],
                        'bono' => $row["bono"],
                        'primer_pago' => $row["primer_pago"],
                        'segundo_pago' => $row["segundo_pago"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                $_GET["query"];
            }
        }

        if ($_GET["quest"] == 'lista_bono_anual') {
            $sql = "SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, em.nombre_comercial empresa, SUM(br.porcentaje) porcentaje, br.fecha_inicio, br.periodo_pago, br.al, br.dias_pagar, SUM(br.julio) julio, SUM(br.agosto) agosto, SUM(br.septiembre) septiembre, SUM(br.octubre) octubre, SUM(br.noviembre) noviembre, SUM(br.diciembre) diciembre, SUM(br.enero) enero, SUM(br.febrero) febrero, SUM(br.marzo) marzo, SUM(br.abril) abril, SUM(br.mayo) mayo, SUM(br.junio) junio, SUM(br.total_periodo) total_periodo, SUM(br.bono) bono, SUM(br.primer_pago) primer_pago, SUM(br.segundo_pago) segundo_pago FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN empresa_empleado ee ON br.id_empleado = ee.id_empleado AND ee.principal = 1 and ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(br.al) = " . $_GET["anio"] . " AND em.id = " . $_GET["id_empresa"] . "  GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empleado' => $row["empleado"],
                        'empresa' => $row["empresa"],
                        'porcentaje' => $row["porcentaje"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'periodo_pago' => $row["periodo_pago"],
                        'al' => $row["al"],
                        'dias_pagar' => $row["dias_pagar"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'total_periodo' => $row["total_periodo"],
                        'bono' => $row["bono"],
                        'primer_pago' => $row["primer_pago"],
                        'segundo_pago' => $row["segundo_pago"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }


        if ($_GET["quest"] == 'listado_empresas') {
            $sql = "SELECT id, nit, nombre_comercial, razon_social FROM empresa";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nit' => $row["nit"],
                        'nombre_comercial' => $row["nombre_comercial"],
                        'razon_social' => $row["razon_social"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_empresa_filtro') {
            $sql = "SELECT * FROM empresa WHERE id != " . $_GET["id_empresa"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre_comercial"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'intercompany_bonos') {

            $result = mysqli_query($con, $_GET["query"]);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empleado' => $row["empleado"],
                        'empresa_deudora' => $row["empresa_deudora"],
                        'empresa_acreedora' => $row["empresa_acreedora"],
                        'total' => $row["total_salario_periodo"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                $_GET["query"];
            }
        }


        if ($_GET["quest"] == 'lista_aguinaldo_anual') {
            $sql = "SELECT CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, em.nombre_comercial empresa, SUM(ar.porcentaje) porcentaje, ar.fecha_inicio, ar.periodo_pago, ar.al, ar.dias_pagar, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.total_periodo) total_periodo, SUM(ar.bono) bono, SUM(ar.primer_pago) primer_pago, SUM(ar.segundo_pago) segundo_pago FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN empresa_empleado ee ON ar.id_empleado = ee.id_empleado AND ee.principal = 1 and ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(ar.al) = " . $_GET["anio"] . " AND em.id = " . $_GET["id_empresa"] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empleado' => $row["empleado"],
                        'empresa' => $row["empresa"],
                        'porcentaje' => $row["porcentaje"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'periodo_pago' => $row["periodo_pago"],
                        'al' => $row["al"],
                        'dias_pagar' => $row["dias_pagar"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'total_periodo' => $row["total_periodo"],
                        'bono' => $row["bono"],
                        'primer_pago' => $row["primer_pago"],
                        'segundo_pago' => $row["segundo_pago"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_pagos_historial') {
            $sql = "SELECT pl.id correlativo, pl.id_empleado id_empleado, pl.id_lote id_lote, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, emp.nombre_comercial, cc.nombre centro_costo, d.nombre departamento, pl.puesto puesto, pl.dias_laborados dias_laborados, pl.sueldo_quincenal salario_ordinario, pl.bon_tot bon_incentivo, pl.bon_dec_tot bon_decreto, pl.bonos bonos, (pl.sueldo_quincenal + pl.bon_tot + pl.bon_dec_tot + pl.bonos) total_devengado, pl.cantidad_horas_dia horas_simples, pl.horas_dia valor_horas_simples, pl.cantidad_horas_noche horas_dobles, pl.horas_noche valor_horas_dobles, pl.otros_ingresos otros_ingresos, pl.ingresos_tot salario_total, pl.vacaciones vacaciones, tp.nombre tipo_pago, tc.nombre tipo_cuenta, pl.no_cuenta no_cuenta, bnc.nombre banco, cl.nombre condicion_laboral, pl.igss igss, pl.isr isr, 0 cafeteria, 0 celular, 0 uniforme, 0 calzado, 0 equipo, 0 producto, 0 bancos, 0 otros, pl.judiciales judiciales, pl.seguro seguro, pl.parqueo parqueo, pl.boleta_ornato boleta_ornato, pl.otros_egresos otros_egresos, pl.egresos_tot total_egresos, pl.liquido liquido_recibir, pl.liquido liquido_primer_quincena, 0 liquido_segunda_quincena FROM pago_lote pl LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = pl.id_centro LEFT JOIN departamento d ON d.id = pl.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN condicion_laboral cl ON cl.id = pl.condicion_laboral WHERE pl.id_lote = " . $_GET['id_lote'] . " AND emp.id = " . $_GET['id_empresa'] . " GROUP BY pl.id_empleado, pl.id_lote ORDER BY pl.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'correlativo' => $row["correlativo"],
                        'id_lote' => $row["id_lote"],
                        'id_empleado' => $row["id_empleado"],
                        'empleado' => $row["empleado"],
                        'nombre_comercial' => $row["nombre_comercial"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dias_laborados' => $row["dias_laborados"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'bonos' => $row["bonos"],
                        'total_devengado' => $row["total_devengado"],
                        'horas_simples' => $row["horas_simples"],
                        'valor_horas_simples' => $row["valor_horas_simples"],
                        'horas_dobles' => $row["horas_dobles"],
                        'valor_horas_dobles' => $row["valor_horas_dobles"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'isr' => $row["isr"],
                        'cafeteria' => $row["cafeteria"],
                        'celular' => $row["celular"],
                        'uniforme' => $row["uniforme"],
                        'calzado' => $row["calzado"],
                        'equipo' => $row["equipo"],
                        'producto' => $row["producto"],
                        'bancos' => $row["bancos"],
                        'otros' => $row["otros"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'boleta_ornato' => $row["boleta_ornato"],
                        'otros_egresos' => $row["otros_egresos"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido_recibir' => $row["liquido_recibir"],
                        'liquido_primer_quincena' => $row["liquido_primer_quincena"],
                        'liquido_segunda_quincena' => $row["liquido_segunda_quincena"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_pagos_centro_historial') {
            $sql = "SELECT pl.id correlativo, pl.id_empleado id_empleado, pl.id_lote id_lote, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, emp.nombre_comercial, cc.nombre centro_costo, d.nombre departamento, pl.puesto puesto, pl.dias_laborados dias_laborados, pl.sueldo_quincenal salario_ordinario, pl.bon_tot bon_incentivo, pl.bon_dec_tot bon_decreto, pl.bonos bonos, (pl.sueldo_quincenal + pl.bon_tot + pl.bon_dec_tot + pl.bonos) total_devengado, pl.cantidad_horas_dia horas_simples, pl.horas_dia valor_horas_simples, pl.cantidad_horas_noche horas_dobles, pl.horas_noche valor_horas_dobles, pl.otros_ingresos otros_ingresos, pl.ingresos_tot salario_total, pl.vacaciones vacaciones, tp.nombre tipo_pago, tc.nombre tipo_cuenta, pl.no_cuenta no_cuenta, bnc.nombre banco, cl.nombre condicion_laboral, pl.igss igss, pl.isr isr, 0 cafeteria, 0 celular, 0 uniforme, 0 calzado, 0 equipo, 0 producto, 0 bancos, 0 otros, pl.judiciales judiciales, pl.seguro seguro, pl.parqueo parqueo, pl.boleta_ornato boleta_ornato, pl.otros_egresos otros_egresos, pl.egresos_tot total_egresos, pl.liquido liquido_recibir, pl.liquido liquido_primer_quincena, 0 liquido_segunda_quincena FROM pago_lote pl LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = pl.id_centro LEFT JOIN departamento d ON d.id = pl.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN condicion_laboral cl ON cl.id = pl.condicion_laboral WHERE pl.id_lote = " . $_GET['id_lote'] . " AND emp.id = " . $_GET['id_empresa'] . " AND cc.id = " . $_GET['id_centro'] . " GROUP BY pl.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'correlativo' => $row["correlativo"],
                        'id_lote' => $row["id_lote"],
                        'id_empleado' => $row["id_empleado"],
                        'empleado' => $row["empleado"],
                        'nombre_comercial' => $row["nombre_comercial"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dias_laborados' => $row["dias_laborados"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'bonos' => $row["bonos"],
                        'total_devengado' => $row["total_devengado"],
                        'horas_simples' => $row["horas_simples"],
                        'valor_horas_simples' => $row["valor_horas_simples"],
                        'horas_dobles' => $row["horas_dobles"],
                        'valor_horas_dobles' => $row["valor_horas_dobles"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'isr' => $row["isr"],
                        'cafeteria' => $row["cafeteria"],
                        'celular' => $row["celular"],
                        'uniforme' => $row["uniforme"],
                        'calzado' => $row["calzado"],
                        'equipo' => $row["equipo"],
                        'producto' => $row["producto"],
                        'bancos' => $row["bancos"],
                        'otros' => $row["otros"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'boleta_ornato' => $row["boleta_ornato"],
                        'otros_egresos' => $row["otros_egresos"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido_recibir' => $row["liquido_recibir"],
                        'liquido_primer_quincena' => $row["liquido_primer_quincena"],
                        'liquido_segunda_quincena' => $row["liquido_segunda_quincena"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_pagos_departamento_historial') {
            $sql = "SELECT pl.id correlativo, pl.id_empleado id_empleado, pl.id_lote id_lote, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, emp.nombre_comercial, cc.nombre centro_costo, d.nombre departamento, pl.puesto puesto, pl.dias_laborados dias_laborados, pl.sueldo_quincenal salario_ordinario, pl.bon_tot bon_incentivo, pl.bon_dec_tot bon_decreto, pl.bonos bonos, (pl.sueldo_quincenal + pl.bon_tot + pl.bon_dec_tot + pl.bonos) total_devengado, pl.cantidad_horas_dia horas_simples, pl.horas_dia valor_horas_simples, pl.cantidad_horas_noche horas_dobles, pl.horas_noche valor_horas_dobles, pl.otros_ingresos otros_ingresos, pl.ingresos_tot salario_total, pl.vacaciones vacaciones, tp.nombre tipo_pago, tc.nombre tipo_cuenta, pl.no_cuenta no_cuenta, bnc.nombre banco, cl.nombre condicion_laboral, pl.igss igss, pl.isr isr, 0 cafeteria, 0 celular, 0 uniforme, 0 calzado, 0 equipo, 0 producto, 0 bancos, 0 otros, pl.judiciales judiciales, pl.seguro seguro, pl.parqueo parqueo, pl.boleta_ornato boleta_ornato, pl.otros_egresos otros_egresos, pl.egresos_tot total_egresos, pl.liquido liquido_recibir, pl.liquido liquido_primer_quincena, 0 liquido_segunda_quincena FROM pago_lote pl LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = pl.id_centro LEFT JOIN departamento d ON d.id = pl.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN condicion_laboral cl ON cl.id = pl.condicion_laboral WHERE pl.id_lote = " . $_GET['id_lote'] . " AND emp.id = " . $_GET['id_empresa'] . " AND d.id = " . $_GET['id_departamento'] . " GROUP BY pl.id_empleado, pl.id_lote ORDER BY pl.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'correlativo' => $row["correlativo"],
                        'id_lote' => $row["id_lote"],
                        'id_empleado' => $row["id_empleado"],
                        'empleado' => $row["empleado"],
                        'nombre_comercial' => $row["nombre_comercial"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dias_laborados' => $row["dias_laborados"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'bonos' => $row["bonos"],
                        'total_devengado' => $row["total_devengado"],
                        'horas_simples' => $row["horas_simples"],
                        'valor_horas_simples' => $row["valor_horas_simples"],
                        'horas_dobles' => $row["horas_dobles"],
                        'valor_horas_dobles' => $row["valor_horas_dobles"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'isr' => $row["isr"],
                        'cafeteria' => $row["cafeteria"],
                        'celular' => $row["celular"],
                        'uniforme' => $row["uniforme"],
                        'calzado' => $row["calzado"],
                        'equipo' => $row["equipo"],
                        'producto' => $row["producto"],
                        'bancos' => $row["bancos"],
                        'otros' => $row["otros"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'boleta_ornato' => $row["boleta_ornato"],
                        'otros_egresos' => $row["otros_egresos"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido_recibir' => $row["liquido_recibir"],
                        'liquido_primer_quincena' => $row["liquido_primer_quincena"],
                        'liquido_segunda_quincena' => $row["liquido_segunda_quincena"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }


        if ($_GET["quest"] == 'listado_empresas_pagos') {
            $sql = "SELECT id, nit, nombre_comercial, razon_social FROM empresa where id in(1,2)";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nit' => $row["nit"],
                        'nombre_comercial' => $row["nombre_comercial"],
                        'razon_social' => $row["razon_social"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }


        if ($_GET["quest"] == 'ultimo_lote') {
            $sql = "SELECT * FROM lote ORDER BY id desc LIMIT 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'id_estado' => $row["id_estado"],
                        'quincena' => $row["quincena"],
                        'fecha' => $row["fecha"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_cambios_empleado') {
            $sql = "SELECT he.id id_cambio, he.nombre_campo campo_modificado, he.info_antes informacion_anterior, he.info_despues nueva_informacion, date(he.fecha_cambio) fecha_cambio, time(he.fecha_cambio) hora_cambio, COALESCE(u.nombre,'---') responsable FROM historial_empleado he LEFT JOIN usuario u on u.id = he.id_usuario WHERE he.id_empleado = " . $_GET["id_empleado"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_cambio' => $row["id_cambio"],
                        'campo_modificado' => $row["campo_modificado"],
                        'informacion_anterior' => $row["informacion_anterior"],
                        'nueva_informacion' => $row["nueva_informacion"],
                        'fecha_cambio' => $row["fecha_cambio"],
                        'hora_cambio' => $row["hora_cambio"],
                        'responsable' => $row["responsable"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lote_activo') {
            $sql = "SELECT * From lote where id_estado = 1 limit 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'id_estado' => $row["id_estado"],
                        'quincena' => $row["quincena"],
                        'fecha' => $row["fecha"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_empresa_cheques') {
            $sql = "SELECT e.id, e.nombre_comercial FROM empresa e INNER JOIN pago_lote pl on e.id = pl.id_empresa GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre_comercial"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_empresa_cheques_historial') {
            $sql = "SELECT e.id, e.nombre_comercial FROM pago_lote pl LEFT JOIN empresa e on e.id = pl.id_empresa WHERE pl.id_lote = " . $_GET["id_lote"] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre_comercial"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_empresa_cheques_verificador') {
            $sql = "SELECT e.id, e.nombre_comercial, b.nombre banco_empresa, COALESCE((select sum(pl.liquido) from pago_lote pl where pl.id_empresa = e.id and pl.id_lote = " . $_GET["id_lote"] . " and pl.cheque = 2),0) liquido_transferencia FROM empresa e INNER JOIN banco b on e.id_banco = b.id GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre_comercial"],
                        'banco_empresa' => $row["banco_empresa"],
                        'liquido_transferencia' => $row["liquido_transferencia"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_empresa_cheques_verificador_historial') {
            $sql = "SELECT e.id, e.nombre_comercial, b.nombre banco_empresa, COALESCE( ( SELECT SUM(liquido) FROM pago_lote WHERE id_lote = pl.id_lote AND cheque = 2 AND id_empresa = pl.id_empresa ), 0 ) liquido_transferencia FROM pago_lote pl LEFT JOIN empresa e ON e.id = pl.id_empresa LEFT JOIN banco b ON b.id = pl.id_banco WHERE pl.id_lote = " . $_GET["id_lote"] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre_comercial"],
                        'banco_empresa' => $row["banco_empresa"],
                        'liquido_transferencia' => $row["liquido_transferencia"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_cheques') {
            $sql = "SELECT CONCAT( e.primer_nombre, ' ', e.segundo_nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido ) empleado, emp.nombre_comercial AS empresa, cl.nombre tipo_personal, 'cheque' soporte, b.nombre banco, 'cheque' medio_pago, pl.liquido monto FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN banco b ON pl.id_banco = b.id INNER JOIN condicion_laboral cl ON pl.condicion_laboral = cl.id INNER JOIN centro_costo cc ON e.centro_de_costo = cc.id INNER JOIN empresa_centro ec ON cc.id = ec.id_centro INNER JOIN empresa emp ON ec.id_empresa = emp.id WHERE pl.id_lote = " . $_GET["id_lote"] . " AND pl.id_empresa = " . $_GET["id_empresa"] . " AND pl.cheque = 1 GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empleado' => $row["empleado"],
                        'empresa' => $row["empresa"],
                        'tipo_personal' => $row["tipo_personal"],
                        'soporte' => $row["soporte"],
                        'banco' => $row["banco"],
                        'medio_pago' => $row["medio_pago"],
                        'monto' => $row["monto"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_cheques_historial') {
            $sql = "SELECT CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, emp.nombre_comercial empresa, cl.nombre tipo_personal, 'cheque' soporte, b.nombre banco, 'cheque' medio_pago, pl.liquido monto FROM pago_lote pl LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN condicion_laboral cl ON cl.id = pl.condicion_laboral LEFT JOIN banco b ON b.id = pl.id_banco WHERE pl.id_lote = " . $_GET["id_lote"] . " AND pl.id_empresa = " . $_GET["id_empresa"] . " AND pl.cheque = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empleado' => $row["empleado"],
                        'empresa' => $row["empresa"],
                        'tipo_personal' => $row["tipo_personal"],
                        'soporte' => $row["soporte"],
                        'banco' => $row["banco"],
                        'medio_pago' => $row["medio_pago"],
                        'monto' => $row["monto"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_bonos_confirmados') {
            $sql = "SELECT b.id as id_bono, ep.id as id_empleado, e.nombre_comercial as empresa, e.id as id_empresa, d.nombre as departamento, d.id as id_departamento, concat(ep.primer_nombre, ' ', ep.segundo_nombre, ' ', ep.primer_apellido, ' ', ep.segundo_apellido) as empleado, ep.sueldo_ordinario as sueldo, (select (bon_dec_37_2001 + bon_productiva + bon_incentivo + comisiones + horas_extras_dobles + horas_extras_simples + otro_ingresos + total_igss) from empleado where id = b.id_empleado) as bonificaciones, (select (anticipo_quincenal + bantrab + boleto_de_ornato + cafeteria + celular + igss_laboral + igss_patronal + isr + otro_descuentos + prestamo_empresa) from empleado where id = b.id_empleado) as descuentos, (select sum(monto) from bono where id_empleado = b.id_empleado and id in(" . $_GET['id_bonos'] . ")) as bonos, (((select (sueldo_ordinario + bon_dec_37_2001 + bon_productiva + bon_incentivo + comisiones + horas_extras_dobles + horas_extras_simples + otro_ingresos + total_igss) from empleado where id = b.id_empleado) - (select (anticipo_quincenal + bantrab + boleto_de_ornato + cafeteria + celular + igss_laboral + igss_patronal + isr + otro_descuentos + prestamo_empresa) from empleado where id = b.id_empleado))/2) + (select sum(monto) from bono where id_empleado = b.id_empleado and id in(" . $_GET['id_bonos'] . ")) as liquido from bono b inner join empleado ep on b.id_empleado = ep.id inner join empresa e on b.empresa_trabajo = e.id INNER JOIN departamento d on ep.departamento_laboral = d.id where b.id in(" . $_GET['id_bonos'] . ") group by ep.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_bono' => $row['id_bono'],
                        'id_empleado' => $row['id_empleado'],
                        'empresa' => $row["empresa"],
                        'id_empresa' => $row["id_empresa"],
                        'departamento' => $row["departamento"],
                        'id_departamento' => $row["id_departamento"],
                        'empleado' => $row["empleado"],
                        'sueldo' => $row["sueldo"],
                        'bonificaciones' => $row["bonificaciones"],
                        'descuentos' => $row["descuentos"],
                        'bonos' => $row["bonos"],
                        'liquido' => $row["liquido"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lista_empleado') {
            $sql = "SELECT *, e.id id_e FROM `empleado` e WHERE e.departamento_laboral = " . $_GET["id_departamento"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id_e"],
                        'primer_nombre' => $row["primer_nombre"],
                        'primer_apellido' => $row["primer_apellido"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'Nos';
            }
        }

        if ($_GET["quest"] == 'listado_detalle_lote') {
            $sql = "SELECT pl.id, e.nombre_comercial, d.nombre, pl.nombre_empleado, pl.sueldo, pl.bonificacion, pl.descuento, pl.bonos, pl.liquido FROM pago_lote pl inner join departamento d on pl.id_departamento = d.id inner join empresa e on pl.id_empresa = e.id where pl.id_lote = " . $_GET['id_lote'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row['id'],
                        'nombre_comercial' => $row['nombre_comercial'],
                        'departamento' => $row['nombre'],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'sueldo' => $row["sueldo"],
                        'bonificacion' => $row["bonificacion"],
                        'descuento' => $row["descuento"],
                        'bonos' => $row["bonos"],
                        'liquido' => $row["liquido"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_empresa') {
            $sql = "SELECT *, b.nombre nombre_banco FROM empresa e inner join banco b on e.id_banco = b.id where e.id = " . $_GET['id_empresa'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'apartado_postal' => $row["apartado_postal"],
                        'apto' => $row["apto"],
                        'calle' => $row["calle"],
                        'colonia' => $row["colonia"],
                        'departamento' => $row["departamento"],
                        'direccion' => $row["direccion"],
                        'direccion_patrono' => $row["direccion_patrono"],
                        'email' => $row["email"],
                        'fax' => $row["fax"],
                        'municipio' => $row["municipio"],
                        'nit' => $row["nit"],
                        'nit_patrono' => $row["nit_partono"],
                        'nombre_comercial' => $row["nombre_comercial"],
                        'nombre_patrono' => $row["nombre_patrono"],
                        'nomenclatura' => $row["nomenclatura"],
                        'numero' => $row["numero"],
                        'numero_patrono' => $row["numero_patrono"],
                        'razon_social' => $row["razon_social"],
                        'telefono' => $row["telefono"],
                        'id_banco' => $row["id_banco"],
                        'nombre_banco' => $row["nombre_banco"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'detalle_pago_empleado') {
            $sql = "SELECT CONCAT( e.primer_nombre, ' ', e.segundo_nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido ) AS nombre_empleado, b.puesto_trabajo AS puesto, ep.nombre_comercial AS empresa_trabajo, b.tarea, ( ( ( SELECT ( sueldo_ordinario + bon_dec_37_2001 + bon_productiva + bon_incentivo + comisiones + horas_extras_dobles + horas_extras_simples + otro_ingresos + total_igss ) FROM empleado WHERE id = e.id ) -( SELECT ( anticipo_quincenal + bantrab + boleto_de_ornato + cafeteria + celular + igss_laboral + igss_patronal + isr + otro_descuentos + prestamo_empresa ) FROM empleado WHERE id = e.id ) ) / 2 ) + sum(b.monto) AS liquido, e.sueldo_ordinario, e.vacaciones, e.bon_dec_37_2001, e.bon_productiva, e.bon_incentivo, e.comisiones, e.horas_extras_dobles, e.horas_extras_simples, e.otro_ingresos, e.total_igss, e.anticipo_quincenal, e.bantrab, e.boleto_de_ornato, e.cafeteria, e.celular, e.igss_laboral, e.igss_patronal, e.isr, e.otro_descuentos, e.prestamo_empresa FROM empleado e INNER JOIN bono b ON e.id = b.id_empleado and b.id in(" . $_GET['bonos_confirmados'] . ") INNER JOIN empresa ep ON b.empresa_trabajo = ep.id WHERE e.id = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'nombre_empleado' => $row['nombre_empleado'],
                        'puesto' => $row['puesto'],
                        'empresa_trabajo' => $row['empresa_trabajo'],
                        'tarea' => $row['tarea'],
                        'liquido' => $row['liquido'],
                        'vacaciones' => $row['vacaciones'],
                        'sueldo_ordinario' => $row['sueldo_ordinario'],
                        'bon_dec_37_2001' => $row['bon_dec_37_2001'],
                        'bon_productiva' => $row['bon_productiva'],
                        'bon_incentivo' => $row['bon_incentivo'],
                        'comisiones' => $row['comisiones'],
                        'horas_extras_dobles' => $row['horas_extras_dobles'],
                        'horas_extras_simples' => $row['horas_extras_simples'],
                        'otro_ingresos' => $row['otro_ingresos'],
                        'total_igss' => $row['total_igss'],
                        'anticipo_quincenal' => $row['anticipo_quincenal'],
                        'bantrab' => $row['bantrab'],
                        'boleto_de_ornato' => $row['boleto_de_ornato'],
                        'cafeteria' => $row['cafeteria'],
                        'celular' => $row['celular'],
                        'igss_laboral' => $row['igss_laboral'],
                        'igss_patronal' => $row['igss_patronal'],
                        'isr' => $row['isr'],
                        'otro_descuentos' => $row['otro_descuentos'],
                        'prestamo_empresa' => $row['prestamo_empresa'],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_pago_lote') {
            $sql = "SELECT * FROM detalle_pago_lote where id_pago_lote = " . $_GET['id_pago_lote'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'nombre_empleado' => $row['nombre_empleado'],
                        'puesto' => $row['puesto_empleado'],
                        'empresa_trabajo' => $row['empresa_empleado'],
                        'tarea' => $row['concepto'],
                        'liquido' => $row['liquido'],
                        'vacaciones' => $row['vacaciones'],
                        'sueldo_ordinario' => $row['sueldo_ordinario'],
                        'bon_dec_37_2001' => $row['bon_37_2001'],
                        'bon_productiva' => $row['bon_productiva'],
                        'bon_incentivo' => $row['bon_incentivo'],
                        'comisiones' => $row['comisiones'],
                        'horas_extras_dobles' => $row['horas_extras_dobles'],
                        'horas_extras_simples' => $row['horas_extras'],
                        'otro_ingresos' => $row['otros_ingresos'],
                        'total_igss' => $row['total_igss'],
                        'anticipo_quincenal' => $row['anticipo_quincenal'],
                        'bantrab' => $row['bantrab'],
                        'boleto_de_ornato' => $row['boleto_ornato'],
                        'cafeteria' => $row['cafeteria'],
                        'celular' => $row['celular'],
                        'igss_laboral' => $row['igss_laboral'],
                        'igss_patronal' => $row['igss_patronal'],
                        'isr' => $row['isr'],
                        'otro_descuentos' => $row['otros_egresos'],
                        'prestamo_empresa' => $row['prestamo_empresa'],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lista_descuentos') {
            $sql = "SELECT dv.id, dv.tipo_egreso, dv.monto_total, dv.cuotas, dv.faltan, DATE(dv.fecha_generado) fecha_generado, CONCAT( e.primer_nombre, ' ', e.segundo_nombre, ' ', e.primer_apellido, ' ', e.segundo_nombre ) nombre, dv.estado, dv.seleccionado, d.nombre departamento FROM descuento_variable dv INNER JOIN empleado e ON dv.id_empleado = e.id INNER JOIN departamento d ON e.departamento_laboral = d.id WHERE dv.estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'tipo_egreso' => $row["tipo_egreso"],
                        'monto_total' => $row["monto_total"],
                        'cuotas' => $row["cuotas"],
                        'faltan' => $row["faltan"],
                        'fecha_generado' => $row["fecha_generado"],
                        'nombre' => $row["nombre"],
                        'departamento' => $row["departamento"],
                        'estado' => $row["estado"],
                        'seleccionado' => $row["seleccionado"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lista_descuento') {
            $sql = "SELECT dv.id, dv.tipo_egreso, dv.monto_total, dv.cuotas, dv.faltan, DATE(dv.fecha_generado) fecha_generado, CONCAT( e.primer_nombre, ' ', e.segundo_nombre, ' ', e.primer_apellido, ' ', e.segundo_nombre ) nombre, dv.estado, dv.seleccionado, d.nombre departamento, cc.nombre centro_costo FROM descuento_variable dv INNER JOIN empleado e ON dv.id_empleado = e.id INNER JOIN departamento d ON e.departamento_laboral = d.id INNER JOIN centro_costo cc ON e.centro_de_costo = cc.id WHERE dv.id = '" . $_GET["id"] . "'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'tipo_egreso' => $row["tipo_egreso"],
                        'monto_total' => $row["monto_total"],
                        'cuotas' => $row["cuotas"],
                        'faltan' => $row["faltan"],
                        'fecha_generado' => $row["fecha_generado"],
                        'nombre' => $row["nombre"],
                        'departamento' => $row["departamento"],
                        'estado' => $row["estado"],
                        'seleccionado' => $row["seleccionado"],
                        'centro_costo' => $row["centro_costo"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'descuento_lote') {
            $sql = "SELECT l.nombre lote FROM `descuento_lote` dl INNER JOIN lote l ON dl.id_lote = l.id WHERE dl.id_descuento = '" . $_GET["id"] . "'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'lote' => $row["lote"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_departamentos') {
            $sql = "SELECT id, nombre FROM departamento where id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_centros_costo') {
            $sql = "SELECT id, nombre FROM centro_costo where id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_dimension_3') {
            $sql = "SELECT id, nombre FROM dimension_3 where id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }


        if ($_GET["quest"] == 'listado_dimension_4') {
            $sql = "SELECT id, nombre FROM dimension_4 where id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_dimension_5') {
            $sql = "SELECT id, nombre FROM dimension_5 where id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_centros_costo_ficha_empleado') {
            $sql = "SELECT cc.id, cc.nombre FROM centro_costo cc inner join departamento_centro dc on cc.id = dc.id_centro where cc.id_estado = 1 and dc.id_departamento = " . $_GET["id_depto"] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_dimension_3_ficha_empleado') {
            $sql = "SELECT d.id id, d.nombre nombre FROM dimension_3 d LEFT JOIN centro_dimension3 cd on cd.id_dimension = d.id WHERE d.id_estado = 1 and cd.id_centro = " . $_GET["id_centro"] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_dimension_4_ficha_empleado') {
            $sql = "SELECT d.id id, d.nombre nombre FROM dimension_4 d LEFT JOIN dimension3_dimension_4 cd on cd.id_dimension4 = d.id WHERE d.id_estado = 1 and cd.id_dimension3 = " . $_GET["id_dimension"] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_dimension_5_ficha_empleado') {
            $sql = "SELECT d.id id, d.nombre nombre FROM dimension_5 d LEFT JOIN dimension4_dimension5 cd on cd.id_dimension5 = d.id WHERE d.id_estado = 1 and cd.id_dimension4 = " . $_GET["id_dimension"] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_empresa_principal') {
            $sql = "SELECT e.id, e.nombre_comercial FROM empresa e INNER JOIN empresa_centro ec ON e.id = ec.id_empresa WHERE e.id_estado = 1 AND ec.id_centro = " . $_GET["id_centro"] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre_comercial"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_historial_empresa') {
            $sql = "SELECT emp.nombre_comercial, ee.porcentaje, ee.principal, coalesce(date(ee.fecha), '') fecha FROM empresa_empleado ee LEFT JOIN empresa emp on emp.id = ee.id_empresa LEFT JOIN empleado e on e.id = ee.id_empleado WHERE e.id = " . $_GET["id_empleado"] . " and ee.activo = 0";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'nombre_comercial' => $row["nombre_comercial"],
                        'porcentaje' => $row["porcentaje"],
                        'principal' => $row["principal"],
                        'fecha' => $row["fecha"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_recibo_pago') {

            $sql = "SELECT COALESCE(CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada), 0) AS 'empleado', COALESCE(e.puesto, 0) AS 'puesto', COALESCE(em.nombre_comercial, 0) AS 'empresa', COALESCE(SUM(pl.dias_laborados), 0) AS 'dias_laborados', COALESCE(SUM(pl.sueldo_quincenal), 0) AS 'sueldo_devengado', COALESCE(SUM(pl.bon_tot + pl.bon_dec_tot + pl.bonos), 0) AS 'bonificacion', COALESCE(SUM(pl.cantidad_horas_dia), 0) AS 'cantidad_horas_dia', COALESCE(SUM(pl.horas_dia), 0) AS 'horas_dia', COALESCE(SUM(pl.cantidad_horas_noche), 0) AS 'cantidad_horas_noche', COALESCE(SUM(pl.horas_noche), 0) AS 'horas_noche', COALESCE(SUM(pl.otros_ingresos), 0) AS 'otros_ingresos', COALESCE(SUM(pl.igss), 0) AS 'igss', COALESCE(MONTH(lot.fecha), 0) AS 'lote', COALESCE( SUM( (SELECT SUM(dv.monto_total / dv.cuotas) FROM descuento_lote dl INNER JOIN descuento_variable dv ON dl.id_descuento = dv.id LEFT JOIN pago_lote pl2 ON dl.id_pago_lote = pl2.id WHERE dv.tipo_egreso = 'Celular' AND pl2.id_empleado = e.id AND MONTH(pl2.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pl2.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) ) ), 0) AS 'celular', COALESCE( SUM( (SELECT SUM(dv.monto_total / dv.cuotas) FROM descuento_lote dl INNER JOIN descuento_variable dv ON dl.id_descuento = dv.id LEFT JOIN pago_lote pl2 ON dl.id_pago_lote = pl2.id WHERE dv.tipo_egreso = 'Bancos' AND pl2.id_empleado = e.id AND MONTH(pl2.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pl2.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) ) ), 0) AS 'banco', COALESCE(SUM(pl.isr), 0) AS 'isr', COALESCE( SUM( (SELECT SUM(dv.monto_total / dv.cuotas) FROM descuento_lote dl INNER JOIN descuento_variable dv ON dl.id_descuento = dv.id LEFT JOIN pago_lote pl2 ON dl.id_pago_lote = pl2.id WHERE dv.tipo_egreso NOT IN ('Bancos', 'Celular') AND pl2.id_empleado = e.id AND MONTH(pl2.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pl2.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) ) ), 0) AS 'descuentos', COALESCE( SUM( (SELECT SUM(pl3.liquido) FROM pago_lote pl3 INNER JOIN lote l1 ON pl3.id_lote = l1.id WHERE l1.quincena = 0 AND pl3.id = pl.id ) ), 0) AS 'primera', COALESCE( SUM( (SELECT SUM(pl4.liquido) FROM pago_lote pl4 INNER JOIN lote l2 ON pl4.id_lote = l2.id WHERE l2.quincena = 1 AND pl4.id = pl.id ) ), 0) AS 'segunda' FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado AND ee.principal = 1 INNER JOIN empresa em ON ee.id_empresa = em.id INNER JOIN lote lot ON pl.id_lote = lot.id WHERE MONTH(pl.fecha_pago_lote) = ( SELECT MONTH(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . " ) AND YEAR(pl.fecha_pago_lote) = ( SELECT YEAR(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . " ) GROUP BY e.id;";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empleado' => $row["empleado"],
                        'puesto' => $row["puesto"],
                        'empresa' => $row["empresa"],
                        'dias_laborados' => $row["dias_laborados"],
                        'sueldo_devengado' => $row["sueldo_devengado"],
                        'bonificacion' => $row["bonificacion"],
                        'cantidad_horas_dia' => $row["cantidad_horas_dia"],
                        'horas_dia' => $row["horas_dia"],
                        'cantidad_horas_noche' => $row["cantidad_horas_noche"],
                        'horas_noche' => $row["horas_noche"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'igss' => $row["igss"],
                        'celular' => $row["celular"],
                        'banco' => $row["banco"],
                        'isr' => $row["isr"],
                        'descuentos' => $row["descuentos"],
                        'primera' => $row["primera"],
                        'segunda' => $row["segunda"],
                        'lote' => $row["lote"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                $_GET["query"];
            }
        }

        if ($_GET["quest"] == 'horas_extra') {
            $sql = "SELECT he.id, CONCAT(e.primer_nombre, ' ', e.segundo_nombre, ' ', e.otro_nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido, ' ', e.apellido_casada) as empleado, DATE(he.fecha_trabajado) as fecha_trabajado, he.horas, CASE WHEN he.jornada = 0 then 'Diurna' ELSE 'Nocturna' END as jornada, he.monto, he.estado as id_estado, he.seleccionado, et.nombre as estado, e.id as id_empleado FROM horas_extra he INNER JOIN empleado e on he.id_empleado = e.id INNER JOIN estado_bono et on he.estado = et.id WHERE he.estado = 2 ORDER BY he.fecha_generado DESC";
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'empleado' => $row["empleado"],
                        'fecha_trabajado' => $row["fecha_trabajado"],
                        'horas' => $row["horas"],
                        'jornada' => $row["jornada"],
                        'monto' => $row["monto"],
                        'estado' => $row["estado"],
                        'id_estado' => $row["id_estado"],
                        'seleccionado' => $row["seleccionado"],
                        'id_empleado' => $row["id_empleado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_isr') {
            $sql = "SELECT e.id, CONCAT( e.primer_nombre, ' ', e.segundo_nombre, ' ', e.otro_nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido, ' ', e.apellido_casada ) AS nombre, e.isr FROM empleado e where e.estado = 1";
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'isr' => $row["isr"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 0;
            }
        }

        if ($_GET["quest"] == 'detalle_horas_extra') {
            $sql = "SELECT CONCAT(e.primer_nombre, ' ', e.segundo_nombre, ' ', e.otro_nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido, ' ', e.apellido_casada) as empleado, cc.nombre as departamento, date(he.fecha_trabajado) as fecha_trabajado, em.nombre_comercial as empresa, he.horas, CASE WHEN he.jornada = 0 THEN 'Diurna' ELSE 'Nocturna' END as jornada, he.monto, he.observacion, u.nombre as solicitador, DATE(he.fecha_generado) as fecha_solicitado, he.observacion_gerencia, he.estado FROM horas_extra he INNER JOIN empleado e on he.id_empleado = e.id INNER JOIN centro_costo cc on e.centro_de_costo = cc.id INNER JOIN empresa_centro ec on ec.id_centro = cc.id INNER JOIN empresa em on ec.id_empresa = em.id INNER JOIN usuario u on he.id_solicitador = u.id WHERE he.id = " . $_GET["id"] . "";
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empleado' => $row["empleado"],
                        'departamento' => $row["departamento"],
                        'fecha_trabajado' => $row["fecha_trabajado"],
                        'empresa' => $row["empresa"],
                        'horas' => $row["horas"],
                        'jornada' => $row["jornada"],
                        'monto' => $row["monto"],
                        'observacion' => $row["observacion"],
                        'solicitador' => $row["solicitador"],
                        'fecha_solicitado' => $row["fecha_solicitado"],
                        'observacion_gerencia' => $row["observacion_gerencia"],
                        'estado' => $row["estado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_tipo_bono') {
            $sql = "SELECT * FROM tipo_bono";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'monto' => $row["monto"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'Sin Datos';
            }
        }

        if ($_GET["quest"] == 'listado_montos_mantenimiento') {
            $sql = "SELECT * FROM monto_mantenimiento";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'monto' => $row["monto"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'Sin Datos';
            }
        }

        if ($_GET["quest"] == 'lista_bonos') {
            $sql = "SELECT b.id, cc.nombre departamento, CONCAT( emp.primer_nombre, ' ', emp.primer_apellido ) empleado, emp.id id_empleado, u.nombre solicitante, DATE(b.fecha_generado) fecha_generado, b.monto, eb.nombre estado FROM bono b INNER JOIN empleado emp ON b.id_empleado = emp.id INNER JOIN centro_costo cc ON emp.centro_de_costo = cc.id INNER JOIN departamento_centro dc on dc.id_centro = cc.id INNER JOIN departamento d ON dc.id_departamento = d.id INNER JOIN usuario u ON b.id_solicitante = u.id INNER JOIN estado_bono eb ON b.id_estado = eb.id GROUP BY b.id ORDER BY b.id DESC";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'departamento' => $row["departamento"],
                        'empleado' => $row["empleado"],
                        'solicitante' => $row["solicitante"],
                        'fecha_generado' => $row["fecha_generado"],
                        'monto' => $row["monto"],
                        'estado' => $row["estado"],
                        'id_empleado' => $row["id_empleado"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lista_lotes') {
            $sql = "SELECT id, nombre from lote";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lista_bonos_confirmados') {
            $sql = "SELECT b.id, d.nombre departamento, CONCAT( emp.primer_nombre, ' ', emp.primer_apellido ) empleado, emp.id id_empleado, u.nombre solicitante, DATE(b.fecha_generado) fecha_generado, b.monto, eb.nombre estado FROM bono b INNER JOIN empleado emp ON b.id_empleado = emp.id INNER JOIN centro_costo cc ON emp.centro_de_costo = cc.id INNER JOIN departamento_centro dc on dc.id_centro = cc.id INNER JOIN departamento d ON dc.id_departamento = d.id INNER JOIN usuario u ON b.id_solicitante = u.id INNER JOIN estado_bono eb ON b.id_estado = eb.id where b.id in(" . $_GET['bonos_confirmados'] . ") and emp.id = " . $_GET['id_empleado'] . " GROUP BY b.id ORDER BY b.id DESC";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'departamento' => $row["departamento"],
                        'empleado' => $row["empleado"],
                        'solicitante' => $row["solicitante"],
                        'fecha_generado' => $row["fecha_generado"],
                        'monto' => $row["monto"],
                        'estado' => $row["estado"],
                        'id_empleado' => $row["id_empleado"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lista_bonos_pago_lote') {
            $sql = "SELECT b.id, d.nombre departamento, CONCAT( emp.primer_nombre, ' ', emp.primer_apellido ) empleado, emp.id id_empleado, u.nombre solicitante, DATE(b.fecha_generado) fecha_generado, b.monto, eb.nombre estado FROM bono b INNER JOIN empleado emp ON b.id_empleado = emp.id INNER JOIN centro_costo cc ON emp.centro_de_costo = cc.id INNER JOIN departamento_centro dc ON dc.id_centro = cc.id INNER JOIN departamento d ON dc.id_departamento = d.id INNER JOIN usuario u ON b.id_solicitante = u.id INNER JOIN estado_bono eb ON b.id_estado = eb.id INNER JOIN bonos_pago_lote bpl ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = " . $_GET['id_pago_lote'] . " GROUP BY b.id ORDER BY b.id DESC";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'departamento' => $row["departamento"],
                        'empleado' => $row["empleado"],
                        'solicitante' => $row["solicitante"],
                        'fecha_generado' => $row["fecha_generado"],
                        'monto' => $row["monto"],
                        'estado' => $row["estado"],
                        'id_empleado' => $row["id_empleado"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lista_bonos_autorizados') {
            $sql = "SELECT b.id, d.nombre departamento, CONCAT( emp.primer_nombre, ' ', emp.primer_apellido ) empleado, emp.id id_empleado, u.nombre solicitante, DATE(b.fecha_generado) fecha_generado, b.monto, eb.nombre estado, b.seleccionado FROM bono b INNER JOIN empleado emp ON b.id_empleado = emp.id INNER JOIN departamento d ON emp.departamento_laboral = d.id INNER JOIN usuario u ON b.id_solicitante = u.id INNER JOIN estado_bono eb ON b.id_estado = eb.id WHERE eb.id = 2 GROUP BY b.id ORDER BY b.id DESC";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'departamento' => $row["departamento"],
                        'empleado' => $row["empleado"],
                        'solicitante' => $row["solicitante"],
                        'fecha_generado' => $row["fecha_generado"],
                        'monto' => $row["monto"],
                        'estado' => $row["estado"],
                        'seleccionado' => $row["seleccionado"],
                        'id_empleado' => $row["id_empleado"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 0;
            }
        }

        if ($_GET["quest"] == 'detalle_bono') {
            $sql = "SELECT b.id, e.nombre_comercial empresa, b.fecha_trabajado, DATE(b.fecha_generado) fecha_generado, b.horas, b.tipo_jornada, b.monto, b.tarea, u.nombre usuario, eb.nombre estado, b.observacion_gerencia as observacion FROM bono b INNER JOIN empresa e ON b.empresa_trabajo = e.id INNER JOIN usuario u ON b.id_solicitante = u.id INNER JOIN estado_bono eb  ON b.id_estado = eb.id WHERE b.id = " . $_GET["id"];
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'empresa' => $row["empresa"],
                        'fecha_trabajado' => $row["fecha_trabajado"],
                        'fecha_generado' => $row["fecha_generado"],
                        'estado' => $row["estado"],
                        'horas' => $row["horas"],
                        'tipo_jornada' => $row["tipo_jornada"],
                        'monto' => $row["monto"],
                        'tarea' => $row["tarea"],
                        'usuario' => $row["usuario"],
                        'observacion' => $row["observacion"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_departamento') {
            $sql = "SELECT d.nombre departamento, d.gerente FROM departamento d where d.id = " . $_GET['id_departamento'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'nombre' => $row["departamento"],
                        'gerente' => $row["gerente"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_centros_costo_depto') {
            $sql = "select c.id, c.nombre, dc.id_departamento_centro from departamento_centro dc left join centro_costo c on dc.id_centro = c.id left join empresa_centro ec on dc.id_centro = ec.id_centro where dc.id_departamento = " . $_GET['id_departamento'] . " and c.id_estado = 1 group by c.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'id_departamento_centro' => $row["id_departamento_centro"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_estado') {
            $sql = "SELECT * FROM estado";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'lote_descuentos_anteriores') {
            $sql = "SELECT l.nombre FROM descuento_lote dl LEFT JOIN descuento_variable dv on dv.id = dl.id_descuento LEFT JOIN lote l on l.id = dl.id_pago_lote WHERE dv.id = " . $_GET['id_descuento'] . " ORDER BY l.id desc";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_estado_civil') {
            $sql = "SELECT * FROM estado_civil";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_genero') {
            $sql = "SELECT * FROM genero";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_banco') {
            $sql = "SELECT * FROM banco";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_tipo_pago') {
            $sql = "SELECT * FROM tipo_pago";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_tipo_cuenta') {
            $sql = "SELECT * FROM tipo_cuenta";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'id_historial_empleado') {
            $sql = "SELECT id FROM historial_empleado WHERE fecha_cambio >= DATE_SUB(NOW(), INTERVAL 5 SECOND)";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_moneda') {
            $sql = "SELECT * FROM moneda";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'pago_real') {
            $sql = "SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(pr.salario) salario, SUM(pr.bono) bono, SUM(pr.cantidad_simple) cantidad_simple, SUM(pr.horas_simple) horas_simple, SUM(pr.cantidad_doble) cantidad_doble, SUM(pr.horas_doble) horas_doble, SUM(pr.cuota_patronal) cuota_patronal, SUM(pr.total) total FROM pago_real pr INNER JOIN empleado e ON pr.id_empleado = e.id INNER JOIN empresa em ON pr.id_empresa = em.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id INNER JOIN pago_lote pl ON pr.id_pago_lote = pl.id INNER JOIN lote l ON pl.id_lote = l.id WHERE MONTH(l.fecha) =( SELECT MONTH(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET['id_lote'] . " ) AND YEAR(l.fecha) =( SELECT YEAR(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET['id_lote'] . " ) AND total != 0 GROUP BY pr.id_empresa, d.id, cc.id, d3, d4, d5 ORDER BY pr.id_empresa, d.id, cc.id, d3, d4, d5";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'salario' => $row["salario"],
                        'bono' => $row["bono"],
                        'cantidad_simple' => $row["cantidad_simple"],
                        'horas_simple' => $row["horas_simple"],
                        'cantidad_doble' => $row["cantidad_doble"],
                        'horas_doble' => $row["horas_doble"],
                        'cuota_patronal' => $row["cuota_patronal"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'pago_contable') {
            $sql = "SELECT em.nombre_comercial AS empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(pc.salario) AS salario, SUM(pc.bono) AS bono, SUM(pc.cantidad_simple) AS cantidad_simple, SUM(pc.horas_simple) AS horas_simple, SUM(pc.cantidad_doble) AS cantidad_doble, SUM(pc.horas_doble) AS horas_doble, SUM(pc.cuota_patronal) AS cuota_patronal, SUM(pc.total) AS total FROM pago_contable pc INNER JOIN empleado e ON pc.id_empleado = e.id INNER JOIN empresa em ON pc.id_empresa = em.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id INNER JOIN pago_lote pl ON pc.id_pago_lote = pl.id INNER JOIN lote l ON pl.id_lote = l.id WHERE MONTH(l.fecha) =( SELECT MONTH(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET['id_lote'] . " ) AND YEAR(l.fecha) =( SELECT YEAR(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET['id_lote'] . " ) AND total != 0 GROUP BY pc.id_empresa, d.id, cc.id, d3, d4, d5 ORDER BY pc.id_empresa, d.id, cc.id, d3, d4, d5";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'salario' => $row["salario"],
                        'bono' => $row["bono"],
                        'cantidad_simple' => $row["cantidad_simple"],
                        'horas_simple' => $row["horas_simple"],
                        'cantidad_doble' => $row["cantidad_doble"],
                        'horas_doble' => $row["horas_doble"],
                        'cuota_patronal' => $row["cuota_patronal"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'ajuste_rh') {

            $sql = "SELECT empresa, d1, d2, d3, d4, d5, SUM(salario) AS salario, SUM(bono) AS bono, SUM(cantidad_simple) AS cantidad_simple, SUM(horas_simple) AS horas_simple, SUM(cantidad_doble) AS cantidad_doble, SUM(horas_doble) AS horas_doble, SUM(cuota_patronal) AS cuota_patronal, SUM(total) AS total FROM ( SELECT em.nombre_comercial AS empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(pc.salario) AS salario, SUM(pc.bono) AS bono, SUM(pc.cantidad_simple) AS cantidad_simple, SUM(pc.horas_simple) AS horas_simple, SUM(pc.cantidad_doble) AS cantidad_doble, SUM(pc.horas_doble) AS horas_doble, SUM(pc.cuota_patronal) AS cuota_patronal, SUM(pc.total) AS total FROM pago_contable pc INNER JOIN empleado e ON pc.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id INNER JOIN empresa em ON pc.id_empresa = em.id INNER JOIN pago_lote pl ON pc.id_pago_lote = pl.id INNER JOIN lote l ON pl.id_lote = l.id WHERE MONTH(l.fecha) =( SELECT MONTH(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . " ) AND YEAR(l.fecha) =( SELECT YEAR(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . " ) GROUP BY pc.id_empresa, d.id, cc.id, d3, d4, d5 UNION ALL SELECT em.nombre_comercial AS empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, - SUM(pr.salario) AS salario, - SUM(pr.bono) AS bono, - SUM(pr.cantidad_simple) AS cantidad_simple, - SUM(pr.horas_simple) AS horas_simple, - SUM(pr.cantidad_doble) AS cantidad_doble, - SUM(pr.horas_doble) AS horas_doble, - SUM(pr.cuota_patronal) AS cuota_patronal, - SUM(pr.total) AS total FROM pago_real pr INNER JOIN empleado e ON pr.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id INNER JOIN empresa em ON pr.id_empresa = em.id INNER JOIN pago_lote pl ON pr.id_pago_lote = pl.id INNER JOIN lote l ON pl.id_lote = l.id WHERE MONTH(l.fecha) =( SELECT MONTH(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . " ) AND YEAR(l.fecha) =( SELECT YEAR(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . " ) GROUP BY pr.id_empresa, d.id, cc.id, d3, d4, d5 ) AS combined WHERE total != 0 GROUP BY empresa, d1, d2, d3, d4, d5";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'salario' => $row["salario"],
                        'bono' => $row["bono"],
                        'cantidad_simple' => $row["cantidad_simple"],
                        'horas_simple' => $row["horas_simple"],
                        'cantidad_doble' => $row["cantidad_doble"],
                        'horas_doble' => $row["horas_doble"],
                        'cuota_patronal' => $row["cuota_patronal"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'determinacion') {
            $sql = "SELECT COALESCE(sub1.empresa, sub2.empresa) AS empresa, COALESCE(sub1.departamento, sub2.departamento) AS departamento, COALESCE(sub1.salario, 0) - sub2.salario AS salario, COALESCE(sub1.bono, 0) - sub2.bono AS bono, COALESCE(sub1.cantidad_simple, 0) - sub2.cantidad_simple AS cantidad_simple, COALESCE(sub1.horas_simple, 0) - sub2.horas_simple AS horas_simple, COALESCE(sub1.cantidad_doble, 0) - sub2.cantidad_doble AS cantidad_doble, COALESCE(sub1.horas_doble, 0) - sub2.horas_doble AS horas_doble, COALESCE(sub1.cuota_patronal, 0) - sub2.cuota_patronal AS cuota_patronal, COALESCE(sub1.total, 0) - sub2.total AS total FROM (SELECT em.nombre_comercial AS empresa, d.nombre departamento, SUM(pc.salario) AS salario, SUM(pc.bono) AS bono, SUM(pc.cantidad_simple) AS cantidad_simple, SUM(pc.horas_simple) AS horas_simple, SUM(pc.cantidad_doble) AS cantidad_doble, SUM(pc.horas_doble) AS horas_doble, SUM(pc.cuota_patronal) AS cuota_patronal, SUM(pc.total) AS total FROM pago_contable pc INNER JOIN empleado e ON pc.id_empleado = e.id INNER JOIN departamento d ON e.departamento_laboral = d.id INNER JOIN empresa em ON pc.id_empresa = em.id INNER JOIN pago_lote pl ON pc.id_pago_lote = pl.id INNER JOIN lote l ON pl.id_lote = l.id WHERE MONTH(l.fecha) = (SELECT MONTH(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . ") AND YEAR(l.fecha) = (SELECT YEAR(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . ") GROUP BY pc.id_empresa) AS sub1 RIGHT JOIN (SELECT em.nombre_comercial AS empresa, d.nombre departamento, SUM(pr.salario) AS salario, SUM(pr.bono) AS bono, SUM(pr.cantidad_simple) AS cantidad_simple, SUM(pr.horas_simple) AS horas_simple, SUM(pr.cantidad_doble) AS cantidad_doble, SUM(pr.horas_doble) AS horas_doble, SUM(pr.cuota_patronal) AS cuota_patronal, SUM(pr.total) AS total FROM pago_real pr INNER JOIN empleado e ON pr.id_empleado = e.id INNER JOIN departamento d ON e.departamento_laboral = d.id INNER JOIN empresa em ON pr.id_empresa = em.id INNER JOIN pago_lote pl ON pr.id_pago_lote = pl.id INNER JOIN lote l ON pl.id_lote = l.id WHERE MONTH(l.fecha) = (SELECT MONTH(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . ") AND YEAR(l.fecha) = (SELECT YEAR(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . ") GROUP BY pr.id_empresa) AS sub2 ON sub1.empresa = sub2.empresa";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'nombre' => $row["departamento"],
                        'salario' => $row["salario"],
                        'bono' => $row["bono"],
                        'cantidad_simple' => $row["cantidad_simple"],
                        'horas_simple' => $row["horas_simple"],
                        'cantidad_doble' => $row["cantidad_doble"],
                        'horas_doble' => $row["horas_doble"],
                        'cuota_patronal' => $row["cuota_patronal"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'intercompany') {
            $sql = "SELECT CONCAT_WS( ' ', ( SELECT e2.nombre_comercial FROM pago_real pr2 INNER JOIN empresa e2 ON pr2.id_empresa = e2.id INNER JOIN pago_lote pl2 ON pr2.id_pago_lote = pl2.id INNER JOIN lote l2 ON pl2.id_lote = l2.id WHERE pr2.principal = 1 AND pr2.id_empleado = pr.id_empleado AND MONTH(l2.fecha) = (SELECT MONTH(lot.fecha) FROM lote lot WHERE lot.id = " . $_GET["id_lote"] . ") AND YEAR(l2.fecha) = (SELECT YEAR(lot.fecha) FROM lote lot WHERE lot.id = " . $_GET["id_lote"] . ") GROUP BY e2.nombre_comercial ), 'Debe Facturar a', e1.nombre_comercial ) factura, SUM(pr.total) base, SUM(pr.total) * 0.12 iva, ( SUM(pr.total) +(SUM(pr.total) * 0.12) ) total FROM pago_real pr INNER JOIN empresa e1 ON pr.id_empresa = e1.id INNER JOIN pago_lote pl ON pr.id_pago_lote = pl.id INNER JOIN lote l ON pl.id_lote = l.id WHERE pr.principal = 0 AND MONTH(l.fecha) =( SELECT MONTH(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . " ) AND YEAR(l.fecha) =( SELECT YEAR(lo.fecha) FROM lote lo WHERE lo.id = " . $_GET["id_lote"] . " ) GROUP BY factura";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'factura' => $row["factura"],
                        'base' => $row["base"],
                        'iva' => $row["iva"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'sugerencia_intercompany') {
            $sql = "SELECT COALESCE(e1.nombre_comercial, '') factura, COALESCE( ( SUM(pr.total) +(SUM(pr.total) * 0.12) ), 0 ) total FROM pago_real pr INNER JOIN empresa e1 ON pr.id_empresa = e1.id INNER JOIN pago_lote pl ON pr.id_pago_lote = pl.id INNER JOIN lote l ON pl.id_lote = l.id WHERE pr.principal = 0 AND MONTH(l.fecha) = MONTH( DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND YEAR(l.fecha) = YEAR(NOW()) GROUP BY factura ORDER BY total DESC LIMIT 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["factura"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_condicion_laboral') {
            $sql = "SELECT * FROM condicion_laboral";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_tipo_licencia') {
            $sql = "SELECT * FROM tipo_licencia";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'tipo' => $row["tipo"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_dias_laborados') {
            $sql = "SELECT dl.id, CONCAT( e.primer_nombre, ' ', e.primer_apellido ) AS nombre, d.nombre departamento, cc.nombre centro_costo, i.nombre incidencia, DATE(dl.fecha_descuento) fecha_descuento, DATE(dl.fecha_generado) fecha_generado FROM dias_laborados dl INNER JOIN empleado e ON dl.id_empleado = e.id INNER JOIN centro_costo cc ON e.centro_de_costo = cc.id INNER JOIN incidencia i ON dl.id_incidencia = i.id INNER JOIN departamento d ON e.departamento_laboral = d.id GROUP BY dl.id ORDER BY dl.fecha_generado DESC";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'departamento' => $row["departamento"],
                        'centro_costo' => $row["centro_costo"],
                        'incidencia' => $row["incidencia"],
                        'fecha_descuento' => $row["fecha_descuento"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_clase_licencia') {
            $sql = "SELECT * FROM clase_licencia";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'clase' => $row["clase"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'obtener_quincena_lote') {
            $sql = "SELECT * FROM lote where id_estado = 1 limit 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'quincena' => $row["quincena"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_dias_laborados') {
            $sql = "SELECT dl.id, dl.descuento_dias, DATE(dl.fecha_descuento) fecha_descuento, COALESCE(DATE(dl.fecha_final), '') fecha_final, DATE(dl.fecha_generado) fecha_generado, dl.septimo, dl.observaciones, i.nombre incidencia, CONCAT( e.primer_nombre, ' ', e.segundo_nombre, ' ', e.otro_nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido, ' ', e.apellido_casada ) empleado, d.nombre departamento, cc.nombre centro_costo FROM dias_laborados dl INNER JOIN incidencia i ON dl.id_incidencia = i.id INNER JOIN empleado e ON dl.id_empleado = e.id INNER JOIN centro_costo cc ON e.centro_de_costo = cc.id INNER JOIN departamento d ON e.departamento_laboral = d.id WHERE dl.id = " . $_GET['id'] . " GROUP BY dl.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'descuento_dias' => $row["descuento_dias"],
                        'fecha_descuento' => $row["fecha_descuento"],
                        'fecha_final' => $row["fecha_final"],
                        'fecha_generado' => $row["fecha_generado"],
                        'septimo' => $row["septimo"],
                        'observaciones' => $row["observaciones"],
                        'incidencia' => $row["incidencia"],
                        'empleado' => $row["empleado"],
                        'departamento' => $row["departamento"],
                        'centro_costo' => $row["centro_costo"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_empleados') {
            $sql = "SELECT e.id, e.primer_nombre, e.primer_apellido, e.dpi, emp.nombre_comercial empresa, emp.id id_empresa, e.id_permisos id_permisos FROM empleado e LEFT JOIN empresa_empleado ee on e.id = ee.id_empleado LEFT JOIN empresa emp on ee.id_empresa = emp.id where e.estado = 1 and ee.activo = 1 and ee.principal = 1 GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'primer_nombre' => $row["primer_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'dpi' => $row["dpi"],
                        'empresa' => $row["empresa"],
                        'id_empresa' => $row["id_empresa"],
                        'id_permisos' => $row["id_permisos"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_empleados_baja') {
            $sql = "SELECT e.id, e.primer_nombre, e.primer_apellido, e.dpi, emp.nombre_comercial empresa, emp.id id_empresa, e.id_permisos id_permisos FROM empleado e LEFT JOIN empresa_empleado ee on e.id = ee.id_empleado LEFT JOIN empresa emp on ee.id_empresa = emp.id where e.estado = 2 and ee.activo = 1 and ee.principal = 1 GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'primer_nombre' => $row["primer_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'dpi' => $row["dpi"],
                        'empresa' => $row["empresa"],
                        'id_empresa' => $row["id_empresa"],
                        'id_permisos' => $row["id_permisos"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'datos_empleados_pago_lote') {
            if ($_GET['nomina_activa'] == 'true') {
                $id_lote = $_GET['id_lote'];
            } else {
                $id_lote = $_SESSION['ultimo_id_lote'];
            }
            $sql = "SELECT e.id, e.primer_nombre, e.primer_apellido, e.centro_de_costo centro_costo, e.departamento_laboral departamento, e.puesto puesto, e.dpi, emp.nombre_comercial empresa, emp.id id_empresa, e.banco banco, ROUND( (e.bon_incentivo / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) bon_incentivo, ROUND( (e.bon_dec_37_2001 / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) bon_decreto, COALESCE(he_dia.horas, 0) cantidad_horas_dia, COALESCE(he_dia.monto, 0) horas_dia, COALESCE(he_noche.horas, 0) cantidad_horas_noche, COALESCE(he_noche.monto, 0) horas_noche, ROUND( (e.sueldo_ordinario / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) sueldo_quincenal, ROUND( COALESCE(e.otro_ingresos, 0), 2 ) otros_ingresos, ROUND(COALESCE(e.vacaciones, 0), 2) vacaciones, ROUND(COALESCE(bono.monto, 0), 2) bonos, ROUND( COALESCE(dv.monto_total, 0), 2 ) descuentos_variables, ROUND(e.boleto_de_ornato / 2, 2) boleto_de_ornato, igss.igss igss_laboral, ROUND(e.isr / 2, 2) isr, ROUND(e.otro_descuentos / 2, 2) otro_descuentos, ROUND(e.judiciales / 2, 2) judiciales, ROUND(e.seguro / 2, 2) seguro, ROUND( (e.parqueo / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) parqueo, ROUND( ( ROUND( (e.sueldo_ordinario / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) + ROUND( (e.bon_dec_37_2001 / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) + ROUND( (e.bon_incentivo / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) + e.otro_ingresos + COALESCE(bono.monto, 0) + COALESCE(he_dia.monto, 0) + COALESCE(he_noche.monto, 0) ), 2 ) AS total_ingresos, ROUND( ( CASE WHEN l.quincena = 0 THEN ROUND(igss.igss, 2) + e.isr / 2 + COALESCE(dv.monto_total, 0) + e.otro_descuentos + e.judiciales / 2 + e.seguro / 2 + e.parqueo / 2 ELSE ROUND(igss.igss, 2) + e.isr / 2 + COALESCE(dv.monto_total, 0) + e.otro_descuentos + e.judiciales / 2 + e.seguro / 2 + e.parqueo / 2 + e.boleto_de_ornato END ), 2 ) AS total_egresos, ROUND( ( ROUND( (e.sueldo_ordinario / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) + ROUND( (e.bon_dec_37_2001 / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) + ROUND( (e.bon_incentivo / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ), 2 ) + e.otro_ingresos + COALESCE(he_dia.monto, 0) + COALESCE(he_noche.monto, 0) + COALESCE(bono.monto, 0) ) - ROUND( ( CASE WHEN l.quincena = 0 THEN ROUND(igss.igss, 2) + e.isr / 2 + COALESCE(dv.monto_total, 0) + e.otro_descuentos + e.judiciales / 2 + e.seguro / 2 + e.parqueo / 2 ELSE ROUND(igss.igss, 2) + e.isr / 2 + COALESCE(dv.monto_total, 0) + e.otro_descuentos + e.judiciales / 2 + e.seguro / 2 + e.parqueo / 2 + e.boleto_de_ornato END ), 2 ), 2 ) AS liquido, ROUND( (e.sueldo_ordinario / 30) *( e.dias_laborados - COALESCE(ddb.dias, 0) ), 2 ) total_reporte_bono, e.condicion_laboral, e.tipo_de_pago AS cheque, e.banco, e.no_cuenta, e.tipo_cuenta, l.id AS id_lote, DATE(NOW()) AS fecha_pago_lote, e.igss_patronal, ROUND(e.igss_patronal * 0.01, 2) AS intecap, ROUND(e.igss_patronal * 0.01, 2) AS irtra, ( e.dias_laborados - COALESCE(dd.dias, 0) ) dias_laborados, ( e.dias_laborados - COALESCE(ddb.dias, 0) ) dias_bono FROM empleado e INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON ee.id_empresa = emp.id INNER JOIN lote l ON l.id = " . $id_lote . " LEFT JOIN( SELECT id_empleado, SUM(monto) monto, SUM(horas) horas FROM horas_extra WHERE estado = 2 AND seleccionado = 1 AND jornada = 0 GROUP BY id_empleado ) he_dia ON he_dia.id_empleado = e.id LEFT JOIN( SELECT id_empleado, SUM(monto) monto, SUM(horas) horas FROM horas_extra WHERE estado = 2 AND seleccionado = 1 AND jornada = 1 GROUP BY id_empleado ) he_noche ON he_noche.id_empleado = e.id LEFT JOIN( SELECT id_empleado, SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 GROUP BY id_empleado ) bono ON bono.id_empleado = e.id LEFT JOIN( SELECT id_empleado, SUM(monto_total / cuotas) AS monto_total FROM descuento_variable WHERE estado = 1 AND seleccionado = 1 AND faltan >= 1 GROUP BY id_empleado ) dv ON dv.id_empleado = e.id LEFT JOIN( SELECT id_empleado, id_incidencia, CASE WHEN faltan_quincena > 0 THEN SUM(faltan_quincena) WHEN faltan > 0 AND faltan > 15 THEN 15 WHEN faltan > 0 AND faltan < 15 THEN SUM(faltan) ELSE 0 END dias FROM dias_laborados WHERE id_empleado = " . $_GET['id_empleado'] . " AND id_incidencia IN(2, 3, 4, 5, 6) ) dd ON dd.id_empleado = e.id LEFT JOIN( SELECT id_empleado, id_incidencia, CASE WHEN faltan_quincena > 0 THEN SUM(faltan_quincena) WHEN faltan > 0 AND faltan > 15 THEN 15 WHEN faltan > 0 AND faltan < 15 THEN SUM(faltan) ELSE 0 END dias FROM dias_laborados WHERE id_empleado = " . $_GET['id_empleado'] . " AND id_incidencia IN(2, 3, 5, 6) ) ddb ON ddb.id_empleado = e.id LEFT JOIN( SELECT e.id id_empleado, ( ( (e.sueldo_ordinario / 30) *( e.dias_laborados - COALESCE(dd.dias, 0) ) ) + COALESCE( ( SELECT SUM(monto) FROM horas_extra WHERE estado = 2 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + e.otro_ingresos ) * 0.0483 igss FROM empleado e LEFT JOIN( SELECT id_empleado, id_incidencia, CASE WHEN faltan_quincena > 0 THEN SUM(faltan_quincena) WHEN faltan > 0 AND faltan > 15 THEN 15 WHEN faltan > 0 AND faltan < 15 THEN SUM(faltan) ELSE 0 END dias FROM dias_laborados WHERE id_empleado = " . $_GET['id_empleado'] . " AND id_incidencia IN(2, 3, 4, 5) ) dd ON dd.id_empleado = e.id WHERE e.id = " . $_GET['id_empleado'] . " ) igss ON igss.id_empleado = e.id WHERE e.estado = 1 AND e.id = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'primer_nombre' => $row["primer_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dpi' => $row["dpi"],
                        'empresa' => $row["empresa"],
                        'id_empresa' => $row["id_empresa"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'horas_dia' => $row["horas_dia"],
                        'horas_noche' => $row["horas_noche"],
                        'cantidad_horas_dia' => $row["cantidad_horas_dia"],
                        'cantidad_horas_noche' => $row["cantidad_horas_noche"],
                        'sueldo_quincenal' => $row["sueldo_quincenal"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'vacaciones' => $row["vacaciones"],
                        'bonos' => $row["bonos"],
                        'descuentos_variables' => $row["descuentos_variables"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'boleto_de_ornato' => $row["boleto_de_ornato"],
                        'igss_laboral' => $row["igss_laboral"],
                        'isr' => $row["isr"],
                        'otro_descuentos' => $row["otro_descuentos"],
                        'total_ingresos' => $row["total_ingresos"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido' => $row["liquido"],
                        'total_reporte_bono' => $row["total_reporte_bono"],
                        'condicion_laboral' => $row["condicion_laboral"],
                        'cheque' => $row["cheque"],
                        'banco' => $row["banco"],
                        'no_cuenta' => $row["no_cuenta"],
                        'tipo_cuenta' => $row["tipo_cuenta"],
                        'id_lote' => $row["id_lote"],
                        'fecha_pago_lote' => $row["fecha_pago_lote"],
                        'igss_patronal' => $row["igss_patronal"],
                        'intecap' => $row["intecap"],
                        'irtra' => $row["irtra"],
                        'dias_laborados' => $row["dias_laborados"],
                        'dias_bono' => $row["dias_bono"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo $sql;
                echo 'No hay datos';
            }
        }



        if ($_GET["quest"] == 'listado_empleados_empresa') {
            $sql = "SELECT e.id, e.primer_nombre, e.primer_apellido, e.dpi, emp.nombre_comercial empresa, emp.id id_empresa, e.id_permisos id_permisos FROM empleado e LEFT JOIN empresa_empleado ee on e.id = ee.id_empleado LEFT JOIN empresa emp on ee.id_empresa = emp.id where e.estado = 1 and ee.activo = 1 and ee.principal = 1 and ee.id_empresa = " . $_GET['id_empresa'] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'primer_nombre' => $row["primer_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'dpi' => $row["dpi"],
                        'empresa' => $row["empresa"],
                        'id_empresa' => $row["id_empresa"],
                        'id_permisos' => $row["id_permisos"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'lista_vacaciones') {

            $sql = "SELECT bv.* , uc.nombre as 'creador', d.nombre as 'departamento', uj.nombre as 'jefe', e.nombre as 'estado' FROM BoletaVacaciones bv LEFT JOIN Usuario uc ON bv.idCreador = uc.idUsuario LEFT JOIN departamento d ON bv.idDepartamento = d.idDepartamento LEFT JOIN Usuario uj ON bv.idJefe = uj.idUsuario LEFT JOIN Estado e on bv.idEstado = e.idEstado WHERE idSolicitante = " . $_GET["id_permiso"] . " AND bv.idEstado = 4;";

            $result = odbc_exec($conn, $sql);

            if (!$result) {
                die('Query Falló - ODBC');
            }

            if (odbc_num_rows($result) > 0) {
                $json = array();
                while (odbc_fetch_row($result)) {
                    $json[] = array(
                        'id_boleta' => odbc_result($result, 1),
                        'correlativo' => odbc_result($result, 2),
                        'fechaSolicitud' => odbc_result($result, 7),
                        'total_dias' => odbc_result($result, 28),
                        'fecha_aut' => odbc_result($result, 36),
                        'creador' => odbc_result($result, 37),
                        'departamento' => odbc_result($result, 38),
                        'estado' => odbc_result($result, 40)
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_empleados_empresa_baja') {
            $sql = "SELECT e.id, e.primer_nombre, e.primer_apellido, e.dpi, emp.nombre_comercial empresa, emp.id id_empresa, e.id_permisos id_permisos FROM empleado e LEFT JOIN empresa_empleado ee on e.id = ee.id_empleado LEFT JOIN empresa emp on ee.id_empresa = emp.id where e.estado = 2 and ee.activo = 1 and ee.principal = 1 and ee.id_empresa = " . $_GET['id_empresa'] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'primer_nombre' => $row["primer_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'dpi' => $row["dpi"],
                        'empresa' => $row["empresa"],
                        'id_empresa' => $row["id_empresa"],
                        'id_permisos' => $row["id_permisos"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_empresas_empleado') {
            $sql = "SELECT ee.id id_empresa_empleado, ee.porcentaje porcentaje, e.nombre_comercial empresa, ee.principal, e.id id_empresa FROM empresa_empleado ee INNER JOIN empresa e on ee.id_empresa = e.id WHERE ee.activo = 1 and ee.id_empleado = " . $_GET["id_empleado"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id_empresa_empleado"],
                        'porcentaje' => $row["porcentaje"],
                        'empresa' => $row["empresa"],
                        'principal' => $row["principal"],
                        'id_empresa' => $row["id_empresa"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_empleados_dl') {
            $sql = "SELECT id, primer_nombre, primer_apellido, dpi FROM empleado where estado = 1 and departamento_laboral = " . $_GET["departamento"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'primer_nombre' => $row["primer_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'dpi' => $row["dpi"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No se encontraron resultados';
            }
        }

        if ($_GET["quest"] == 'datos_empleado_dias_laborados') {
            $sql = "SELECT e.id, e.primer_nombre, e.primer_apellido, concat(e.primer_nombre, ' ', e.segundo_nombre, ' ', e.otro_nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido, ' ', e.apellido_casada) as nombre_completo, cc.nombre as centro FROM empleado e INNER JOIN centro_costo cc on e.centro_de_costo = cc.id WHERE e.id = " . $_GET["id"];
            "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'primer_nombre' => $row["primer_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'nombre_completo' => $row["nombre_completo"],
                        'centro' => $row["centro"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_incidencias') {
            $sql = "SELECT id, nombre FROM incidencia";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'datos_empleado_finiquito') {
            $sql = "SELECT concat_ws(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) nombre, e.puesto puesto, DATE_FORMAT(e.fecha_inicio, '%d/%m/%Y') fecha_alta, emp.nombre_comercial empresa, e.id_permisos id_permisos FROM empleado e LEFT JOIN empresa_empleado ee on ee.id_empleado = e.id LEFT JOIN empresa emp on emp.id = ee.id_empresa WHERE ee.principal = 1 and ee.activo = 1 AND e.id = " . $_GET["id_empleado"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'nombre' => $row["nombre"],
                        'puesto' => $row["puesto"],
                        'fecha_alta' => $row["fecha_alta"],
                        'empresa' => $row["empresa"],
                        'id_permisos' => $row["id_permisos"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'liquidacion_empleado') {

            $sql = "SELECT mezcla.*, coalesce(mezcla.aguinaldo_real,0) aguinaldo_real_2, coalesce(mezcla.bono_real,0) bono_real_2, ( mezcla.aguinaldo + mezcla.bono + mezcla.sueldo_base ) base_calculo, ( ( mezcla.aguinaldo + mezcla.bono + mezcla.sueldo_base ) / 365 * mezcla.baja ) indemnizacion FROM empleado em INNER JOIN( SELECT e.id, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre, ( SELECT e1.nombre_comercial FROM empresa_empleado ee INNER JOIN empresa e1 ON e1.id = ee.id_empresa WHERE ee.principal = 1 AND ee.id_empleado = e.id LIMIT 1 ) empresa, DATE(e.fecha_inicio) AS 'fecha_inicio', DATE(e.fecha_baja) AS 'fecha_baja', e.sueldo_ordinario, DATEDIFF(e.fecha_baja, e.fecha_inicio) baja, CASE WHEN DATEDIFF(e.fecha_baja, e.fecha_inicio) > 182 THEN( SELECT ( SUM( COALESCE(pl.sueldo_quincenal, 0) ) ) / 6 sueldo FROM pago_lote pl WHERE pl.id_empleado = e.id AND pl.fecha_pago_lote BETWEEN DATE_SUB(e.fecha_baja, INTERVAL 6 MONTH) AND e.fecha_baja GROUP BY pl.id_empleado ) ELSE( SELECT ( SUM( COALESCE(pl.sueldo_quincenal, 0) ) ) /( SELECT TIMESTAMPDIFF( MONTH, e.fecha_inicio, e.fecha_baja ) ) sueldo FROM pago_lote pl WHERE pl.id_empleado = e.id AND pl.fecha_pago_lote BETWEEN DATE_SUB( e.fecha_baja, INTERVAL( SELECT TIMESTAMPDIFF( MONTH, e.fecha_inicio, e.fecha_baja ) ) MONTH ) AND e.fecha_baja GROUP BY pl.id_empleado ) END / 12 aguinaldo, CASE WHEN DATEDIFF(e.fecha_baja, e.fecha_inicio) > 182 THEN( SELECT ( SUM( COALESCE(pl.sueldo_quincenal, 0) ) ) / 6 sueldo FROM pago_lote pl WHERE pl.id_empleado = e.id AND pl.fecha_pago_lote BETWEEN DATE_SUB(e.fecha_baja, INTERVAL 6 MONTH) AND e.fecha_baja GROUP BY pl.id_empleado ) ELSE( SELECT ( SUM( COALESCE(pl.sueldo_quincenal, 0) ) ) /( SELECT TIMESTAMPDIFF( MONTH, e.fecha_inicio, e.fecha_baja ) ) sueldo FROM pago_lote pl WHERE pl.id_empleado = e.id AND pl.fecha_pago_lote BETWEEN DATE_SUB( e.fecha_baja, INTERVAL( SELECT TIMESTAMPDIFF( MONTH, e.fecha_inicio, e.fecha_baja ) ) MONTH ) AND e.fecha_baja GROUP BY pl.id_empleado ) END / 12 bono, CASE WHEN DATEDIFF(e.fecha_baja, e.fecha_inicio) > 182 THEN( SELECT(SUM(pl.sueldo_quincenal) + SUM(pl.horas_dia) + SUM(pl.horas_noche)) / 6 sueldo FROM pago_lote pl WHERE pl.id_empleado = e.id AND pl.fecha_pago_lote BETWEEN DATE_SUB(e.fecha_baja, INTERVAL 6 MONTH) AND e.fecha_baja GROUP BY pl.id_empleado ) ELSE (SELECT(SUM(pl.sueldo_quincenal) + SUM(pl.horas_dia) + SUM(pl.horas_noche)) /(SELECT TIMESTAMPDIFF(MONTH, e.fecha_inicio, e.fecha_baja)) sueldo FROM pago_lote pl WHERE pl.id_empleado = e.id AND pl.fecha_pago_lote BETWEEN DATE_SUB(e.fecha_baja, INTERVAL (SELECT TIMESTAMPDIFF(MONTH, e.fecha_inicio, e.fecha_baja)) MONTH) AND e.fecha_baja GROUP BY pl.id_empleado ) END sueldo_base, CASE WHEN MONTH(e.fecha_baja) = 12 THEN( SELECT SUM(ar.bono) bono FROM aguinaldo_real ar WHERE YEAR(ar.al) = YEAR(e.fecha_baja) + 1 AND ar.id_empleado = e.id ) WHEN MONTH(e.fecha_baja) < 12 THEN( SELECT SUM(ar.bono) bono FROM aguinaldo_real ar WHERE YEAR(ar.al) = YEAR(e.fecha_baja) AND ar.id_empleado = e.id ) END aguinaldo_real, CASE WHEN MONTH(e.fecha_baja) > 6 THEN( SELECT SUM(br.bono) bono FROM bono_real br WHERE YEAR(br.al) = YEAR(e.fecha_baja) + 1 AND br.id_empleado = e.id ) WHEN MONTH(e.fecha_baja) < 7 THEN( SELECT SUM(br.bono) bono FROM bono_real br WHERE YEAR(br.al) = YEAR(e.fecha_baja) AND br.id_empleado = e.id ) END bono_real, CASE WHEN DATEDIFF(e.fecha_baja, e.fecha_inicio) > 364 THEN( SELECT ( SUM( COALESCE(pl.sueldo_quincenal, 0) ) + SUM(COALESCE(pl.horas_dia, 0)) + SUM(COALESCE(pl.horas_noche, 0)) ) / 12 sueldo FROM pago_lote pl WHERE pl.id_empleado = e.id AND pl.fecha_pago_lote BETWEEN DATE_SUB( e.fecha_baja, INTERVAL 12 MONTH ) AND e.fecha_baja GROUP BY pl.id_empleado ) ELSE( SELECT ( SUM( COALESCE(pl.sueldo_quincenal, 0) ) + SUM(COALESCE(pl.horas_dia, 0)) + SUM(COALESCE(pl.horas_noche, 0)) ) /( SELECT TIMESTAMPDIFF( MONTH, e.fecha_inicio, e.fecha_baja ) ) sueldo FROM pago_lote pl WHERE pl.id_empleado = e.id AND pl.fecha_pago_lote BETWEEN DATE_SUB( e.fecha_baja, INTERVAL( SELECT TIMESTAMPDIFF( MONTH, e.fecha_inicio, e.fecha_baja ) ) MONTH ) AND e.fecha_baja GROUP BY pl.id_empleado ) END sueldo_anual, e.sueldo_ordinario / 30 sueldo_diario, CASE WHEN MONTH(e.fecha_baja) = 12 THEN CASE WHEN e.fecha_inicio >= DATE_FORMAT(e.fecha_baja, '%Y-12-01') THEN DATEDIFF(e.fecha_baja, e.fecha_inicio) ELSE DATEDIFF( e.fecha_baja, DATE_FORMAT(e.fecha_baja, '%Y-12-01') ) END ELSE CASE WHEN e.fecha_inicio >= DATE_SUB( DATE_FORMAT(e.fecha_baja, '%Y-12-01'), INTERVAL 1 YEAR ) THEN DATEDIFF(e.fecha_baja, e.fecha_inicio) ELSE DATEDIFF( e.fecha_baja, DATE_SUB( DATE_FORMAT(e.fecha_baja, '%Y-12-01'), INTERVAL 1 YEAR ) ) END END dias_aguinaldo, CASE WHEN MONTH(e.fecha_baja) < 12 THEN CASE WHEN e.fecha_inicio >= DATE_FORMAT(e.fecha_baja, '%Y-07-01') THEN DATEDIFF(e.fecha_baja, e.fecha_inicio) ELSE DATEDIFF( e.fecha_baja, DATE_FORMAT(e.fecha_baja, '%Y-07-01') ) END ELSE CASE WHEN e.fecha_inicio >= DATE_SUB( DATE_FORMAT(e.fecha_baja, '%Y-07-01'), INTERVAL 1 YEAR ) THEN DATEDIFF(e.fecha_baja, e.fecha_inicio) ELSE DATEDIFF( e.fecha_baja, DATE_SUB( DATE_FORMAT(e.fecha_baja, '%Y-07-01'), INTERVAL 1 YEAR ) ) END END dias_bono, CASE WHEN MONTH(e.fecha_baja) = 12 THEN CASE WHEN e.fecha_inicio >= DATE_FORMAT(e.fecha_baja, '%Y-12-01') THEN DATE(e.fecha_inicio) ELSE DATE_FORMAT(e.fecha_baja, '%Y-12-01') END ELSE CASE WHEN e.fecha_inicio >= DATE_SUB( DATE_FORMAT(e.fecha_baja, '%Y-12-01'), INTERVAL 1 YEAR ) THEN DATE(e.fecha_inicio) ELSE DATE_SUB( DATE_FORMAT(e.fecha_baja, '%Y-12-01'), INTERVAL 1 YEAR ) END END inicio_aguinaldo, CASE WHEN MONTH(e.fecha_baja) < 12 THEN CASE WHEN e.fecha_inicio >= DATE_FORMAT(e.fecha_baja, '%Y-07-01') THEN DATE(e.fecha_inicio) ELSE DATE_FORMAT(e.fecha_baja, '%Y-07-01') END ELSE CASE WHEN e.fecha_inicio >= DATE_SUB( DATE_FORMAT(e.fecha_baja, '%Y-07-01'), INTERVAL 1 YEAR ) THEN DATE(e.fecha_inicio) ELSE DATE_SUB( DATE_FORMAT(e.fecha_baja, '%Y-07-01'), INTERVAL 1 YEAR ) END END inicio_bono, CASE WHEN DAY(e.fecha_baja) <= 15 THEN CASE WHEN EXISTS( SELECT pl.id_empleado FROM pago_lote pl INNER JOIN lote l ON pl.id_lote = l.id WHERE pl.id_empleado = e.id AND MONTH(l.fecha) = MONTH(e.fecha_baja) AND l.quincena = 0 ) THEN 0 ELSE DATEDIFF( e.fecha_baja, DATE_FORMAT(e.fecha_baja, '%Y-%m-01') ) END ELSE CASE WHEN EXISTS( SELECT pl.id_empleado FROM pago_lote pl INNER JOIN lote l ON pl.id_lote = l.id WHERE pl.id_empleado = e.id AND MONTH(l.fecha) = MONTH(e.fecha_baja) AND l.quincena = 1 ) THEN 0 ELSE DATEDIFF( e.fecha_baja, DATE_FORMAT(e.fecha_baja, '%Y-%m-15') ) END END dias_exceso FROM empleado e WHERE e.estado = 2 ) mezcla ON mezcla.id = em.id AND em.id = " . $_GET["id_empleado"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'empresa' => $row["empresa"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'fecha_baja' => $row["fecha_baja"],
                        'sueldo_ordinario' => $row["sueldo_ordinario"],
                        'baja' => $row["baja"],
                        'aguinaldo' => $row["aguinaldo"],
                        'bono' => $row["bono"],
                        'sueldo_base' => $row["sueldo_base"],
                        'aguinaldo_real' => $row["aguinaldo_real_2"],
                        'bono_real' => $row["bono_real_2"],
                        'sueldo_anual' => $row["sueldo_anual"],
                        'sueldo_diario' => $row["sueldo_diario"],
                        'dias_aguinaldo' => $row["dias_aguinaldo"],
                        'dias_bono' => $row["dias_bono"],
                        'inicio_aguinaldo' => $row["inicio_aguinaldo"],
                        'inicio_bono' => $row["inicio_bono"],
                        'dias_exceso' => $row["dias_exceso"],
                        'base_calculo' => $row["base_calculo"],
                        'indemnizacion' => $row["indemnizacion"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                $_GET["query"];
            }
        }

        if ($_GET["quest"] == 'aguinaldo_real') {
            $sql = "SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.total_periodo) suma, SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa em ON ar.id_empresa = em.id WHERE YEAR(ar.al) = ".$_GET["anio"]." AND ar.bono != 0 GROUP BY em.id, d.id, cc.id, d3, d4, d5;";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'suma' => $row["suma"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'aguinaldo_contable') {
            $sql = "SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.total_periodo) suma, SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa_empleado ee ON ar.id_empleado = ee.id_empleado AND ee.principal = 1 AND ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(ar.al) = ".$_GET["anio"]." AND ar.bono != 0 GROUP BY em.id, d.id, cc.id, d3, d4, d5;";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'suma' => $row["suma"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'aguinaldo_ajuste') {
            $sql = "SELECT empresa, d1, d2, d3, d4, d5, SUM(julio) julio, SUM(agosto) agosto, SUM(septiembre) septiembre, SUM(octubre) octubre, SUM(noviembre) noviembre, SUM(diciembre) diciembre, SUM(enero) enero, SUM(febrero) febrero, SUM(marzo) marzo, SUM(abril) abril, SUM(mayo) mayo, SUM(junio) junio, SUM(suma) suma, SUM(total) total FROM ( SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.total_periodo) suma, SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa_empleado ee ON ar.id_empleado = ee.id_empleado AND ee.principal = 1 AND ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(ar.al) = ".$_GET["anio"]." GROUP BY em.id, d.id, cc.id, d3, d4, d5 UNION ALL SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, - SUM(ar.julio) julio, - SUM(ar.agosto) agosto, - SUM(ar.septiembre) septiembre, - SUM(ar.octubre) octubre, - SUM(ar.noviembre) noviembre, - SUM(ar.diciembre) diciembre, - SUM(ar.enero) enero, - SUM(ar.febrero) febrero, - SUM(ar.marzo) marzo, - SUM(ar.abril) abril, - SUM(ar.mayo) mayo, - SUM(ar.junio) junio, - SUM(ar.total_periodo) suma, - SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa em ON ar.id_empresa = em.id WHERE YEAR(ar.al) = ".$_GET["anio"]." GROUP BY em.id, d.id, cc.id, d3, d4, d5 ) AS combined GROUP BY empresa, d1, d2, d3, d4, d5 HAVING total != 0;";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'suma' => $row["suma"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'aguinaldo_determinacion') {
            $sql = "SELECT COALESCE(sub1.empresa, sub2.empresa) AS empresa, COALESCE(sub1.julio, 0) - sub2.julio AS julio, COALESCE(sub1.agosto, 0) - sub2.agosto AS agosto, COALESCE(sub1.septiembre, 0) - sub2.septiembre AS septiembre, COALESCE(sub1.octubre, 0) - sub2.octubre AS octubre, COALESCE(sub1.noviembre, 0) - sub2.noviembre AS noviembre, COALESCE(sub1.diciembre, 0) - sub2.diciembre AS diciembre, COALESCE(sub1.enero, 0) - sub2.enero AS enero, COALESCE(sub1.febrero, 0) - sub2.febrero AS febrero, COALESCE(sub1.marzo, 0) - sub2.marzo AS marzo, COALESCE(sub1.abril, 0) - sub2.abril AS abril, COALESCE(sub1.mayo, 0) - sub2.mayo AS mayo, COALESCE(sub1.junio, 0) - sub2.junio AS junio, COALESCE(sub1.suma, 0) - sub2.suma AS suma, COALESCE(sub1.total, 0) - sub2.total AS total FROM ( SELECT em.nombre_comercial empresa, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.total_periodo) suma, SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN empresa_empleado ee ON ar.id_empleado = ee.id_empleado AND ee.principal = 1 AND ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(ar.al) = ".$_GET["anio"]." GROUP BY em.id ) AS sub1 RIGHT JOIN( SELECT em.nombre_comercial empresa, SUM(ar.julio) julio, SUM(ar.agosto) agosto, SUM(ar.septiembre) septiembre, SUM(ar.octubre) octubre, SUM(ar.noviembre) noviembre, SUM(ar.diciembre) diciembre, SUM(ar.enero) enero, SUM(ar.febrero) febrero, SUM(ar.marzo) marzo, SUM(ar.abril) abril, SUM(ar.mayo) mayo, SUM(ar.junio) junio, SUM(ar.total_periodo) suma, SUM(ar.bono) total FROM aguinaldo_real ar LEFT JOIN empleado e ON ar.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN empresa em ON ar.id_empresa = em.id WHERE YEAR(ar.al) = ".$_GET["anio"]." GROUP BY em.id ) AS sub2 ON sub1.empresa = sub2.empresa HAVING total != 0;";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'suma' => $row["suma"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'aguinaldo_intercompany') {
            $sql = "SELECT CONCAT_WS( ' ', ( SELECT e2.nombre_comercial FROM aguinaldo_real ar2 INNER JOIN empresa e2 ON ar2.id_empresa = e2.id WHERE ar2.principal = 1 AND ar2.id_empleado = ar.id_empleado AND YEAR(ar.al) = ".$_GET["anio"]." GROUP BY e2.nombre_comercial ), 'Debe Facturar a', e1.nombre_comercial ) factura, SUM(ar.total_periodo) base, SUM(ar.total_periodo) * 0.12 iva, ( SUM(ar.total_periodo) +(SUM(ar.total_periodo) * 0.12) ) total FROM aguinaldo_real ar INNER JOIN empresa e1 ON ar.id_empresa = e1.id WHERE ar.principal = 0 AND YEAR(ar.al) = ".$_GET["anio"]." GROUP BY factura HAVING total != 0;";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'factura' => $row["factura"],
                        'base' => $row["base"],
                        'iva' => $row["iva"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'bono_real') {
            $sql = "SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(br.julio) julio, SUM(br.agosto) agosto, SUM(br.septiembre) septiembre, SUM(br.octubre) octubre, SUM(br.noviembre) noviembre, SUM(br.diciembre) diciembre, SUM(br.enero) enero, SUM(br.febrero) febrero, SUM(br.marzo) marzo, SUM(br.abril) abril, SUM(br.mayo) mayo, SUM(br.junio) junio, SUM(br.total_periodo) suma, SUM(br.bono) total FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa em ON br.id_empresa = em.id WHERE YEAR(br.al) = ".$_GET["anio"]." AND br.bono != 0 GROUP BY em.id, d.id, cc.id, d3, d4, d5";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'suma' => $row["suma"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'bono_contable') {
            $sql = "SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(br.julio) julio, SUM(br.agosto) agosto, SUM(br.septiembre) septiembre, SUM(br.octubre) octubre, SUM(br.noviembre) noviembre, SUM(br.diciembre) diciembre, SUM(br.enero) enero, SUM(br.febrero) febrero, SUM(br.marzo) marzo, SUM(br.abril) abril, SUM(br.mayo) mayo, SUM(br.junio) junio, SUM(br.total_periodo) suma, SUM(br.bono) total FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa_empleado ee ON br.id_empleado = ee.id_empleado AND ee.principal = 1 AND ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(br.al) = ".$_GET["anio"]." AND br.bono != 0 GROUP BY em.id, d.id, cc.id, d3, d4, d5";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'suma' => $row["suma"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'bono_ajuste') {
            $sql = "SELECT empresa, d1, d2, d3, d4, d5, SUM(julio) julio, SUM(agosto) agosto, SUM(septiembre) septiembre, SUM(octubre) octubre, SUM(noviembre) noviembre, SUM(diciembre) diciembre, SUM(enero) enero, SUM(febrero) febrero, SUM(marzo) marzo, SUM(abril) abril, SUM(mayo) mayo, SUM(junio) junio, SUM(suma) suma, SUM(total) total FROM ( SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, SUM(br.julio) julio, SUM(br.agosto) agosto, SUM(br.septiembre) septiembre, SUM(br.octubre) octubre, SUM(br.noviembre) noviembre, SUM(br.diciembre) diciembre, SUM(br.enero) enero, SUM(br.febrero) febrero, SUM(br.marzo) marzo, SUM(br.abril) abril, SUM(br.mayo) mayo, SUM(br.junio) junio, SUM(br.total_periodo) suma, SUM(br.bono) total FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa_empleado ee ON br.id_empleado = ee.id_empleado AND ee.principal = 1 AND ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(br.al) = ".$_GET["anio"]." GROUP BY em.id, d.id, cc.id, d3, d4, d5 UNION ALL SELECT em.nombre_comercial empresa, d.nombre d1, cc.nombre d2, COALESCE(d3.nombre, '') d3, COALESCE(d4.nombre, '') d4, COALESCE(d5.nombre, '') d5, - SUM(br.julio) julio, - SUM(br.agosto) agosto, - SUM(br.septiembre) septiembre, - SUM(br.octubre) octubre, - SUM(br.noviembre) noviembre, - SUM(br.diciembre) diciembre, - SUM(br.enero) enero, - SUM(br.febrero) febrero, - SUM(br.marzo) marzo, - SUM(br.abril) abril, - SUM(br.mayo) mayo, - SUM(br.junio) junio, - SUM(br.total_periodo) suma, - SUM(br.bono) total FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN centro_costo cc ON e.centro_de_costo = cc.id LEFT JOIN dimension_3 d3 ON e.dimension_3 = d3.id LEFT JOIN dimension_4 d4 ON e.dimension_4 = d4.id LEFT JOIN dimension_5 d5 ON e.dimension_5 = d5.id LEFT JOIN empresa em ON br.id_empresa = em.id WHERE YEAR(br.al) = ".$_GET["anio"]." GROUP BY em.id, d.id, cc.id, d3, d4, d5 ) AS combined GROUP BY empresa, d1, d2, d3, d4, d5 HAVING total != 0";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'd1' => $row["d1"],
                        'd2' => $row["d2"],
                        'd3' => $row["d3"],
                        'd4' => $row["d4"],
                        'd5' => $row["d5"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'suma' => $row["suma"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'bono_determinacion') {
            $sql = "SELECT COALESCE(sub1.empresa, sub2.empresa) AS empresa, COALESCE(sub1.julio, 0) - sub2.julio AS julio, COALESCE(sub1.agosto, 0) - sub2.agosto AS agosto, COALESCE(sub1.septiembre, 0) - sub2.septiembre AS septiembre, COALESCE(sub1.octubre, 0) - sub2.octubre AS octubre, COALESCE(sub1.noviembre, 0) - sub2.noviembre AS noviembre, COALESCE(sub1.diciembre, 0) - sub2.diciembre AS diciembre, COALESCE(sub1.enero, 0) - sub2.enero AS enero, COALESCE(sub1.febrero, 0) - sub2.febrero AS febrero, COALESCE(sub1.marzo, 0) - sub2.marzo AS marzo, COALESCE(sub1.abril, 0) - sub2.abril AS abril, COALESCE(sub1.mayo, 0) - sub2.mayo AS mayo, COALESCE(sub1.junio, 0) - sub2.junio AS junio, COALESCE(sub1.suma, 0) - sub2.suma AS suma, COALESCE(sub1.total, 0) - sub2.total AS total FROM ( SELECT em.nombre_comercial empresa, SUM(br.julio) julio, SUM(br.agosto) agosto, SUM(br.septiembre) septiembre, SUM(br.octubre) octubre, SUM(br.noviembre) noviembre, SUM(br.diciembre) diciembre, SUM(br.enero) enero, SUM(br.febrero) febrero, SUM(br.marzo) marzo, SUM(br.abril) abril, SUM(br.mayo) mayo, SUM(br.junio) junio, SUM(br.total_periodo) suma, SUM(br.bono) total FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN empresa_empleado ee ON br.id_empleado = ee.id_empleado AND ee.principal = 1 AND ee.activo = 1 LEFT JOIN empresa em ON ee.id_empresa = em.id WHERE YEAR(br.al) = ".$_GET["anio"]." GROUP BY em.id ) AS sub1 RIGHT JOIN( SELECT em.nombre_comercial empresa, SUM(br.julio) julio, SUM(br.agosto) agosto, SUM(br.septiembre) septiembre, SUM(br.octubre) octubre, SUM(br.noviembre) noviembre, SUM(br.diciembre) diciembre, SUM(br.enero) enero, SUM(br.febrero) febrero, SUM(br.marzo) marzo, SUM(br.abril) abril, SUM(br.mayo) mayo, SUM(br.junio) junio, SUM(br.total_periodo) suma, SUM(br.bono) total FROM bono_real br LEFT JOIN empleado e ON br.id_empleado = e.id LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN empresa em ON br.id_empresa = em.id WHERE YEAR(br.al) = ".$_GET["anio"]." GROUP BY em.id ) AS sub2 ON sub1.empresa = sub2.empresa HAVING total != 0";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'empresa' => $row["empresa"],
                        'julio' => $row["julio"],
                        'agosto' => $row["agosto"],
                        'septiembre' => $row["septiembre"],
                        'octubre' => $row["octubre"],
                        'noviembre' => $row["noviembre"],
                        'diciembre' => $row["diciembre"],
                        'enero' => $row["enero"],
                        'febrero' => $row["febrero"],
                        'marzo' => $row["marzo"],
                        'abril' => $row["abril"],
                        'mayo' => $row["mayo"],
                        'junio' => $row["junio"],
                        'suma' => $row["suma"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'bono_intercompany') {
            $sql = "SELECT CONCAT_WS(' ', ( SELECT e2.nombre_comercial FROM bono_real br2 INNER JOIN empresa e2 ON br2.id_empresa = e2.id WHERE br2.principal = 1 AND br2.id_empleado = br.id_empleado AND YEAR(br.al) = ".$_GET["anio"]." GROUP BY e2.nombre_comercial ), 'Debe Facturar a', e1.nombre_comercial ) factura, SUM(br.total_periodo) base, SUM(br.total_periodo) * 0.12 iva, (SUM(br.total_periodo) + (SUM(br.total_periodo) * 0.12)) total FROM bono_real br INNER JOIN empresa e1 ON br.id_empresa = e1.id WHERE br.principal = 0 AND YEAR(br.al) = ".$_GET["anio"]." GROUP BY factura HAVING total != 0";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'factura' => $row["factura"],
                        'base' => $row["base"],
                        'iva' => $row["iva"],
                        'total' => $row["total"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'descuentos_faltantes') {

            $sql = "SELECT dv.tipo_egreso as 'egreso', ((dv.monto_total) / (dv.cuotas)) * dv.faltan as 'falta' FROM descuento_variable dv WHERE id_empleado = " . $_GET["id_empleado"] . " AND dv.faltan > 0";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'egreso' => $row["egreso"],
                        'falta' => $row["falta"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'datos_empleado') {
            $sql = "SELECT *, (emp.igss_laboral * 2) igss, ROUND( (emp.igss_patronal * 0.8422), 2 ) detalle_igss_patronal, ROUND( (emp.igss_patronal * 0.0789), 2 ) irtra_intecap, d.nombre nombre_departamento, cc.nombre nombre_centro_costo, est.nombre nombre_estado, ec.nombre nombre_estado_civil, g.nombre nombre_genero, tl.tipo nombre_tipo_licencia, cl.clase nombre_clase_licencia, bnc.nombre nombre_banco, tp.nombre nombre_tipo_pago, tc.nombre nombre_tipo_cuenta, m.nombre nombre_moneda, clb.nombre nombre_condicion_laboral FROM empleado emp LEFT JOIN centro_costo cc ON cc.id = emp.centro_de_costo LEFT JOIN departamento_centro dc ON dc.id_centro = cc.id LEFT JOIN departamento d ON d.id = dc.id_departamento LEFT JOIN estado est ON est.id = emp.estado LEFT JOIN estado_civil ec ON ec.id = emp.estado_civil LEFT JOIN genero g ON g.id = emp.genero LEFT JOIN tipo_licencia tl ON tl.id = emp.id_tipo_licencia LEFT JOIN clase_licencia cl ON cl.id = emp.id_clase_licencia LEFT JOIN banco bnc ON bnc.id = emp.banco LEFT JOIN tipo_pago tp ON tp.id = emp.tipo_de_pago LEFT JOIN tipo_cuenta tc ON tc.id = emp.tipo_cuenta LEFT JOIN moneda m ON m.id = emp.moneda LEFT JOIN condicion_laboral clb ON clb.id = emp.condicion_laboral WHERE emp.id = " . $_GET['id_empleado'] . " GROUP BY emp.id;";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'estado' => $row["estado"],
                        'primer_nombre' => $row["primer_nombre"],
                        'segundo_nombre' => $row["segundo_nombre"],
                        'otro_nombre' => $row["otro_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'segundo_apellido' => $row["segundo_apellido"],
                        'direccion' => $row["direccion"],
                        'estado_civil' => $row["estado_civil"],
                        'fecha_nacimiento' => $row["fecha_nacimiento"],
                        'cedula' => $row["cedula"],
                        'dpi' => $row["dpi"],
                        'no_igss' => $row["no_igss"],
                        'centro_de_costo' => $row["centro_de_costo"],
                        'puesto' => $row["puesto"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'fecha_baja' => $row["fecha_baja"],
                        'telefono' => $row["telefono"],
                        'genero' => $row["genero"],
                        'licencia' => $row["licencia"],
                        'id_tipo_licencia' => $row["id_tipo_licencia"],
                        'id_clase_licencia' => $row["id_clase_licencia"],
                        'horas_extra' => $row["horas_extra"],
                        'tipo_de_pago' => $row["tipo_de_pago"],
                        'tipo_cuenta' => $row["tipo_cuenta"],
                        'banco' => $row["banco"],
                        'no_cuenta' => $row["no_cuenta"],
                        'moneda' => $row["moneda"],
                        'conyugue' => $row["conyugue"],
                        'foto' => $row["foto"],
                        'bon_dec_37_2001' => $row["bon_dec_37_2001"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'horas_extras_dobles' => $row["horas_extras_dobles"],
                        'horas_extras_simples' => $row["horas_extras_simples"],
                        'sueldo_ordinario' => $row["sueldo_ordinario"],
                        'otro_ingresos' => $row["otro_ingresos"],
                        'total_igss' => $row["total_igss"],
                        'vacaciones' => $row["vacaciones"],
                        'anticipo_quincenal' => $row["anticipo_quincenal"],
                        'bantrab' => $row["bantrab"],
                        'boleto_de_ornato' => $row["boleto_de_ornato"],
                        'igss_laboral' => $row["igss"],
                        'igss_patronal' => $row["igss_patronal"],
                        'isr' => $row["isr"],
                        'otro_descuentos' => $row["otro_descuentos"],
                        'prestamo_empresa' => $row["prestamo_empresa"],
                        'bancos' => $row["bancos"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'primaria' => $row["primaria"],
                        'grado_primaria' => $row["grado_primaria"],
                        'secundaria' => $row["secundaria"],
                        'grado_secundaria' => $row["grado_secundaria"],
                        'diversificado' => $row["diversificado"],
                        'universidad' => $row["universidad"],
                        'nacionalidad' => $row["nacionalidad"],
                        'region_originario' => $row["region_originario"],
                        'departamento_originario' => $row["departamento_originario"],
                        'municipio_originario' => $row["municipio_originario"],
                        'municipio_cedula' => $row["municipio_cedula"],
                        'municipio_laboral' => $row["municipio_laboral"],
                        'apellido_casada' => $row["apellido_casada"],
                        'condicion_laboral' => $row["condicion_laboral"],
                        'codigo_ocupacion' => $row["codigo_ocupacion"],
                        'tipo_plantilla' => $row["tipo_plantilla"],
                        'horas_laborales' => $row["horas_laborales"],
                        'ventas_economicas' => $row["ventas_economicas"],
                        'temporal' => $row["temporal"],
                        'dias_laborados' => $row["dias_laborados"],
                        'telefono_celular' => $row["telefono_celular"],
                        'telefono_emergencia' => $row["telefono_emergencia"],
                        'nombre_emergencia' => $row["nombre_emergencia"],
                        'edad' => $row["edad"],
                        'emision_dpi' => $row["emision_dpi"],
                        'edad_conyuge' => $row["edad_conyuge"],
                        'ocupacion_conyuge' => $row["ocupacion_conyuge"],
                        'nombre_padre' => $row["nombre_padre"],
                        'edad_padre' => $row["edad_padre"],
                        'ocupacion_padre' => $row["ocupacion_padre"],
                        'nombre_madre' => $row["nombre_madre"],
                        'edad_madre' => $row["edad_madre"],
                        'ocupacion_madre' => $row["ocupacion_madre"],
                        'nit' => $row["nit"],
                        'departamento_laboral' => $row["departamento_laboral"],
                        'apellido_casada_originario' => $row["apellido_casada_originario"],
                        'detalle_igss_patronal' => $row["detalle_igss_patronal"],
                        'irtra_intecap' => $row["irtra_intecap"],
                        'nombre_departamento' => $row["nombre_departamento"],
                        'nombre_centro_costo' => $row["nombre_centro_costo"],
                        'nombre_estado' => $row["nombre_estado"],
                        'nombre_estado_civil' => $row["nombre_estado_civil"],
                        'nombre_genero' => $row["nombre_genero"],
                        'nombre_tipo_licencia' => $row["nombre_tipo_licencia"],
                        'nombre_clase_licencia' => $row["nombre_clase_licencia"],
                        'nombre_nombre_banco' => $row["nombre_banco"],
                        'nombre_tipo_pago' => $row["nombre_tipo_pago"],
                        'nombre_tipo_cuenta' => $row["nombre_tipo_cuenta"],
                        'nombre_moneda' => $row["nombre_moneda"],
                        'nombre_nombre_condicion_laboral' => $row["nombre_condicion_laboral"],
                        'jubilacion' => $row["jubilacion"],
                        'discapacidad' => $row["discapacidad"],
                        'jornada' => $row["jornada"],
                        'id_permisos' => $row["id_permisos"],
                        'titulo_diploma' => $row["titulo_diploma"],
                        'afiliacion' => $row["afiliacion"],
                        'dimension_3' => $row["dimension_3"],
                        'dimension_4' => $row["dimension_4"],
                        'dimension_5' => $row["dimension_5"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_empleados_nomina') {
            $sql = "SELECT * FROM empleado e WHERE e.id IN(SELECT id_empleado from pago_lote pl INNER JOIN lote l on pl.id_lote = l.id WHERE l.id_estado = 1) and e.estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_empleado' => $row["id"],
                        'estado' => $row["estado"],
                        'primer_nombre' => $row["primer_nombre"],
                        'segundo_nombre' => $row["segundo_nombre"],
                        'otro_nombre' => $row["otro_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'segundo_apellido' => $row["segundo_apellido"],
                        'direccion' => $row["direccion"],
                        'estado_civil' => $row["estado_civil"],
                        'fecha_nacimiento' => $row["fecha_nacimiento"],
                        'cedula' => $row["cedula"],
                        'dpi' => $row["dpi"],
                        'no_igss' => $row["no_igss"],
                        'centro_de_costo' => $row["centro_de_costo"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'fecha_baja' => $row["fecha_baja"],
                        'telefono' => $row["telefono"],
                        'genero' => $row["genero"],
                        'licencia' => $row["licencia"],
                        'id_tipo_licencia' => $row["id_tipo_licencia"],
                        'id_clase_licencia' => $row["id_clase_licencia"],
                        'horas_extra' => $row["horas_extra"],
                        'tipo_de_pago' => $row["tipo_de_pago"],
                        'tipo_cuenta' => $row["tipo_cuenta"],
                        'banco' => $row["banco"],
                        'no_cuenta' => $row["no_cuenta"],
                        'moneda' => $row["moneda"],
                        'conyugue' => $row["conyugue"],
                        'foto' => $row["foto"],
                        'bon_dec_37_2001' => $row["bon_dec_37_2001"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'horas_extras_dobles' => $row["horas_extras_dobles"],
                        'horas_extras_simples' => $row["horas_extras_simples"],
                        'sueldo_ordinario' => $row["sueldo_ordinario"],
                        'otro_ingresos' => $row["otro_ingresos"],
                        'total_igss' => $row["total_igss"],
                        'vacaciones' => $row["vacaciones"],
                        'anticipo_quincenal' => $row["anticipo_quincenal"],
                        'bantrab' => $row["bantrab"],
                        'boleto_de_ornato' => $row["boleto_de_ornato"],
                        'igss_laboral' => $row["igss_laboral"],
                        'igss_patronal' => $row["igss_patronal"],
                        'isr' => $row["isr"],
                        'otro_descuentos' => $row["otro_descuentos"],
                        'prestamo_empresa' => $row["prestamo_empresa"],
                        'bancos' => $row["bancos"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'primaria' => $row["primaria"],
                        'grado_primaria' => $row["grado_primaria"],
                        'secundaria' => $row["secundaria"],
                        'grado_secundaria' => $row["grado_secundaria"],
                        'diversificado' => $row["diversificado"],
                        'universidad' => $row["universidad"],
                        'nacionalidad' => $row["nacionalidad"],
                        'region_originario' => $row["region_originario"],
                        'departamento_originario' => $row["departamento_originario"],
                        'municipio_originario' => $row["municipio_originario"],
                        'municipio_cedula' => $row["municipio_cedula"],
                        'municipio_laboral' => $row["municipio_laboral"],
                        'apellido_casada' => $row["apellido_casada"],
                        'condicion_laboral' => $row["condicion_laboral"],
                        'codigo_ocupacion' => $row["codigo_ocupacion"],
                        'tipo_plantilla' => $row["tipo_plantilla"],
                        'horas_laborales' => $row["horas_laborales"],
                        'ventas_economicas' => $row["ventas_economicas"],
                        'temporal' => $row["temporal"],
                        'dias_laborados' => $row["dias_laborados"],
                        'telefono_celular' => $row["telefono_celular"],
                        'telefono_emergencia' => $row["telefono_emergencia"],
                        'nombre_emergencia' => $row["nombre_emergencia"],
                        'edad' => $row["edad"],
                        'emision_dpi' => $row["emision_dpi"],
                        'edad_conyuge' => $row["edad_conyuge"],
                        'ocupacion_conyuge' => $row["ocupacion_conyuge"],
                        'nombre_padre' => $row["nombre_padre"],
                        'edad_padre' => $row["edad_padre"],
                        'ocupacion_padre' => $row["ocupacion_padre"],
                        'nombre_madre' => $row["nombre_madre"],
                        'edad_madre' => $row["edad_madre"],
                        'ocupacion_madre' => $row["ocupacion_madre"],
                        'nit' => $row["nit"],
                        'departamento_laboral' => $row["departamento_laboral"],
                        'apellido_casada_originario' => $row["apellido_casada_originario"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_empleados_fuera_nomina') {
            $sql = "SELECT * FROM empleado e WHERE e.id NOT IN(SELECT id_empleado from pago_lote pl INNER JOIN lote l on pl.id_lote = l.id WHERE l.id_estado = 1) and e.estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_empleado' => $row["id"],
                        'estado' => $row["estado"],
                        'primer_nombre' => $row["primer_nombre"],
                        'segundo_nombre' => $row["segundo_nombre"],
                        'otro_nombre' => $row["otro_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'segundo_apellido' => $row["segundo_apellido"],
                        'direccion' => $row["direccion"],
                        'estado_civil' => $row["estado_civil"],
                        'fecha_nacimiento' => $row["fecha_nacimiento"],
                        'cedula' => $row["cedula"],
                        'dpi' => $row["dpi"],
                        'no_igss' => $row["no_igss"],
                        'centro_de_costo' => $row["centro_de_costo"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'fecha_baja' => $row["fecha_baja"],
                        'telefono' => $row["telefono"],
                        'genero' => $row["genero"],
                        'licencia' => $row["licencia"],
                        'id_tipo_licencia' => $row["id_tipo_licencia"],
                        'id_clase_licencia' => $row["id_clase_licencia"],
                        'horas_extra' => $row["horas_extra"],
                        'tipo_de_pago' => $row["tipo_de_pago"],
                        'tipo_cuenta' => $row["tipo_cuenta"],
                        'banco' => $row["banco"],
                        'no_cuenta' => $row["no_cuenta"],
                        'moneda' => $row["moneda"],
                        'conyugue' => $row["conyugue"],
                        'foto' => $row["foto"],
                        'bon_dec_37_2001' => $row["bon_dec_37_2001"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'horas_extras_dobles' => $row["horas_extras_dobles"],
                        'horas_extras_simples' => $row["horas_extras_simples"],
                        'sueldo_ordinario' => $row["sueldo_ordinario"],
                        'otro_ingresos' => $row["otro_ingresos"],
                        'total_igss' => $row["total_igss"],
                        'vacaciones' => $row["vacaciones"],
                        'anticipo_quincenal' => $row["anticipo_quincenal"],
                        'bantrab' => $row["bantrab"],
                        'boleto_de_ornato' => $row["boleto_de_ornato"],
                        'igss_laboral' => $row["igss_laboral"],
                        'igss_patronal' => $row["igss_patronal"],
                        'isr' => $row["isr"],
                        'otro_descuentos' => $row["otro_descuentos"],
                        'prestamo_empresa' => $row["prestamo_empresa"],
                        'bancos' => $row["bancos"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'primaria' => $row["primaria"],
                        'grado_primaria' => $row["grado_primaria"],
                        'secundaria' => $row["secundaria"],
                        'grado_secundaria' => $row["grado_secundaria"],
                        'diversificado' => $row["diversificado"],
                        'universidad' => $row["universidad"],
                        'nacionalidad' => $row["nacionalidad"],
                        'region_originario' => $row["region_originario"],
                        'departamento_originario' => $row["departamento_originario"],
                        'municipio_originario' => $row["municipio_originario"],
                        'municipio_cedula' => $row["municipio_cedula"],
                        'municipio_laboral' => $row["municipio_laboral"],
                        'apellido_casada' => $row["apellido_casada"],
                        'condicion_laboral' => $row["condicion_laboral"],
                        'codigo_ocupacion' => $row["codigo_ocupacion"],
                        'tipo_plantilla' => $row["tipo_plantilla"],
                        'horas_laborales' => $row["horas_laborales"],
                        'ventas_economicas' => $row["ventas_economicas"],
                        'temporal' => $row["temporal"],
                        'dias_laborados' => $row["dias_laborados"],
                        'telefono_celular' => $row["telefono_celular"],
                        'telefono_emergencia' => $row["telefono_emergencia"],
                        'nombre_emergencia' => $row["nombre_emergencia"],
                        'edad' => $row["edad"],
                        'emision_dpi' => $row["emision_dpi"],
                        'edad_conyuge' => $row["edad_conyuge"],
                        'ocupacion_conyuge' => $row["ocupacion_conyuge"],
                        'nombre_padre' => $row["nombre_padre"],
                        'edad_padre' => $row["edad_padre"],
                        'ocupacion_padre' => $row["ocupacion_padre"],
                        'nombre_madre' => $row["nombre_madre"],
                        'edad_madre' => $row["edad_madre"],
                        'ocupacion_madre' => $row["ocupacion_madre"],
                        'nit' => $row["nit"],
                        'departamento_laboral' => $row["departamento_laboral"],
                        'apellido_casada_originario' => $row["apellido_casada_originario"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'datos_empleado_bono') {
            $sql = "SELECT e.id, e.estado, e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.direccion, e.estado_civil, e.fecha_nacimiento, e.cedula, e.dpi, e.no_igss, e.centro_de_costo, e.fecha_inicio, e.fecha_baja, e.telefono, e.genero, e.licencia, e.id_tipo_licencia, e.id_clase_licencia, e.horas_extra, e.tipo_de_pago, e.banco, e.no_cuenta, e.moneda, e.conyugue, e.foto, e.bon_dec_37_2001, e.bon_incentivo, e.horas_extras_dobles, e.horas_extras_simples, e.sueldo_ordinario, e.otro_ingresos, e.total_igss, e.vacaciones, e.anticipo_quincenal, e.bantrab, e.boleto_de_ornato, e.igss_laboral, e.igss_patronal, e.isr, e.otro_descuentos, e.prestamo_empresa, e.primaria, e.grado_primaria, e.secundaria, e.grado_secundaria, e.diversificado, e.universidad, e.nacionalidad, e.region_originario, e.departamento_originario, e.municipio_originario, e.municipio_cedula, e.municipio_laboral, e.apellido_casada, e.condicion_laboral, e.codigo_ocupacion, e.tipo_plantilla, e.horas_laborales, e.ventas_economicas, e.temporal, e.telefono_celular, e.telefono_emergencia, e.nombre_emergencia, e.edad, e.emision_dpi, e.edad_conyuge, e.ocupacion_conyuge, e.nombre_padre, e.edad_padre, e.ocupacion_padre, e.nombre_madre, e.edad_madre, e.ocupacion_madre, e.nit, e.departamento_laboral, e.apellido_casada_originario, d.nombre as nombre_departamento FROM empleado e inner join departamento d on e.departamento_laboral = d.id WHERE e.id = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'estado' => $row["estado"],
                        'primer_nombre' => $row["primer_nombre"],
                        'segundo_nombre' => $row["segundo_nombre"],
                        'otro_nombre' => $row["otro_nombre"],
                        'primer_apellido' => $row["primer_apellido"],
                        'segundo_apellido' => $row["segundo_apellido"],
                        'direccion' => $row["direccion"],
                        'estado_civil' => $row["estado_civil"],
                        'fecha_nacimiento' => $row["fecha_nacimiento"],
                        'cedula' => $row["cedula"],
                        'dpi' => $row["dpi"],
                        'no_igss' => $row["no_igss"],
                        'centro_de_costo' => $row["centro_de_costo"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'fecha_baja' => $row["fecha_baja"],
                        'telefono' => $row["telefono"],
                        'genero' => $row["genero"],
                        'licencia' => $row["licencia"],
                        'id_tipo_licencia' => $row["id_tipo_licencia"],
                        'id_clase_licencia' => $row["id_clase_licencia"],
                        'horas_extra' => $row["horas_extra"],
                        'tipo_de_pago' => $row["tipo_de_pago"],
                        'banco' => $row["banco"],
                        'no_cuenta' => $row["no_cuenta"],
                        'moneda' => $row["moneda"],
                        'conyugue' => $row["conyugue"],
                        'foto' => $row["foto"],
                        'bon_dec_37_2001' => $row["bon_dec_37_2001"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'horas_extras_dobles' => $row["horas_extras_dobles"],
                        'horas_extras_simples' => $row["horas_extras_simples"],
                        'sueldo_ordinario' => $row["sueldo_ordinario"],
                        'otro_ingresos' => $row["otro_ingresos"],
                        'total_igss' => $row["total_igss"],
                        'vacaciones' => $row["vacaciones"],
                        'anticipo_quincenal' => $row["anticipo_quincenal"],
                        'bantrab' => $row["bantrab"],
                        'boleto_de_ornato' => $row["boleto_de_ornato"],
                        'igss_laboral' => $row["igss_laboral"],
                        'igss_patronal' => $row["igss_patronal"],
                        'isr' => $row["isr"],
                        'otro_descuentos' => $row["otro_descuentos"],
                        'prestamo_empresa' => $row["prestamo_empresa"],
                        'primaria' => $row["primaria"],
                        'grado_primaria' => $row["grado_primaria"],
                        'secundaria' => $row["secundaria"],
                        'grado_secundaria' => $row["grado_secundaria"],
                        'diversificado' => $row["diversificado"],
                        'universidad' => $row["universidad"],
                        'nacionalidad' => $row["nacionalidad"],
                        'region_originario' => $row["region_originario"],
                        'departamento_originario' => $row["departamento_originario"],
                        'municipio_originario' => $row["municipio_originario"],
                        'municipio_cedula' => $row["municipio_cedula"],
                        'municipio_laboral' => $row["municipio_laboral"],
                        'apellido_casada' => $row["apellido_casada"],
                        'condicion_laboral' => $row["condicion_laboral"],
                        'codigo_ocupacion' => $row["codigo_ocupacion"],
                        'tipo_plantilla' => $row["tipo_plantilla"],
                        'horas_laborales' => $row["horas_laborales"],
                        'ventas_economicas' => $row["ventas_economicas"],
                        'temporal' => $row["temporal"],
                        'telefono_celular' => $row["telefono_celular"],
                        'telefono_emergencia' => $row["telefono_emergencia"],
                        'nombre_emergencia' => $row["nombre_emergencia"],
                        'edad' => $row["edad"],
                        'emision_dpi' => $row["emision_dpi"],
                        'edad_conyuge' => $row["edad_conyuge"],
                        'ocupacion_conyuge' => $row["ocupacion_conyuge"],
                        'nombre_padre' => $row["nombre_padre"],
                        'edad_padre' => $row["edad_padre"],
                        'ocupacion_padre' => $row["ocupacion_padre"],
                        'nombre_madre' => $row["nombre_madre"],
                        'edad_madre' => $row["edad_madre"],
                        'ocupacion_madre' => $row["ocupacion_madre"],
                        'nit' => $row["nit"],
                        'departamento_laboral' => $row["departamento_laboral"],
                        'apellido_casada_originario' => $row["apellido_casada_originario"],
                        'nombre_departamento' => $row["nombre_departamento"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_estudios') {
            $sql = "SELECT * FROM estudio where id_empleado = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'carrera' => $row["carrera"],
                        'descripcion' => $row["descripcion"],
                        'universidad' => $row["universidad"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_estudio') {
            $sql = "SELECT * FROM estudio where id = " . $_GET['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'carrera' => $row["carrera"],
                        'descripcion' => $row["descripcion"],
                        'universidad' => $row["universidad"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_cursos') {
            $sql = "SELECT * FROM curso where id_empleado = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'lugar' => $row["lugar"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_curso') {
            $sql = "SELECT * FROM curso where id = " . $_GET['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'lugar' => $row["lugar"],
                        'interno' => $row["interno"],
                        'ano' => $row["ano"],
                        'mes' => $row["mes"],
                        'diploma' => $row["diploma"],
                        'obligacion' => $row["obligacion"],
                        'ano_obligacion' => $row["ano_obligacion"],
                        'mes_obligacion' => $row["mes_obligacion"],
                        'reembolsar' => $row["reembolsar"],
                        'fecha_capacitacion' => $row["fecha_capacitacion"],
                        'codigo_curso' => $row["codigo_curso"],
                        'nombre_curso' => $row["nombre_curso"],
                        'induccion' => $row["induccion"],
                        'general' => $row["general"],
                        'funciones' => $row["funciones"],
                        'fecha_evaluacion' => $row["fecha_evaluacion"],
                        'nota' => $row["nota"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_puestos') {
            $sql = "SELECT * FROM puesto where id_empleado = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'puesto' => $row["puesto"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_pagos') {
            $sql = "SELECT pl.id AS correlativo, e.id AS id_empleado, tp.nombre tipo_pago, bnc.nombre banco, e.no_cuenta no_cuenta, tc.nombre tipo_cuenta, cl.nombre condicion_laboral, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) AS nombre_empleado, emp.nombre_comercial AS empresa, cc.nombre AS centro_costo, d.nombre AS departamento, e.puesto AS puesto, CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE pl.dias_laborados + COALESCE(pla.dias_laborados, 0) END AS dias_laborados, ROUND( (e.sueldo_ordinario / 30) *( CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE pl.dias_laborados + COALESCE(pla.dias_laborados, 0) END ), 2 ) AS salario_ordinario, CASE WHEN l.quincena = 0 THEN pl.bon_tot ELSE pl.bon_tot + COALESCE(pla.bon_tot, 0) END AS bon_incentivo, CASE WHEN l.quincena = 0 THEN pl.bon_dec_tot ELSE pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) END AS bon_decreto, CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) ELSE COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END AS bonos, ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) ) END, 2 ) AS total_devengado, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_dia ELSE pl.cantidad_horas_dia + COALESCE(pla.cantidad_horas_dia, 0) END AS horas_simples, CASE WHEN l.quincena = 0 THEN pl.horas_dia ELSE pl.horas_dia + COALESCE(pla.horas_dia, 0) END AS valor_horas_simples, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_noche ELSE pl.cantidad_horas_noche + COALESCE(pla.cantidad_horas_noche, 0) END AS horas_dobles, CASE WHEN l.quincena = 0 THEN pl.horas_noche ELSE pl.horas_noche + COALESCE(pla.horas_noche, 0) END AS valor_horas_dobles, CASE WHEN l.quincena = 0 THEN pl.otros_ingresos ELSE pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) END AS otros_ingresos, CASE WHEN l.quincena = 0 THEN pl.vacaciones ELSE pl.vacaciones + COALESCE(pla.vacaciones, 0) END AS vacaciones, ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) +( pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END, 2 ) AS salario_total, CASE WHEN l.quincena = 0 THEN pl.igss ELSE pl.igss + COALESCE(pla.igss, 0) END AS igss, CASE WHEN l.quincena = 0 THEN pl.isr ELSE pl.isr + COALESCE(pla.isr, 0) END AS isr, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS cafeteria, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS celular, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) END, 2 ) AS uniforme, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS calzado, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS equipo, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS producto, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS bancos, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS otros, pl.otros_egresos AS otros_egresos, CASE WHEN l.quincena = 0 THEN pl.judiciales ELSE pl.judiciales + COALESCE(pla.judiciales, 0) END AS judiciales, CASE WHEN l.quincena = 0 THEN pl.seguro ELSE pl.seguro + COALESCE(pla.seguro, 0) END AS seguro, CASE WHEN l.quincena = 0 THEN pl.parqueo ELSE pl.parqueo + COALESCE(pla.parqueo, 0) END AS parqueo, CASE WHEN l.quincena = 0 THEN 0 ELSE ROUND(e.boleto_de_ornato, 2) END AS boleta_ornato, ROUND( CASE WHEN l.quincena = 0 THEN pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ELSE( pl.igss + COALESCE(pla.igss, 0) ) +(pl.isr + COALESCE(pla.isr, 0)) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos +( pl.seguro + COALESCE(pla.seguro, 0) ) +( pl.judiciales + COALESCE(pla.judiciales, 0) ) +( pl.parqueo + COALESCE(pla.parqueo, 0) ) + e.boleto_de_ornato END, 2 ) total_egresos, ( ( ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) +( pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END, 2 ) ) -( ROUND( CASE WHEN l.quincena = 0 THEN pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ELSE( pl.igss + COALESCE(pla.igss, 0) ) +(pl.isr + COALESCE(pla.isr, 0)) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos +( pl.judiciales + COALESCE(pla.judiciales, 0) ) +( pl.seguro + COALESCE(pla.seguro, 0) ) +( pl.parqueo + COALESCE(pla.parqueo, 0) + e.boleto_de_ornato ) END, 2 ) ) ) AS liquido_recibir, CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ) -( pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ) ELSE COALESCE(pla.liquido, 0) END AS liquido_primer_quincena, CASE WHEN l.quincena = 0 THEN 0 ELSE( ( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) + pl.bon_tot + COALESCE(pla.bon_tot, 0) + pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) + pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) ) -( pl.igss + COALESCE(pla.igss, 0) + pl.isr + COALESCE(pla.isr, 0) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos + COALESCE(pla.otros_egresos, 0) + pl.judiciales + COALESCE(pla.judiciales, 0) + pl.seguro + COALESCE(pla.seguro, 0) + pl.parqueo + COALESCE(pla.parqueo, 0) + e.boleto_de_ornato ) ) - COALESCE(pla.liquido, 0) END AS liquido_segunda_quincena FROM pago_lote pl LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN( SELECT * FROM pago_lote ) pla ON pla.id_empleado = pl.id_empleado AND MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) AND pla.id_lote != pl.id_lote LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = e.centro_de_costo LEFT JOIN departamento_centro dc ON dc.id_centro = cc.id LEFT JOIN departamento d ON d.id = dc.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN condicion_laboral cl ON cl.id = e.condicion_laboral WHERE l.id_estado = 1 AND e.estado = 1 AND emp.id = " . $_GET['id_empresa'] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'correlativo' => $row["correlativo"],
                        'id_empleado' => $row["id_empleado"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'empresa' => $row["empresa"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dias_laborados' => $row["dias_laborados"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'bonos' => $row["bonos"],
                        'total_devengado' => $row["total_devengado"],
                        'horas_simples' => $row["horas_simples"],
                        'valor_horas_simples' => $row["valor_horas_simples"],
                        'horas_dobles' => $row["horas_dobles"],
                        'valor_horas_dobles' => $row["valor_horas_dobles"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'isr' => $row["isr"],
                        'cafeteria' => $row["cafeteria"],
                        'celular' => $row["celular"],
                        'uniforme' => $row["uniforme"],
                        'calzado' => $row["calzado"],
                        'equipo' => $row["equipo"],
                        'producto' => $row["producto"],
                        'bancos' => $row["bancos"],
                        'otros' => $row["otros"],
                        'boleta_ornato' => $row["boleta_ornato"],
                        'otros_egresos' => $row["otros_egresos"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido_recibir' => $row["liquido_recibir"],
                        'liquido_primer_quincena' => $row["liquido_primer_quincena"],
                        'liquido_segunda_quincena' => $row["liquido_segunda_quincena"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_pagos_centro') {
            $sql = "SELECT pl.id AS correlativo, e.id AS id_empleado, tp.nombre tipo_pago, bnc.nombre banco, e.no_cuenta no_cuenta, tc.nombre tipo_cuenta, cl.nombre condicion_laboral, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) AS nombre_empleado, emp.nombre_comercial AS empresa, cc.nombre AS centro_costo, d.nombre AS departamento, e.puesto AS puesto, CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE pl.dias_laborados + COALESCE(pla.dias_laborados, 0) END AS dias_laborados, ROUND( (e.sueldo_ordinario / 30) *( CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE pl.dias_laborados + COALESCE(pla.dias_laborados, 0) END ), 2 ) AS salario_ordinario, CASE WHEN l.quincena = 0 THEN pl.bon_tot ELSE pl.bon_tot + COALESCE(pla.bon_tot, 0) END AS bon_incentivo, CASE WHEN l.quincena = 0 THEN pl.bon_dec_tot ELSE pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) END AS bon_decreto, CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) ELSE COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END AS bonos, ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) ) END, 2 ) AS total_devengado, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_dia ELSE pl.cantidad_horas_dia + COALESCE(pla.cantidad_horas_dia, 0) END AS horas_simples, CASE WHEN l.quincena = 0 THEN pl.horas_dia ELSE pl.horas_dia + COALESCE(pla.horas_dia, 0) END AS valor_horas_simples, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_noche ELSE pl.cantidad_horas_noche + COALESCE(pla.cantidad_horas_noche, 0) END AS horas_dobles, CASE WHEN l.quincena = 0 THEN pl.horas_noche ELSE pl.horas_noche + COALESCE(pla.horas_noche, 0) END AS valor_horas_dobles, CASE WHEN l.quincena = 0 THEN pl.otros_ingresos ELSE pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) END AS otros_ingresos, CASE WHEN l.quincena = 0 THEN pl.vacaciones ELSE pl.vacaciones + COALESCE(pla.vacaciones, 0) END AS vacaciones, ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) +( pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END, 2 ) AS salario_total, CASE WHEN l.quincena = 0 THEN pl.igss ELSE pl.igss + COALESCE(pla.igss, 0) END AS igss, CASE WHEN l.quincena = 0 THEN pl.isr ELSE pl.isr + COALESCE(pla.isr, 0) END AS isr, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS cafeteria, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS celular, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) END, 2 ) AS uniforme, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS calzado, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS equipo, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS producto, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS bancos, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS otros, pl.otros_egresos AS otros_egresos, CASE WHEN l.quincena = 0 THEN pl.judiciales ELSE pl.judiciales + COALESCE(pla.judiciales, 0) END AS judiciales, CASE WHEN l.quincena = 0 THEN pl.seguro ELSE pl.seguro + COALESCE(pla.seguro, 0) END AS seguro, CASE WHEN l.quincena = 0 THEN pl.parqueo ELSE pl.parqueo + COALESCE(pla.parqueo, 0) END AS parqueo, CASE WHEN l.quincena = 0 THEN 0 ELSE ROUND(e.boleto_de_ornato, 2) END AS boleta_ornato, ROUND( CASE WHEN l.quincena = 0 THEN pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ELSE( pl.igss + COALESCE(pla.igss, 0) ) +(pl.isr + COALESCE(pla.isr, 0)) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos +( pl.seguro + COALESCE(pla.seguro, 0) ) +( pl.judiciales + COALESCE(pla.judiciales, 0) ) +( pl.parqueo + COALESCE(pla.parqueo, 0) ) + e.boleto_de_ornato END, 2 ) total_egresos, ( ( ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) +( pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END, 2 ) ) -( ROUND( CASE WHEN l.quincena = 0 THEN pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ELSE( pl.igss + COALESCE(pla.igss, 0) ) +(pl.isr + COALESCE(pla.isr, 0)) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos +( pl.judiciales + COALESCE(pla.judiciales, 0) ) +( pl.seguro + COALESCE(pla.seguro, 0) ) +( pl.parqueo + COALESCE(pla.parqueo, 0) + e.boleto_de_ornato ) END, 2 ) ) ) AS liquido_recibir, CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ) -( pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ) ELSE COALESCE(pla.liquido, 0) END AS liquido_primer_quincena, CASE WHEN l.quincena = 0 THEN 0 ELSE( ( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) + pl.bon_tot + COALESCE(pla.bon_tot, 0) + pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) + pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) ) -( pl.igss + COALESCE(pla.igss, 0) + pl.isr + COALESCE(pla.isr, 0) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos + COALESCE(pla.otros_egresos, 0) + pl.judiciales + COALESCE(pla.judiciales, 0) + pl.seguro + COALESCE(pla.seguro, 0) + pl.parqueo + COALESCE(pla.parqueo, 0) + e.boleto_de_ornato ) ) - COALESCE(pla.liquido, 0) END AS liquido_segunda_quincena FROM pago_lote pl LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN( SELECT * FROM pago_lote ) pla ON pla.id_empleado = pl.id_empleado AND MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) AND pla.id_lote != pl.id_lote LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = e.centro_de_costo LEFT JOIN departamento_centro dc ON dc.id_centro = cc.id LEFT JOIN departamento d ON d.id = dc.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN condicion_laboral cl ON cl.id = e.condicion_laboral WHERE l.id_estado = 1 AND e.estado = 1 AND emp.id =" . $_GET['id_empresa'] . " and cc.id = " . $_GET['id_centro'] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'correlativo' => $row["correlativo"],
                        'id_empleado' => $row["id_empleado"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'empresa' => $row["empresa"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dias_laborados' => $row["dias_laborados"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'bonos' => $row["bonos"],
                        'total_devengado' => $row["total_devengado"],
                        'horas_simples' => $row["horas_simples"],
                        'valor_horas_simples' => $row["valor_horas_simples"],
                        'horas_dobles' => $row["horas_dobles"],
                        'valor_horas_dobles' => $row["valor_horas_dobles"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'isr' => $row["isr"],
                        'cafeteria' => $row["cafeteria"],
                        'celular' => $row["celular"],
                        'uniforme' => $row["uniforme"],
                        'calzado' => $row["calzado"],
                        'equipo' => $row["equipo"],
                        'producto' => $row["producto"],
                        'bancos' => $row["bancos"],
                        'otros' => $row["otros"],
                        'boleta_ornato' => $row["boleta_ornato"],
                        'otros_egresos' => $row["otros_egresos"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido_recibir' => $row["liquido_recibir"],
                        'liquido_primer_quincena' => $row["liquido_primer_quincena"],
                        'liquido_segunda_quincena' => $row["liquido_segunda_quincena"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_pagos_departamento') {
            $sql = "SELECT pl.id AS correlativo, e.id AS id_empleado, tp.nombre tipo_pago, bnc.nombre banco, e.no_cuenta no_cuenta, tc.nombre tipo_cuenta, cl.nombre condicion_laboral, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) AS nombre_empleado, emp.nombre_comercial AS empresa, cc.nombre AS centro_costo, d.nombre AS departamento, e.puesto AS puesto, CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE pl.dias_laborados + COALESCE(pla.dias_laborados, 0) END AS dias_laborados, ROUND( (e.sueldo_ordinario / 30) *( CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE pl.dias_laborados + COALESCE(pla.dias_laborados, 0) END ), 2 ) AS salario_ordinario, CASE WHEN l.quincena = 0 THEN pl.bon_tot ELSE pl.bon_tot + COALESCE(pla.bon_tot, 0) END AS bon_incentivo, CASE WHEN l.quincena = 0 THEN pl.bon_dec_tot ELSE pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) END AS bon_decreto, CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) ELSE COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END AS bonos, ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) ) END, 2 ) AS total_devengado, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_dia ELSE pl.cantidad_horas_dia + COALESCE(pla.cantidad_horas_dia, 0) END AS horas_simples, CASE WHEN l.quincena = 0 THEN pl.horas_dia ELSE pl.horas_dia + COALESCE(pla.horas_dia, 0) END AS valor_horas_simples, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_noche ELSE pl.cantidad_horas_noche + COALESCE(pla.cantidad_horas_noche, 0) END AS horas_dobles, CASE WHEN l.quincena = 0 THEN pl.horas_noche ELSE pl.horas_noche + COALESCE(pla.horas_noche, 0) END AS valor_horas_dobles, CASE WHEN l.quincena = 0 THEN pl.otros_ingresos ELSE pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) END AS otros_ingresos, CASE WHEN l.quincena = 0 THEN pl.vacaciones ELSE pl.vacaciones + COALESCE(pla.vacaciones, 0) END AS vacaciones, ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) +( pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END, 2 ) AS salario_total, CASE WHEN l.quincena = 0 THEN pl.igss ELSE pl.igss + COALESCE(pla.igss, 0) END AS igss, CASE WHEN l.quincena = 0 THEN pl.isr ELSE pl.isr + COALESCE(pla.isr, 0) END AS isr, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS cafeteria, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS celular, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) END, 2 ) AS uniforme, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS calzado, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS equipo, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS producto, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS bancos, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS otros, pl.otros_egresos AS otros_egresos, CASE WHEN l.quincena = 0 THEN pl.judiciales ELSE pl.judiciales + COALESCE(pla.judiciales, 0) END AS judiciales, CASE WHEN l.quincena = 0 THEN pl.seguro ELSE pl.seguro + COALESCE(pla.seguro, 0) END AS seguro, CASE WHEN l.quincena = 0 THEN pl.parqueo ELSE pl.parqueo + COALESCE(pla.parqueo, 0) END AS parqueo, CASE WHEN l.quincena = 0 THEN 0 ELSE ROUND(e.boleto_de_ornato, 2) END AS boleta_ornato, ROUND( CASE WHEN l.quincena = 0 THEN pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ELSE( pl.igss + COALESCE(pla.igss, 0) ) +(pl.isr + COALESCE(pla.isr, 0)) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos +( pl.seguro + COALESCE(pla.seguro, 0) ) +( pl.judiciales + COALESCE(pla.judiciales, 0) ) +( pl.parqueo + COALESCE(pla.parqueo, 0) ) + e.boleto_de_ornato END, 2 ) total_egresos, ( ( ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) +( pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END, 2 ) ) -( ROUND( CASE WHEN l.quincena = 0 THEN pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ELSE( pl.igss + COALESCE(pla.igss, 0) ) +(pl.isr + COALESCE(pla.isr, 0)) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos +( pl.judiciales + COALESCE(pla.judiciales, 0) ) +( pl.seguro + COALESCE(pla.seguro, 0) ) +( pl.parqueo + COALESCE(pla.parqueo, 0) + e.boleto_de_ornato ) END, 2 ) ) ) AS liquido_recibir, CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ) -( pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ) ELSE COALESCE(pla.liquido, 0) END AS liquido_primer_quincena, CASE WHEN l.quincena = 0 THEN 0 ELSE( ( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) + pl.bon_tot + COALESCE(pla.bon_tot, 0) + pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) + pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) ) -( pl.igss + COALESCE(pla.igss, 0) + pl.isr + COALESCE(pla.isr, 0) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( (SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos + COALESCE(pla.otros_egresos, 0) + pl.judiciales + COALESCE(pla.judiciales, 0) + pl.seguro + COALESCE(pla.seguro, 0) + pl.parqueo + COALESCE(pla.parqueo, 0) + e.boleto_de_ornato ) ) - COALESCE(pla.liquido, 0) END AS liquido_segunda_quincena FROM pago_lote pl LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN( SELECT * FROM pago_lote ) pla ON pla.id_empleado = pl.id_empleado AND MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) AND pla.id_lote != pl.id_lote LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = e.centro_de_costo LEFT JOIN departamento_centro dc ON dc.id_centro = cc.id LEFT JOIN departamento d ON d.id = dc.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN condicion_laboral cl ON cl.id = e.condicion_laboral WHERE l.id_estado = 1 AND e.estado = 1 AND emp.id = " . $_GET['id_empresa'] . " and d.id = " . $_GET['id_departamento'] . " GROUP BY e.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'correlativo' => $row["correlativo"],
                        'id_empleado' => $row["id_empleado"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'empresa' => $row["empresa"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dias_laborados' => $row["dias_laborados"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'bonos' => $row["bonos"],
                        'total_devengado' => $row["total_devengado"],
                        'horas_simples' => $row["horas_simples"],
                        'valor_horas_simples' => $row["valor_horas_simples"],
                        'horas_dobles' => $row["horas_dobles"],
                        'valor_horas_dobles' => $row["valor_horas_dobles"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'isr' => $row["isr"],
                        'cafeteria' => $row["cafeteria"],
                        'celular' => $row["celular"],
                        'uniforme' => $row["uniforme"],
                        'calzado' => $row["calzado"],
                        'equipo' => $row["equipo"],
                        'producto' => $row["producto"],
                        'bancos' => $row["bancos"],
                        'otros' => $row["otros"],
                        'boleta_ornato' => $row["boleta_ornato"],
                        'otros_egresos' => $row["otros_egresos"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido_recibir' => $row["liquido_recibir"],
                        'liquido_primer_quincena' => $row["liquido_primer_quincena"],
                        'liquido_segunda_quincena' => $row["liquido_segunda_quincena"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'detalle_pago') {
            $sql = "SELECT pl.id AS correlativo, e.id AS id_empleado, tp.nombre tipo_pago, bnc.nombre banco, e.no_cuenta no_cuenta, tc.nombre tipo_cuenta, cl.nombre condicion_laboral, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) AS nombre_empleado, emp.nombre_comercial AS empresa, cc.nombre AS centro_costo, d.nombre AS departamento, e.puesto AS puesto, CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE pl.dias_laborados + COALESCE(pla.dias_laborados, 0) END AS dias_laborados, ROUND( (e.sueldo_ordinario / 30) *( CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE pl.dias_laborados + COALESCE(pla.dias_laborados, 0) END ), 2 ) AS salario_ordinario, CASE WHEN l.quincena = 0 THEN pl.bon_tot ELSE pl.bon_tot + COALESCE(pla.bon_tot, 0) END AS bon_incentivo, CASE WHEN l.quincena = 0 THEN pl.bon_dec_tot ELSE pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) END AS bon_decreto, CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) ELSE COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END AS bonos, ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) ) END, 2 ) AS total_devengado, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_dia ELSE pl.cantidad_horas_dia + COALESCE(pla.cantidad_horas_dia, 0) END AS horas_simples, CASE WHEN l.quincena = 0 THEN pl.horas_dia ELSE pl.horas_dia + COALESCE(pla.horas_dia, 0) END AS valor_horas_simples, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_noche ELSE pl.cantidad_horas_noche + COALESCE(pla.cantidad_horas_noche, 0) END AS horas_dobles, CASE WHEN l.quincena = 0 THEN pl.horas_noche ELSE pl.horas_noche + COALESCE(pla.horas_noche, 0) END AS valor_horas_dobles, CASE WHEN l.quincena = 0 THEN pl.otros_ingresos ELSE pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) END AS otros_ingresos, CASE WHEN l.quincena = 0 THEN pl.vacaciones ELSE pl.vacaciones + COALESCE(pla.vacaciones, 0) END AS vacaciones, ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) +( pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END, 2 ) AS salario_total, CASE WHEN l.quincena = 0 THEN pl.igss ELSE pl.igss + COALESCE(pla.igss, 0) END AS igss, CASE WHEN l.quincena = 0 THEN pl.isr ELSE pl.isr + COALESCE(pla.isr, 0) END AS isr, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS cafeteria, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS celular, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS uniforme, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS calzado, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS equipo, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS producto, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS bancos, ROUND( CASE WHEN l.quincena = 0 THEN COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) ELSE COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) END, 2 ) AS otros, pl.otros_egresos AS otros_egresos, CASE WHEN l.quincena = 0 THEN pl.judiciales ELSE pl.judiciales + COALESCE(pla.judiciales, 0) END AS judiciales, CASE WHEN l.quincena = 0 THEN pl.seguro ELSE pl.seguro + COALESCE(pla.seguro, 0) END AS seguro, CASE WHEN l.quincena = 0 THEN pl.parqueo ELSE pl.parqueo + COALESCE(pla.parqueo, 0) END AS parqueo, CASE WHEN l.quincena = 0 THEN 0 ELSE ROUND(e.boleto_de_ornato, 2) END AS boleta_ornato, ROUND( CASE WHEN l.quincena = 0 THEN pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ELSE( pl.igss + COALESCE(pla.igss, 0) ) +(pl.isr + COALESCE(pla.isr, 0)) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos +( pl.seguro + COALESCE(pla.seguro, 0) ) +( pl.judiciales + COALESCE(pla.judiciales, 0) ) +( pl.parqueo + COALESCE(pla.parqueo, 0) ) + e.boleto_de_ornato END, 2 ) total_egresos, ( ( ROUND( CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados ) + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ELSE( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) +( pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) ) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) END, 2 ) ) -( ROUND( CASE WHEN l.quincena = 0 THEN pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ELSE( pl.igss + COALESCE(pla.igss, 0) ) +(pl.isr + COALESCE(pla.isr, 0)) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos +( pl.judiciales + COALESCE(pla.judiciales, 0) ) +( pl.seguro + COALESCE(pla.seguro, 0) ) +( pl.parqueo + COALESCE(pla.parqueo, 0) + e.boleto_de_ornato ) END, 2 ) ) ) AS liquido_recibir, CASE WHEN l.quincena = 0 THEN( (e.sueldo_ordinario / 30) * pl.dias_laborados + pl.bon_tot + pl.bon_dec_tot + pl.otros_ingresos + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + pl.horas_dia + pl.horas_noche ) -( pl.igss + pl.isr + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + pl.otros_egresos + pl.judiciales + pl.seguro + pl.parqueo ) ELSE COALESCE(pla.liquido, 0) END AS liquido_primer_quincena, CASE WHEN l.quincena = 0 THEN 0 ELSE( ( (e.sueldo_ordinario / 30) *( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) + pl.bon_tot + COALESCE(pla.bon_tot, 0) + pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) + pl.horas_dia + COALESCE(pla.horas_dia, 0) + pl.horas_noche + COALESCE(pla.horas_noche, 0) + pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) + COALESCE( ( SELECT SUM(monto) AS monto FROM bono WHERE id_estado = 2 AND seleccionado = 1 AND id_empleado = e.id GROUP BY id_empleado ), 0 ) + COALESCE( ( SELECT SUM(b.monto) AS monto FROM bonos_pago_lote bpl LEFT JOIN bono b ON b.id = bpl.id_bono WHERE bpl.id_pago_lote = pla.id_lote AND b.id_empleado = e.id ), 0 ) ) -( pl.igss + COALESCE(pla.igss, 0) + pl.isr + COALESCE(pla.isr, 0) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Celular' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Cafeteria' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Uniforme' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Calzado' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Equipo' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Producto' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso = 'Bancos' AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(monto_total / cuotas) cuotas FROM descuento_variable WHERE tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND faltan > 0 AND estado = 1 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + COALESCE( ( SELECT SUM(dv.monto_total / dv.cuotas) cuotas FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) AND dl.id_pago_lote = pla.id_lote AND dv.id_empleado = e.id ), 0 ) + pl.otros_egresos + COALESCE(pla.otros_egresos, 0) + pl.judiciales + COALESCE(pla.judiciales, 0) + pl.seguro + COALESCE(pla.seguro, 0) + pl.parqueo + COALESCE(pla.parqueo, 0) + e.boleto_de_ornato ) ) - COALESCE(pla.liquido, 0) END AS liquido_segunda_quincena FROM pago_lote pl LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN( SELECT * FROM pago_lote ) pla ON pla.id_empleado = pl.id_empleado AND MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) AND pla.id_lote != pl.id_lote LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = e.centro_de_costo LEFT JOIN departamento_centro dc ON dc.id_centro = cc.id LEFT JOIN departamento d ON d.id = dc.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN condicion_laboral cl ON cl.id = e.condicion_laboral WHERE l.id_estado = 1 AND e.estado = 1 AND e.id = " . $_GET['id_empleado'] . " GROUP BY e.id;";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'correlativo' => $row["correlativo"],
                        'id_empleado' => $row["id_empleado"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'empresa' => $row["empresa"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dias_laborados' => $row["dias_laborados"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'bonos' => $row["bonos"],
                        'total_devengado' => $row["total_devengado"],
                        'horas_simples' => $row["horas_simples"],
                        'valor_horas_simples' => $row["valor_horas_simples"],
                        'horas_dobles' => $row["horas_dobles"],
                        'valor_horas_dobles' => $row["valor_horas_dobles"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'vacaciones' => $row["vacaciones"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'isr' => $row["isr"],
                        'cafeteria' => $row["cafeteria"],
                        'celular' => $row["celular"],
                        'uniforme' => $row["uniforme"],
                        'calzado' => $row["calzado"],
                        'equipo' => $row["equipo"],
                        'producto' => $row["producto"],
                        'bancos' => $row["bancos"],
                        'otros' => $row["otros"],
                        'boleta_ornato' => $row["boleta_ornato"],
                        'otros_egresos' => $row["otros_egresos"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido_recibir' => $row["liquido_recibir"],
                        'liquido_primer_quincena' => $row["liquido_primer_quincena"],
                        'liquido_segunda_quincena' => $row["liquido_segunda_quincena"],
                        'tipo_pago' => $row["tipo_pago"],
                        'tipo_cuenta' => $row["tipo_cuenta"],
                        'no_cuenta' => $row["no_cuenta"],
                        'banco' => $row["banco"],
                        'condicion_laboral' => $row["condicion_laboral"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'detalle_pago_historial') {
            $sql = "SELECT pl.id correlativo, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, emp.nombre_comercial empresa, cc.nombre centro_costo, d.nombre departamento, pl.puesto puesto, CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) END dias_laborados, CASE WHEN l.quincena = 0 THEN pl.sueldo_quincenal ELSE( pl.sueldo_quincenal + COALESCE(pla.sueldo_quincenal, 0) ) END salario_ordinario, CASE WHEN l.quincena = 0 THEN pl.bon_tot ELSE( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) END bon_incentivo, CASE WHEN l.quincena = 0 THEN pl.bon_dec_tot ELSE( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) END bon_decreto, CASE WHEN l.quincena = 0 THEN pl.bonos ELSE( pl.bonos + COALESCE(pla.bonos, 0) ) END bonos, CASE WHEN l.quincena = 0 THEN( pl.sueldo_quincenal + pl.bon_tot + pl.bon_dec_tot + pl.bonos ) ELSE( ( pl.sueldo_quincenal + COALESCE(pla.sueldo_quincenal, 0) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) +( pl.bonos + COALESCE(pla.bonos, 0) ) ) END total_devengado, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_dia ELSE pl.cantidad_horas_dia + COALESCE(pla.cantidad_horas_dia, 0) END horas_simples, CASE WHEN l.quincena = 0 THEN pl.horas_dia ELSE pl.horas_dia + COALESCE(pla.horas_dia, 0) END valor_horas_simples, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_noche ELSE pl.cantidad_horas_noche + COALESCE(pla.cantidad_horas_noche, 0) END horas_dobles, CASE WHEN l.quincena = 0 THEN pl.horas_noche ELSE pl.horas_noche + COALESCE(pla.horas_noche, 0) END valor_horas_dobles, CASE WHEN l.quincena = 0 THEN pl.otros_ingresos ELSE pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) END otros_ingresos, CASE WHEN l.quincena = 0 THEN pl.ingresos_tot ELSE pl.ingresos_tot + COALESCE(pla.ingresos_tot, 0) END salario_total, CASE WHEN l.quincena = 0 THEN pl.vacaciones ELSE pl.vacaciones + COALESCE(pla.vacaciones, 0) END vacaciones, tp.nombre tipo_pago, tc.nombre tipo_cuenta, pl.no_cuenta no_cuenta, bnc.nombre banco, cl.nombre condicion_laboral, CASE WHEN l.quincena = 0 THEN pl.igss ELSE pl.igss + COALESCE(pla.igss, 0) END igss, CASE WHEN l.quincena = 0 THEN pl.isr ELSE pl.isr + COALESCE(pla.isr, 0) END isr, CASE WHEN l.quincena = 0 THEN COALESCE(cafeteria.cuota, 0) ELSE COALESCE(cafeteria.cuota, 0) + COALESCE(cafeteria_anterior.cuota, 0) END cafeteria, CASE WHEN l.quincena = 0 THEN COALESCE(celular.cuota, 0) ELSE COALESCE(celular.cuota, 0) + COALESCE(celular_anterior.cuota, 0) END celular, CASE WHEN l.quincena = 0 THEN COALESCE(uniforme.cuota, 0) ELSE COALESCE(uniforme.cuota, 0) + COALESCE(uniforme_anterior.cuota, 0) END uniforme, CASE WHEN l.quincena = 0 THEN COALESCE(calzado.cuota, 0) ELSE COALESCE(calzado.cuota, 0) + COALESCE(calzado_anterior.cuota, 0) END calzado, CASE WHEN l.quincena = 0 THEN COALESCE(equipo.cuota, 0) ELSE COALESCE(equipo.cuota, 0) + COALESCE(equipo_anterior.cuota, 0) END equipo, CASE WHEN l.quincena = 0 THEN COALESCE(producto.cuota, 0) ELSE COALESCE(producto.cuota, 0) + COALESCE(producto_anterior.cuota, 0) END producto, CASE WHEN l.quincena = 0 THEN COALESCE(bancos.cuota, 0) ELSE COALESCE(bancos.cuota, 0) + COALESCE(bancos_anterior.cuota, 0) END bancos, CASE WHEN l.quincena = 0 THEN COALESCE(otros.cuota, 0) ELSE COALESCE(otros.cuota, 0) + COALESCE(otros_anterior.cuota, 0) END otros, CASE WHEN l.quincena = 0 THEN pl.judiciales ELSE pl.judiciales + COALESCE(pla.judiciales, 0) END judiciales, CASE WHEN l.quincena = 0 THEN pl.seguro ELSE pl.seguro + COALESCE(pla.seguro, 0) END seguro, CASE WHEN l.quincena = 0 THEN pl.parqueo ELSE pl.parqueo + COALESCE(pla.parqueo, 0) END parqueo, CASE WHEN l.quincena = 0 THEN pl.boleta_ornato ELSE pl.boleta_ornato + COALESCE(pla.boleta_ornato, 0) END boleta_ornato, CASE WHEN l.quincena = 0 THEN pl.otros_egresos ELSE pl.otros_egresos + COALESCE(pla.otros_egresos, 0) END otros_egresos, CASE WHEN l.quincena = 0 THEN pl.egresos_tot ELSE pl.egresos_tot + COALESCE(pla.egresos_tot, 0) END total_egresos, CASE WHEN l.quincena = 0 THEN pl.liquido ELSE pl.liquido + COALESCE(pla.liquido, 0) END liquido_recibir, CASE WHEN l.quincena = 0 THEN pl.liquido ELSE COALESCE(pla.liquido, 0) END liquido_primer_quincena, CASE WHEN l.quincena = 0 THEN 0 ELSE pl.liquido END liquido_segunda_quincena FROM pago_lote pl LEFT JOIN( SELECT * FROM pago_lote ) pla ON MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) AND pla.id_empleado = pl.id_empleado AND pla.id_lote != pl.id_lote LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = pl.id_centro LEFT JOIN departamento d ON d.id = pl.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN condicion_laboral cl ON cl.id = pl.condicion_laboral LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' GROUP BY dl.id_pago_lote, dv.id_empleado ) cafeteria ON cafeteria.id_lote = pl.id_lote AND cafeteria.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' GROUP BY dl.id_pago_lote, dv.id_empleado ) cafeteria_anterior ON cafeteria_anterior.id_lote = pla.id_lote AND cafeteria_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' GROUP BY dl.id_pago_lote, dv.id_empleado ) celular ON celular.id_lote = pl.id_lote AND celular.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' GROUP BY dl.id_pago_lote, dv.id_empleado ) celular_anterior ON celular_anterior.id_lote = pla.id_lote AND celular_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' GROUP BY dl.id_pago_lote, dv.id_empleado ) uniforme ON uniforme.id_lote = pl.id_lote AND uniforme.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' GROUP BY dl.id_pago_lote, dv.id_empleado ) uniforme_anterior ON uniforme_anterior.id_lote = pla.id_lote AND uniforme_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' GROUP BY dl.id_pago_lote, dv.id_empleado ) calzado ON calzado.id_lote = pl.id_lote AND calzado.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' GROUP BY dl.id_pago_lote, dv.id_empleado ) calzado_anterior ON calzado_anterior.id_lote = pla.id_lote AND calzado_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' GROUP BY dl.id_pago_lote, dv.id_empleado ) equipo ON equipo.id_lote = pl.id_lote AND equipo.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' GROUP BY dl.id_pago_lote, dv.id_empleado ) equipo_anterior ON equipo_anterior.id_lote = pla.id_lote AND equipo_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' GROUP BY dl.id_pago_lote, dv.id_empleado ) producto ON producto.id_lote = pl.id_lote AND producto.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' GROUP BY dl.id_pago_lote, dv.id_empleado ) producto_anterior ON producto_anterior.id_lote = pla.id_lote AND producto_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' GROUP BY dl.id_pago_lote, dv.id_empleado ) bancos ON bancos.id_lote = pl.id_lote AND bancos.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' GROUP BY dl.id_pago_lote, dv.id_empleado ) bancos_anterior ON bancos_anterior.id_lote = pla.id_lote AND bancos_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) GROUP BY dl.id_pago_lote, dv.id_empleado ) otros ON otros.id_lote = pl.id_lote AND otros.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl LEFT JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) GROUP BY dl.id_pago_lote, dv.id_empleado ) otros_anterior ON otros_anterior.id_lote = pla.id_lote AND otros_anterior.id_empleado = pl.id_empleado WHERE pl.id_lote = " . $_GET['id_pago_lote'] . " and e.id = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'correlativo' => $row["correlativo"],
                        'nombre_empleado' => $row["empleado"],
                        'empresa' => $row["empresa"],
                        'centro_costo' => $row["centro_costo"],
                        'departamento' => $row["departamento"],
                        'puesto' => $row["puesto"],
                        'dias_laborados' => $row["dias_laborados"],
                        'salario_ordinario' => $row["salario_ordinario"],
                        'bon_incentivo' => $row["bon_incentivo"],
                        'bon_decreto' => $row["bon_decreto"],
                        'bonos' => $row["bonos"],
                        'total_devengado' => $row["total_devengado"],
                        'horas_simples' => $row["horas_simples"],
                        'valor_horas_simples' => $row["valor_horas_simples"],
                        'horas_dobles' => $row["horas_dobles"],
                        'valor_horas_dobles' => $row["valor_horas_dobles"],
                        'otros_ingresos' => $row["otros_ingresos"],
                        'vacaciones' => $row["vacaciones"],
                        'salario_total' => $row["salario_total"],
                        'igss' => $row["igss"],
                        'isr' => $row["isr"],
                        'cafeteria' => $row["cafeteria"],
                        'celular' => $row["celular"],
                        'uniforme' => $row["uniforme"],
                        'calzado' => $row["calzado"],
                        'equipo' => $row["equipo"],
                        'producto' => $row["producto"],
                        'bancos' => $row["bancos"],
                        'otros' => $row["otros"],
                        'boleta_ornato' => $row["boleta_ornato"],
                        'otros_egresos' => $row["otros_egresos"],
                        'judiciales' => $row["judiciales"],
                        'seguro' => $row["seguro"],
                        'parqueo' => $row["parqueo"],
                        'total_egresos' => $row["total_egresos"],
                        'liquido_recibir' => $row["liquido_recibir"],
                        'liquido_primer_quincena' => $row["liquido_primer_quincena"],
                        'liquido_segunda_quincena' => $row["liquido_segunda_quincena"],
                        'tipo_pago' => $row["tipo_pago"],
                        'tipo_cuenta' => $row["tipo_cuenta"],
                        'no_cuenta' => $row["no_cuenta"],
                        'banco' => $row["banco"],
                        'condicion_laboral' => $row["condicion_laboral"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'detalle_puesto') {
            $sql = "SELECT * FROM puesto where id = " . $_GET['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'fecha' => $row["fecha"],
                        'cod_depto' => $row["cod_depto"],
                        'departamento' => $row["departamento"],
                        'cod_puesto' => $row["cod_puesto"],
                        'puesto' => $row["puesto"],
                        'motivo' => $row["motivo"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_lotes_cerrados') {
            $sql = "SELECT * FROM lote WHERE id_estado = 2";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'quincena' => $row["quincena"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_descuentos_variables_otros') {
            $sql = "SELECT dv.tipo_egreso, (dv.monto_total / dv.cuotas) monto, l.nombre FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN pago_lote pl ON pl.id_lote = dl.id_pago_lote LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN( SELECT * FROM pago_lote ) pla ON pla.id_empleado = pl.id_empleado AND MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) AND pla.id_lote != " . $_GET['id_lote'] . " WHERE pl.id_lote IN(COALESCE(pla.id, ''), " . $_GET['id_lote'] . ") AND dv.id_empleado = " . $_GET['id_empleado'] . " AND dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) GROUP BY dv.id, dl.id";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'tipo_egreso' => $row["tipo_egreso"],
                        'monto' => $row["monto"],
                        'lote' => $row["nombre"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_bonos_cerrados') {
            $sql = "SELECT b.id id, e.id id_empleado, d.nombre departamento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, u.nombre solicitante, DATE(b.fecha_generado) fecha_solicitado, b.monto monto, eb.nombre estado_bono FROM bono b LEFT JOIN bonos_pago_lote bpl ON bpl.id_bono = b.id LEFT JOIN empleado e ON e.id = b.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN usuario u ON u.id = b.id_solicitante LEFT JOIN estado_bono eb ON eb.id = b.id_estado WHERE bpl.id_pago_lote =" . $_GET['id_lote'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'id_empleado' => $row["id_empleado"],
                        'departamento' => $row["departamento"],
                        'empleado' => $row["empleado"],
                        'solicitante' => $row["solicitante"],
                        'fecha_solicitado' => $row["fecha_solicitado"],
                        'monto' => $row["monto"],
                        'estado_bono' => $row["estado_bono"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_horas_cerradas') {
            $sql = "SELECT he.id id, e.id id_empleado, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, DATE(he.fecha_trabajado) fecha_trabajado, he.horas horas, CASE WHEN he.jornada = 0 THEN 'Diurna' ELSE 'Nocturna' END jornada, he.monto, et.nombre estado FROM horas_extra he LEFT JOIN horas_extra_lote hel ON hel.id_hora_extra = he.id LEFT JOIN empleado e ON e.id = he.id_empleado LEFT JOIN estado_bono et ON et.id = he.estado WHERE hel.id_pago_lote =" . $_GET['id_lote'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'id_empleado' => $row["id_empleado"],
                        'empleado' => $row["empleado"],
                        'fecha_trabajado' => $row["fecha_trabajado"],
                        'horas' => $row["horas"],
                        'jornada' => $row["jornada"],
                        'monto' => $row["monto"],
                        'estado' => $row["estado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_dias_laborados_cerrados') {
            $sql = "SELECT dl.id id, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, d.nombre departamento, cc.nombre centro_costo, inc.nombre incidencia, DATE(dl.fecha_descuento) fecha_descuento, DATE(dl.fecha_generado) fecha_generado FROM dias_laborados dl LEFT JOIN dias_lote dll ON dll.id_dia = dl.id LEFT JOIN empleado e ON e.id = dl.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN centro_costo cc ON cc.id = e.centro_de_costo LEFT JOIN incidencia inc ON inc.id = dl.id_incidencia WHERE dll.id_pago_lote = " . $_GET['id_lote'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'empleado' => $row["empleado"],
                        'departamento' => $row["departamento"],
                        'centro_costo' => $row["centro_costo"],
                        'incidencia' => $row["incidencia"],
                        'fecha_descuento' => $row["fecha_descuento"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados_cafeteria') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . " and dv.tipo_egreso = 'Cafetería'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados_celular') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . " and dv.tipo_egreso = 'Celular'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados_uniforme') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . " and dv.tipo_egreso = 'Uniforme'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados_calzado') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . " and dv.tipo_egreso = 'Calzado'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados_equipo') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . " and dv.tipo_egreso = 'Equipo'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados_producto') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . " and dv.tipo_egreso = 'Producto'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados_bancos') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . " and dv.tipo_egreso = 'Bancos'";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_descuentos_cerrados_otros') {
            $sql = "SELECT dv.id id_descuento, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) nombre_empleado, d.nombre departamento, dv.tipo_egreso egreso, dv.monto_total monto_total, (dv.monto_total / dv.cuotas) monto_pagar, DATE(dv.fecha_generado) fecha_generado FROM descuento_variable dv LEFT JOIN descuento_lote dl ON dl.id_descuento = dv.id LEFT JOIN empleado e ON e.id = dv.id_empleado LEFT JOIN departamento d ON d.id = e.departamento_laboral LEFT JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON emp.id = ee.id_empresa WHERE emp.id = " . $_GET['id_empresa'] . " AND dl.id_pago_lote = " . $_GET['id_lote'] . " and dv.tipo_egreso not in('Cafetería', 'Celular','Uniforme','Calzado','Equipo','Producto','Bancos')";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id_descuento' => $row["id_descuento"],
                        'nombre_empleado' => $row["nombre_empleado"],
                        'departamento' => $row["departamento"],
                        'egreso' => $row["egreso"],
                        'monto_total' => $row["monto_total"],
                        'monto_pagar' => $row["monto_pagar"],
                        'fecha_generado' => $row["fecha_generado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_isr_cerrados') {
            $sql = "SELECT e.id id, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, pl.isr FROM pago_lote pl LEFT JOIN empleado e ON e.id = pl.id_empleado WHERE pl.id_lote = " . $_GET['id_lote'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'empleado' => $row["empleado"],
                        'isr' => $row["isr"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }


        if ($_GET["quest"] == 'listado_eventos') {
            $sql = "SELECT * FROM evento where id_empleado = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'tipo' => $row["tipo"],
                        'numero' => $row["numero"],
                        'estado' => $row["estado"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_evento') {
            $sql = "SELECT * FROM evento where id = " . $_GET['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'tipo' => $row["tipo"],
                        'numero' => $row["numero"],
                        'fecha_inicio' => $row["fecha_inicio"],
                        'fecha_final' => $row["fecha_final"],
                        'año' => $row["año"],
                        'mes' => $row["mes"],
                        'dia' => $row["dia"],
                        'hora' => $row["hora"],
                        'minuto' => $row["minuto"],
                        'procesar' => $row["procesar"],
                        'planilla' => $row["planilla"],
                        'estado' => $row["estado"],
                        'observaciones' => $row["observaciones"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_records') {
            $sql = "SELECT * FROM record where id_empleado = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'tipo' => $row["tipo"],
                        'descripcion' => $row["descripcion"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_record') {
            $sql = "SELECT * FROM record where id = " . $_GET['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'tipo' => $row["tipo"],
                        'fecha' => $row["fecha"],
                        'descripcion' => $row["descripcion"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_empresas_anteriores') {
            $sql = "SELECT * FROM empresa_anterior where id_empleado = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_empresa_anterior') {
            $sql = "SELECT * FROM empresa_anterior where id = " . $_GET['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'direccion' => $row["direccion"],
                        'motivo' => $row["motivo"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'listado_vehiculos') {
            $sql = "SELECT * FROM vehiculo where id_empleado = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'marca' => $row["marca"],
                        'modelo' => $row["modelo"],
                        'placa' => $row["placa"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_vehiculo') {
            $sql = "SELECT * FROM vehiculo where id = " . $_GET['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'marca' => $row["marca"],
                        'modelo' => $row["modelo"],
                        'placa' => $row["placa"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_centro_costo') {
            $sql = "SELECT * FROM centro_costo where id = " . $_GET['id_centro'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'detalle_dimension_3') {
            $sql = "SELECT * FROM dimension_3 where id = " . $_GET['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'detalle_dimension_4') {
            $sql = "SELECT * FROM dimension_4 where id = " . $_GET['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'detalle_dimension_5') {
            $sql = "SELECT * FROM dimension_5 where id = " . $_GET['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"]
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No hay datos';
            }
        }

        if ($_GET["quest"] == 'listado_empresas_centro_costo') {
            $sql = "SELECT e.id, e.nombre_comercial, ec.id_empresa_centro from empresa_centro ec inner join empresa e on ec.id_empresa = e.id where ec.id_centro = " . $_GET['id_centro'] . " and e.id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre_comercial' => $row["nombre_comercial"],
                        'id_empresa_centro' => $row["id_empresa_centro"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo "No hay datos";
            }
        }

        if ($_GET["quest"] == 'listado_dimension3_dimension2') {
            $sql = "SELECT d3.id id_dimension, d3.nombre nombre_dimension, cd.id id_centro_dimension3 FROM centro_costo cc LEFT JOIN centro_dimension3 cd on cd.id_centro = cc.id LEFT JOIN dimension_3 d3 on d3.id = cd.id_dimension WHERE cc.id = " . $_GET['id_dimension'] . " AND d3.id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id_dimension"],
                        'nombre' => $row["nombre_dimension"],
                        'id_centro_dimension3' => $row["id_centro_dimension3"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo "No hay datos";
            }
        }

        if ($_GET["quest"] == 'listado_dimension3_dimension4') {
            $sql = "SELECT d4.id id_dimension, d4.nombre nombre_dimension, d34.id id_dimension3_dimension4 FROM dimension_3 d3 LEFT JOIN dimension3_dimension_4 d34 on d34.id_dimension3 = d3.id LEFT JOIN dimension_4 d4 on d4.id = d34.id_dimension4 WHERE d3.id = " . $_GET['id_dimension'] . " AND d4.id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id_dimension"],
                        'nombre' => $row["nombre_dimension"],
                        'id_dimension3_dimension4' => $row["id_dimension3_dimension4"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo "No hay datos";
            }
        }

        if ($_GET["quest"] == 'listado_dimension4_dimension5') {
            $sql = "SELECT d5.id id_dimension, d5.nombre nombre_dimension, d45.id id_dimension4_dimension5 FROM dimension_4 d4 LEFT JOIN dimension4_dimension5 d45 on d45.id_dimension4 = d4.id LEFT JOIN dimension_5 d5 on d5.id = d45.id_dimension5 WHERE d4.id = " . $_GET['id_dimension'] . " AND d5.id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id_dimension"],
                        'nombre' => $row["nombre_dimension"],
                        'id_dimension4_dimension5' => $row["id_dimension4_dimension5"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo "No hay datos";
            }
        }

        if ($_GET["quest"] == 'listado_hijos') {
            $sql = "SELECT * FROM hijo where id_empleado = " . $_GET['id_empleado'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row['id'],
                        'nombre' => $row["nombre"],
                        'edad' => $row["edad"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }

        if ($_GET["quest"] == 'detalle_hijo') {
            $sql = "SELECT * FROM hijo where id = " . $_GET['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            }

            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array(
                        'id' => $row["id"],
                        'nombre' => $row["nombre"],
                        'edad' => $row["edad"],
                    );
                }
                $json_string = json_encode($json);
                echo $json_string;
            } else {
                echo 'No';
            }
        }
    }
}

// --------------------- POST -------------------------- //

if (isset($_POST)) {
    if (isset($_POST['quest'])) {
        if ($_POST["quest"] == 'agregar_empresa') {
            $apartado_postal = $con->real_escape_string($_POST["apartado_postal"]);
            $apto = $con->real_escape_string($_POST["apto"]);
            $calle = $con->real_escape_string($_POST["calle"]);
            $colonia = $con->real_escape_string($_POST["colonia"]);
            $departamento = $con->real_escape_string($_POST["departamento"]);
            $direccion = $con->real_escape_string($_POST["direccion"]);
            $direccion_patrono = $con->real_escape_string($_POST["direccion_patrono"]);
            $email = $con->real_escape_string($_POST["email"]);
            $fax = $con->real_escape_string($_POST["fax"]);
            $municipio = $con->real_escape_string($_POST["municipio"]);
            $nit = $con->real_escape_string($_POST["nit"]);
            $nit_patrono = $con->real_escape_string($_POST["nit_patrono"]);
            $nombre_comercial = $con->real_escape_string($_POST["nombre_comercial"]);
            $nombre_patrono = $con->real_escape_string($_POST["nombre_patrono"]);
            $nomenclatura = $con->real_escape_string($_POST["nomenclatura"]);
            $numero = $con->real_escape_string($_POST["numero"]);
            $numero_patrono = $con->real_escape_string($_POST["numero_patrono"]);
            $razon_social = $con->real_escape_string($_POST["razon_social"]);
            $telefono = $con->real_escape_string($_POST["telefono"]);
            $id_banco = $_POST["id_banco"];

            $sql = "INSERT INTO empresa(apartado_postal, apto, calle, colonia, departamento, direccion, direccion_patrono, email, fax, municipio, nit, nit_partono, nombre_comercial, nombre_patrono, nomenclatura, numero, numero_patrono, razon_social, telefono, id_estado, id_banco) values('" . $apartado_postal . "','" . $apto . "','" . $calle . "','" . $colonia . "','" . $departamento . "','" . $direccion . "','" . $direccion_patrono . "','" . $email . "','" . $fax . "','" . $municipio . "','" . $nit . "','" . $nit_patrono . "','" . $nombre_comercial . "','" . $nombre_patrono . "','" . $nomenclatura . "','" . $numero . "','" . $numero_patrono . "','" . $razon_social . "','" . $telefono . "', 1, " . $id_banco . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_empresa') {

            $apartado_postal = $con->real_escape_string($_POST["apartado_postal"]);
            $apto = $con->real_escape_string($_POST["apto"]);
            $calle = $con->real_escape_string($_POST["calle"]);
            $colonia = $con->real_escape_string($_POST["colonia"]);
            $departamento = $con->real_escape_string($_POST["departamento"]);
            $direccion = $con->real_escape_string($_POST["direccion"]);
            $direccion_patrono = $con->real_escape_string($_POST["direccion_patrono"]);
            $email = $con->real_escape_string($_POST["email"]);
            $fax = $con->real_escape_string($_POST["fax"]);
            $municipio = $con->real_escape_string($_POST["municipio"]);
            $nit = $con->real_escape_string($_POST["nit"]);
            $nit_patrono = $con->real_escape_string($_POST["nit_patrono"]);
            $nombre_comercial = $con->real_escape_string($_POST["nombre_comercial"]);
            $nombre_patrono = $con->real_escape_string($_POST["nombre_patrono"]);
            $nomenclatura = $con->real_escape_string($_POST["nomenclatura"]);
            $numero = $con->real_escape_string($_POST["numero"]);
            $numero_patrono = $con->real_escape_string($_POST["numero_patrono"]);
            $razon_social = $con->real_escape_string($_POST["razon_social"]);
            $telefono = $con->real_escape_string($_POST["telefono"]);
            $id_banco = $_POST["id_banco"];

            $sql = "UPDATE empresa SET nit = '" . $nit . "', nombre_comercial = '" . $nombre_comercial . "', razon_social = '" . $razon_social . "', calle = '" . $calle . "', apto = '" . $apto . "', departamento = '" . $departamento . "', apartado_postal = '" . $apartado_postal . "', telefono = '" . $telefono . "', fax = '" . $fax . "', email = '" . $email . "', nomenclatura = '" . $nomenclatura . "', numero = '" . $numero . "', colonia = '" . $colonia . "', municipio = '" . $municipio . "', direccion = '" . $direccion . "', nombre_patrono = '" . $nombre_patrono . "', direccion_patrono = '" . $direccion_patrono . "', numero_patrono = '" . $numero_patrono . "', nit_partono = '" . $nit_patrono . "', id_banco = " . $id_banco . " WHERE id  = " . $_POST['id_empresa'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_empresa') {

            $sql = "DELETE FROM empresa WHERE id = " . $_POST['id_empresa'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'agregar_departamento') {

            $nombre = $con->real_escape_string($_POST["nombre_departamento"]);
            $gerente = $con->real_escape_string($_POST["gerente"]);


            $sql = "INSERT INTO departamento(nombre, gerente, id_estado) values('" . $nombre . "', '" . $gerente . "', 1)";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                $ultimo_id = mysqli_insert_id($con);
                $_SESSION["ultimo_id_depto"] = $ultimo_id;
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'agregar_dimension_2') {

            $nombre = $con->real_escape_string($_POST["nombre_centro"]);

            $sql = "INSERT INTO centro_costo(nombre, id_estado) values('" . $nombre . "', 1)";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                $ultimo_id = mysqli_insert_id($con);
                $_SESSION["ultimo_id_dimension_2"] = $ultimo_id;
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_dimension_3') {

            $nombre = $con->real_escape_string($_POST["nombre_dimension"]);

            $sql = "INSERT INTO dimension_3(nombre, id_estado) values('" . $nombre . "', 1)";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                $ultimo_id = mysqli_insert_id($con);
                $_SESSION["ultimo_id_dimension_3"] = $ultimo_id;
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_dimension_4') {

            $nombre = $con->real_escape_string($_POST["nombre_dimension"]);

            $sql = "INSERT INTO dimension_4(nombre, id_estado) values('" . $nombre . "', 1)";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                $ultimo_id = mysqli_insert_id($con);
                $_SESSION["ultimo_id_dimension_4"] = $ultimo_id;
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_dimension_5') {

            $nombre = $con->real_escape_string($_POST["nombre_dimension"]);

            $sql = "INSERT INTO dimension_5(nombre, id_estado) values('" . $nombre . "', 1)";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                $ultimo_id = mysqli_insert_id($con);
                $_SESSION["ultimo_id_dimension_5"] = $ultimo_id;
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'agregar_centro_costo') {
            if ($_POST['departamento_existente'] == 'true') {
                $id_departamento = $_POST['id_departamento'];
            } else {
                $id_departamento = $_SESSION["ultimo_id_depto"];
            }

            $sql = "INSERT INTO departamento_centro(id_departamento, id_centro) values(" . $id_departamento . ", " . $_POST['id_centro'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'agregar_dimension_3') {
            if ($_POST['dimension_2_existente'] == 'true') {
                $id_dimension_2 = $_POST['id_dimension_2'];
            } else {
                $id_dimension_2 = $_SESSION["ultimo_id_dimension_2"];
            }

            $sql = "INSERT INTO centro_dimension3(id_centro, id_dimension) values(" . $id_dimension_2 . ", " . $_POST['id_dimension_3'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'agregar_dimension_4') {
            if ($_POST['dimension_3_existente'] == 'true') {
                $id_dimension_3 = $_POST['id_dimension_3'];
            } else {
                $id_dimension_3 = $_SESSION["ultimo_id_dimension_3"];
            }

            $sql = "INSERT INTO dimension3_dimension_4(id_dimension3, id_dimension4) values(" . $id_dimension_3 . ", " . $_POST['id_dimension_4'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'agregar_dimension_5') {
            if ($_POST['dimension_4_existente'] == 'true') {
                $id_dimension_4 = $_POST['id_dimension_4'];
            } else {
                $id_dimension_4 = $_SESSION["ultimo_id_dimension_4"];
            }

            $sql = "INSERT INTO dimension4_dimension5(id_dimension4, id_dimension5) values(" . $id_dimension_4 . ", " . $_POST['id_dimension_5'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_departamento') {
            $sql = "UPDATE departamento set id_estado = 2 where id = " . $_POST['id_departamento'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_departamento') {

            $nombre = $con->real_escape_string($_POST["nombre_departamento"]);
            $gerente = $con->real_escape_string($_POST["gerente"]);

            $sql = "UPDATE departamento set nombre = '" . $nombre . "', gerente = '" . $gerente . "' where id = " . $_POST['id_departamento'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_centro_costo') {

            $sql = "INSERT into centro_costo(nombre, id_estado) values('" . $_POST['nombre_centro'] . "', 1)";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                $ultimo_id_centro = mysqli_insert_id($con);
                $_SESSION["ultimo_id_centro"] = $ultimo_id_centro;
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_centro_costo') {

            $nombre = $con->real_escape_string($_POST["nombre_centro"]);

            $sql = "UPDATE centro_costo set nombre = '" . $nombre . "' where id = " . $_POST['id_centro'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_dimension_3') {

            $nombre = $con->real_escape_string($_POST["nombre_dimension"]);

            $sql = "UPDATE dimension_3 set nombre = '" . $nombre . "' where id = " . $_POST['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_dimension_4') {

            $nombre = $con->real_escape_string($_POST["nombre_dimension"]);

            $sql = "UPDATE dimension_4 set nombre = '" . $nombre . "' where id = " . $_POST['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_dimension_5') {

            $nombre = $con->real_escape_string($_POST["nombre_dimension"]);

            $sql = "UPDATE dimension_5 set nombre = '" . $nombre . "' where id = " . $_POST['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_empresa_centro') {

            $sql = "UPDATE empresa_centro set id_empresa = " . $_POST['id_empresa'] . " where id_empresa_centro = " . $_POST['id_empresa_centro'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_departamento_centro') {

            $sql = "UPDATE departamento_centro set id_centro = " . $_POST['id_centro'] . " where id_departamento_centro = " . $_POST['id_depto_centro'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_centro_dimension3') {

            $sql = "UPDATE centro_dimension3 set id_dimension = " . $_POST['id_dimension'] . " where id = " . $_POST['id_centro_dimension3'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_dimension3_dimension4') {

            $sql = "UPDATE dimension3_dimension_4 set id_dimension4 = " . $_POST['id_dimension'] . " where id = " . $_POST['id_dimension3_dimension4'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_dimension4_dimension5') {

            $sql = "UPDATE dimension4_dimension5 set id_dimension5 = " . $_POST['id_dimension'] . " where id = " . $_POST['id_dimension4_dimension5'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'agregar_empresa_centro') {
            if ($_POST['centro_existente'] == 'true') {
                $id_centro = $_POST['id_centro'];
            } else {
                $id_centro = $_SESSION["ultimo_id_dimension_2"];
            }

            $sql = "INSERT INTO empresa_centro(id_centro, id_empresa) values(" . $id_centro . ", " . $_POST['id_empresa'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_empresa_centro') {

            $sql = "DELETE FROM empresa_centro WHERE id_empresa_centro = " . $_POST['id_empresa_centro'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_centro_costo') {

            $sql = "UPDATE centro_costo set id_estado = 2 where id = " . $_POST['id_centro'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_dimension_3') {

            $sql = "UPDATE dimension_3 set id_estado = 2 where id = " . $_POST['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_dimension_4') {

            $sql = "UPDATE dimension_4 set id_estado = 2 where id = " . $_POST['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_dimension_5') {

            $sql = "UPDATE dimension_5 set id_estado = 2 where id = " . $_POST['id_dimension'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_empleado') {

            $primer_nombre = $con->real_escape_string($_POST['primer_nombre']);
            $segundo_nombre = $con->real_escape_string($_POST['segundo_nombre']);
            $otro_nombre = $con->real_escape_string($_POST['otro_nombre']);
            $primer_apellido = $con->real_escape_string($_POST['primer_apellido']);
            $segundo_apellido = $con->real_escape_string($_POST['segundo_apellido']);
            $direccion = $con->real_escape_string($_POST['direccion']);
            $fecha_nacimiento = $con->real_escape_string($_POST['fecha_nacimiento']);
            $dpi = $con->real_escape_string($_POST['dpi']);
            $no_igss = $con->real_escape_string($_POST['no_iggs']);
            $fecha_inicio = $con->real_escape_string($_POST['fecha_inicio']);
            $fecha_baja = $con->real_escape_string($_POST['fecha_baja']);
            $telefono = $con->real_escape_string($_POST['telefono']);
            $licencia = $con->real_escape_string($_POST['licencia']);
            $no_cuenta = $con->real_escape_string($_POST['no_cuenta']);
            $conyugue = $con->real_escape_string($_POST['conyuge']);
            $grado_primaria = $con->real_escape_string($_POST['grado_primaria']);
            $grado_secundaria = $con->real_escape_string($_POST['grado_secundaria']);
            $nacionalidad = $con->real_escape_string($_POST['nacionalidad']);
            $region_originario = $con->real_escape_string($_POST['region_originario']);
            $departamento_originario = $con->real_escape_string($_POST['departamento_originario']);
            $municipio_originario = $con->real_escape_string($_POST['municipio_originario']);
            $municipio_laboral = $con->real_escape_string($_POST['municipio_laboral']);
            $apellido_casada = $con->real_escape_string($_POST['apellido_casada']);
            $condicion_laboral = $con->real_escape_string($_POST['condicion_laboral']);
            $codigo_ocupacion = $con->real_escape_string($_POST['codigo_ocupacion']);
            $temporal = $con->real_escape_string($_POST['temporal']);
            $telefono_celular = $con->real_escape_string($_POST['telefono_celular']);
            $telefono_emergencia = $con->real_escape_string($_POST['telefono_emergencia']);
            $nombre_emergencia = $con->real_escape_string($_POST['nombre_emergencia']);
            $edad = $con->real_escape_string($_POST['edad']);
            $emision_dpi = $con->real_escape_string($_POST['emision_dpi']);
            $edad_conyuge = $con->real_escape_string($_POST['edad_conyuge']);
            $ocupacion_conyuge = $con->real_escape_string($_POST['ocupacion_conyuge']);
            $nombre_padre = $con->real_escape_string($_POST['nombre_padre']);
            $edad_padre = $con->real_escape_string($_POST['edad_padre']);
            $ocupacion_padre = $con->real_escape_string($_POST['ocupacion_padre']);
            $nombre_madre = $con->real_escape_string($_POST['nombre_madre']);
            $edad_madre = $con->real_escape_string($_POST['edad_madre']);
            $ocupacion_madre = $con->real_escape_string($_POST['ocupacion_madre']);
            $nit = $con->real_escape_string($_POST['nit']);
            $apellido_casada_originario = $con->real_escape_string($_POST['apellido_casada_originario']);
            $dias_laborados = 15;
            $puesto = $con->real_escape_string($_POST['puesto']);
            $discapacidad = $con->real_escape_string($_POST['discapacidad']);
            $afiliacion = $con->real_escape_string($_POST['afiliacion_igss']);
            $titulo_diploma = $con->real_escape_string($_POST['titulos_diplomas']);

            $sql = "INSERT INTO empleado( estado, primer_nombre, segundo_nombre, otro_nombre, primer_apellido, segundo_apellido, direccion, estado_civil, fecha_nacimiento, dpi, no_igss, centro_de_costo, fecha_inicio, fecha_baja, telefono, genero, licencia, id_tipo_licencia, id_clase_licencia, horas_extra, tipo_de_pago, banco, no_cuenta, moneda, conyugue, bon_dec_37_2001, bon_incentivo, horas_extras_dobles, horas_extras_simples, sueldo_ordinario, otro_ingresos, total_igss, vacaciones, bancos, judiciales, seguro, parqueo, anticipo_quincenal, bantrab, boleto_de_ornato, igss_laboral, igss_patronal, isr, otro_descuentos, prestamo_empresa, primaria, grado_primaria, secundaria, grado_secundaria, diversificado, universidad, nacionalidad, region_originario, departamento_originario, municipio_originario, municipio_laboral, apellido_casada, condicion_laboral, codigo_ocupacion, tipo_plantilla, horas_laborales, ventas_economicas, temporal, telefono_celular, telefono_emergencia, nombre_emergencia, edad, emision_dpi, edad_conyuge, ocupacion_conyuge, nombre_padre, edad_padre, ocupacion_padre, nombre_madre, edad_madre, ocupacion_madre, nit, departamento_laboral, apellido_casada_originario, tipo_cuenta, dias_laborados, puesto, jubilacion, discapacidad, jornada, id_permisos, afiliacion, titulo_diploma, dimension_3, dimension_4, dimension_5 ) VALUES ( " . $_POST['estado'] . ", '$primer_nombre', '$segundo_nombre', '$otro_nombre', '$primer_apellido', '$segundo_apellido', '$direccion', " . $_POST['estado_civil'] . ", '$fecha_nacimiento', '$dpi', '$no_igss', " . $_POST['centro_de_costo'] . ", '$fecha_inicio', '$fecha_baja', '$telefono', " . $_POST['genero'] . ", '$licencia', " . $_POST['id_tipo_licencia'] . ", " . $_POST['id_clase_licencia'] . ", " . $_POST['horas_extra'] . ", " . $_POST['tipo_de_pago'] . ", " . $_POST['banco'] . ", '$no_cuenta', " . $_POST['moneda'] . ", '$conyugue', " . $_POST['bon_dec_37_2001'] . ", " . $_POST['bon_incentivo'] . ", " . $_POST['horas_extras_dobles'] . ", " . $_POST['horas_extras_simples'] . ", " . $_POST['sueldo_ordinario'] . ", " . $_POST['otro_ingresos'] . ", " . $_POST['total_iggs'] . ", " . $_POST['vacaciones'] . ", " . $_POST['bancos'] . ", " . $_POST['judiciales'] . ", " . $_POST['seguro'] . ", " . $_POST['parqueo'] . ", " . $_POST['anticipo_quincenal'] . ", " . $_POST['bantrab'] . ", " . $_POST['boleto_de_ornato'] . ", " . $_POST['iggs_laboral'] . ", " . $_POST['iggs_patronal'] . ", " . $_POST['isr'] . ", " . $_POST['otro_descuentos'] . ", " . $_POST['prestamo_empresa'] . ", " . $_POST['primaria'] . ", '$grado_primaria', " . $_POST['secundaria'] . ", '$grado_secundaria', " . $_POST['diversificado'] . ", " . $_POST['universidad'] . ", '$nacionalidad', '$region_originario', '$departamento_originario', '$municipio_originario', '$municipio_laboral', '$apellido_casada', '$condicion_laboral', '$codigo_ocupacion', " . $_POST['tipo_planilla'] . ", " . $_POST['horas_laborales'] . ", " . $_POST['ventas_economicas'] . ", '$temporal', '$telefono_celular', '$telefono_emergencia', '$nombre_emergencia', '$edad', '$emision_dpi', '$edad_conyuge', '$ocupacion_conyuge', '$nombre_padre', '$edad_padre', '$ocupacion_padre', '$nombre_madre', '$edad_madre', '$ocupacion_madre', '$nit', " . $_POST['departamento_laboral'] . ", '$apellido_casada_originario', " . $_POST['tipo_cuenta'] . ", '$dias_laborados', '$puesto', " . $_POST['jubilacion'] . ", '$discapacidad', " . $_POST['jornada'] . ", " . $_POST['id_permisos'] . ", '$afiliacion', '$titulo_diploma', " . $_POST['dimension_3'] . ", " . $_POST['dimension_4'] . ", " . $_POST['dimension_5'] . ")";
            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                $ultimo_id_empleado = mysqli_insert_id($con);
                $_SESSION["ultimo_id_empleado"] = $ultimo_id_empleado;
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_estudio') {

            $ultimo_id_empleado = $_SESSION["ultimo_id_empleado"];
            $descripcion = $con->real_escape_string($_POST["descripcion"]);

            $sql = "INSERT INTO estudio(carrera, descripcion, universidad, id_empleado) VALUES ('" . $_POST['carrera'] . "','" . $descripcion . "'," . $_POST['universidad'] . "," . $ultimo_id_empleado . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_estudio_editar') {

            $descripcion = $con->real_escape_string($_POST["descripcion"]);

            $sql = "INSERT INTO estudio(carrera, descripcion, universidad, id_empleado) VALUES ('" . $_POST['carrera'] . "','" . $descripcion . "'," . $_POST['universidad'] . "," . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_curso') {

            $ultimo_id_empleado = $_SESSION["ultimo_id_empleado"];

            $sql = "INSERT INTO curso(nombre, lugar, interno, ano, mes, diploma, obligacion, ano_obligacion, mes_obligacion, reembolsar, fecha_capacitacion, codigo_curso, nombre_curso, induccion, general, funciones, fecha_evaluacion, nota, id_empleado) VALUES ('" . $_POST["nombre"] . "','" . $_POST["lugar"] . "'," . $_POST["interno"] . ",'" . $_POST["ano"] . "','" . $_POST["mes"] . "'," . $_POST["diploma"] . ",'" . $_POST["obligacion"] . "'," . $_POST["ano_obligacion"] . ",'" . $_POST["mes_obligacion"] . "','" . $_POST["reembolsar"] . "','" . $_POST["fecha_capacitacion"] . "','" . $_POST["codigo_curso"] . "','" . $_POST["nombre_curso"] . "'," . $_POST["induccion"] . "," . $_POST["general"] . "," . $_POST["funciones"] . ",'" . $_POST["fecha_evaluacion"] . "','" . $_POST["nota"] . "'," . $ultimo_id_empleado . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_curso_editar') {

            $sql = "INSERT INTO curso(nombre, lugar, interno, ano, mes, diploma, obligacion, ano_obligacion, mes_obligacion, reembolsar, fecha_capacitacion, codigo_curso, nombre_curso, induccion, general, funciones, fecha_evaluacion, nota, id_empleado) VALUES ('" . $_POST["nombre"] . "','" . $_POST["lugar"] . "'," . $_POST["interno"] . ",'" . $_POST["ano"] . "','" . $_POST["mes"] . "'," . $_POST["diploma"] . "," . $_POST["obligacion"] . ",'" . $_POST["ano_obligacion"] . "','" . $_POST["mes_obligacion"] . "','" . $_POST["reembolsar"] . "','" . $_POST["fecha_capacitacion"] . "','" . $_POST["codigo_curso"] . "','" . $_POST["nombre_curso"] . "'," . $_POST["induccion"] . "," . $_POST["general"] . "," . $_POST["funciones"] . ",'" . $_POST["fecha_evaluacion"] . "','" . $_POST["nota"] . "'," . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_puesto') {

            $ultimo_id_empleado = $_SESSION["ultimo_id_empleado"];

            $sql = "INSERT INTO puesto(fecha, cod_depto, departamento, cod_puesto, puesto, motivo, id_empleado) VALUES ('" . $_POST['fecha'] . "','" . $_POST['cod_depto'] . "','" . $_POST['departamento'] . "','" . $_POST['cod_puesto'] . "','" . $_POST['puesto'] . "','" . $_POST['motivo'] . "'," . $ultimo_id_empleado . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_puesto_editar') {

            $sql = "INSERT INTO puesto(fecha, cod_depto, departamento, cod_puesto, puesto, motivo, id_empleado) VALUES ('" . $_POST['fecha'] . "','" . $_POST['cod_depto'] . "','" . $_POST['departamento'] . "','" . $_POST['cod_puesto'] . "','" . $_POST['puesto'] . "','" . $_POST['motivo'] . "'," . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_evento') {

            $ultimo_id_empleado = $_SESSION["ultimo_id_empleado"];
            $observaciones = $con->zscape_string($_POST["observaciones"]);

            $sql = "INSERT INTO evento(tipo, numero, fecha_inicio, fecha_final, año, mes, dia, hora, minuto, procesar, planilla, estado, observaciones, id_empleado) VALUES ('" . $_POST['tipo'] . "','" . $_POST['numero'] . "','" . $_POST['fecha_inicio'] . "','" . $_POST['fecha_final'] . "'," . $_POST['año'] . "," . $_POST['mes'] . "," . $_POST['dia'] . "," . $_POST['hora'] . "," . $_POST['minuto'] . ",'" . $_POST['procesar'] . "','" . $_POST['planilla'] . "','" . $_POST['estado'] . "','" . $observaciones . "'," . $ultimo_id_empleado . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_evento_editar') {

            $observaciones = $con->real_escape_string($_POST["observaciones"]);

            $sql = "INSERT INTO evento(tipo, numero, fecha_inicio, fecha_final, año, mes, dia, hora, minuto, procesar, planilla, estado, observaciones, id_empleado) VALUES ('" . $_POST['tipo'] . "','" . $_POST['numero'] . "','" . $_POST['fecha_inicio'] . "','" . $_POST['fecha_final'] . "'," . $_POST['año'] . "," . $_POST['mes'] . "," . $_POST['dia'] . "," . $_POST['hora'] . "," . $_POST['minuto'] . ",'" . $_POST['procesar'] . "','" . $_POST['planilla'] . "','" . $_POST['estado'] . "','" . $observaciones . "'," . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_record') {

            $ultimo_id_empleado = $_SESSION["ultimo_id_empleado"];
            $descripcion = $con->real_escape_string($_POST["descripcion"]);

            $sql = "INSERT INTO record(fecha, descripcion, tipo, id_empleado) VALUES ('" . $_POST['fecha'] . "','" . $descripcion . "','" . $_POST['tipo'] . "'," . $ultimo_id_empleado . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_record_editar') {

            $descripcion = $con->real_escape_string($_POST["descripcion"]);

            $sql = "INSERT INTO record(fecha, descripcion, tipo, id_empleado) VALUES ('" . $_POST['fecha'] . "','" . $descripcion . "','" . $_POST['tipo'] . "'," . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_empresa_anterior') {

            $ultimo_id_empleado = $_SESSION["ultimo_id_empleado"];
            $motivo = $con->real_escape_string($_POST["motivo"]);

            $sql = "INSERT INTO empresa_anterior(nombre, direccion, motivo, id_empleado) VALUES ('" . $_POST['nombre'] . "','" . $_POST['direccion'] . "','" . $motivo . "'," . $ultimo_id_empleado . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'insertar_vacaciones') {

            $result = odbc_exec($conn, $_POST["template"]);

            if (!$result) {
                die('Query Falló - OBDC');
            }

            if (odbc_num_rows($result) > 0) {
                echo 'Successfully';
            } else {
                echo 'ODBC salió mal';
            }
        }

        if ($_POST["quest"] == 'ingresar_empresa_anterior_editar') {

            $motivo = $con->real_escape_string($_POST["motivo"]);

            $sql = "INSERT INTO empresa_anterior(nombre, direccion, motivo, id_empleado) VALUES ('" . $_POST['nombre'] . "','" . $_POST['direccion'] . "','" . $motivo . "'," . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_vehiculo') {

            $ultimo_id_empleado = $_SESSION["ultimo_id_empleado"];

            $sql = "INSERT INTO vehiculo(marca, modelo, placa, id_empleado) VALUES ('" . $_POST['marca'] . "','" . $_POST['modelo'] . "','" . $_POST['placa'] . "'," . $ultimo_id_empleado . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_vehiculo_editar') {

            $sql = "INSERT INTO vehiculo(marca, modelo, placa, id_empleado) VALUES ('" . $_POST['marca'] . "','" . $_POST['modelo'] . "','" . $_POST['placa'] . "'," . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_hijo') {

            $ultimo_id_empleado = $_SESSION["ultimo_id_empleado"];

            $sql = "INSERT INTO hijo(nombre, edad, id_empleado) VALUES ('" . $_POST['nombre'] . "','" . $_POST['edad'] . "'," . $ultimo_id_empleado . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_hijo_editar') {

            $sql = "INSERT INTO hijo(nombre, edad, id_empleado) VALUES ('" . $_POST['nombre'] . "','" . $_POST['edad'] . "'," . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_tipo_bono') {

            $sql = "INSERT INTO tipo_bono(nombre, monto) VALUES ('" . $_POST['nombre'] . "'," . $_POST['monto'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_tipo_bono') {

            $sql = "UPDATE tipo_bono SET nombre = '" . $_POST['nombre'] . "', monto = " . $_POST['monto'] . "  where id = " . $_POST['id'];
            "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_monto_mantenimiento') {

            $sql = "INSERT INTO monto_mantenimiento(monto) VALUES (" . $_POST['monto'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_monto_mantenimiento') {

            $sql = "UPDATE monto_mantenimiento SET monto = " . $_POST['monto'] . "  where id = " . $_POST['id'];
            "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_empleado') {

            $sql = "UPDATE empleado SET estado = " . $_POST['estado'] . ", primer_nombre = '" . $_POST['primer_nombre'] . "', segundo_nombre = '" . $_POST['segundo_nombre'] . "', otro_nombre = '" . $_POST['otro_nombre'] . "', primer_apellido = '" . $_POST['primer_apellido'] . "', segundo_apellido = '" . $_POST['segundo_apellido'] . "', direccion = '" . $_POST['direccion'] . "', estado_civil = " . $_POST['estado_civil'] . ", fecha_nacimiento = '" . $_POST['fecha_nacimiento'] . "', dpi = '" . $_POST['dpi'] . "', no_igss = '" . $_POST['no_igss'] . "', centro_de_costo = " . $_POST['centro_de_costo'] . ", fecha_inicio = '" . $_POST['fecha_inicio'] . "', fecha_baja = '" . $_POST['fecha_baja'] . "', telefono = '" . $_POST['telefono'] . "', genero = " . $_POST['genero'] . ", licencia = '" . $_POST['licencia'] . "', id_tipo_licencia = " . $_POST['id_tipo_licencia'] . ", id_clase_licencia = " . $_POST['id_clase_licencia'] . ", horas_extra = " . $_POST['horas_extra'] . ", tipo_de_pago = " . $_POST['tipo_de_pago'] . ", banco = " . $_POST['banco'] . ", no_cuenta = '" . $_POST['no_cuenta'] . "', moneda = " . $_POST['moneda'] . ", conyugue = '" . $_POST['conyuge'] . "', bon_dec_37_2001 = '" . $_POST['bon_dec_37_2001'] . "', bon_incentivo = '" . $_POST['bon_incentivo'] . "', horas_extras_dobles = '" . $_POST['horas_extras_dobles'] . "', horas_extras_simples = '" . $_POST['horas_extras_simples'] . "', sueldo_ordinario = '" . $_POST['sueldo_ordinario'] . "', otro_ingresos = '" . $_POST['otro_ingresos'] . "', vacaciones = '" . $_POST['vacaciones'] . "', anticipo_quincenal = '" . $_POST['anticipo_quincenal'] . "', bantrab = '" . $_POST['bantrab'] . "', boleto_de_ornato = '" . $_POST['boleto_de_ornato'] . "', isr = '" . $_POST['isr'] . "', otro_descuentos = '" . $_POST['otro_descuentos'] . "', prestamo_empresa = '" . $_POST['prestamo_empresa'] . "', bancos = '" . $_POST['bancos'] . "', judiciales = '" . $_POST['judiciales'] . "', seguro = '" . $_POST['seguro'] . "', parqueo = '" . $_POST['parqueo'] . "', primaria = " . $_POST['primaria'] . ", grado_primaria = '" . $_POST['grado_primaria'] . "', secundaria = " . $_POST['secundaria'] . ", grado_secundaria = '" . $_POST['grado_secundaria'] . "', diversificado = " . $_POST['diversificado'] . ", universidad = " . $_POST['universidad'] . ", nacionalidad = '" . $_POST['nacionalidad'] . "', region_originario = '" . $_POST['region_originario'] . "', departamento_originario = '" . $_POST['departamento_originario'] . "', municipio_originario = '" . $_POST['municipio_originario'] . "', municipio_laboral = '" . $_POST['municipio_laboral'] . "', apellido_casada = '" . $_POST['apellido_casada'] . "', condicion_laboral = " . $_POST['condicion_laboral'] . ", codigo_ocupacion = '" . $_POST['codigo_ocupacion'] . "', tipo_plantilla = " . $_POST['tipo_plantilla'] . ", horas_laborales = " . $_POST['horas_laborales'] . ", ventas_economicas = '" . $_POST['ventas_economicas'] . "', temporal = '" . $_POST['temporal'] . "', telefono_celular = '" . $_POST['telefono_celular'] . "', telefono_emergencia = '" . $_POST['telefono_emergencia'] . "', nombre_emergencia = '" . $_POST['nombre_emergencia'] . "', edad = '" . $_POST['edad'] . "', emision_dpi = '" . $_POST['emision_dpi'] . "', edad_conyuge = '" . $_POST['edad_conyuge'] . "', ocupacion_conyuge = '" . $_POST['ocupacion_conyuge'] . "', nombre_padre = '" . $_POST['nombre_padre'] . "', edad_padre = '" . $_POST['edad_padre'] . "', ocupacion_padre = '" . $_POST['ocupacion_padre'] . "', nombre_madre = '" . $_POST['nombre_madre'] . "', edad_madre = '" . $_POST['edad_madre'] . "', ocupacion_madre = '" . $_POST['ocupacion_madre'] . "', nit = '" . $_POST['nit'] . "', departamento_laboral = '" . $_POST['departamento_laboral'] . "', apellido_casada_originario = '" . $_POST['apellido_casada_originario'] . "', tipo_cuenta = " . $_POST['tipo_cuenta'] . ", puesto = '" . $_POST['puesto'] . "', jubilacion = " . $_POST['jubilacion'] . ", discapacidad = '" . $_POST['discapacidad'] . "', jornada = " . $_POST['jornada'] . ", id_permisos = " . $_POST['id_permisos'] . ", titulo_diploma = '" . $_POST['titulos_diplomas'] . "', afiliacion = '" . $_POST['afiliacion_igss'] . "', dimension_3 = " . $_POST['dimension_3'] . ", dimension_4 = " . $_POST['dimension_4'] . ", dimension_5 = " . $_POST['dimension_5'] . " WHERE id = " . $_POST['id'] . "";
            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_departamento_centro') {

            $sql = "DELETE FROM departamento_centro WHERE id_departamento_centro = " . $_POST['id_depto_centro'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_centro_dimension3') {

            $sql = "DELETE FROM centro_dimension3 WHERE id = " . $_POST['id_centro_dimension3'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_dimesion3_dimension4') {

            $sql = "DELETE FROM dimension3_dimension_4 WHERE id = " . $_POST['id_dimension3_dimension4'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_dimesion4_dimension5') {

            $sql = "DELETE FROM dimension4_dimension5 WHERE id = " . $_POST['id_dimension4_dimension5'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_curso') {

            $sql = "UPDATE curso SET nombre='" . $_POST['nombre'] . "',lugar='" . $_POST['lugar'] . "',interno=" . $_POST['interno'] . ",ano='" . $_POST['ano'] . "',mes='" . $_POST['mes'] . "',diploma=" . $_POST['diploma'] . ",obligacion=" . $_POST['obligacion'] . ",ano_obligacion='" . $_POST['ano_obligacion'] . "',mes_obligacion='" . $_POST['mes_obligacion'] . "',reembolsar='" . $_POST['reembolsar'] . "',fecha_capacitacion='" . $_POST['fecha_capacitacion'] . "',codigo_curso='" . $_POST['codigo_curso'] . "',nombre_curso='" . $_POST['nombre_curso'] . "',induccion=" . $_POST['induccion'] . ",general=" . $_POST['general'] . ",funciones=" . $_POST['funciones'] . ",fecha_evaluacion='" . $_POST['fecha_evaluacion'] . "',nota='" . $_POST['nota'] . "' WHERE id =" . $_POST['id_curso'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_curso') {

            $sql = "DELETE from curso where id = " . $_POST['id_curso'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_puesto') {

            $sql = "UPDATE puesto SET fecha='" . $_POST['fecha'] . "',cod_depto='" . $_POST['cod_depto'] . "',departamento='" . $_POST['departamento'] . "',cod_puesto='" . $_POST['cod_puesto'] . "',puesto='" . $_POST['puesto'] . "',motivo='" . $_POST['motivo'] . "' WHERE id = " . $_POST['id_puesto'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_puesto') {

            $sql = "DELETE from puesto where id = " . $_POST['id_puesto'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_evento') {

            $observaciones = $con->real_escape_string($_POST["observaciones"]);

            $sql = "UPDATE evento SET tipo ='" . $_POST['tipo'] . "', numero ='" . $_POST['numero'] . "', fecha_inicio ='" . $_POST['fecha_inicio'] . "', fecha_final ='" . $_POST['fecha_final'] . "', año =" . $_POST['año'] . ", mes =" . $_POST['mes'] . ", dia =" . $_POST['dia'] . ", hora =" . $_POST['hora'] . ", minuto =" . $_POST['minuto'] . ", procesar ='" . $_POST['procesar'] . "', planilla ='" . $_POST['planilla'] . "', estado ='" . $_POST['estado'] . "', observaciones = '" . $observaciones . "' WHERE id = " . $_POST['id_evento'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_evento') {

            $sql = "DELETE from evento where id = " . $_POST['id_evento'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_record') {

            $descripcion = $con->real_escape_string($_POST["descripcion"]);

            $sql = "UPDATE record SET fecha = '" . $_POST['fecha'] . "', descripcion = '" . $descripcion . "', tipo = '" . $_POST['tipo'] . "'  WHERE id = " . $_POST['id_record'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_record') {

            $sql = "DELETE from record where id = " . $_POST['id_record'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_empresa_anterior') {

            $motivo = $con->real_escape_string($_POST["motivo"]);

            $sql = "UPDATE empresa_anterior SET nombre = '" . $_POST['nombre'] . "', direccion = '" . $_POST['direccion'] . "', motivo = '" . $motivo . "'  WHERE id = " . $_POST['id_empresa'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_empresa_anterior') {

            $sql = "DELETE from empresa_anterior where id = " . $_POST['id_empresa'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_vehiculo') {

            $sql = "UPDATE vehiculo SET marca = '" . $_POST['marca'] . "', modelo = '" . $_POST['modelo'] . "', placa = '" . $_POST['placa'] . "' WHERE id = " . $_POST['id_vehiculo'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_vehiculo') {

            $sql = "DELETE from vehiculo where id = " . $_POST['id_vehiculo'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_hijo') {

            $sql = "UPDATE hijo SET nombre = '" . $_POST['nombre'] . "', edad = '" . $_POST['edad'] . "' WHERE id = " . $_POST['id_hijo'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_empresa_empleado_db') {
            $id_empleado = $_SESSION["ultimo_id_empleado"];
            $sql = "INSERT INTO empresa_empleado(porcentaje, principal, id_empleado, id_empresa, activo, fecha) VALUES (" . $_POST['porcentaje'] . "," . $_POST['principal'] . "," . $id_empleado . "," . $_POST['id_empresa'] . ", 1, now())";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_empresa_empleado_db_editar') {
            $id_empleado = $_POST["id_empleado"];
            $sql = "INSERT INTO empresa_empleado(porcentaje, principal, id_empleado, id_empresa, activo, fecha) VALUES (" . $_POST['porcentaje'] . "," . $_POST['principal'] . "," . $id_empleado . "," . $_POST['id_empresa'] . ", 1, now())";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'inactivar_empresa_empleado_db') {
            $id_empleado = $_POST["id_empleado"];
            $sql = "UPDATE empresa_empleado SET activo = 0 WHERE id_empleado = " . $_POST['id_empleado'] . " ";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'editar_empresa_empleado_db') {
            $id_empleado = $_POST["id_empleado"];
            $sql = "UPDATE empresa_empleado SET porcentaje='" . $_POST['porcentaje'] . "',principal=" . $_POST['principal'] . ",id_empleado=" . $_POST['id_empleado'] . ",id_empresa=" . $_POST['id_empresa'] . ", fecha = now() WHERE id = " . $_POST['id'] . " ";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'eliminar_hijo') {

            $sql = "DELETE from hijo where id = " . $_POST['id_hijo'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_lote') {

            $sql = "INSERT INTO lote(nombre, id_estado, quincena, fecha) values('" . $_POST['nombre_lote'] . "', 1, " . $_POST['quincena'] . ", date(now()))";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                $ultimo_id_lote = mysqli_insert_id($con);
                $_SESSION["ultimo_id_lote"] = $ultimo_id_lote;
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'reiniciar_dias_laborados') {

            $sql = "UPDATE empleado set dias_laborados = 15 WHERE estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló ' . mysqli_error($con));
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_pago_lote') {
            $id_lote = $_SESSION["ultimo_id_lote"];

            $sql = "INSERT INTO pago_lote(id_empresa, id_empleado, bon_tot, bon_dec_tot, horas_dia, horas_noche, cantidad_horas_dia, cantidad_horas_noche, sueldo_quincenal, otros_ingresos, vacaciones, bonos, desc_variables, boleta_ornato, igss, isr, prestamo_empresa, otros_egresos, judiciales, seguro, parqueo, ingresos_tot, egresos_tot, liquido, total_reporte_bono, condicion_laboral, cheque, id_banco, no_cuenta, id_tipo_cuenta, id_lote, fecha_pago_lote, igss_patronal, intecap, irtra, dias_laborados, dias_bono, id_centro, id_departamento, puesto) VALUES (" . $_POST['id_empresa'] . "," . $_POST['id_empleado'] . ",'" . $_POST['bon_tot'] . "','" . $_POST['bon_dec_tot'] . "','" . $_POST['horas_dia'] . "','" . $_POST['horas_noche'] . "'," . $_POST['cantidad_horas_dia'] . "," . $_POST['cantidad_horas_noche'] . ",'" . $_POST['sueldo_quincenal'] . "','" . $_POST['otros_ingresos'] . "','" . $_POST['vacaciones'] . "','" . $_POST['bonos'] . "','" . $_POST['desc_variables'] . "','" . $_POST['boleta_ornato'] . "','" . $_POST['igss'] . "','" . $_POST['isr'] . "','" . $_POST['prestamo_empresa'] . "','" . $_POST['otros_egresos'] . "','" . $_POST['judiciales'] . "','" . $_POST['seguro'] . "','" . $_POST['parqueo'] . "','" . $_POST['ingresos_tot'] . "','" . $_POST['egresos_tot'] . "','" . $_POST['liquido'] . "','" . $_POST['total_reporte_bono'] . "'," . $_POST['condicion_laboral'] . "," . $_POST['cheque'] . "," . $_POST['id_banco'] . ",'" . $_POST['no_cuenta'] . "'," . $_POST['id_tipo_cuenta'] . "," . $_POST['id_lote'] . ",'" . $_POST['fecha_pago_lote'] . "','" . $_POST['igss_patronal'] . "','" . $_POST['intecap'] . "','" . $_POST['irtra'] . "'," . $_POST['dias_laborados'] . "," . $_POST['dias_bono'] . "," . $_POST['centro_costo'] . "," . $_POST['departamento'] . ",'" . $_POST['puesto'] . "')";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                $ultimo_id_pago_lote = mysqli_insert_id($con);
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_pago_lote_activo') {
            $id_lote = $_POST["id_lote"];

            $sql = "INSERT INTO pago_lote(id_empresa, id_empleado, bon_tot, bon_dec_tot, horas_dia, horas_noche, cantidad_horas_dia, cantidad_horas_noche, sueldo_quincenal, otros_ingresos, vacaciones, bonos, desc_variables, boleta_ornato, igss, isr, prestamo_empresa, otros_egresos, judiciales, seguro, parqueo, ingresos_tot, egresos_tot, liquido, total_reporte_bono, condicion_laboral, cheque, id_banco, no_cuenta, id_tipo_cuenta, id_lote, fecha_pago_lote, igss_patronal, intecap, irtra, dias_laborados, dias_bono, id_centro, id_departamento, puesto) VALUES (" . $_POST['id_empresa'] . "," . $_POST['id_empleado'] . ",'" . $_POST['bon_tot'] . "','" . $_POST['bon_dec_tot'] . "','" . $_POST['horas_dia'] . "','" . $_POST['horas_noche'] . "'," . $_POST['cantidad_horas_dia'] . "," . $_POST['cantidad_horas_noche'] . ",'" . $_POST['sueldo_quincenal'] . "','" . $_POST['otros_ingresos'] . "','" . $_POST['vacaciones'] . "','" . $_POST['bonos'] . "','" . $_POST['desc_variables'] . "','" . $_POST['boleta_ornato'] . "','" . $_POST['igss'] . "','" . $_POST['isr'] . "','" . $_POST['prestamo_empresa'] . "','" . $_POST['otros_egresos'] . "','" . $_POST['judiciales'] . "','" . $_POST['seguro'] . "','" . $_POST['parqueo'] . "','" . $_POST['ingresos_tot'] . "','" . $_POST['egresos_tot'] . "','" . $_POST['liquido'] . "','" . $_POST['total_reporte_bono'] . "'," . $_POST['condicion_laboral'] . "," . $_POST['cheque'] . "," . $_POST['id_banco'] . ",'" . $_POST['no_cuenta'] . "'," . $_POST['id_tipo_cuenta'] . "," . $_POST['id_lote'] . ",'" . $_POST['fecha_pago_lote'] . "','" . $_POST['igss_patronal'] . "','" . $_POST['intecap'] . "','" . $_POST['irtra'] . "'," . $_POST['dias_laborados'] . "," . $_POST['dias_bono'] . "," . $_POST['centro_costo'] . "," . $_POST['departamento'] . ",'" . $_POST['puesto'] . "')";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                $ultimo_id_pago_lote = mysqli_insert_id($con);
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'actualizar_pago_lote') {
            $id_lote = $_POST["id_lote"];

            $sql = "UPDATE pago_lote SET id_centro=" . $_POST['centro_costo'] . ", id_departamento = " . $_POST['departamento'] . ", puesto = '" . $_POST['puesto'] . "', id_empresa=" . $_POST['id_empresa'] . ",bon_tot='" . $_POST['bon_tot'] . "',bon_dec_tot='" . $_POST['bon_dec_tot'] . "',horas_dia='" . $_POST['horas_dia'] . "',horas_noche='" . $_POST['horas_noche'] . "',cantidad_horas_dia=" . $_POST['cantidad_horas_dia'] . ",cantidad_horas_noche=" . $_POST['cantidad_horas_noche'] . ",sueldo_quincenal='" . $_POST['sueldo_quincenal'] . "',otros_ingresos='" . $_POST['otros_ingresos'] . "',vacaciones='" . $_POST['vacaciones'] . "',bonos='" . $_POST['bonos'] . "',desc_variables='" . $_POST['desc_variables'] . "',boleta_ornato='" . $_POST['boleta_ornato'] . "',igss='" . $_POST['igss'] . "',isr='" . $_POST['isr'] . "',otros_egresos='" . $_POST['otros_egresos'] . "',judiciales='" . $_POST['judiciales'] . "',seguro='" . $_POST['seguro'] . "',parqueo='" . $_POST['parqueo'] . "',ingresos_tot='" . $_POST['ingresos_tot'] . "',egresos_tot='" . $_POST['egresos_tot'] . "',liquido='" . $_POST['liquido'] . "',total_reporte_bono='" . $_POST['total_reporte_bono'] . "',condicion_laboral=" . $_POST['condicion_laboral'] . ",cheque=" . $_POST['cheque'] . ",id_banco=" . $_POST['id_banco'] . ",no_cuenta='" . $_POST['no_cuenta'] . "',id_tipo_cuenta=" . $_POST['id_tipo_cuenta'] . ",igss_patronal='" . $_POST['igss_patronal'] . "',intecap='" . $_POST['intecap'] . "',irtra='" . $_POST['irtra'] . "',dias_laborados=" . $_POST['dias_laborados'] . ", dias_bono =" . $_POST['dias_bono'] . " WHERE id_empleado = " . $_POST['id_empleado'] . " and id_lote = " . $id_lote . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                $ultimo_id_pago_lote = mysqli_insert_id($con);
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_detalle_pago_lote') {

            $sql = "INSERT INTO detalle_pago_lote(nombre_empleado, puesto_empleado, empresa_empleado, concepto, liquido, bon_37_2001, bon_productiva, bon_incentivo, comisiones, horas_extras_dobles, horas_extras, sueldo_ordinario, otros_ingresos, total_igss, vacaciones, anticipo_quincenal, bantrab, boleto_ornato, cafeteria, celular, igss_laboral, igss_patronal, isr, otros_egresos, prestamo_empresa, id_pago_lote) VALUES ('" . $_POST['nombre_empleado'] . "','" . $_POST['puesto_empleado'] . "','" . $_POST['empresa_empleado'] . "','" . $_POST['concepto'] . "'," . $_POST['liquido'] . "," . $_POST['bon_37_2001'] . "," . $_POST['bon_productiva'] . "," . $_POST['bon_incentivo'] . "," . $_POST['comisiones'] . "," . $_POST['horas_extras_dobles'] . "," . $_POST['horas_extras'] . "," . $_POST['sueldo_ordinario'] . "," . $_POST['otros_ingresos'] . "," . $_POST['total_igss'] . "," . $_POST['vacaciones'] . "," . $_POST['anticipo_quincenal'] . "," . $_POST['bantrab'] . "," . $_POST['boleto_ornato'] . "," . $_POST['cafeteria'] . "," . $_POST['celular'] . "," . $_POST['igss_laboral'] . "," . $_POST['igss_patronal'] . "," . $_POST['isr'] . "," . $_POST['otros_egresos'] . "," . $_POST['prestamo_empresa'] . "," . $_POST['id_pago_lote'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_bono_pago_lote') {

            $sql = "INSERT INTO bonos_pago_lote(id_bono, id_pago_lote) values(" . $_POST['id_bono'] . ", " . $_POST['id_pago_lote'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_descuento') {

            $tipo_egreso = $con->real_escape_string($_POST["egreso"]);
            $monto_total = $con->real_escape_string($_POST["monto_total"]);
            $cuotas = $con->real_escape_string($_POST["cuotas"]);
            $faltan = $con->real_escape_string($_POST["cuotas"]);
            $id_empleado = $_POST["id_empleado"];
            $estado = $_POST["estado"];
            $seleccionado = $_POST["seleccionado"];

            $mysqli = "INSERT INTO `descuento_variable`( `tipo_egreso`, `monto_total`, `cuotas`, `faltan`, `fecha_generado`, `id_empleado`, `estado`, `seleccionado` ) 
                VALUES('$tipo_egreso', $monto_total, $cuotas, $faltan, NOW(), $id_empleado, $estado, $seleccionado)";

            $result = mysqli_query($con, $mysqli);

            if (!$result) {
                echo 'No funciono, query: ' + $mysqli;
            }

            echo 'Successfuly';
        }

        if ($_POST["quest"] == 'cambiar_estado_bonos') {

            $sql = "UPDATE bono set id_estado = 4 where id in(" . $_POST['bonos_confirmados'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'cambiar_seleccionado') {
            $id = $con->real_escape_string($_POST["id"]);
            $seleccionado = $_POST["nuevo_seleccionado"];

            $mysqli = "UPDATE descuento_variable SET seleccionado = $seleccionado WHERE id = $id";

            $result = mysqli_query($con, $mysqli);

            if (!$result) {
                echo 'No funciono, query: ' + $mysqli;
            }

            echo 'Successfuly';
        }

        if ($_POST["quest"] == 'confirmar_bono') {

            $sql = "UPDATE bono set seleccionado = 1 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'desaprobar_bono') {

            $sql = "UPDATE bono set seleccionado = 0 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'anular_bono') {

            $sql = "UPDATE bono set id_estado = 3 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'confirmar_dia') {

            $sql = "UPDATE dias_laborados set seleccionado = 1 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'desaprobar_dia') {

            $sql = "UPDATE dias_laborados set seleccionado = 0 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'confirmar_descuento') {

            $sql = "UPDATE descuento_variable set seleccionado = 1 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'desaprobar_descuento') {

            $sql = "UPDATE descuento_variable set seleccionado = 0 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'confirmar_hora_extra') {

            $sql = "UPDATE horas_extra set seleccionado = 1 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'desaprobar_hora_extra') {

            $sql = "UPDATE horas_extra set seleccionado = 0 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'anular_hora_extra') {

            $sql = "UPDATE horas_extra set estado = 3 where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'actualizar_igss_empleado') {

            $sql = "UPDATE empleado set igss_laboral = (SELECT ( ( (e.sueldo_ordinario / 30) * e.dias_laborados ) + COALESCE( ( SELECT SUM(monto) FROM horas_extra WHERE estado = 2 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + e.otro_ingresos ) * 0.0483 FROM empleado e where e.id = " . $_POST['id'] . ") where id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_igss_empleado') {

            $id_empleado = $_SESSION['ultimo_id_empleado'];

            $sql = "UPDATE empleado set igss_laboral = (SELECT ( ( (e.sueldo_ordinario / 30) * e.dias_laborados ) + COALESCE( ( SELECT SUM(monto) FROM horas_extra WHERE estado = 2 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + e.otro_ingresos ) * 0.0483 FROM empleado e where e.id = " . $id_empleado . ") where id = " . $id_empleado . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_igss_empleado_detalle') {

            $id_empleado = $_POST['id_empleado'];

            $sql = "UPDATE empleado set igss_laboral = (SELECT ( ( (e.sueldo_ordinario / 30) * e.dias_laborados ) + COALESCE( ( SELECT SUM(monto) FROM horas_extra WHERE estado = 2 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + e.otro_ingresos ) * 0.0483 FROM empleado e where e.id = " . $id_empleado . ") where id = " . $id_empleado . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'actualizar_historial_empleado') {

            $sql = "UPDATE historial_empleado set id_usuario = " . $_POST['id_usuario'] . " WHERE id in(" . $_POST['listado_id'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_igss_patronal') {

            $id_empleado = $_SESSION['ultimo_id_empleado'];

            $sql = "UPDATE empleado set igss_patronal = (SELECT ( ( (e.sueldo_ordinario / 30) * e.dias_laborados ) + COALESCE( ( SELECT SUM(monto) FROM horas_extra WHERE estado = 2 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + e.otro_ingresos ) * 0.1267 FROM empleado e where e.id = " . $id_empleado . ") where id = " . $id_empleado . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_igss_patronal_detalle') {

            $id_empleado = $_POST['id_empleado'];

            $sql = "UPDATE empleado set igss_patronal = (SELECT ( ( (e.sueldo_ordinario / 30) * e.dias_laborados ) + COALESCE( ( SELECT SUM(monto) FROM horas_extra WHERE estado = 2 AND seleccionado = 1 AND id_empleado = e.id ), 0 ) + e.otro_ingresos ) * 0.1267 FROM empleado e where e.id = " . $id_empleado . ") where id = " . $id_empleado . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'guardar_isr') {

            $sql = "UPDATE empleado set isr = " . $_POST['isr'] . " WHERE id = " . $_POST['id'] . "";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_empresa_empleado') {

            $sql = "INSERT INTO empresa_empleado(porcentaje, principal, id_empleado, id_empresa, activo, fecha) values ('" . $_POST['porcentaje'] . "'," . $_POST['principal'] . "," . $_POST['id_empleado'] . "," . $_POST['id_empresa'] . ", 1, now())";

            $result = mysqli_query($con, $sql);

            if (!$result) {

                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_dias_laborados') {

            $observaciones = mysqli_real_escape_string($con, $_POST['observaciones']);

            $sql = "INSERT INTO dias_laborados(descuento_dias, faltan, faltan_quincena, fecha_descuento, fecha_final, fecha_generado, septimo, observaciones, id_incidencia, id_empleado) VALUES (" . $_POST['descuento_dias'] . "," . $_POST['descuento_dias'] . "," . $_POST['faltan_quincena'] . ",'" . $_POST['fecha_descuento'] . "','" . $_POST['fecha_final'] . "',now(), " . $_POST['septimo'] . ", '" . $observaciones . "', " . $_POST['id_incidencia'] . ", " . $_POST['id_empleado'] . ")";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'restar_dias_laborados') {

            $sql = "UPDATE dias_laborados set faltan = CASE WHEN faltan_quincena > 0 THEN faltan - faltan_quincena WHEN faltan_quincena = 0 AND faltan >= 15 THEN faltan - 15 WHEN faltan_quincena = 0 AND faltan < 15 THEN faltan - faltan END, faltan_quincena = 0";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_pago_real') {

            $sql = "INSERT INTO pago_real( id_empleado, salario, bono, cantidad_simple, horas_simple, cantidad_doble, horas_doble, cuota_patronal, total, id_empresa, porcentaje, principal, id_pago_lote ) SELECT e.id id_empleado, ( ROUND( (e.sueldo_ordinario / 30) * e.dias_laborados *(ee.porcentaje / 100), 2 ) ) AS salario, ( ROUND( ( ( ( ( e.bon_dec_37_2001 + e.bon_incentivo ) / 30 ) * e.dias_laborados ) *(ee.porcentaje / 100) ), 2 ) + COALESCE( ( SELECT SUM(b.monto) FROM bono b WHERE b.id_estado = 2 AND b.seleccionado = 1 AND b.id_empleado = e.id AND b.empresa_trabajo = emp.id ), 0 ) ) bono, ( COALESCE( ( SELECT SUM(h0.horas) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 0 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) cantidad_simples, ( COALESCE( ( SELECT SUM(h0.monto) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 0 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) horas_simples, ( COALESCE( ( SELECT SUM(h0.horas) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 1 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) cantidad_dobles, ( COALESCE( ( SELECT SUM(h0.monto) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 1 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) horas_dobles, ( ( ( ROUND( (e.sueldo_ordinario / 30) * e.dias_laborados *(ee.porcentaje / 100), 2 ) ) +( COALESCE( ( SELECT SUM(h0.monto) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 0 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) +( COALESCE( ( SELECT SUM(h0.monto) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 1 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) ) * 0.1267 ) cuota_patronal, ( ( ROUND( (e.sueldo_ordinario / 30) * e.dias_laborados *(ee.porcentaje / 100), 2 ) ) +( ROUND( ( ( ( ( e.bon_dec_37_2001 + e.bon_incentivo ) / 30 ) * e.dias_laborados ) *(ee.porcentaje / 100) ), 2 ) + COALESCE( ( SELECT SUM(b.monto) FROM bono b WHERE b.id_estado = 2 AND b.seleccionado = 1 AND b.id_empleado = e.id AND b.empresa_trabajo = emp.id ), 0 ) ) +( COALESCE( ( SELECT SUM(h0.monto) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 0 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) +( COALESCE( ( SELECT SUM(h0.monto) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 1 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) +( ( ( ROUND( (e.sueldo_ordinario / 30) * e.dias_laborados *(ee.porcentaje / 100), 2 ) ) +( COALESCE( ( SELECT SUM(h0.monto) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 0 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) +( COALESCE( ( SELECT SUM(h0.monto) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 1 AND h0.id_empleado = e.id AND h0.empresa_labor = emp.id ), 0 ) ) ) * 0.1267 ) ) AS total, emp.id id_empresa, ee.porcentaje, ee.principal, pl.id pago_lote FROM empleado e INNER JOIN empresa_empleado ee ON ee.id_empleado = e.id INNER JOIN empresa emp ON emp.id = ee.id_empresa INNER JOIN pago_lote pl ON pl.id_empleado = e.id INNER JOIN lote l ON pl.id_lote = l.id AND l.id_estado = 1 WHERE e.estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_pago_contable') {

            $sql = "INSERT INTO pago_contable( id_empleado, salario, bono, cantidad_simple, horas_simple, cantidad_doble, horas_doble, cuota_patronal, total, id_empresa, id_pago_lote ) SELECT em.id id_empleado, COALESCE(calculos.sueldo_quincenal, 0) salario, COALESCE(calculos.bono, 0) bono, COALESCE(calculos.cantidad_simples, 0) cantidad_simples, COALESCE(calculos.horas_simples, 0) horas_simples, COALESCE(calculos.cantidad_dobles, 0) cantidad_dobles, COALESCE(calculos.horas_dobles, 0) horas_dobles, COALESCE(calculos.cuota_patronal, 0) cuota_patronal, ( COALESCE( ( calculos.sueldo_quincenal + calculos.bono + calculos.horas_simples + calculos.horas_dobles + calculos.cuota_patronal ), 0 ) ) total, calculos.id_empresa, COALESCE(calculos.id_pago_lote, 0) id_pago_lote FROM empleado em LEFT JOIN( SELECT em.id, ( (em.sueldo_ordinario / 30) * em.dias_laborados ) sueldo_quincenal, COALESCE( ( ( ( em.bon_dec_37_2001 + em.bon_incentivo ) / 30 ) * em.dias_laborados ) + COALESCE( ( SELECT SUM(b.monto) FROM bono b WHERE b.id_estado = 2 AND b.seleccionado = 1 AND b.id_empleado = em.id ), 0 ), 0 ) bono, COALESCE( ( SELECT SUM(b.monto) FROM bono b WHERE b.id_estado = 2 AND b.seleccionado = 1 AND b.id_empleado = em.id ), 0 ) tabla_bonos, COALESCE( ( SELECT SUM(h0.horas) FROM horas_extra h0 WHERE h0.seleccionado = 1 AND h0.estado = 2 AND h0.jornada = 0 AND h0.id_empleado = em.id ), 0 ) cantidad_simples, COALESCE( ( SELECT SUM(h1.monto) FROM horas_extra h1 WHERE h1.seleccionado = 1 AND h1.estado = 2 AND h1.jornada = 0 AND h1.id_empleado = em.id ), 0 ) horas_simples, COALESCE( ( SELECT SUM(h2.horas) FROM horas_extra h2 WHERE h2.seleccionado = 1 AND h2.estado = 2 AND h2.jornada = 1 AND h2.id_empleado = em.id ), 0 ) cantidad_dobles, COALESCE( ( SELECT SUM(h3.monto) FROM horas_extra h3 WHERE h3.seleccionado = 1 AND h3.estado = 2 AND h3.jornada = 1 AND h3.id_empleado = em.id ), 0 ) horas_dobles, ( COALESCE( ( ( (em.sueldo_ordinario / 30) * em.dias_laborados + COALESCE( ( SELECT SUM(h4.monto) FROM horas_extra h4 WHERE h4.seleccionado = 1 AND h4.estado = 2 AND h4.jornada = 0 AND h4.id_empleado = em.id ), 0 ) + COALESCE( ( SELECT SUM(h5.monto) FROM horas_extra h5 WHERE h5.seleccionado = 1 AND h5.estado = 2 AND h5.jornada = 1 AND h5.id_empleado = em.id ), 0 ) ) * 0.1267 ), 0 ) ) cuota_patronal, COALESCE(pl.id, 0) id_pago_lote, ee.id_empresa, eps.nombre_comercial empresa, l.id lote FROM empleado em LEFT JOIN pago_lote pl ON pl.id_empleado = em.id LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empresa_empleado ee ON ee.id_empleado = em.id AND ee.principal = 1 LEFT JOIN empresa eps ON eps.id = ee.id_empresa WHERE l.id = " . $_POST['id_lote'] . " GROUP BY em.id ) calculos ON em.id = calculos.id WHERE em.estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_bonos_pago_lote') {

            $sql = "INSERT INTO bonos_pago_lote(id_bono, id_pago_lote) SELECT b.id, " . $_POST['id_lote'] . " from bono b WHERE b.id_estado = 2 and b.seleccionado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'pagar_bonos') {

            $sql = "UPDATE bono set id_estado = 4, seleccionado = 0 WHERE id_estado = 2 and seleccionado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_horas_extra_lote') {

            $sql = "INSERT INTO horas_extra_lote(id_hora_extra, id_pago_lote) SELECT h.id, " . $_POST['id_lote'] . " from horas_extra h WHERE h.estado = 2 and h.seleccionado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'pagar_horas_extra') {

            $sql = "UPDATE horas_extra set estado = 4, seleccionado = 0 WHERE estado = 2 and seleccionado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_descuento_lote') {

            $sql = "INSERT INTO descuento_lote(id_descuento, id_pago_lote) SELECT d.id, " . $_POST['id_lote'] . " from descuento_variable d WHERE d.estado = 1 and d.seleccionado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'cerrar_descuentos_variables') {

            $sql = "UPDATE descuento_variable set faltan = (faltan - 1), estado = CASE WHEN faltan >= 1 THEN 1 ELSE 0 END, seleccionado = CASE WHEN faltan >= 1 THEN 1 ELSE 0 END WHERE estado = 1 AND seleccionado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'cerrar_nomina') {

            $sql = "UPDATE lote set id_estado = 2 WHERE id_estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'pagar_otros_ingresos_empleado') {

            $sql = "UPDATE empleado set otro_ingresos = 0 WHERE otro_ingresos > 0 and estado = 1";

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_bonos') {

            $sql = $_POST["query"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
                // echo $sql;
            }
        }

        if ($_POST["quest"] == 'update_bono') {

            $result = mysqli_query($con, $_POST["query"]);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }

        if ($_POST["quest"] == 'ingresar_aguinaldos') {

            $sql = $_POST["query"];

            $result = mysqli_query($con, $sql);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
                // echo $sql;
            }
        }

        if ($_POST["quest"] == 'update_aguinaldo') {

            $result = mysqli_query($con, $_POST["query"]);

            if (!$result) {
                echo $sql;
                die('Query Falló');
            } else {
                echo 'Successfully';
            }
        }
    }
}