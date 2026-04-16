<?php
// Servidor específico para bonos variables
$host = "localhost";
// En XAMPP/MariaDB normalmente el usuario local es "root" sin contraseña
$username = "root";
$password = "";
$database = "nomina";

header('Content-Type: application/json');

// Evitar que mysqli lance excepciones fatales y manejar el error devolviendo JSON
mysqli_report(MYSQLI_REPORT_OFF);
$con = @mysqli_connect($host, $username, $password, $database, 3306);

if (!$con) {
    echo json_encode(['error' => 'Error de conexión MySQL: ' . mysqli_connect_error()]);
    exit;
}
$con->set_charset("utf8");

// Configurar headers para JSON (ya establecidos arriba)

if (isset($_GET["quest"]) && $_GET["quest"] == 'listado_empresas') {
    $sql = "SELECT id, nit, nombre_comercial, razon_social FROM empresa";
    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
    } else {
        $json = array();
        while ($row = mysqli_fetch_array($result)) {
            $json[] = array(
                'id' => $row["id"],
                'nit' => $row["nit"],
                'nombre_comercial' => $row["nombre_comercial"],
                'razon_social' => $row["razon_social"]
            );
        }
        echo json_encode($json);
    }
    exit;
}

if (isset($_GET["quest"]) && $_GET["quest"] == 'listado_empleados_activos') {
    $sql = "SELECT e.id, e.primer_nombre, e.segundo_nombre, e.primer_apellido, e.segundo_apellido, e.sueldo_ordinario, d.nombre as departamento_laboral, emp.nombre_comercial as empresa, emp.id as id_empresa FROM empleado e LEFT JOIN departamento d ON e.departamento_laboral = d.id LEFT JOIN empresa_empleado ee ON e.id = ee.id_empleado AND ee.activo = 1 AND ee.principal = 1 LEFT JOIN empresa emp ON ee.id_empresa = emp.id WHERE e.estado = 1 ORDER BY e.primer_nombre, e.primer_apellido";
    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
    } else {
        $json = array();
        while ($row = mysqli_fetch_array($result)) {
            $json[] = array(
                'id' => $row["id"],
                'primer_nombre' => $row["primer_nombre"],
                'segundo_nombre' => $row["segundo_nombre"],
                'primer_apellido' => $row["primer_apellido"],
                'segundo_apellido' => $row["segundo_apellido"],
                'departamento_laboral' => $row["departamento_laboral"],
                'empresa' => $row["empresa"],
                'id_empresa' => $row["id_empresa"],
                'sueldo_ordinario' => floatval($row["sueldo_ordinario"])
            );
        }
        echo json_encode($json);
    }
    exit;
}

if (isset($_GET["quest"]) && $_GET["quest"] == 'listado_usuarios') {
    $sql = "SELECT id, nombre FROM usuario ORDER BY nombre";
    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
    } else {
        $json = array();
        while ($row = mysqli_fetch_array($result)) {
            $json[] = array(
                'id' => $row["id"],
                'nombre' => $row["nombre"]
            );
        }
        echo json_encode($json);
    }
    exit;
}

if (isset($_GET["quest"]) && $_GET["quest"] == 'obtener_sueldo_empleado') {
    $id_empleado = isset($_GET['id_empleado']) ? intval($_GET['id_empleado']) : 0;
    
    if ($id_empleado <= 0) {
        echo json_encode(['error' => 'ID de empleado inválido']);
        exit;
    }
    
    $sql = "SELECT sueldo_ordinario FROM empleado WHERE id = $id_empleado AND estado = 1";
    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
    } else {
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_array($result);
            echo json_encode([
                'sueldo_ordinario' => floatval($row['sueldo_ordinario'])
            ]);
        } else {
            echo json_encode(['error' => 'Empleado no encontrado']);
        }
    }
    exit;
}

// Endpoint para obtener sueldos de MÚLTIPLES empleados
if (isset($_GET["quest"]) && $_GET["quest"] == 'obtener_sueldos_empleados') {
    $id_empleados = isset($_GET['id_empleados']) ? $_GET['id_empleados'] : [];
    
    if (empty($id_empleados) || !is_array($id_empleados)) {
        echo json_encode(['error' => 'No se proporcionaron empleados']);
        exit;
    }
    
    // Sanitizar IDs
    $ids_limpios = array_map('intval', $id_empleados);
    $ids_string = implode(',', $ids_limpios);
    
    $sql = "SELECT id, CONCAT(primer_nombre, ' ', COALESCE(segundo_nombre, ''), ' ', primer_apellido, ' ', COALESCE(segundo_apellido, '')) as nombre, sueldo_ordinario 
            FROM empleado 
            WHERE id IN ($ids_string) AND estado = 1";
    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
    } else {
        $json = array();
        while ($row = mysqli_fetch_array($result)) {
            $json[] = array(
                'id' => $row["id"],
                'nombre' => trim($row["nombre"]),
                'sueldo_ordinario' => floatval($row['sueldo_ordinario'])
            );
        }
        echo json_encode($json);
    }
    exit;
}

