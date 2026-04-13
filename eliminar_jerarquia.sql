-- =====================================================
-- Script para eliminar todo lo relacionado con jerarquía
-- Base de datos: nomina
-- Fecha: 2025-12-29
-- =====================================================

USE nomina;

-- 1. Eliminar la tabla jerarquia_organizacional
-- Esta tabla contiene las relaciones jerárquicas entre empleados
DROP TABLE IF EXISTS `jerarquia_organizacional`;

-- 2. Si hay otras tablas relacionadas con jerarquía (verificar primero)
-- Descomentar las siguientes líneas si existen estas tablas:

-- DROP TABLE IF EXISTS `jerarquia_departamentos`;
-- DROP TABLE IF EXISTS `jerarquia_puestos`;
-- DROP TABLE IF EXISTS `jerarquia_niveles`;

-- =====================================================
-- Nota: Este script eliminará permanentemente:
-- - La tabla jerarquia_organizacional
-- - Todos los registros de jerarquía
-- - Las relaciones jefe-empleado
-- - Las relaciones gerente-empleado
--
-- NO HAY FORMA DE RECUPERAR ESTOS DATOS DESPUÉS
-- Asegúrate de hacer un backup antes de ejecutar
-- =====================================================

-- Para verificar que se eliminó correctamente:
-- SHOW TABLES LIKE '%jerarquia%';
