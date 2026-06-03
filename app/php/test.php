<?php
$_GET["quest"] = 'lista_comisiones_pendientes';
$_GET["user_id"] = 11;
$_GET["user_role"] = 'rh';

$con = mysqli_connect("localhost", "root", "", "nomina", 3306);
$user_id = $_GET['user_id'] ?? null;
$user_role = strtolower($_GET['user_role'] ?? '');

$sql = "SELECT b.id, COALESCE(d.nombre, 'Sin Depto') departamento, CONCAT( emp.primer_nombre, ' ', emp.primer_apellido ) empleado, emp.id id_empleado, COALESCE(u.nombre, 'Sin Solicitante') solicitante, DATE(b.fecha_generado) fecha_generado, b.monto, eb.nombre estado, b.seleccionado FROM comision b LEFT JOIN empleado emp ON b.id_empleado = emp.id LEFT JOIN departamento d ON emp.departamento_laboral = d.id LEFT JOIN usuario u ON b.id_solicitante = u.id LEFT JOIN estado_bono eb ON b.id_estado = eb.id WHERE eb.id = 1 AND (b.tipo_registro = 'bono' OR b.tipo_registro = 'comision' OR b.tipo_registro = '') GROUP BY b.id ORDER BY b.id DESC";
$result = mysqli_query($con, $sql);
if (!$result) echo mysqli_error($con);
while ($row = mysqli_fetch_assoc($result)) {
    print_r($row);
}
?>