if (isset($_POST["quest"]) && $_POST["quest"] == 'crear_comision') {
    // Sistema de aprobación:
    // - admin: estado 8 (Aprobado) - se agrega directamente a nómina
    // - operaciones: estado 1 (Pendiente aprobación) - requiere aprobación de admin
    $rol_usuario = isset($_POST['rol_usuario']) ? $_POST['rol_usuario'] : 'operaciones';
    
    if ($rol_usuario == 'admin') {
        $estado_inicial = 8; // Aprobado (directamente guardado)
        $agregar_a_nomina = true;
    } else {
        $estado_inicial = 1; // Pendiente aprobación por admin
        $agregar_a_nomina = false;
    }
    
    // Obtener el array de empleados
    $empleados = isset($_POST['id_empleado']) ? $_POST['id_empleado'] : [];
    
    if (empty($empleados)) {
        echo json_encode(['error' => 'Debe seleccionar al menos un empleado']);
        exit;
    }
    
    // Obtener solicitante (opcional, usar 1 por defecto)
    $solicitante_id = isset($_POST['id_solicitante']) && !empty($_POST['id_solicitante']) ? intval($_POST['id_solicitante']) : 1;
    
    // Obtener otros campos
    $empresa_trabajo = mysqli_real_escape_string($con, $_POST['empresa_trabajo']);
    $area_trabajo = mysqli_real_escape_string($con, $_POST['area_trabajo']);
    $puesto_trabajo = mysqli_real_escape_string($con, $_POST['puesto_trabajo']);
    $fecha_trabajado = mysqli_real_escape_string($con, $_POST['fecha_trabajado']);
    $horas = !empty($_POST['horas']) ? floatval($_POST['horas']) : 0;
    $tipo_jornada = !empty($_POST['tipo_jornada']) ? intval($_POST['tipo_jornada']) : 1;
    $monto_enviado = !empty($_POST['monto']) ? floatval($_POST['monto']) : 0;
    $tarea = mysqli_real_escape_string($con, $_POST['tarea']);
    $tipo_registro = isset($_POST['tipo_registro']) ? mysqli_real_escape_string($con, $_POST['tipo_registro']) : 'bono';
    $autorizado_cenas = isset($_POST['autorizado_cenas']) ? intval($_POST['autorizado_cenas']) : 0;
    
    $insertados = 0;
    $errores = 0;
    
    // Insertar una comisión por cada empleado seleccionado
    foreach ($empleados as $id_empleado) {
        $id_empleado = intval($id_empleado);
        
        // Calcular monto automáticamente para hora_extra si no se envió
        $monto = $monto_enviado;
        if ($tipo_registro == 'hora_extra' && $monto == 0 && $horas > 0) {
            // Obtener sueldo del empleado
            $sueldo_sql = "SELECT sueldo_ordinario FROM empleado WHERE id = $id_empleado";
            $sueldo_result = mysqli_query($con, $sueldo_sql);
            if ($sueldo_result && mysqli_num_rows($sueldo_result) > 0) {
                $emp_row = mysqli_fetch_array($sueldo_result);
                $sueldo = floatval($emp_row['sueldo_ordinario']);
                // Valor hora = sueldo / 30 días / 8 horas
                $valor_hora = $sueldo / 30 / 8;
                // Diurna = 1.5x, Nocturna = 2x
                $factor = ($tipo_jornada == 2) ? 2 : 1.5;
                $monto = round($valor_hora * $factor * $horas, 2);
            }
        }
        
        // Asegurar que empresa_trabajo sea un número válido
        $empresa_trabajo_val = !empty($empresa_trabajo) ? intval($empresa_trabajo) : 0;
        
        $sql = "INSERT INTO comision (empresa_trabajo, area_trabajo, puesto_trabajo, fecha_trabajado, fecha_generado, horas, tipo_jornada, monto, tarea, id_empleado, id_solicitante, id_estado, seleccionado, tipo_registro, autorizado_cenas) VALUES (" . 
               $empresa_trabajo_val . ", '" . 
               $area_trabajo . "', '" . 
               $puesto_trabajo . "', '" . 
               $fecha_trabajado . "', NOW(), " . 
               $horas . ", " . 
               $tipo_jornada . ", " . 
               $monto . ", '" . 
               $tarea . "', " . 
               $id_empleado . ", " . 
               $solicitante_id . ", " . 
               $estado_inicial . ", 0, '" . 
               $tipo_registro . "', " . 
               $autorizado_cenas . ")";

        $result = mysqli_query($con, $sql);

        if ($result) {
            $insertados++;
            $last_comision_id = mysqli_insert_id($con); // Guardar el ID de la comisión recién insertada
            
            // === AGREGAR AUTOMÁTICAMENTE A LA NÓMINA ACTIVA (solo si está aprobado) ===
            if ($agregar_a_nomina) {
            // Buscar el lote activo
            $lote_sql = "SELECT id FROM lote WHERE id_estado = 1 LIMIT 1";
            $lote_result = mysqli_query($con, $lote_sql);
            
            if ($lote_result && mysqli_num_rows($lote_result) > 0) {
                $lote_row = mysqli_fetch_array($lote_result);
                $id_lote = $lote_row['id'];
                
                // Determinar qué columna actualizar según el tipo de registro
                $columna_monto = 'bonos';
                if ($tipo_registro == 'hora_extra') {
                    // Tipo jornada: 1=diurna, 2=nocturna
                    $columna_monto = ($tipo_jornada == 2) ? 'horas_noche' : 'horas_dia';
                }
                
                // Verificar si el empleado ya está en pago_lote para este lote
                $check_sql = "SELECT id, $columna_monto as monto_actual FROM pago_lote WHERE id_empleado = $id_empleado AND id_lote = $id_lote";
                $check_result = mysqli_query($con, $check_sql);
                
                if ($check_result && mysqli_num_rows($check_result) > 0) {
                    // Si ya existe, actualizar el monto correspondiente
                    $existing = mysqli_fetch_array($check_result);
                    $nuevo_monto = floatval($existing['monto_actual']) + floatval($monto);
                    $update_sql = "UPDATE pago_lote SET $columna_monto = $nuevo_monto, liquido = liquido + $monto, ingresos_tot = ingresos_tot + $monto WHERE id = " . $existing['id'];
                    mysqli_query($con, $update_sql);
                } else {
                    // Si no existe, insertar nuevo registro
                    $emp_sql = "SELECT e.*, ee.id_empresa FROM empleado e 
                                INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado AND ee.activo = 1 AND ee.principal = 1 
                                WHERE e.id = $id_empleado";
                    $emp_result = mysqli_query($con, $emp_sql);
                    
                    if ($emp_result && mysqli_num_rows($emp_result) > 0) {
                        $emp = mysqli_fetch_array($emp_result);
                        
                        // Calcular sueldo quincenal del empleado
                        $sueldo_ordinario = floatval($emp['sueldo_ordinario']);
                        $dias_laborados = intval($emp['dias_laborados']);
                        $sueldo_quincenal = round(($sueldo_ordinario / 30) * $dias_laborados, 2);
                        $bon_incentivo = round((floatval($emp['bon_incentivo']) / 30) * $dias_laborados, 2);
                        $bon_decreto = round((floatval($emp['bon_dec_37_2001']) / 30) * $dias_laborados, 2);
                        
                        // Calcular IGSS
                        $base_igss = $sueldo_quincenal + floatval($monto);
                        $igss = round($base_igss * 0.0483, 2);
                        
                        // Determinar valores según tipo de registro
                        $valor_horas_dia = 0;
                        $valor_horas_noche = 0;
                        $valor_bonos = 0;
                        
                        if ($tipo_registro == 'hora_extra') {
                            if ($tipo_jornada == 2) {
                                $valor_horas_noche = $monto;
                            } else {
                                $valor_horas_dia = $monto;
                            }
                        } else {
                            $valor_bonos = $monto;
                        }
                        
                        // Calcular totales
                        $total_ingresos = $sueldo_quincenal + $bon_incentivo + $bon_decreto + $valor_horas_dia + $valor_horas_noche + $valor_bonos;
                        $total_egresos = $igss + round(floatval($emp['isr']) / 2, 2);
                        $liquido = round($total_ingresos - $total_egresos, 2);
                        
                        $insert_pago = "INSERT INTO pago_lote (id_empresa, id_empleado, id_centro, id_departamento, puesto, 
                                        bon_tot, bon_dec_tot, horas_dia, horas_noche, sueldo_quincenal, otros_ingresos, 
                                        vacaciones, bonos, desc_variables, boleta_ornato, igss, isr, prestamo_empresa, 
                                        otros_egresos, ingresos_tot, egresos_tot, liquido, total_reporte_bono, 
                                        condicion_laboral, cheque, id_banco, no_cuenta, id_tipo_cuenta, id_lote, 
                                        fecha_pago_lote, igss_patronal, intecap, irtra, dias_laborados, dias_bono) 
                                        VALUES (" . $emp['id_empresa'] . ", $id_empleado, 
                                        COALESCE(" . intval($emp['centro_de_costo']) . ", 0), 
                                        COALESCE(" . intval($emp['departamento_laboral']) . ", 0), 
                                        COALESCE(" . intval($emp['puesto']) . ", 0), 
                                        $bon_incentivo, $bon_decreto, $valor_horas_dia, $valor_horas_noche, $sueldo_quincenal, 0, 0, $valor_bonos, 0, 0, $igss, " . round(floatval($emp['isr']) / 2, 2) . ", 0, 0, 
                                        $total_ingresos, $total_egresos, $liquido, $sueldo_quincenal, " . intval($emp['condicion_laboral']) . ", " . intval($emp['tipo_de_pago']) . ", 
                                        " . intval($emp['banco']) . ", '" . mysqli_real_escape_string($con, $emp['no_cuenta']) . "', 
                                        " . intval($emp['tipo_cuenta']) . ", $id_lote, CURDATE(), " . floatval($emp['igss_patronal']) . ", " . round(floatval($emp['igss_patronal']) * 0.01, 2) . ", " . round(floatval($emp['igss_patronal']) * 0.01, 2) . ", $dias_laborados, $dias_laborados)";
                        mysqli_query($con, $insert_pago);
                    }
                }
                
                // Marcar la comisión recién creada como seleccionada ya que se agregó a pago_lote
                if ($last_comision_id > 0) {
                    mysqli_query($con, "UPDATE comision SET seleccionado = 1 WHERE id = $last_comision_id");
                }
            }
            } // fin if ($agregar_a_nomina)
            // === FIN AGREGAR A NÓMINA ===
            
        } else {
            $errores++;
            error_log("Error al insertar comisión para empleado $id_empleado: " . mysqli_error($con));
        }
    }
    
    if ($insertados > 0) {
        $mensaje_estado = $agregar_a_nomina ? 'Comisiones guardadas y agregadas a nómina' : 'Comisiones guardadas. Pendientes de aprobación por administrador';
        echo json_encode([
            'success' => $mensaje_estado, 
            'insertados' => $insertados,
            'errores' => $errores,
            'pendiente_aprobacion' => !$agregar_a_nomina
        ]);
    } else {
        echo json_encode(['error' => 'No se pudo crear ninguna comisión. Errores: ' . $errores]);
    }
    exit;
}

