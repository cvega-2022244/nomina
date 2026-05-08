import os

filepath = 'c:\\xampp\\htdocs\\nomina\\app\\php\\servidor.php'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_idx(search):
    for i, line in enumerate(lines):
        if search in line:
            return i
    return -1

start1 = find_idx("if ($_GET[\"quest\"] == 'listado_pagos_historial') {")
end1 = find_idx("if ($_GET[\"quest\"] == 'listado_empresas_pagos') {")

start2 = find_idx("if ($_GET[\"quest\"] == 'listado_pagos') {")
end2 = find_idx("if ($_GET[\"quest\"] == 'detalle_pago') {")

start3 = find_idx("if ($_POST[\"quest\"] == 'agregar_empresa') {")

print(f"Indices: {start1} to {end1}, {start2} to {end2}, {start3}")

# We will remove from start2 to end2-1
# Then we will remove from start1 to end1-1
# Then we will add the new post endpoints at start3

if all(x != -1 for x in [start1, end1, start2, end2, start3]):
    
    # NEW $_GET listado_empresas_historial
    empresas_historial = """        if ($_GET["quest"] == 'listado_empresas_historial') {
            $sql = "SELECT DISTINCT e.id, e.nombre_comercial as nombre FROM pago_lote pl INNER JOIN empresa e ON pl.id_empresa = e.id WHERE pl.id_lote = " . $_GET['id_lote'];
            $result = mysqli_query($con, $sql);
            if (!$result) {
                echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
                exit;
            }
            if (mysqli_num_rows($result) > 0) {
                $json = array();
                while ($row = mysqli_fetch_array($result)) {
                    $json[] = array('id' => $row["id"], 'nombre' => $row["nombre"]);
                }
                echo json_encode($json);
            } else {
                echo 'No hay datos';
            }
            exit;
        }

"""

    # NEW $_POST listado_pagos
    listado_pagos = """        if ($_POST["quest"] == 'listado_pagos') {
            $q_act = mysqli_query($con, "SELECT id, quincena FROM lote WHERE id_estado = 1 ORDER BY id DESC LIMIT 1");
            $l_act = mysqli_fetch_all($q_act, MYSQLI_ASSOC);
            $id_l_act = $l_act ? $l_act[0]['id'] : 0;
            $quin_act = $l_act ? $l_act[0]['quincena'] : 0;

            $id_l_ant = 0;
            if ($quin_act == 1) {
                $q_ant = mysqli_query($con, "SELECT id FROM lote WHERE quincena = 0 AND id < $id_l_act ORDER BY id DESC LIMIT 1");
                $l_ant = mysqli_fetch_all($q_ant, MYSQLI_ASSOC);
                $id_l_ant = $l_ant ? $l_ant[0]['id'] : 0;
            }

            $id_empresa = intval($_POST['id_empresa']);
            $centros = isset($_POST['centros']) && is_array($_POST['centros']) ? $_POST['centros'] : [];
            $departamentos = isset($_POST['departamentos']) && is_array($_POST['departamentos']) ? $_POST['departamentos'] : [];

            $sql = "SELECT e.id AS id_empleado, tp.nombre tipo_pago, bnc.nombre banco, e.no_cuenta no_cuenta, tc.nombre tipo_cuenta, cl.nombre condicion_laboral, 
                CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.primer_apellido, e.segundo_apellido) AS nombre_empleado, 
                emp.nombre_comercial AS empresa, cc.nombre AS centro_costo, d.nombre AS departamento, e.puesto AS puesto,
                CASE WHEN pl.id IS NULL THEN ROUND( (e.sueldo_ordinario / 30) * (CASE WHEN $quin_act = 0 THEN 15 ELSE 30 END), 2 ) ELSE (CASE WHEN $quin_act = 0 THEN COALESCE(pl.sueldo_quincenal, 0) ELSE COALESCE(pl.sueldo_quincenal, 0) + COALESCE(pla.sueldo_quincenal, 0) END) END AS salario_ordinario,
                CASE WHEN pl.id IS NULL THEN ROUND((ROUND( (e.sueldo_ordinario / 30) * (CASE WHEN $quin_act = 0 THEN 15 ELSE 30 END), 2 ) + COALESCE(e.bon_incentivo, 0) + COALESCE(e.bon_dec_37_2001, 0)) / 2, 2) ELSE (CASE WHEN $quin_act = 0 THEN COALESCE(pl.liquido, 0) ELSE COALESCE(pla.liquido, 0) END) END AS liquido_primer_quincena,
                CASE WHEN pl.id IS NULL THEN (CASE WHEN $quin_act = 0 THEN 0 ELSE (ROUND( (e.sueldo_ordinario / 30) * 30, 2 ) + COALESCE(e.bon_incentivo, 0) + COALESCE(e.bon_dec_37_2001, 0)) - ROUND((ROUND( (e.sueldo_ordinario / 30) * 30, 2 ) + COALESCE(e.bon_incentivo, 0) + COALESCE(e.bon_dec_37_2001, 0)) / 2, 2) END) ELSE (CASE WHEN $quin_act = 0 THEN 0 ELSE COALESCE(pl.liquido, 0) END) END AS liquido_segunda_quincena,
                CASE WHEN pl.id IS NULL THEN ROUND( (e.sueldo_ordinario / 30) * (CASE WHEN $quin_act = 0 THEN 15 ELSE 30 END), 2 ) + COALESCE(e.bon_incentivo, 0) + COALESCE(e.bon_dec_37_2001, 0) ELSE (CASE WHEN $quin_act = 0 THEN COALESCE(pl.liquido, 0) ELSE COALESCE(pl.liquido, 0) + COALESCE(pla.liquido, 0) END) END AS liquido_recibir,
                COALESCE(pl.id, e.id) AS correlativo,
                CASE WHEN pl.id IS NULL THEN (CASE WHEN $quin_act = 0 THEN 15 ELSE 30 END) ELSE (CASE WHEN $quin_act = 0 THEN COALESCE(pl.dias_laborados, 15) ELSE COALESCE(pl.dias_laborados, 0) + COALESCE(pla.dias_laborados, 0) END) END AS dias_laborados,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.bon_tot, 0) ELSE COALESCE(pl.bon_tot, 0) + COALESCE(pla.bon_tot, 0) END AS bon_incentivo,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.bon_dec_tot, 0) ELSE COALESCE(pl.bon_dec_tot, 0) + COALESCE(pla.bon_dec_tot, 0) END AS bon_decreto,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.bonos, 0) ELSE COALESCE(pl.bonos, 0) + COALESCE(pla.bonos, 0) END AS bonos,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.sueldo_quincenal, 0) + COALESCE(pl.bon_tot, 0) + COALESCE(pl.bon_dec_tot, 0) + COALESCE(pl.bonos, 0) ELSE (COALESCE(pl.sueldo_quincenal, 0) + COALESCE(pla.sueldo_quincenal, 0)) + (COALESCE(pl.bon_tot, 0) + COALESCE(pla.bon_tot, 0)) + (COALESCE(pl.bon_dec_tot, 0) + COALESCE(pla.bon_dec_tot, 0)) + (COALESCE(pl.bonos, 0) + COALESCE(pla.bonos, 0)) END AS total_devengado,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.cantidad_horas_dia, 0) ELSE COALESCE(pl.cantidad_horas_dia, 0) + COALESCE(pla.cantidad_horas_dia, 0) END AS horas_simples,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.horas_dia, 0) ELSE COALESCE(pl.horas_dia, 0) + COALESCE(pla.horas_dia, 0) END AS valor_horas_simples,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.cantidad_horas_noche, 0) ELSE COALESCE(pl.cantidad_horas_noche, 0) + COALESCE(pla.cantidad_horas_noche, 0) END AS horas_dobles,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.horas_noche, 0) ELSE COALESCE(pl.horas_noche, 0) + COALESCE(pla.horas_noche, 0) END AS valor_horas_dobles,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.otros_ingresos, 0) ELSE COALESCE(pl.otros_ingresos, 0) + COALESCE(pla.otros_ingresos, 0) END AS otros_ingresos,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.ingresos_tot, 0) ELSE COALESCE(pl.ingresos_tot, 0) + COALESCE(pla.ingresos_tot, 0) END AS salario_total,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.igss, 0) ELSE COALESCE(pl.igss, 0) + COALESCE(pla.igss, 0) END AS igss,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.isr, 0) ELSE COALESCE(pl.isr, 0) + COALESCE(pla.isr, 0) END AS isr,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.desc_variables, 0) ELSE COALESCE(pl.desc_variables, 0) + COALESCE(pla.desc_variables, 0) END AS cafeteria,
                0 AS celular, 0 AS uniforme, 0 AS calzado, 0 AS equipo, 0 AS producto, 0 AS bancos, 0 AS otros,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.boleta_ornato, 0) ELSE COALESCE(pl.boleta_ornato, 0) + COALESCE(pla.boleta_ornato, 0) END AS boleta_ornato,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.otros_egresos, 0) ELSE COALESCE(pl.otros_egresos, 0) + COALESCE(pla.otros_egresos, 0) END AS otros_egresos,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.judiciales, 0) ELSE COALESCE(pl.judiciales, 0) + COALESCE(pla.judiciales, 0) END AS judiciales,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.seguro, 0) ELSE COALESCE(pl.seguro, 0) + COALESCE(pla.seguro, 0) END AS seguro,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.parqueo, 0) ELSE COALESCE(pl.parqueo, 0) + COALESCE(pla.parqueo, 0) END AS parqueo,
                CASE WHEN $quin_act = 0 THEN COALESCE(pl.egresos_tot, 0) ELSE COALESCE(pl.egresos_tot, 0) + COALESCE(pla.egresos_tot, 0) END AS total_egresos
                FROM empleado e 
                INNER JOIN empresa_empleado ee ON ee.id_empleado = e.id AND ee.activo = 1 AND ee.principal = 1 
                INNER JOIN empresa emp ON emp.id = ee.id_empresa 
                LEFT JOIN pago_lote pl ON pl.id_empleado = e.id AND pl.id_lote = $id_l_act
                LEFT JOIN pago_lote pla ON pla.id_empleado = e.id AND pla.id_lote = $id_l_ant
                LEFT JOIN centro_costo cc ON cc.id = e.centro_de_costo 
                LEFT JOIN departamento_centro dc ON dc.id_centro = cc.id 
                LEFT JOIN departamento d ON d.id = dc.id_departamento 
                LEFT JOIN tipo_pago tp ON tp.id = COALESCE(pl.cheque, e.tipo_de_pago) 
                LEFT JOIN banco bnc ON bnc.id = COALESCE(pl.id_banco, e.banco) 
                LEFT JOIN tipo_cuenta tc ON tc.id = COALESCE(pl.id_tipo_cuenta, e.tipo_cuenta) 
                LEFT JOIN condicion_laboral cl ON cl.id = e.condicion_laboral 
                WHERE e.estado = 1 AND emp.id = " . $id_empresa;

            if (!empty($centros)) {
                $centros_str = implode(',', array_map('intval', $centros));
                $sql .= " AND e.centro_de_costo IN ($centros_str) ";
            }
            if (!empty($departamentos)) {
                $dept_str = implode(',', array_map('intval', $departamentos));
                $sql .= " AND dc.id_departamento IN ($dept_str) ";
            }

            $sql .= " GROUP BY e.id";

            $result = mysqli_query($con, $sql);
            if (!$result) {
                echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
                exit;
            }
            $json = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $json[] = $row;
            }
            if(count($json) > 0) {
                echo json_encode($json);
            } else {
                echo 'No hay datos';
            }
            exit;
        }

"""

    # NEW $_POST listado_pagos_historial
    listado_pagos_historial = """        if ($_POST["quest"] == 'listado_pagos_historial') {
            $id_lote = intval($_POST['id_lote']);
            $id_empresa_fallback = intval($_POST['id_empresa']);
            $empresas = isset($_POST['empresas']) && is_array($_POST['empresas']) ? $_POST['empresas'] : [];
            $centros = isset($_POST['centros']) && is_array($_POST['centros']) ? $_POST['centros'] : [];
            $departamentos = isset($_POST['departamentos']) && is_array($_POST['departamentos']) ? $_POST['departamentos'] : [];

            $sql = "SELECT pl.id correlativo, pl.id_empleado id_empleado, pl.id_lote id_lote, CONCAT_WS( ' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada ) empleado, emp.nombre_comercial, cc.nombre centro_costo, d.nombre departamento, pl.puesto puesto, CASE WHEN l.quincena = 0 THEN pl.dias_laborados ELSE( pl.dias_laborados + COALESCE(pla.dias_laborados, 0) ) END dias_laborados, CASE WHEN l.quincena = 0 THEN pl.sueldo_quincenal ELSE( pl.sueldo_quincenal + COALESCE(pla.sueldo_quincenal, 0) ) END salario_ordinario, CASE WHEN l.quincena = 0 THEN pl.bon_tot ELSE( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) END bon_incentivo, CASE WHEN l.quincena = 0 THEN pl.bon_dec_tot ELSE( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) END bon_decreto, CASE WHEN l.quincena = 0 THEN pl.bonos ELSE( pl.bonos + COALESCE(pla.bonos, 0) ) END bonos, CASE WHEN l.quincena = 0 THEN( pl.sueldo_quincenal + pl.bon_tot + pl.bon_dec_tot + pl.bonos ) ELSE( ( pl.sueldo_quincenal + COALESCE(pla.sueldo_quincenal, 0) ) +( pl.bon_tot + COALESCE(pla.bon_tot, 0) ) +( pl.bon_dec_tot + COALESCE(pla.bon_dec_tot, 0) ) +( pl.bonos + COALESCE(pla.bonos, 0) ) ) END total_devengado, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_dia ELSE pl.cantidad_horas_dia + COALESCE(pla.cantidad_horas_dia, 0) END horas_simples, CASE WHEN l.quincena = 0 THEN pl.horas_dia ELSE pl.horas_dia + COALESCE(pla.horas_dia, 0) END valor_horas_simples, CASE WHEN l.quincena = 0 THEN pl.cantidad_horas_noche ELSE pl.cantidad_horas_noche + COALESCE(pla.cantidad_horas_noche, 0) END horas_dobles, CASE WHEN l.quincena = 0 THEN pl.horas_noche ELSE pl.horas_noche + COALESCE(pla.horas_noche, 0) END valor_horas_dobles, CASE WHEN l.quincena = 0 THEN pl.otros_ingresos ELSE pl.otros_ingresos + COALESCE(pla.otros_ingresos, 0) END otros_ingresos, CASE WHEN l.quincena = 0 THEN pl.ingresos_tot ELSE pl.ingresos_tot + COALESCE(pla.ingresos_tot, 0) END salario_total, CASE WHEN l.quincena = 0 THEN pl.vacaciones ELSE pl.vacaciones + COALESCE(pla.vacaciones, 0) END vacaciones, tp.nombre tipo_pago, tc.nombre tipo_cuenta, pl.no_cuenta no_cuenta, bnc.nombre banco, cl.nombre condicion_laboral, CASE WHEN l.quincena = 0 THEN pl.igss ELSE pl.igss + COALESCE(pla.igss, 0) END igss, CASE WHEN l.quincena = 0 THEN pl.isr ELSE pl.isr + COALESCE(pla.isr, 0) END isr, CASE WHEN l.quincena = 0 THEN COALESCE(cafeteria.cuota, 0) ELSE COALESCE(cafeteria.cuota, 0) + COALESCE(cafeteria_anterior.cuota, 0) END cafeteria, CASE WHEN l.quincena = 0 THEN COALESCE(celular.cuota, 0) ELSE COALESCE(celular.cuota, 0) + COALESCE(celular_anterior.cuota, 0) END celular, CASE WHEN l.quincena = 0 THEN COALESCE(uniforme.cuota, 0) ELSE COALESCE(uniforme.cuota, 0) + COALESCE(uniforme_anterior.cuota, 0) END uniforme, CASE WHEN l.quincena = 0 THEN COALESCE(calzado.cuota, 0) ELSE COALESCE(calzado.cuota, 0) + COALESCE(calzado_anterior.cuota, 0) END calzado, CASE WHEN l.quincena = 0 THEN COALESCE(equipo.cuota, 0) ELSE COALESCE(equipo.cuota, 0) + COALESCE(equipo_anterior.cuota, 0) END equipo, CASE WHEN l.quincena = 0 THEN COALESCE(producto.cuota, 0) ELSE COALESCE(producto.cuota, 0) + COALESCE(producto_anterior.cuota, 0) END producto, CASE WHEN l.quincena = 0 THEN COALESCE(bancos.cuota, 0) ELSE COALESCE(bancos.cuota, 0) + COALESCE(bancos_anterior.cuota, 0) END bancos, CASE WHEN l.quincena = 0 THEN COALESCE(otros.cuota, 0) ELSE COALESCE(otros.cuota, 0) + COALESCE(otros_anterior.cuota, 0) END otros, CASE WHEN l.quincena = 0 THEN pl.judiciales ELSE pl.judiciales + COALESCE(pla.judiciales, 0) END judiciales, CASE WHEN l.quincena = 0 THEN pl.seguro ELSE pl.seguro + COALESCE(pla.seguro, 0) END seguro, CASE WHEN l.quincena = 0 THEN pl.parqueo ELSE pl.parqueo + COALESCE(pla.parqueo, 0) END parqueo, CASE WHEN l.quincena = 0 THEN pl.boleta_ornato ELSE pl.boleta_ornato + COALESCE(pla.boleta_ornato, 0) END boleta_ornato, CASE WHEN l.quincena = 0 THEN pl.otros_egresos ELSE pl.otros_egresos + COALESCE(pla.otros_egresos, 0) END otros_egresos, CASE WHEN l.quincena = 0 THEN pl.egresos_tot ELSE pl.egresos_tot + COALESCE(pla.egresos_tot, 0) END total_egresos, CASE WHEN l.quincena = 0 THEN pl.liquido ELSE pl.liquido + COALESCE(pla.liquido, 0) END liquido_recibir, CASE WHEN l.quincena = 0 THEN pl.liquido ELSE COALESCE(pla.liquido, 0) END liquido_primer_quincena, CASE WHEN l.quincena = 0 THEN 0 ELSE pl.liquido END liquido_segunda_quincena FROM pago_lote pl LEFT JOIN( SELECT * FROM pago_lote ) pla ON MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote) AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote) AND pla.id_empleado = pl.id_empleado AND pla.id_lote != pl.id_lote LEFT JOIN lote l ON l.id = pl.id_lote LEFT JOIN empleado e ON e.id = pl.id_empleado LEFT JOIN empresa emp ON emp.id = pl.id_empresa LEFT JOIN centro_costo cc ON cc.id = pl.id_centro LEFT JOIN departamento d ON d.id = pl.id_departamento LEFT JOIN tipo_pago tp ON tp.id = pl.cheque LEFT JOIN tipo_cuenta tc ON tc.id = pl.id_tipo_cuenta LEFT JOIN banco bnc ON bnc.id = pl.id_banco LEFT JOIN condicion_laboral cl ON cl.id = pl.condicion_laboral LEFT JOIN( SELECT dl.id_pago_lote id_lote, dv.id_empleado id_empleado, SUM(dv.monto_total / dv.cuotas) cuota FROM descuento_variable dv INNER JOIN descuento_lote dl ON dl.id_descuento = dv.id WHERE dv.tipo_egreso = 'Cafeteria' GROUP BY dl.id_pago_lote, dv.id_empleado ) cafeteria ON cafeteria.id_lote = pl.id_lote AND cafeteria.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Cafeteria' GROUP BY dl.id_pago_lote, dv.id_empleado ) cafeteria_anterior ON cafeteria_anterior.id_lote = pla.id_lote AND cafeteria_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' GROUP BY dl.id_pago_lote, dv.id_empleado ) celular ON celular.id_lote = pl.id_lote AND celular.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Celular' GROUP BY dl.id_pago_lote, dv.id_empleado ) celular_anterior ON celular_anterior.id_lote = pla.id_lote AND celular_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' GROUP BY dl.id_pago_lote, dv.id_empleado ) uniforme ON uniforme.id_lote = pl.id_lote AND uniforme.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Uniforme' GROUP BY dl.id_pago_lote, dv.id_empleado ) uniforme_anterior ON uniforme_anterior.id_lote = pla.id_lote AND uniforme_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' GROUP BY dl.id_pago_lote, dv.id_empleado ) calzado ON calzado.id_lote = pl.id_lote AND calzado.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Calzado' GROUP BY dl.id_pago_lote, dv.id_empleado ) calzado_anterior ON calzado_anterior.id_lote = pla.id_lote AND calzado_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' GROUP BY dl.id_pago_lote, dv.id_empleado ) equipo ON equipo.id_lote = pl.id_lote AND equipo.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Equipo' GROUP BY dl.id_pago_lote, dv.id_empleado ) equipo_anterior ON equipo_anterior.id_lote = pla.id_lote AND equipo_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' GROUP BY dl.id_pago_lote, dv.id_empleado ) producto ON producto.id_lote = pl.id_lote AND producto.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Producto' GROUP BY dl.id_pago_lote, dv.id_empleado ) producto_anterior ON producto_anterior.id_lote = pla.id_lote AND producto_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' GROUP BY dl.id_pago_lote, dv.id_empleado ) bancos ON bancos.id_lote = pl.id_lote AND bancos.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso = 'Bancos' GROUP BY dl.id_pago_lote, dv.id_empleado ) bancos_anterior ON bancos_anterior.id_lote = pla.id_lote AND bancos_anterior.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) GROUP BY dl.id_pago_lote, dv.id_empleado ) otros ON otros.id_lote = pl.id_lote AND otros.id_empleado = pl.id_empleado LEFT JOIN( SELECT SUM(dv.monto_total / dv.cuotas) cuota, dl.id_pago_lote id_lote, dv.id_empleado id_empleado FROM descuento_lote dl INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento WHERE dv.tipo_egreso NOT IN( 'Cafeteria', 'Celular', 'Uniforme', 'Calzado', 'Equipo', 'Producto', 'Bancos' ) GROUP BY dl.id_pago_lote, dv.id_empleado ) otros_anterior ON otros_anterior.id_lote = pla.id_lote AND otros_anterior.id_empleado = pl.id_empleado WHERE pl.id_lote = " . $id_lote;

            if (!empty($empresas)) {
                $emp_str = implode(',', array_map('intval', $empresas));
                $sql .= " AND emp.id IN ($emp_str) ";
            } else {
                $sql .= " AND emp.id = " . $id_empresa_fallback;
            }

            if (!empty($centros)) {
                $centros_str = implode(',', array_map('intval', $centros));
                $sql .= " AND pl.id_centro IN ($centros_str) ";
            }

            if (!empty($departamentos)) {
                $dept_str = implode(',', array_map('intval', $departamentos));
                $sql .= " AND pl.id_departamento IN ($dept_str) ";
            }

            $result = mysqli_query($con, $sql);
            if (!$result) {
                echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
                exit;
            }
            $json = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $json[] = $row;
            }
            if(count($json) > 0) {
                echo json_encode($json);
            } else {
                echo 'No hay datos';
            }
            exit;
        }

"""

    # Do it from bottom up so indices don't change
    new_lines = lines[:start3] + [listado_pagos, listado_pagos_historial] + lines[start3:]
    
    # We added elements, so end2, start2, end1, start1 are still the same indices relative to the beginning
    new_lines = new_lines[:start2] + new_lines[end2:]
    
    new_lines = new_lines[:start1] + [empresas_historial] + new_lines[end1:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("Success")
else:
    print("Could not find all indices")
