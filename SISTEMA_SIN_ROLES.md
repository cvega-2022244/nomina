# Sistema Sin Roles - Simplificado

## Fecha: 2025-12-29

## Cambios Realizados:

### 1. Sistema de Guardado Simplificado (servidor-bonos.php)
✅ **Estado de bonos/horas extra**: Todos se guardan directamente como **"Aprobado RH" (estado 8)**
- Ya no hay flujo de aprobación
- No se verifica el rol del solicitante
- Todos los registros se guardan inmediatamente como aprobados

### 2. Sistema de Roles Deshabilitado (role_manager.js)
✅ **Todas las funciones retornan `true`**:
- `hasRole()` → siempre true
- `hasAnyRole()` → siempre true
- `isRH()` → siempre true
- `isJefeOrGerente()` → siempre true
- `isEmpleado()` → siempre true
- `canCreateBonos()` → siempre true
- `canApproveBonos()` → siempre true
- `redirectIfNoPermission()` → siempre true

✅ **Funciones de ocultamiento deshabilitadas**:
- `hideElementsByRole()` → No oculta nada
- `hideMenuItemsByRole()` → No oculta nada

### 3. Funcionamiento Actual:

#### Al crear un Bono:
1. Usuario selecciona empleados (múltiples)
2. Llena el formulario de bono
3. Click en "Guardar"
4. **Se guarda directamente en la base de datos con estado 8 (Aprobado RH)**
5. Aparece inmediatamente en:
   - Lista de bonos autorizados
   - Panel de bonos
   - Reportes

#### Al crear una Hora Extra:
1. Usuario selecciona empleados (múltiples)
2. Llena el formulario de hora extra
3. Click en "Guardar"
4. **Se guarda directamente en la base de datos con estado 8 (Aprobado RH)**
5. Aparece inmediatamente en las mismas listas

### 4. Tabla `comision` actualizada:
```sql
ALTER TABLE `comision` 
ADD COLUMN `tipo_registro` VARCHAR(20) DEFAULT 'bono' COMMENT 'Tipo: bono o hora_extra' AFTER `seleccionado`;

ALTER TABLE `comision` 
ADD COLUMN `autorizado_cenas` TINYINT(1) DEFAULT 0 COMMENT 'Si está autorizado para cenas' AFTER `tipo_registro`;
```

### 5. Estados en la tabla `estado_bono`:
- **Estado 1**: Solicitado
- **Estado 5**: Pendiente Jefe
- **Estado 6**: Autorizado Jefe
- **Estado 7**: Pendiente RH
- **Estado 8**: Aprobado RH ← **TODOS los registros usan este estado ahora**
- **Estado 3**: Rechazado

### 6. Acceso al Sistema:
✅ **Todos los usuarios pueden**:
- Ver todas las secciones del menú
- Crear bonos y horas extra
- Ver todos los registros
- Acceder a todas las funcionalidades

### 7. Para Reactivar el Sistema de Roles (en el futuro):

#### Paso 1: Restaurar servidor-bonos.php
Cambiar la línea:
```php
$estado_inicial = 8; // Aprobado RH (directamente guardado)
```

Por:
```php
// Obtener el rol del solicitante
$solicitante_id = $_POST['id_solicitante'];
$sql_rol = "SELECT rol FROM usuario WHERE id = " . $solicitante_id;
$result_rol = mysqli_query($con, $sql_rol);

$estado_inicial = 1; // Por defecto: Solicitado
if ($result_rol && mysqli_num_rows($result_rol) > 0) {
    $rol_data = mysqli_fetch_array($result_rol);
    $rol_solicitante = $rol_data['rol'];
    
    if ($rol_solicitante == 'empleado') {
        $estado_inicial = 5; // Pendiente Jefe
    } else if ($rol_solicitante == 'jefe' || $rol_solicitante == 'gerente') {
        $estado_inicial = 7; // Pendiente RH
    } else if ($rol_solicitante == 'rh') {
        $estado_inicial = 8; // Aprobado RH
    }
}
```

#### Paso 2: Restaurar role_manager.js
Eliminar las líneas que retornan `true` y descomentar la lógica original.

## Ventajas del Sistema Actual (Sin Roles):
✅ Más simple y directo
✅ No hay bloqueos ni permisos
✅ Todos pueden trabajar libremente
✅ Ideal para testing y desarrollo
✅ Fácil de revertir cuando sea necesario

## Notas Importantes:
⚠️ **Este es un sistema temporal para facilitar el desarrollo**
⚠️ Los archivos originales NO fueron eliminados, solo modificados
⚠️ Puedes reactivar los roles en cualquier momento siguiendo los pasos arriba