// Endpoint para obtener historial completo de bonos (solo bonos, sin horas extra)
if (isset($_GET["quest"]) && $_GET["quest"] == 'historial_completo_bonos') {
    // Parámetros de filtro
    $filtro_buscar = isset($_GET['buscar']) ? mysqli_real_escape_string($con, $_GET['buscar']) : '';
    $filtro_estado = isset($_GET['estado']) ? mysqli_real_escape_string($con, $_GET['estado']) : '';
    $filtro_fecha_desde = isset($_GET['fecha_desde']) ? mysqli_real_escape_string($con, $_GET['fecha_desde']) : '';
    $filtro_fecha_hasta = isset($_GET['fecha_hasta']) ? mysqli_real_escape_string($con, $_GET['fecha_hasta']) : '';
    
    // Parámetros de usuario para filtrar por rol
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    $user_role = isset($_GET['user_role']) ? mysqli_real_escape_string($con, $_GET['user_role']) : '';
    
    // Construir la consulta base - Solo mostrar bonos (tipo_registro = 'bono')
    $sql = "SELECT 
                c.id,
                c.fecha_trabajado,
                DATE(c.fecha_generado) as fecha_generado,
                CONCAT(e.primer_nombre, ' ', COALESCE(e.segundo_nombre, ''), ' ', e.primer_apellido, ' ', COALESCE(e.segundo_apellido, '')) as empleado,
                e.id as id_empleado,
                COALESCE(d.nombre, 'Sin Departamento') as departamento,
                COALESCE(emp.nombre_comercial, 'Sin Empresa') as empresa,
                COALESCE(u.nombre, 'Sin Solicitante') as solicitante,
                c.tipo_registro,
                c.horas,
                CASE 
                    WHEN c.tipo_jornada = 1 THEN 'Diurna'
                    WHEN c.tipo_jornada = 2 THEN 'Nocturna'
                    ELSE 'N/A'
                END as jornada,
                c.monto,
                COALESCE(eb.nombre, 'Sin Estado') as estado,
                c.area_trabajo,
                c.puesto_trabajo,
                c.tarea
            FROM comision c
            LEFT JOIN empleado e ON c.id_empleado = e.id
            LEFT JOIN departamento d ON e.departamento_laboral = d.id
            LEFT JOIN empresa emp ON c.empresa_trabajo = emp.id
            LEFT JOIN usuario u ON c.id_solicitante = u.id
            LEFT JOIN estado_bono eb ON c.id_estado = eb.id
            WHERE c.tipo_registro = 'bono'";
    
    // Si el rol es 'operaciones', solo mostrar los bonos creados por ese usuario
    if ($user_role == 'operaciones' && $user_id) {
        $sql .= " AND c.id_solicitante = $user_id";
    }
    // Admin ve todo, no necesita filtro adicional
    
    // Aplicar filtros
    if (!empty($filtro_buscar)) {
        $sql .= " AND (
            CONCAT(e.primer_nombre, ' ', e.primer_apellido) LIKE '%$filtro_buscar%' OR
            d.nombre LIKE '%$filtro_buscar%' OR
            emp.nombre_comercial LIKE '%$filtro_buscar%'
        )";
    }
    
    if (!empty($filtro_estado)) {
        $sql .= " AND eb.nombre = '$filtro_estado'";
    }
    
    if (!empty($filtro_fecha_desde)) {
        $sql .= " AND DATE(c.fecha_generado) >= '$filtro_fecha_desde'";
    }
    
    if (!empty($filtro_fecha_hasta)) {
        $sql .= " AND DATE(c.fecha_generado) <= '$filtro_fecha_hasta'";
    }
    
    $sql .= " ORDER BY c.fecha_generado DESC, c.id DESC";
    
    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
    } else {
        $json = array();
        while ($row = mysqli_fetch_array($result)) {
            $json[] = array(
                'id' => $row["id"],
                'fecha_trabajado' => $row["fecha_trabajado"],
                'fecha_generado' => $row["fecha_generado"],
                'empleado' => trim($row["empleado"]),
                'id_empleado' => $row["id_empleado"],
                'departamento' => $row["departamento"],
                'empresa' => $row["empresa"],
                'solicitante' => $row["solicitante"],
                'tipo_registro' => $row["tipo_registro"],
                'horas' => floatval($row["horas"]),
                'jornada' => $row["jornada"],
                'monto' => floatval($row["monto"]),
                'estado' => $row["estado"],
                'area_trabajo' => $row["area_trabajo"],
                'puesto_trabajo' => $row["puesto_trabajo"],
                'tarea' => $row["tarea"]
            );
        }
        echo json_encode($json);
    }
    exit;
}

