-- ============================================================
-- SCRIPT DE CAMBIOS PARA BASE DE DATOS DE NÓMINA
-- Sistema de Roles: admin, operaciones, capturador
-- Flujo de Aprobación: operaciones → admin → nómina
-- Fecha de generación: Enero 2026
-- ============================================================

-- ============================================================
-- 1. MODIFICAR TABLA USUARIO - AGREGAR CAMPO ROL
-- ============================================================

-- Verificar si el campo 'rol' ya existe, si no, agregarlo
-- Si ya existe, modificarlo para tener los valores correctos

ALTER TABLE usuario 
MODIFY COLUMN rol ENUM('admin','operaciones','capturador') DEFAULT NULL;

-- Si el campo no existe (en caso de base de datos nueva), usar:
-- ALTER TABLE usuario ADD COLUMN rol ENUM('admin','operaciones','capturador') DEFAULT NULL;


-- ============================================================
-- 2. ASIGNAR ROLES A USUARIOS EXISTENTES
-- ============================================================

-- Asignar rol 'admin' a usuarios administradores
-- NOTA: Ajusta los IDs o nombres de usuario según tu base de datos real

-- Ejemplo: Asignar admin al usuario con id=1 (generalmente el admin principal)
UPDATE usuario SET rol = 'admin' WHERE id = 1;

-- Ejemplo: Asignar admin por nombre de usuario
UPDATE usuario SET rol = 'admin' WHERE usuario = 'admin';
UPDATE usuario SET rol = 'admin' WHERE usuario = 'ilemus';

-- Asignar rol 'operaciones' a usuarios de operaciones
UPDATE usuario SET rol = 'operaciones' WHERE usuario = 'operaciones';

-- Asignar rol 'capturador' a usuarios capturadores
UPDATE usuario SET rol = 'capturador' WHERE usuario = 'mperez';
UPDATE usuario SET rol = 'capturador' WHERE usuario = 'ljimenez';


-- ============================================================
-- 3. VERIFICAR CAMBIOS
-- ============================================================

-- Verificar estructura de la columna rol
-- SHOW COLUMNS FROM usuario LIKE 'rol';

-- Verificar usuarios con roles asignados
-- SELECT id, usuario, nombre, rol FROM usuario WHERE rol IS NOT NULL;


-- ============================================================
-- DESCRIPCIÓN DE ROLES Y FLUJO DE APROBACIÓN
-- ============================================================
-- 
-- ADMIN (admin):
--   - Acceso completo a todas las funciones del sistema
--   - Dashboard principal (index.html)
--   - Datos maestros, nómina completa, historial, reportes
--   - Puede crear bonos y horas extra (se agregan directamente a nómina)
--   - Puede APROBAR o RECHAZAR bonos creados por operaciones
--   - Acceso a página: aprobacion_bonos.html
--
-- OPERACIONES (operaciones):
--   - Acceso limitado a nómina
--   - Solo ve: Bonos, Horas Extra, Inicio de nómina
--   - NO ve: Días laborados, Descuentos, ISR
--   - Puede crear bonos y horas extra (quedan PENDIENTES de aprobación)
--   - Redirige a nomina.html al iniciar sesión
--
-- CAPTURADOR (capturador):
--   - Acceso solo a gestión de empleados
--   - Solo ve la página de empleados
--   - Redirige a empleados.html al iniciar sesión
--
-- ============================================================
-- FLUJO DE APROBACIÓN DE BONOS/HORAS EXTRA:
-- ============================================================
--
-- 1. Operaciones crea un bono/hora extra
--    → Se guarda con id_estado = 1 (Pendiente)
--    → NO se agrega a la nómina aún
--
-- 2. Admin entra a aprobacion_bonos.html
--    → Ve lista de bonos/horas extra pendientes
--    → Puede aprobar o rechazar
--
-- 3. Si Admin APRUEBA:
--    → Cambia a id_estado = 8 (Aprobado)
--    → Se agrega a pago_lote (nómina del empleado)
--
-- 4. Si Admin RECHAZA:
--    → Cambia a id_estado = 9 (Rechazado)
--    → NO se agrega a la nómina
--
-- ESTADOS en tabla comision:
--   1 = Pendiente aprobación
--   8 = Aprobado (agregado a nómina)
--   9 = Rechazado
--
-- ============================================================


-- ============================================================
-- ROLLBACK (En caso de necesitar revertir)
-- ============================================================
-- 
-- Para eliminar el campo rol:
-- ALTER TABLE usuario DROP COLUMN rol;
--
-- Para dejar el campo pero sin valores:
-- UPDATE usuario SET rol = NULL;
-- 
-- ============================================================
