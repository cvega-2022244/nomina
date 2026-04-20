# Documentación Técnica: Cálculo de Nómina Completa y División en Quincenas

## Resumen Ejecutivo

El sistema de nómina calcula el **"Líquido a Recibir"** dividiéndolo en dos períodos de pago mensuales (quincenas). La arquitectura utiliza una base de datos MySQL con tablas relacionadas y consultas SQL complejas en PHP (sin procedimientos almacenados) que ejecutan toda la lógica de cálculo.

---

## 1. Arquitectura General del Sistema

### 1.1 Tecnología Base
- **Base de datos**: MySQL (base `nomina`)
- **Backend**: PHP (archivo principal: `/app/php/servidor.php`)
- **Interfaz**: HTML/JavaScript en `/app/` directory
- **Modelo de Pago**: Biweekly (dos quincenas por mes)

### 1.2 Tablas Principales

| Tabla | Propósito | Campo Clave |
|-------|-----------|------------|
| `lote` | Agrupa pagos por período | `quincena` (0=primera, 1=segunda) |
| `pago_lote` | Almacena cálculos individuales por empleado | `liquido`, `ingresos_tot`, `egresos_tot` |
| `empleado` | Datos maestros de empleados | `sueldo_ordinario`, `bon_incentivo`, `bon_dec_37_2001` |
| `descuento_variable` | Descuentos configurables | `monto_total`, `cuotas`, `faltan` |
| `descuento_lote` | Descuentos asignados por período | Links `descuento_variable` a `pago_lote` |
| `comision` | Bonificaciones y comisiones | `monto`, `tipo_registro` (bono/comisión) |

---

## 2. Modelo de Datos: División en Quincenas

### 2.1 El Campo "Quincena" en la Tabla `lote`

```
lote.quincena = 0  → PRIMERA QUINCENA (días 1-15)
lote.quincena = 1  → SEGUNDA QUINCENA (días 16-último día)
```

**Ejemplo de estructura para un mes de junio 2024:**

```
id_lote  | mes | año | quincena | fecha_inicio | fecha_fin
---------|-----|-----|----------|--------------|----------
101      | 6   | 2024| 0        | 2024-06-01   | 2024-06-15
102      | 6   | 2024| 1        | 2024-06-16   | 2024-06-30
```

### 2.2 Estructura de `pago_lote` (Un Registro por Empleado/Quincena)

Cada empleado tiene DOS registros en `pago_lote` por mes (uno para cada quincena):

```
id  | id_empleado | id_lote | fecha_pago | liquido    | ingresos_tot | egresos_tot
----|-------------|---------|------------|------------|--------------|-------------
1   | 5           | 101     | 2024-06-15 | 3,500.00   | 4,200.00     | 700.00
2   | 5           | 102     | 2024-06-30 | 3,800.00   | 4,500.00     | 700.00
```

---

## 3. Fórmula Principal: Cálculo de "Líquido a Recibir"

### 3.1 Fórmula General

$$\text{LÍQUIDO A RECIBIR} = \text{INGRESOS TOTALES} - \text{EGRESOS TOTALES}$$

### 3.2 Desglose por Componente

#### **INGRESOS TOTALES (ingresos_tot)**

$$\text{INGRESOS} = \text{Salario Ordinario} + \text{Bonificaciones} + \text{Horas Extras} + \text{Otros Ingresos}$$

**Componentes:**

1. **Salario Ordinario** (sueldo_quincenal):
   $$\text{Salario Ordinario} = \frac{\text{Sueldo Mensual}}{30} \times \text{Días Laborados}$$

2. **Bonificación de Incentivo** (bon_tot):
   $$\text{Bon Incentivo} = \frac{\text{Bon Incentivo Mensual}}{30} \times \text{Días Laborados}$$

3. **Bonificación Decreto 37-2001** (bon_dec_tot):
   $$\text{Bon Decreto} = \frac{\text{Bon Decreto 37-2001}}{30} \times \text{Días Laborados}$$

4. **Horas Extras**:
   - `horas_dia`: Horas simples (25% adicional)
   - `horas_noche`: Horas nocturnas (100% adicional)

5. **Comisiones y Bonos Variables**:
   ```sql
   SELECT SUM(monto) FROM comision 
   WHERE id_empleado = ? 
   AND seleccionado = 1 
   AND id_estado = 2 
   AND tipo_registro = 'bono'
   ```

6. **Otros Ingresos** (otros_ingresos): Ingresos especiales configurables

#### **EGRESOS TOTALES (egresos_tot)**

$$\text{EGRESOS} = \text{Impuestos} + \text{Descuentos Obligatorios} + \text{Descuentos Voluntarios}$$