// === ENDPOINTS PARA APROBACIÓN RH ===

// === HISTORIAL COMPLETO DE HORAS EXTRA ===
if (isset($_GET["quest"]) && $_GET["quest"] == 'historial_completo_horas') {
    // Parámetros de filtro
    $filtro_buscar = isset($_GET['buscar']) ? mysqli_real_escape_string($con, $_GET['buscar']) : '';
    $filtro_estado = isset($_GET['estado']) ? mysqli_real_escape_string($con, $_GET['estado']) : '';
    $filtro_fecha_desde = isset($_GET['fecha_desde']) ? mysqli_real_escape_string($con, $_GET['fecha_desde']) : '';
    $filtro_fecha_hasta = isset($_GET['fecha_hasta']) ? mysqli_real_escape_string($con, $_GET['fecha_hasta']) : '';
    
    // Parámetros de usuario para filtrar por rol
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    $user_role = isset($_GET['user_role']) ? mysqli_real_escape_string($con, $_GET['user_role']) : '';
    
    // Construir la consulta base - Solo mostrar horas extra (tipo_registro = 'hora_extra')
    $sql = "SELECT 
                c.id,
                c.fecha_trabajado,
                DATE(c.fecha_generado) as fecha_generado,
                CONCAT(e.primer_nombre, ' ', COALESCE(e.segundo_nombre, ''), ' ', e.primer_apellido, ' ', COALESCE(e.segundo_apellido, '')) as empleado,
                e.id as id_empleado,
                COALESCE(d.nombre, 'Sin Departamento') as departamento,
                c.horas,
                CASE 
                    WHEN c.tipo_jornada = 1 THEN 'Diurna'
                    WHEN c.tipo_jornada = 2 THEN 'Nocturna'
                    ELSE 'N/A'
                END as jornada,
                c.monto,
                COALESCE(eb.nombre, 'Sin Estado') as estado
            FROM comision c
            LEFT JOIN empleado e ON c.id_empleado = e.id
            LEFT JOIN departamento d ON e.departamento_laboral = d.id
            LEFT JOIN estado_bono eb ON c.id_estado = eb.id
            WHERE c.tipo_registro = 'hora_extra'";
    
    // Si el rol es 'operaciones', solo mostrar las horas extra creadas por ese usuario
    if ($user_role == 'operaciones' && $user_id) {
        $sql .= " AND c.id_solicitante = $user_id";
    }
    // Admin ve todo, no necesita filtro adicional
    
    // Aplicar filtros
    if (!empty($filtro_buscar)) {
        $sql .= " AND (
            CONCAT(e.primer_nombre, ' ', e.primer_apellido) LIKE '%$filtro_buscar%' OR
            d.nombre LIKE '%$filtro_buscar%'
        )";
    }
    
    if (!empty($filtro_estado)) {
        $sql .= " AND eb.nombre LIKE '%$filtro_estado%'";
    }
    
    if (!empty($filtro_fecha_desde)) {
        $sql .= " AND DATE(c.fecha_generado) >= '$filtro_fecha_desde'";
    }
    
    if (!empty($filtro_fecha_hasta)) {
        $sql .= " AND DATE(c.fecha_generado) <= '$filtro_fecha_hasta'";
    }
    
    $sql .= " ORDER BY c.fecha_generado DESC, c.id DESC";
    
    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
    } else {
        $json = array();
        while ($row = mysqli_fetch_array($result)) {
            $json[] = array(
                'id' => $row["id"],
                'fecha_trabajado' => $row["fecha_trabajado"],
                'fecha_generado' => $row["fecha_generado"],
                'empleado' => trim($row["empleado"]),
                'id_empleado' => $row["id_empleado"],
                'departamento' => $row["departamento"],
                'horas' => floatval($row["horas"]),
                'jornada' => $row["jornada"],
                'monto' => floatval($row["monto"]),
                'estado' => $row["estado"]
            );
        }
        echo json_encode($json);
    }
    exit;
}

