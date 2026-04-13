-- =====================================================
-- SCRIPT DE LIMPIEZA DEL SISTEMA DE ROLES
-- Fecha: Enero 2026
-- Descripción: Elimina tabla jerarquia_organizacional
--              y simplifica roles a: admin, operaciones, capturador
-- =====================================================

USE nomina;

-- =====================================================
-- 1. BACKUP de tablas antes de eliminar
-- =====================================================
CREATE TABLE IF NOT EXISTS jerarquia_organizacional_backup AS 
SELECT * FROM jerarquia_organizacional;

-- =====================================================
-- 2. ELIMINAR tabla jerarquia_organizacional
-- =====================================================
DROP TABLE IF EXISTS `jerarquia_organizacional`;

-- =====================================================
-- 3. ACTUALIZAR ROLES en tabla usuario
--    Nuevos roles: admin, operaciones, capturador
-- =====================================================

-- Convertir roles antiguos a nuevos:
-- rh -> operaciones
-- jefe -> capturador  
-- gerente -> capturador
-- empleado -> capturador
-- admin (mantener como admin)

UPDATE usuario SET rol = 'admin' WHERE rol = 'admin' OR usuario = 'admin';
UPDATE usuario SET rol = 'operaciones' WHERE rol = 'rh';
UPDATE usuario SET rol = 'capturador' WHERE rol IN ('jefe', 'gerente', 'empleado');

-- Asegurar que usuarios sin rol tengan rol capturador
UPDATE usuario SET rol = 'capturador' WHERE rol IS NULL OR rol = '';

-- =====================================================
-- 4. VERIFICAR resultados
-- =====================================================
SELECT id, usuario, nombre, rol FROM usuario ORDER BY rol, nombre;

-- =====================================================
-- 5. VERIFICAR que la tabla fue eliminada
-- =====================================================
SHOW TABLES LIKE '%jerarquia%';

-- =====================================================
-- RESUMEN DE ROLES:
-- - admin: Acceso total al sistema
-- - operaciones: Procesar nómina, aprobar bonos, etc.
-- - capturador: Captura de información básica
-- =====================================================