**Componentes:**

| Concepto | Tipo | Descripción |
|----------|------|-------------|
| **IGSS** | Obligatorio | Instituto Guatemalteco de Seguridad Social (~4.83%) |
| **ISR** | Obligatorio | Impuesto Sobre la Renta (progresivo según ley) |
| **Cafetería** | Variable | Descuento de plan de cafetería |
| **Celular** | Variable | Descuento de plan celular corporativo |
| **Uniforme** | Variable | Descuento de uniforme |
| **Calzado** | Variable | Descuento de calzado |
| **Equipo** | Variable | Descuento de equipo personal |
| **Producto** | Variable | Descuento de productos |
| **Bancos** | Variable | Descuento por préstamos bancarios |
| **Otros** | Variable | Otros descuentos configurables |
| **Judiciales** | Especial | Embargos judiciales |
| **Seguro** | Especial | Seguros adicionales |
| **Parqueo** | Especial | Estacionamiento |
| **Boleta de Ornato** | Municipal | Pago municipal |

**Cálculo de descuentos variables:**

Para cada tipo de descuento (Cafetería, Celular, etc.):

$$\text{Descuento Periodo} = \frac{\text{Monto Total}}{{\text{Cuotas}}} \times 1$$

Donde:
- El descuento se obtiene de `descuento_variable` table
- Solo se incluyen descuentos con `faltan > 0` (cuotas pendientes)
- `estado = 1` (activo) y `seleccionado = 1` (seleccionado)

---

## 4. Lógica de Quincenas: El Patrón CASE WHEN

### 4.1 La Consulta Principal (Patrón Clave)

La consulta SQL utiliza un **auto-join** para vincular ambas quincenas del mismo mes:

```sql
SELECT 
    pl.id,
    pl.id_empleado,
    -- ... campos básicos ...
    
    -- PRIMERA QUINCENA
    CASE WHEN l.quincena = 0 
        THEN pl.liquido 
        ELSE COALESCE(pla.liquido, 0) 
    END AS liquido_primer_quincena,
    
    -- SEGUNDA QUINCENA
    CASE WHEN l.quincena = 0 
        THEN 0 
        ELSE pl.liquido 
    END AS liquido_segunda_quincena,
    
    -- TOTAL A RECIBIR
    CASE WHEN l.quincena = 0 
        THEN pl.liquido 
        ELSE pl.liquido + COALESCE(pla.liquido, 0) 
    END AS liquido_recibir
    
FROM pago_lote pl

-- Auto-join para traer la otra quincena del mismo mes
LEFT JOIN (SELECT * FROM pago_lote) pla 
    ON pla.id_empleado = pl.id_empleado 
    AND pla.id_empleado = pl.id_empleado 
    AND MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote)
    AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote)
    AND pla.id_lote != pl.id_lote  -- Diferente período

LEFT JOIN lote l ON l.id = pl.id_lote
```

### 4.2 Interpretación de la Lógica

#### **Cuando se procesa la PRIMERA QUINCENA (`l.quincena = 0`)**

| Campo | Fórmula | Resultado |
|-------|---------|-----------|
| `liquido_primer_quincena` | `pl.liquido` | Muestra el líquido de la primera quincena |
| `liquido_segunda_quincena` | `0` | **Es CERO** (aún no se ha trabajado) |
| `liquido_recibir` | `pl.liquido` | Solo el de la primera quincena |

**Ejemplo:**
```
Empleado: Juan García
Período: Junio 1-15, 2024 (quincena = 0)

Salario Ordinario:      Q. 1,500.00
Bonificación:           Q.   300.00
Horas Extras:           Q.   200.00
INGRESOS TOTALES:       Q. 2,000.00

IGSS:                   Q.    96.50
ISR:                    Q.   250.00
Cafetería:              Q.    50.00
EGRESOS TOTALES:        Q.   396.50

LÍQUIDO PRIMER QUINCENA:   Q. 1,603.50
LÍQUIDO SEGUNDA QUINCENA:  Q.     0.00
LÍQUIDO A RECIBIR:         Q. 1,603.50
```

#### **Cuando se procesa la SEGUNDA QUINCENA (`l.quincena = 1`)**

| Campo | Fórmula | Resultado |
|-------|---------|-----------|
| `liquido_primer_quincena` | `COALESCE(pla.liquido, 0)` | Trae el liquido de la primera quincena (del JOIN) |
| `liquido_segunda_quincena` | `pl.liquido` | Muestra el líquido de la segunda quincena (actual) |
| `liquido_recibir` | `pl.liquido + pla.liquido` | Suma de ambas quincenas (nómina completa) |

