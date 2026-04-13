-- Script para asignar roles iniciales a usuarios existentes
-- Ejecutar este script para configurar los roles básicos

-- Asignar roles según los usuarios existentes
-- Ajustar los IDs según los usuarios reales en tu base de datos

-- RH (Recursos Humanos) - Acceso completo
UPDATE usuario SET rol = 'rh' WHERE usuario IN ('admin', 'operaciones');

-- Jefes - Pueden aprobar solicitudes de empleados
UPDATE usuario SET rol = 'jefe' WHERE usuario IN ('ilemus');

-- Gerentes - Mismo nivel que jefes, pueden aprobar solicitudes
UPDATE usuario SET rol = 'gerente' WHERE usuario IN ('ljimenez');

-- Empleados - Solo pueden crear solicitudes
UPDATE usuario SET rol = 'empleado' WHERE usuario IN ('mperez', 'clorenzana');

-- Verificar los roles asignados
SELECT id, usuario, nombre, rol FROM usuario ORDER BY rol, nombre;


