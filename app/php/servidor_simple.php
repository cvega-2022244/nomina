<?php
header('Content-Type: application/json; charset=UTF-8');
date_default_timezone_set("America/Guatemala");
session_start();

$con = mysqli_connect("localhost", "root", "", null, 3307);
if (!$con) { echo json_encode(['error' => mysqli_connect_error()]); exit; }
mysqli_select_db($con, "nomina");
$con->set_charset("utf8");

if (isset($_GET["quest"])) {
    if ($_GET["quest"] === 'lista_usuarios') {
        $sql = "SELECT id, usuario, nombre, rol FROM usuario ORDER BY id ASC";
        $result = mysqli_query($con, $sql);
        if (!$result) { echo json_encode(['error' => mysqli_error($con)]); exit; }
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) { $data[] = $row; }
        echo json_encode($data); exit;
    }

    if ($_GET["quest"] === 'lista_departamentos') {
        $sql = "SELECT id, nombre FROM departamento ORDER BY nombre";
        $result = mysqli_query($con, $sql);
        if (!$result) { echo json_encode(['error' => mysqli_error($con)]); exit; }
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) { $data[] = $row; }
        echo json_encode($data); exit;
    }

    if ($_GET["quest"] === 'check_user_role') {
        $user_id = $_GET['id'] ?? null;
        if (!$user_id) { echo json_encode(['error' => 'ID requerido']); exit; }
        
        $sql = "SELECT id, usuario, nombre, rol FROM usuario WHERE id = " . intval($user_id);
        $result = mysqli_query($con, $sql);
        if (!$result) { echo json_encode(['error' => mysqli_error($con)]); exit; }
        
        if (mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            echo json_encode($row);
        } else {
            echo json_encode(['error' => 'Usuario no encontrado']);
        }
        exit;
    }

    if ($_GET["quest"] === 'debug_comisiones') {
        $sql = "SELECT c.id, c.id_empleado, c.id_solicitante, c.id_estado, eb.nombre as estado_nombre, c.fecha_generado, c.monto
                FROM comision c
                LEFT JOIN estado_bono eb ON c.id_estado = eb.id
                ORDER BY c.id DESC";
        $result = mysqli_query($con, $sql);
        if (!$result) { echo json_encode(['error' => mysqli_error($con)]); exit; }
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) { $data[] = $row; }
        echo json_encode($data); exit;
    }

    if ($_GET["quest"] === 'debug_estados') {
        $sql = "SELECT id, nombre FROM estado_bono ORDER BY id";
        $result = mysqli_query($con, $sql);
        if (!$result) { echo json_encode(['error' => mysqli_error($con)]); exit; }
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) { $data[] = $row; }
        echo json_encode($data); exit;
    }
}

if (isset($_POST["quest"])) {
    if ($_POST["quest"] === 'actualizar_rol_usuario') {
        $user_id = intval($_POST['user_id'] ?? 0);
        $new_role = mysqli_real_escape_string($con, $_POST['new_role'] ?? '');
        
        // Validar que el rol sea uno de los permitidos
        $roles_permitidos = ['admin', 'operaciones', 'capturador'];
        if (!in_array($new_role, $roles_permitidos)) {
            echo json_encode(['error' => 'Rol no válido. Roles permitidos: admin, operaciones, capturador']);
            exit;
        }
        
        $sql = "UPDATE usuario SET rol = '$new_role' WHERE id = $user_id";
        $result = mysqli_query($con, $sql);
        if (!$result) { echo json_encode(['error' => mysqli_error($con)]); exit; }
        echo 'Successfully'; exit;
    }
}

echo json_encode(['error' => 'Solicitud inválida']);
?>