**Ejemplo (mismo empleado, segunda quincena):**
```
Empleado: Juan García
Período: Junio 16-30, 2024 (quincena = 1)

SEGUNDA QUINCENA:
Salario Ordinario:      Q. 1,700.00
Bonificación:           Q.   350.00
Horas Extras:           Q.   150.00
INGRESOS TOTALES:       Q. 2,200.00

IGSS:                   Q.   106.20
ISR:                    Q.   280.00
Cafetería:              Q.    50.00
EGRESOS TOTALES:        Q.   436.20

LÍQUIDO SEGUNDA QUINCENA:  Q. 1,763.80
LÍQUIDO PRIMERA QUINCENA:  Q. 1,603.50 (traído del JOIN)
LÍQUIDO A RECIBIR:         Q. 3,367.30 (NÓMINA COMPLETA DEL MES)
```

---

## 5. Cálculo Detallado del "Líquido de la Segunda Quincena"

### 5.1 Fórmula Completa de `liquido_segunda_quincena`

Cuando `l.quincena = 1`:

$$\text{Liquido 2da Quincena} = \left( \sum \text{Ingresos Ambas Quincenas} \right) - \left( \sum \text{Egresos Ambas Quincenas} \right) - \text{Liquido 1ra Quincena}$$

### 5.2 Componentes en Detalle

#### **Ingresos Ambas Quincenas:**

```
(sueldo_quincenal[Q1] + sueldo_quincenal[Q2]) +
(bon_tot[Q1] + bon_tot[Q2]) +
(bon_dec_tot[Q1] + bon_dec_tot[Q2]) +
(horas_dia[Q1] + horas_dia[Q2]) +
(horas_noche[Q1] + horas_noche[Q2]) +
(otros_ingresos[Q1] + otros_ingresos[Q2]) +
bonos_totales_mes
```

Donde:
- Parámetros con `[Q1]` vienen de `pla` (primera quincena)
- Parámetros con `[Q2]` vienen de `pl` (segunda quincena actual)

#### **Egresos Ambas Quincenas:**

```
(igss[Q1] + igss[Q2]) +
(isr[Q1] + isr[Q2]) +
(cafetería) +  // Variable, igual para ambas quincenas
(celular) +
(uniforme) +
(calzado) +
(equipo) +
(producto) +
(bancos) +
(otros_descuentos) +
(judiciales[Q1] + judiciales[Q2]) +
(seguro[Q1] + seguro[Q2]) +
(parqueo[Q1] + parqueo[Q2]) +
(boleto_ornato) +
(otros_egresos[Q1] + otros_egresos[Q2])
```

### 5.3 Ejemplo Numérico Completo

```
Empleado: María López | Sueldo: Q. 3,500/mes

=== PRIMERA QUINCENA (1-15) ===
Días Laborados:    15 días

Ingresos:
  Salario:         (3,500 / 30) × 15 = Q. 1,750.00
  Bonificación:    (500 / 30) × 15   = Q.   250.00
  Horas Extras:    Q.   100.00
  TOTAL Q1:        Q. 2,100.00

Egresos:
  IGSS (4.83%):    Q.   101.43
  ISR:             Q.   300.00
  Cafetería:       Q.    50.00
  TOTAL Q1:        Q.   451.43

LÍQUIDO Q1 = 2,100.00 - 451.43 = Q. 1,648.57

=== SEGUNDA QUINCENA (16-30) ===
Días Laborados:    15 días

Ingresos:
  Salario:         (3,500 / 30) × 15 = Q. 1,750.00
  Bonificación:    (500 / 30) × 15   = Q.   250.00
  Horas Extras:    Q.   150.00
  TOTAL Q2:        Q. 2,150.00

Egresos:
  IGSS (4.83%):    Q.   103.85
  ISR:             Q.   310.00
  Cafetería:       Q.    50.00
  TOTAL Q2:        Q.   463.85

CÁLCULO DEL LÍQUIDO Q2:
Ingresos Total Mes = Q2 + Q1 = 2,150.00 + 2,100.00 = Q. 4,250.00
Egresos Total Mes  = Q2 + Q1 = 463.85 + 451.43   = Q.   915.28

Líquido 2da Quincena = 4,250.00 - 915.28 - 1,648.57
                     = Q. 1,686.15

RESUMEN FINAL:
Líquido Primera Quincena:   Q. 1,648.57
Líquido Segunda Quincena:   Q. 1,686.15
═══════════════════════════════
NÓMINA COMPLETA DEL MES:    Q. 3,334.72
```

