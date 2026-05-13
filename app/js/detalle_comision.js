$(document).ready(function () {
    cargando();
    datos_empleado();
});

// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function formatear_numeros(numero) {
    const number = numero;
    const locale = 'es-GT'; // The locale of the user's browser

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
        const id_empleado = getUrlParameter('id_empleado');
        
        // Validar que id_empleado sea un número válido mayor que 0
        if (!id_empleado || id_empleado === 'undefined' || id_empleado === 'null' || id_empleado === '0' || isNaN(parseInt(id_empleado))) {
            console.warn('ID de empleado no válido en la URL:', id_empleado);
            // No mostrar error, solo continuar a cargar datos de comisión
            document.getElementById("nombre_empleado").value = 'Sin empleado asignado';
            document.getElementById("departamento").value = 'N/A';
            resolve();
            datos_comision();
            return;
        }
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'datos_empleado_comision',
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

                if (res.includes('No hay datos')) {
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
        datos_comision();
    })
}

function datos_comision() {
    return new Promise((resolve) => {
        const id_comision = getUrlParameter('id');
        
        if (!id_comision) {
            console.error('ID de comisión no encontrado en la URL');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID de comisión no encontrado'
            });
            resolve();
            return;
        }
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'detalle_comision',
                id: id_comision
            },
            success: function (res) {
                // Validar respuesta
                if (!res || typeof res !== 'string') {
                    console.error('Respuesta inválida para datos comisión:', res);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Datos De La Comisión',
                        text: 'Respuesta inválida del servidor'
                    });
                    resolve();
                    return;
                }

                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Datos De La Comisión',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.error('Error en consulta comisión:', res);
                    resolve();
                    return;
                }

                if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Datos De La Comisión',
                        text: 'No se encontraron datos de la comisión'
                    });
                    console.log('No hay datos de la comisión:', res);
                    resolve();
                    return;
                }

                try {
                    const lista = JSON.parse(res);
                    console.log('📋 Datos de comisión recibidos:', lista);
                    
                    if (Array.isArray(lista) && lista.length > 0) {
                        const comision = lista[0];
                        console.log('📝 Comisión:', comision);
                        
                        document.getElementById("empresa_labor").value = comision.empresa || 'Sin empresa';
                        document.getElementById("fecha_labor").value = comision.fecha_trabajado || '';
                        document.getElementById("fecha_solicitud").value = comision.fecha_generado || '';
                        document.getElementById("horas_trabajadas").value = comision.horas != null ? String(comision.horas) : '0';
                        
                        // Jornada: 1 = Diurna, 2 = Nocturna (o 0 = Diurna según algunos registros)
                        if (comision.tipo_jornada == 2) {
                            document.getElementById("jornada").value = "Nocturna";
                        } else {
                            document.getElementById("jornada").value = "Diurna";
                        }

                        const elMes = document.getElementById("mes_trabajo");
                        if (elMes) {
                            elMes.value = comision.mes_trabajo != null && comision.mes_trabajo !== '' ? comision.mes_trabajo : '';
                        }
                        const elTipoHora = document.getElementById("tipo_hora_dn");
                        if (elTipoHora) {
                            elTipoHora.value = comision.tipo_hora_dn != null ? String(comision.tipo_hora_dn) : '';
                        }
                        const elUni = document.getElementById("unidades_bono");
                        if (elUni) {
                            elUni.value = comision.unidades_bono != null && comision.unidades_bono !== '' ? String(comision.unidades_bono) : '';
                        }
                        const elOrigen = document.getElementById("origen_reporte");
                        if (elOrigen) {
                            elOrigen.value = comision.origen_reporte != null ? String(comision.origen_reporte) : '';
                        }
                        
                        document.getElementById("monto").value = formatear_numeros(comision.monto || 0);
                        document.getElementById("solicitante").value = comision.usuario || 'Sin solicitante';
                        document.getElementById("tarea").value = comision.tarea || '';
                        document.getElementById("estado").value = comision.estado || 'Sin estado';
                        
                        // Mostrar si tiene autorizado cenas
                        if (comision.autorizado_cenas == 1) {
                            document.getElementById("autorizado_cenas").value = "Sí";
                        } else {
                            document.getElementById("autorizado_cenas").value = "No";
                        }
                        
                        if (comision.estado == "Rechazado") {
                            document.getElementById("input_obs_gerencia").style.display = "block";
                            document.getElementById("obs_gerencia").value = comision.observacion || '';
                        }
                    } else {
                        console.warn('⚠️ No se encontraron datos de comisión para ID:', id_comision);
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sin Datos',
                            text: 'No se encontraron datos para esta comisión (ID: ' + id_comision + ')'
                        });
                    }
                } catch (error) {
                    console.error('Error al parsear datos de la comisión:', error);
                    console.error('Respuesta recibida:', res);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Procesar Datos',
                        text: 'Error al procesar los datos de la comisión'
                    });
                } finally {
                    resolve();
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX en datos_comision:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error De Conexión',
                    text: 'No se pudo conectar con el servidor'
                });
                resolve();
            }
        });
    }).then(() => {
        Swal.close();
    })
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