// Endpoint para listar bonos pendientes de aprobación (estado = 1)
if (isset($_GET["quest"]) && $_GET["quest"] == 'bonos_pendientes_aprobacion') {
    $sql = "SELECT c.id, c.fecha_trabajado, c.fecha_generado, c.monto, c.horas, c.tipo_jornada, c.tarea, 
            c.tipo_registro, c.empresa_trabajo, c.area_trabajo, c.puesto_trabajo, c.id_empleado, c.id_solicitante,
            CONCAT(e.primer_nombre, ' ', COALESCE(e.segundo_nombre, ''), ' ', e.primer_apellido, ' ', COALESCE(e.segundo_apellido, '')) as empleado,
            d.nombre as departamento,
            emp.nombre_comercial as empresa_empleado,
            CONCAT(sol.primer_nombre, ' ', sol.primer_apellido) as solicitante_nombre
            FROM comision c
            LEFT JOIN empleado e ON c.id_empleado = e.id
            LEFT JOIN departamento d ON e.departamento_laboral = d.id
            LEFT JOIN empresa_empleado ee ON e.id = ee.id_empleado AND ee.activo = 1 AND ee.principal = 1
            LEFT JOIN empresa emp ON ee.id_empresa = emp.id
            LEFT JOIN empleado sol ON c.id_solicitante = sol.id
            WHERE c.id_estado = 1
            ORDER BY c.fecha_generado DESC";
    
    $result = mysqli_query($con, $sql);
    
    if (!$result) {
        echo json_encode(['error' => 'Query Falló: ' . mysqli_error($con)]);
    } else {
        $json = array();
        while ($row = mysqli_fetch_array($result)) {
            $jornada = '';
            if ($row['tipo_registro'] == 'hora_extra') {
                $jornada = ($row['tipo_jornada'] == 2) ? 'Nocturna' : 'Diurna';
            }
            $json[] = array(
                'id' => $row["id"],
                'fecha_trabajado' => $row["fecha_trabajado"],
                'fecha_generado' => $row["fecha_generado"],
                'monto' => floatval($row["monto"]),
                'horas' => floatval($row["horas"]),
                'tipo_jornada' => $jornada,
                'tarea' => $row["tarea"],
                'tipo_registro' => $row["tipo_registro"],
                'empleado' => trim($row["empleado"]),
                'id_empleado' => $row["id_empleado"],
                'departamento' => $row["departamento"],
                'empresa' => $row["empresa_empleado"],
                'solicitante' => $row["solicitante_nombre"],
                'area_trabajo' => $row["area_trabajo"],
                'puesto_trabajo' => $row["puesto_trabajo"]
            );
        }
        echo json_encode($json);
    }
    exit;
}