---

## 6. Descuentos Especiales: Sistema `descuento_variable`

### 6.1 Tabla `descuento_variable`

```sql
CREATE TABLE descuento_variable (
    id INT PRIMARY KEY,
    id_empleado INT,
    tipo_egreso VARCHAR(50),      -- Cafeteria, Celular, Uniforme, etc.
    monto_total DECIMAL(10,2),    -- Total a descontar
    cuotas INT,                   -- Número de cuotas
    faltan INT,                   -- Cuotas restantes
    estado INT,                   -- 1 = activo, 0 = inactivo
    seleccionado INT              -- 1 = seleccionado, 0 = no
);
```

### 6.2 Cálculo del Descuento Periódico

$$\text{Descuento por Período} = \frac{\text{Monto Total}}{\text{Cuotas}}$$

**Ejemplo:**
```
Descuento de Cafetería:
- Monto Total a Descontar: Q. 600.00
- Cuotas: 12 meses
- Descuento Mensual: 600.00 / 12 = Q. 50.00 ✓
- Este Q. 50.00 se descuenta en CADA QUINCENA
```

### 6.3 Query para Obtener Descuentos (Patrón Used)

```sql
COALESCE(
    ( SELECT SUM(monto_total / cuotas) cuotas 
      FROM descuento_variable 
      WHERE tipo_egreso = 'Cafeteria'
      AND faltan > 0               -- Aún quedan cuotas
      AND estado = 1               -- Activo
      AND seleccionado = 1         -- Seleccionado
      AND id_empleado = e.id 
    ), 0
)
```

---

## 7. Archivos Clave del Sistema

### 7.1 Backend

**Archivo Principal:** `/app/php/servidor.php`

**Query Handlers (funciones principales):**
- `'listado_pagos'` - Lista de pagos general
- `'listado_pagos_centro'` - Por centro de costo
- `'listado_pagos_departamento'` - Por departamento
- `'detalle_pago'` - Detalles completos con split de quincenas
- `'listado_pagos_historial'` - Histórico de pagos
- `'simulacion'` - Simulación de nómina antes de confirmar

**Líneas clave:**
- Línea ~1073: Query con CASE WHEN para quincenas (histórico)
- Línea ~5291: Cálculo detallado de `liquido_segunda_quincena`
- Línea ~5484: Query completa con todas las validaciones

### 7.2 Frontend

**Archivos HTML:**
- `/app/nomina.html` - Interfaz principal de nómina
- `/app/detalle_lote.html` - Detalles de un lote específico
- `/app/pagos.html` - Gestión de pagos
- `/app/simulacion.html` - Simulador de nómina

**Archivos JavaScript:**
- `/app/js/nomina.js` - Lógica de procesamiento de nómina
- `/app/js/pagos.js` - Manejo de pagos
- `/app/js/simulacion.js` - Simulador
- `/app/js/recibo.js` - Generación de recibos

---

## 8. Flujo Completo de Cálculo

```
┌─────────────────────────────────────┐
│  1. CREAR LOTE DE NÓMINA            │
│     (quincena = 0)                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. INGRESAR DATOS (Q1)             │
│     - Días laborados                │
│     - Horas extras                  │
│     - Bonificaciones                │
│     - Comisiones                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. CALCULAR INGRESOS y EGRESOS Q1  │
│     - Salario ordinario             │
│     - IGSS, ISR, descuentos         │
│     - GUARDAR en pago_lote          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. CONFIRMAR PAGO Q1               │
│     - liquido_primer_quincena = Q1  │
│     - liquido_segunda_quincena = 0  │
│     - liquido_recibir = Q1          │
└──────────────┬──────────────────────┘
               │
        (15-20 días después)
               │
               ▼
┌─────────────────────────────────────┐
│  5. CREAR LOTE SEGUNDA QUINCENA     │
│     (quincena = 1)                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  6. INGRESAR DATOS (Q2)             │
│     - Días laborados                │
│     - Horas extras                  │
│     - Bonificaciones                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  7. CALCULAR CON JOIN A Q1          │
│     - LEFT JOIN pago_lote (Q1)      │
│     - Ingresos Q1 + Q2              │
│     - Egresos Q1 + Q2               │
│     - liquido_segunda_quincena =    │
│       (total_ingresos - total_egre- │
│        sos - liquido_Q1)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  8. MOSTRAR NÓMINA COMPLETA         │
│     - liquido_primer_quincena       │
│     - liquido_segunda_quincena      │
│     - liquido_recibir (total mes)   │
└─────────────────────────────────────┘
```

---

## 9. Validaciones y Reglas de Negocio

