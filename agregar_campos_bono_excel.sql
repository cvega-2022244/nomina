-- Campos alineados al reporte Excel (BONOS / horas extras y supervisión)
-- Ejecutar una vez sobre la base `nomina` después de `agregar_campos_comision.sql`.

USE nomina;

ALTER TABLE `comision`
ADD COLUMN `mes_trabajo` VARCHAR(40) NULL DEFAULT NULL COMMENT 'MES (texto del reporte)' AFTER `autorizado_cenas`;

ALTER TABLE `comision`
ADD COLUMN `tipo_hora_dn` VARCHAR(40) NULL DEFAULT NULL COMMENT 'TIPO DE HORA D-N' AFTER `mes_trabajo`;

ALTER TABLE `comision`
ADD COLUMN `unidades_bono` DECIMAL(10,2) NOT NULL DEFAULT 1.00 COMMENT 'Columna BONO del Excel (unidades)' AFTER `tipo_hora_dn`;

ALTER TABLE `comision`
ADD COLUMN `origen_reporte` VARCHAR(120) NULL DEFAULT NULL COMMENT 'Hoja o tipo de reporte (ej. SUPERVISION)' AFTER `unidades_bono`;

DESCRIBE comision;
