<?php
$file = 'c:\xampp\htdocs\nomina\app\php\servidor.php';
$content = file_get_contents($file);

$search1 = "LEFT JOIN pago_lote pl ON pl.id_empleado = e.id AND pl.id_lote IN (SELECT id FROM lote WHERE id_estado = 1) LEFT JOIN( SELECT * FROM pago_lote ) pla ON pla.id_empleado = e.id AND pla.id_lote = (SELECT MAX(id) FROM lote WHERE quincena = 0 AND id < COALESCE(pl.id_lote, 0)) LEFT JOIN lote l ON l.id = pl.id_lote";

$search2 = "LEFT JOIN pago_lote pl ON pl.id_empleado = e.id AND pl.id_lote IN (SELECT id FROM lote WHERE id_estado = 1) LEFT JOIN( SELECT * FROM pago_lote ) pla ON pla.id_empleado = e.id AND pla.id_lote IN (SELECT id FROM lote WHERE id_estado = 1) AND pla.id_lote != COALESCE(pl.id_lote, 0) LEFT JOIN lote l ON l.id = pl.id_lote";

$replace = "LEFT JOIN (SELECT * FROM lote WHERE id_estado = 1 ORDER BY id DESC LIMIT 1) l ON 1=1 LEFT JOIN pago_lote pl ON pl.id_empleado = e.id AND pl.id_lote = l.id LEFT JOIN( SELECT * FROM pago_lote ) pla ON pla.id_empleado = e.id AND pla.id_lote = (SELECT MAX(id) FROM lote WHERE quincena = 0 AND id < l.id)";

$content = str_replace($search1, $replace, $content, $count1);
$content = str_replace($search2, $replace, $content, $count2);

file_put_contents($file, $content);
echo "Replaced pattern 1: $count1 times\n";
echo "Replaced pattern 2: $count2 times\n";
?>
