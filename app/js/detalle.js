$(document).ready(function () {
    cargando();
    datos_empleado();
});

function formatear_numeros(numero) {
    const number = numero;
    const locale = 'es-GT';

    const options = {
        style: 'currency',
        currency: 'GTQ',
        minimumIntegerDigits: 2,
    };

    const formattedNumber = new Intl.NumberFormat(locale, options).format(number);
    return formattedNumber;
}

function datos_empleado() {
    return new Promise((resolve) => {
        const id_empleado = sessionStorage.getItem("id_empleado");
        
        if (!id_empleado) {
            console.error('ID de empleado no encontrado en sessionStorage');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID de empleado no encontrado'
            });
            resolve();
            return;
        }
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'datos_empleado_bono',
                id_empleado: id_empleado
            },
            success: function (res) {
                // Validar respuesta
                if (!res || typeof res !== 'string') {
                    console.error('Respuesta inválida para datos empleado:', res);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Datos Del Empleado',
                        text: 'Respuesta inválida del servidor'
                    });
                    resolve();
                    return;
                }

                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Datos Del Empleado',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.error('Error en consulta:', res);
                    resolve();
                    return;
                }

                if (res.includes('No hay datos') || res.trim() === 'No') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Datos Del Empleado',
                        text: 'No se encontraron datos del empleado'
                    });
                    console.log('No hay datos del empleado:', res);
                    resolve();
                    return;
                }

                try {
                    const lista = JSON.parse(res);
                    
                    if (Array.isArray(lista) && lista.length > 0) {
                        const empleado = lista[0];
                        document.getElementById("primer_nombre").value = empleado.primer_nombre || '';
                        document.getElementById("segundo_nombre").value = empleado.segundo_nombre || '';
                        document.getElementById("otro_nombre").value = empleado.otro_nombre || '';
                        document.getElementById("primer_apellido").value = empleado.primer_apellido || '';
                        document.getElementById("segundo_apellido").value = empleado.segundo_apellido || '';
                        document.getElementById("departamento").value = empleado.nombre_departamento || 'Sin Departamento';
                    }
                } catch (error) {
                    console.error('Error al parsear datos del empleado:', error);
                    console.error('Respuesta recibida:', res);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Procesar Datos',
                        text: 'Error al procesar los datos del empleado'
                    });
                } finally {
                    resolve();
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX en datos_empleado:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error De Conexión',
                    text: 'No se pudo conectar con el servidor'
                });
                resolve();
            }
        });
    }).then(() => {
        datos_bono();
    })
}

function datos_bono() {
    return new Promise((resolve) => {
        const id_bono = sessionStorage.getItem("id_bono");
        const origen = sessionStorage.getItem("origen_bono") || 'bono'; // 'bono' o 'comision'
        
        if (!id_bono) {
            console.error('ID de bono no encontrado en sessionStorage');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID de bono no encontrado'
            });
            resolve();
            return;
        }
        
        console.log('🔍 Buscando bono ID:', id_bono, 'Origen:', origen);
        
        // Primero intentar buscar en la tabla comision
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'detalle_comision',
                id: id_bono
            },
            success: function (res) {
                console.log('📋 Respuesta detalle_comision:', res);
                
                // Verificar si hay datos en comision
                let encontrado = false;
                if (res && !res.includes('Query Falló') && !res.includes('No hay datos') && res.trim() !== 'No' && res.trim() !== '[]') {
                    try {
                        const lista = JSON.parse(res);
                        if (Array.isArray(lista) && lista.length > 0) {
                            encontrado = true;
                            llenarDatosBono(lista[0]);
                        }
                    } catch (e) {
                        console.log('No es JSON válido de comision, intentando en bono...');
                    }
                }
                
                // Si no se encontró en comision, buscar en bono (tabla antigua)
                if (!encontrado) {
                    buscarEnTablaBono(id_bono, resolve);
                } else {
                    resolve();
                }
            },
            error: function () {
                // Si falla la búsqueda en comision, intentar en bono
                buscarEnTablaBono(id_bono, resolve);
            }
        });
    }).then(() => {
        Swal.close();
    })
}

// Función para buscar en la tabla bono (antigua)
function buscarEnTablaBono(id_bono, resolve) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        dataType: 'text',
        data: {
            quest: 'detalle_bono',
            id: id_bono
        },
        success: function (res) {
            console.log('📋 Respuesta detalle_bono:', res);
            
            if (!res || typeof res !== 'string') {
                console.error('Respuesta inválida para datos bono:', res);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Obtener Datos Del Bono',
                    text: 'Respuesta inválida del servidor'
                });
                resolve();
                return;
            }

            if (res.includes('Query Falló')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Obtener Datos Del Bono',
                    text: 'Por favor, comunicate con sistemas'
                });
                console.error('Error en consulta bono:', res);
                resolve();
                return;
            }

            if (res.includes('No hay datos') || res.trim() === 'No' || res.trim() === '[]') {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Hay Datos Del Bono',
                    text: 'No se encontraron datos del bono en ninguna tabla'
                });
                console.log('No hay datos del bono:', res);
                resolve();
                return;
            }

            try {
                const lista = JSON.parse(res);
                
                if (Array.isArray(lista) && lista.length > 0) {
                    llenarDatosBono(lista[0]);
                }
            } catch (error) {
                console.error('Error al parsear datos del bono:', error);
                console.error('Respuesta recibida:', res);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Procesar Datos',
                    text: 'Error al procesar los datos del bono'
                });
            } finally {
                resolve();
            }
        },
        error: function (xhr, status, error) {
            console.error('Error AJAX en datos_bono:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error De Conexión',
                text: 'No se pudo conectar con el servidor'
            });
            resolve();
        }
    });
}

// Función para llenar los campos del formulario
function llenarDatosBono(bono) {
    console.log('✅ Llenando datos del bono:', bono);
    
    document.getElementById("empresa_labor").value = bono.empresa || 'Sin empresa';
    document.getElementById("fecha_labor").value = bono.fecha_trabajado || '';
    document.getElementById("fecha_solicitud").value = bono.fecha_generado || '';
    document.getElementById("horas_trabajadas").value = bono.horas || '0';
    
    // Jornada: 1 = Diurna, 2 = Nocturna
    if (bono.tipo_jornada == 2) {
        document.getElementById("jornada").value = "Nocturna";
    } else {
        document.getElementById("jornada").value = "Diurna";
    }
    
    document.getElementById("monto").value = formatear_numeros(bono.monto || 0);
    document.getElementById("solicitante").value = bono.usuario || 'Sin solicitante';
    document.getElementById("tarea").value = bono.tarea || '';
    document.getElementById("estado").value = bono.estado || 'Sin estado';
    
    // Mostrar autorizado cenas si existe el campo
    const autorizadoCenasEl = document.getElementById("autorizado_cenas");
    if (autorizadoCenasEl) {
        autorizadoCenasEl.value = bono.autorizado_cenas == 1 ? "Sí" : "No";
    }
    
    if (bono.estado == "Rechazado") {
        const obsEl = document.getElementById("input_obs_gerencia");
        if (obsEl) {
            obsEl.style.display = "block";
            document.getElementById("obs_gerencia").value = bono.observacion || '';
        }
    }
}

function cargando() {
    Swal.fire({
        title: 'Procesando...',
        html: 'Esto puede demorar unos momentos, de tardar demasiado recargue la pagina',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}