// Endpoint para aprobar bono (cambiar estado a 8 y agregar a nómina)
if (isset($_POST["quest"]) && $_POST["quest"] == 'aprobar_bono') {
    $id_comision = isset($_POST['id_comision']) ? intval($_POST['id_comision']) : 0;
    
    if ($id_comision <= 0) {
        echo json_encode(['error' => 'ID de comisión inválido']);
        exit;
    }
    
    // Obtener datos de la comisión
    $sql = "SELECT * FROM comision WHERE id = $id_comision AND id_estado = 1";
    $result = mysqli_query($con, $sql);
    
    if (!$result || mysqli_num_rows($result) == 0) {
        echo json_encode(['error' => 'Comisión no encontrada o ya fue procesada']);
        exit;
    }
    
    $comision = mysqli_fetch_array($result);
    $id_empleado = $comision['id_empleado'];
    $monto = floatval($comision['monto']);
    $tipo_registro = $comision['tipo_registro'];
    $tipo_jornada = intval($comision['tipo_jornada']);
    
    // Actualizar estado a 8 (Aprobado RH)
    $update_sql = "UPDATE comision SET id_estado = 8 WHERE id = $id_comision";
    $update_result = mysqli_query($con, $update_sql);
    
    if (!$update_result) {
        echo json_encode(['error' => 'Error al aprobar: ' . mysqli_error($con)]);
        exit;
    }
    
    // === AGREGAR A LA NÓMINA ACTIVA ===
    $lote_sql = "SELECT id FROM lote WHERE id_estado = 1 LIMIT 1";
    $lote_result = mysqli_query($con, $lote_sql);
    
    if ($lote_result && mysqli_num_rows($lote_result) > 0) {
        $lote_row = mysqli_fetch_array($lote_result);
        $id_lote = $lote_row['id'];
        
        // Determinar qué columna actualizar según el tipo de registro
        $columna_monto = 'bonos';
        if ($tipo_registro == 'hora_extra') {
            $columna_monto = ($tipo_jornada == 2) ? 'horas_noche' : 'horas_dia';
        }
        
        // Verificar si el empleado ya está en pago_lote para este lote
        $check_sql = "SELECT id, $columna_monto as monto_actual FROM pago_lote WHERE id_empleado = $id_empleado AND id_lote = $id_lote";
        $check_result = mysqli_query($con, $check_sql);
        
        if ($check_result && mysqli_num_rows($check_result) > 0) {
            // Si ya existe, actualizar el monto correspondiente
            $existing = mysqli_fetch_array($check_result);
            $nuevo_monto = floatval($existing['monto_actual']) + floatval($monto);
            $update_pago = "UPDATE pago_lote SET $columna_monto = $nuevo_monto, liquido = liquido + $monto, ingresos_tot = ingresos_tot + $monto WHERE id = " . $existing['id'];
            mysqli_query($con, $update_pago);
        } else {
            // Si no existe, insertar nuevo registro
            $emp_sql = "SELECT e.*, ee.id_empresa FROM empleado e 
                        INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado AND ee.activo = 1 AND ee.principal = 1 
                        WHERE e.id = $id_empleado";
            $emp_result = mysqli_query($con, $emp_sql);
            
            if ($emp_result && mysqli_num_rows($emp_result) > 0) {
                $emp = mysqli_fetch_array($emp_result);
                $sueldo_ordinario = floatval($emp['sueldo_ordinario']);
                $dias_laborados = intval($emp['dias_laborados']);
                $sueldo_quincenal = round(($sueldo_ordinario / 30) * $dias_laborados, 2);
                $bon_incentivo = round((floatval($emp['bon_incentivo']) / 30) * $dias_laborados, 2);
                $bon_decreto = round((floatval($emp['bon_dec_37_2001']) / 30) * $dias_laborados, 2);
                
                $base_igss = $sueldo_quincenal + floatval($monto);
                $igss = round($base_igss * 0.0483, 2);
                
                $valor_horas_dia = 0;
                $valor_horas_noche = 0;
                $valor_bonos = 0;
                
                if ($tipo_registro == 'hora_extra') {
                    if ($tipo_jornada == 2) {
                        $valor_horas_noche = $monto;
                    } else {
                        $valor_horas_dia = $monto;
                    }
                } else {
                    $valor_bonos = $monto;
                }
                
                $total_ingresos = $sueldo_quincenal + $bon_incentivo + $bon_decreto + $valor_horas_dia + $valor_horas_noche + $valor_bonos;
                $total_egresos = $igss + round(floatval($emp['isr']) / 2, 2);
                $liquido = round($total_ingresos - $total_egresos, 2);
                
                $insert_pago = "INSERT INTO pago_lote (id_empresa, id_empleado, id_centro, id_departamento, puesto, 
                                bon_tot, bon_dec_tot, horas_dia, horas_noche, sueldo_quincenal, otros_ingresos, 
                                vacaciones, bonos, desc_variables, boleta_ornato, igss, isr, prestamo_empresa, 
                                otros_egresos, ingresos_tot, egresos_tot, liquido, total_reporte_bono, 
                                condicion_laboral, cheque, id_banco, no_cuenta, id_tipo_cuenta, id_lote, 
                                fecha_pago_lote, igss_patronal, intecap, irtra, dias_laborados, dias_bono) 
                                VALUES (" . $emp['id_empresa'] . ", $id_empleado, 
                                COALESCE(" . intval($emp['centro_de_costo']) . ", 0), 
                                COALESCE(" . intval($emp['departamento_laboral']) . ", 0), 
                                COALESCE(" . intval($emp['puesto']) . ", 0), 
                                $bon_incentivo, $bon_decreto, $valor_horas_dia, $valor_horas_noche, $sueldo_quincenal, 0, 0, $valor_bonos, 0, 0, $igss, " . round(floatval($emp['isr']) / 2, 2) . ", 0, 0, 
                                $total_ingresos, $total_egresos, $liquido, $sueldo_quincenal, " . intval($emp['condicion_laboral']) . ", " . intval($emp['tipo_de_pago']) . ", 
                                " . intval($emp['banco']) . ", '" . mysqli_real_escape_string($con, $emp['no_cuenta']) . "', 
                                " . intval($emp['tipo_cuenta']) . ", $id_lote, CURDATE(), " . floatval($emp['igss_patronal']) . ", " . round(floatval($emp['igss_patronal']) * 0.01, 2) . ", " . round(floatval($emp['igss_patronal']) * 0.01, 2) . ", $dias_laborados, $dias_laborados)";
                mysqli_query($con, $insert_pago);
            }
        }
        
        // Marcar la comisión como seleccionada
        mysqli_query($con, "UPDATE comision SET seleccionado = 1 WHERE id = $id_comision");
    }
    
    echo json_encode(['success' => 'Bono aprobado y agregado a nómina exitosamente']);
    exit;
}

