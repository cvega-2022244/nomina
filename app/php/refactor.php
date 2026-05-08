<?php
$filepath = 'c:\\xampp\\htdocs\\nomina\\app\\php\\servidor.php';
$lines = file($filepath);

$start1 = -1; $end1 = -1;
$start2 = -1; $end2 = -1;
$start3 = -1;

foreach ($lines as $i => $line) {
    if (strpos($line, "if (\$_GET[\"quest\"] == 'listado_pagos_historial') {") !== false) $start1 = $i;
    if (strpos($line, "if (\$_GET[\"quest\"] == 'listado_empresas_pagos') {") !== false) $end1 = $i;
    
    if (strpos($line, "if (\$_GET[\"quest\"] == 'listado_pagos') {") !== false) $start2 = $i;
    if (strpos($line, "if (\$_GET[\"quest\"] == 'detalle_pago') {") !== false) $end2 = $i;
    
    if (strpos($line, "if (\$_POST[\"quest\"] == 'agregar_empresa') {") !== false) $start3 = $i;
}

echo "Indices: $start1 to $end1, $start2 to $end2, $start3\n";

if ($start1 != -1 && $end1 != -1 && $start2 != -1 && $end2 != -1 && $start3 != -1) {
    
    $empresas_historial = "        if (\$_GET[\"quest\"] == 'listado_empresas_historial') {\n" .
        "            \$sql = \"SELECT DISTINCT e.id, e.nombre_comercial as nombre FROM pago_lote pl INNER JOIN empresa e ON pl.id_empresa = e.id WHERE pl.id_lote = \" . \$_GET['id_lote'];\n" .
        "            \$result = mysqli_query(\$con, \$sql);\n" .
        "            if (!\$result) {\n" .
        "                echo json_encode(['error' => 'Query Falló: ' . mysqli_error(\$con)]);\n" .
        "                exit;\n" .
        "            }\n" .
        "            if (mysqli_num_rows(\$result) > 0) {\n" .
        "                \$json = array();\n" .
        "                while (\$row = mysqli_fetch_array(\$result)) {\n" .
        "                    \$json[] = array('id' => \$row[\"id\"], 'nombre' => \$row[\"nombre\"]);\n" .
        "                }\n" .
        "                echo json_encode(\$json);\n" .
        "            } else {\n" .
        "                echo 'No hay datos';\n" .
        "            }\n" .
        "            exit;\n" .
        "        }\n\n";

    $listado_pagos = file_get_contents('listado_pagos.txt');
    $listado_pagos_historial = file_get_contents('listado_pagos_historial.txt');
    
    // Reverse order modifications
    // 3. Add to POST (start3 is lower index than the ends? No, start3 is 6700+. start2 is 5200. start1 is 1000)
    // So order is start3, then start2, then start1. Modifying from bottom up!
    
    array_splice($lines, $start3, 0, [$listado_pagos, $listado_pagos_historial]);
    
    // start2 and end2
    array_splice($lines, $start2, $end2 - $start2, []);
    
    // start1 and end1
    array_splice($lines, $start1, $end1 - $start1, [$empresas_historial]);
    
    file_put_contents($filepath, implode("", $lines));
    echo "Success\n";
} else {
    echo "Failed to find indices\n";
}
