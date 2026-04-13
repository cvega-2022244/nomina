# Resumen de Eliminación de Jerarquías

## Archivos Eliminados:
1. ✅ `c:\xampp\htdocs\nomina\app\gestionar-jerarquia.html` - Página de gestión de jerarquía
2. ✅ `c:\xampp\htdocs\nomina\app\js\gestionar-jerarquia.js` - JavaScript de gestión de jerarquía

## Archivos Modificados:

### HTML:
1. ✅ `app/index.html` - Eliminada sección completa de "Gestionar Jerarquía"
2. ✅ `app/crear-bono-variable.html` - Eliminado enlace del menú
3. ✅ `app/bono-variable.html` - Eliminado enlace del menú

### PHP (servidor.php):
1. ✅ Eliminado endpoint `lista_jerarquias` (línea ~8700)
2. ✅ Eliminado endpoint `guardar_jerarquia` (línea ~8751)
3. ✅ Eliminado endpoint `eliminar_jerarquia` (línea ~8794)
4. ✅ Modificadas consultas SQL que usaban INNER JOIN con `jerarquia_organizacional`:
   - Línea ~69: Comisiones rechazadas (jefe/gerente)
   - Línea ~2336: Comisiones autorizadas (jefe/gerente)
   - Línea ~2390: Comisiones pendientes (jefe/gerente)
   
**Nota**: Quedan 2 funciones en servidor.php relacionadas con jerarquía que pueden eliminarse si es necesario:
- `obtener_jefe_empleado` (línea ~8566)
- `obtener_empleados_supervisados` (línea ~8600)

## Base de Datos:

### Para eliminar la tabla de jerarquía, ejecuta:
```sql
-- Archivo: eliminar_jerarquia.sql
USE nomina;
DROP TABLE IF EXISTS `jerarquia_organizacional`;
```

### Verificar eliminación:
```sql
SHOW TABLES LIKE '%jerarquia%';
```

## Comportamiento después de eliminar jerarquías:

### Usuarios con rol "jefe" o "gerente":
- **ANTES**: Solo veían comisiones/bonos de sus empleados subordinados según la tabla jerarquia_organizacional
- **AHORA**: Ven TODAS las comisiones/bonos del sistema (mismo comportamiento que RH)

### Funcionalidad que permanece igual:
- ✅ Empleados: Solo ven sus propias solicitudes
- ✅ RH: Ve todas las solicitudes
- ✅ Sistema de roles sigue funcionando
- ✅ Creación de bonos/horas extra
- ✅ Autorización/rechazo de solicitudes

## IMPORTANTE:
⚠️ **HACER BACKUP** de la tabla `jerarquia_organizacional` antes de ejecutar el SQL:
```sql
CREATE TABLE jerarquia_organizacional_backup AS SELECT * FROM jerarquia_organizacional;
```

## Archivos generados:
- `eliminar_jerarquia.sql` - Script SQL para eliminar tablas
- `RESUMEN_ELIMINACION_JERARQUIA.md` - Este archivo