### 9.1 Validaciones en el SQL

1. **Solo un lote activo por período:**
   ```sql
   WHERE id_lote IN (SELECT id FROM lote WHERE id_estado = 1)
   ```

2. **Fechas válidas:**
   ```sql
   WHERE MONTH(fecha_pago_lote) = MONTH(actual)
   AND YEAR(fecha_pago_lote) = YEAR(actual)
   ```

3. **Descuentos pendientes:**
   ```sql
   WHERE faltan > 0  -- Aún hay cuotas pendientes
   ```

4. **Registros seleccionados:**
   ```sql
   WHERE seleccionado = 1
   ```

### 9.2 Reglas de Negocio

1. La "segunda quincena" siempre incluye el cálculo acumulado de ambas semanas
2. Los descuentos variables se aplican a TODA la quincena (no se dividen)
3. Si no existe registro en `descuento_lote` para Q2, se busca en `descuento_variable`
4. Los bonos se incluyen solo si tienen `id_estado = 2` (aprobados)
5. El sistema soporta hasta 30 descuentos diferentes por empleado

---

## 10. Consultas SQL Clave

### 10.1 Obtener Liquidación Completa de un Empleado

```sql
SELECT 
    e.nombre_empleado,
    CASE WHEN l.quincena = 0 
        THEN pl.liquido 
        ELSE COALESCE(pla.liquido, 0) 
    END AS liquido_primera_quincena,
    CASE WHEN l.quincena = 0 
        THEN 0 
        ELSE pl.liquido 
    END AS liquido_segunda_quincena,
    CASE WHEN l.quincena = 0 
        THEN pl.liquido 
        ELSE pl.liquido + COALESCE(pla.liquido, 0) 
    END AS liquido_total_mes,
    pl.ingresos_tot,
    pl.egresos_tot
FROM pago_lote pl
LEFT JOIN (SELECT * FROM pago_lote) pla 
    ON pla.id_empleado = pl.id_empleado 
    AND MONTH(pla.fecha_pago_lote) = MONTH(pl.fecha_pago_lote)
    AND YEAR(pla.fecha_pago_lote) = YEAR(pl.fecha_pago_lote)
    AND pla.id_lote != pl.id_lote
LEFT JOIN lote l ON l.id = pl.id_lote
LEFT JOIN empleado e ON e.id = pl.id_empleado
WHERE MONTH(pl.fecha_pago_lote) = MONTH(NOW())
  AND YEAR(pl.fecha_pago_lote) = YEAR(NOW());
```

### 10.2 Validar si Existe Segundo Quincena

```sql
SELECT COUNT(*) FROM pago_lote pl
INNER JOIN lote l ON l.id = pl.id_lote
WHERE pl.id_empleado = ? 
  AND MONTH(pl.fecha_pago_lote) = ?
  AND YEAR(pl.fecha_pago_lote) = ?
  AND l.quincena = 1;
```

---

## 11. Ejemplo de Auditoría: Rastreo de Liquidación

**Pregunta:** ¿Cómo verificar qué se descont que se descontó exactamente en cada quincena?

**Solución:**

```sql
-- Descuentos Q1
SELECT dv.tipo_egreso, dv.monto_total, dv.cuotas, 
       (dv.monto_total / dv.cuotas) AS descuento_quincenal
FROM descuento_variable dv
WHERE dv.id_empleado = ?
  AND dv.estado = 1
  AND dv.seleccionado = 1
  AND dv.faltan > 0
ORDER BY dv.tipo_egreso;

-- Descuentos Lote Específico (Q2 si aplica)
SELECT dl.*, dv.tipo_egreso, dv.monto_total / dv.cuotas AS cuota
FROM descuento_lote dl
INNER JOIN descuento_variable dv ON dv.id = dl.id_descuento
WHERE dl.id_pago_lote = ?
ORDER BY dv.tipo_egreso;
```

---

## Conclusión

El sistema implementa un modelo **biweekly** sofisticado utilizando:

1. **Base de datos relacional** - Separación clara entre períodos mediante `quincena` field
2. **Lógica SQL compleja** - CASE WHEN y LEFT JOINs para agregar datos de ambas quincenas
3. **Cálculos dinámicos** - Todos los cálculos ocurren en la consulta, no en aplicación
4. **Descuentos variables** - Sistema flexible de descuentos por período o mes

La **nómina completa** se calcula mostrando:
- **Primer quincena**: Sólo su período individual
- **Segunda quincena**: Suma acumulada + desglose de ambos períodos

Este diseño permite reportes precisos de cuánto recibe cada empleado en cada quincena y cuál es el total mensual.