// Endpoint para rechazar bono (cambiar estado a 9)
if (isset($_POST["quest"]) && $_POST["quest"] == 'rechazar_bono') {
    $id_comision = isset($_POST['id_comision']) ? intval($_POST['id_comision']) : 0;
    $motivo = isset($_POST['motivo']) ? mysqli_real_escape_string($con, $_POST['motivo']) : '';
    
    if ($id_comision <= 0) {
        echo json_encode(['error' => 'ID de comisión inválido']);
        exit;
    }
    
    // Verificar que exista y esté pendiente
    $sql = "SELECT id FROM comision WHERE id = $id_comision AND id_estado = 1";
    $result = mysqli_query($con, $sql);
    
    if (!$result || mysqli_num_rows($result) == 0) {
        echo json_encode(['error' => 'Comisión no encontrada o ya fue procesada']);
        exit;
    }
    
    // Actualizar estado a 9 (Rechazado RH)
    $update_sql = "UPDATE comision SET id_estado = 9 WHERE id = $id_comision";
    $update_result = mysqli_query($con, $update_sql);
    
    if (!$update_result) {
        echo json_encode(['error' => 'Error al rechazar: ' . mysqli_error($con)]);
        exit;
    }
    
    echo json_encode(['success' => 'Bono rechazado']);
    exit;
}

mysqli_close($con);
?>

