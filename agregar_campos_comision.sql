-- =====================================================
-- Script para agregar campos a la tabla comision
-- Para manejar bonos y horas extra
-- Fecha: 2025-12-29
-- =====================================================

USE nomina;

-- Agregar columna para tipo de registro (bono o hora_extra)
ALTER TABLE `comision` 
ADD COLUMN `tipo_registro` VARCHAR(20) DEFAULT 'bono' COMMENT 'Tipo: bono o hora_extra' AFTER `seleccionado`;

-- Agregar columna para autorizado cenas
ALTER TABLE `comision` 
ADD COLUMN `autorizado_cenas` TINYINT(1) DEFAULT 0 COMMENT 'Si está autorizado para cenas' AFTER `tipo_registro`;

-- Verificar que se agregaron correctamente
DESCRIBE comision;
