var bonos_confirmados = new Array();
var quincena = sessionStorage.getItem("quincena");

$(document).ready(function () {
    cargando();
    listado_horas();
})

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

function listado_horas() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'horas_extra'
            },
            dataType: 'text', // Evitar que jQuery intente parsear como JSON
            success: function (res) {
                console.log('Respuesta del servidor horas_extra:', res);
                
                // Verificar si la respuesta es válida antes de procesar
                if (!res) {
                    console.log('Respuesta vacía para horas_extra');
                    resolve();
                    return;
                }
                
                // Si no es una cadena, intentar convertirla
                if (typeof res !== 'string') {
                    res = String(res);
                }
                
                // Verificar respuestas de error
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Horas Extra',
                        text: 'Ah ocurrido un error al intentar obtener las horas extra, por favor, comunicate con sistemas'
                    });
                    document.getElementById('chx_todos').style.display = 'none'
                    console.log(res);
                    resolve();
                    return;
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Horas Extra',
                        text: 'No hay registro de horas extras autorizadas'
                    });
                    document.getElementById('chx_todos').style.display = 'none'
                    console.log(res);
                    resolve();
                    return;
                }
                
                // Verificar si la respuesta es JSON válido antes de parsear
                if (res.trim().startsWith('<') || res.includes('<br') || res.includes('Successfully') || res.trim() === 'No') {
                    console.log('Respuesta no válida para horas_extra:', res);
                    resolve();
                    return;
                }
                
                try {
                    let lista;
                    if (typeof res === 'string') {
                        try {
                            lista = JSON.parse(res);
                        } catch (error) {
                            console.error('Error parseando JSON en horas_extra:', error, 'Respuesta:', res);
                            resolve();
                            return;
                        }
                    } else {
                        lista = res; // jQuery ya parseó el JSON
                    }
                        let template = '';
                        lista.forEach(lista => {
                            let checkedAttribute = '';
                            if (lista.seleccionado == 1) {
                                checkedAttribute = ' checked';
                            }
                            // Guardar el origen para saber de qué tabla viene
                            const origen = lista.origen || 'horas_extra';
                            
                            template += `
                        <tr role="row">
                            <td class="text-center"><input class="form-check-input" type="checkbox"
                            value="" onclick="confirmar_hora_extra(${lista.id}, ${lista.id_empleado}, '${origen}')"${checkedAttribute}
                            id="${lista.id}"></td>
                            <td>${lista.id}</td>
                            <td>${lista.empleado}</td>
                            <td>${lista.fecha_trabajado}</td>
                            <td>${lista.horas}</td>
                            <td>${lista.jornada}</td>
                            <td>${formatear_numeros(lista.monto)}</td>
                            `;
                            if (lista.estado == 'Solicitado') {
                                template += `
                                    <td><div class="badge badge-warning badge-pill">Solicitado</div></td>
                                `;
                            } else if (lista.estado == 'Autorizado' || lista.estado == 'Aprobado RH' || lista.estado == 'Autorizada') {
                                template += `
                                    <td><div class="badge badge-primary badge-pill">Autorizado</div></td>
                                `;
                            } else if (lista.estado == 'Rechazado') {
                                template += `
                                    <td><div class="badge badge-danger badge-pill">Rechazado</div></td>
                                `;
                            } else if (lista.estado == 'Pagado') {
                                template += `
                                    <td><div class="badge badge-success badge-pill">Pagado</div></td>
                                `;
                            } else {
                                template += `
                                    <td><div class="badge badge-info badge-pill">${lista.estado}</div></td>
                                `;
                            }
                            template += `
                        </td>
                        <td>
                            <div class="action-btns">
                                <a onclick="detalle_hora(${lista.id}, '${origen}')" class="action-btn btn-view bs-tooltip me-2"
                                    data-toggle="tooltip" data-placement="top" title="Detalle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-eye">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </a>
                                <a onclick="advertencia_anular_hora(${lista.id}, '${origen}')" class="action-btn btn-delete bs-tooltip"
                                    data-toggle="tooltip" data-placement="top" title="Borrar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-trash-2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path
                                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                        </path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </a>
                            </div>
                        </td>
                    </tr>
                        `
                        });
                        $('#tabla').DataTable().destroy();
                        document.getElementById("cuerpo_tabla").innerHTML = template;
                        $('#tabla').DataTable({
                            "dom": "<'dt--top-section'<'row'<'col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center'l><'col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3'f>>>" +
                                "<'table-responsive'tr>" +
                                "<'dt--bottom-section d-sm-flex justify-content-sm-between text-center'<'dt--pages-count  mb-sm-0 mb-3'i><'dt--pagination'p>>",
                            "oLanguage": {
                                "oPaginate": { "sPrevious": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' },
                                "sInfo": "Showing page _PAGE_ of _PAGES_",
                                "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
                                "sSearchPlaceholder": "Search...",
                                "sLengthMenu": "Results :  _MENU_",
                            },
                            "stripeClasses": [],
                            "lengthMenu": [1000, 2000, 3000, 5000],
                            "pageLength": 1000
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve();
                    }
                }
        });
    }).then(() => {
        Swal.close();
    })
}

function detalle_hora(id, origen = 'horas_extra') {
    return new Promise((resolve) => {
        try {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'detalle_horas_extra',
                    id: id,
                    origen: origen
                },
                success: function (res) {
                    if (res.includes('Query Falló')) {
                        Swal.fire({
                            title: '¡Hubo un error!',
                            text: "Por favor comunicate con sistemas",
                            icon: 'error'
                        });
                        console.log(res);
                    } else {
                        let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
                        var nombre_completo_detalle = document.getElementById("nombre_completo_detalle");
                        var departamento_detalle = document.getElementById("departamento_detalle");
                        var fecha_trabajada_detalle = document.getElementById("fecha_trabajada_detalle");
                        var empresa_detalle = document.getElementById("empresa_detalle");
                        var horas_detalle = document.getElementById("horas_trabajadas_detalle");
                        var jornada_detalle = document.getElementById("jornada_detalle");
                        var monto_detalle = document.getElementById("monto_detalle");
                        var observaciones_detalle = document.getElementById("observaciones_detalle");
                        var solicitador_detalle = document.getElementById("solicitador_detalle");
                        var fecha_solicitado_detalle = document.getElementById("fecha_solicitado_detalle");
                        var input_obs_gerencia = document.getElementById("input_obs_gerencia");
                        var obs_gerencia_detalle = document.getElementById("obs_gerencia_detalle");
                        lista.forEach(lista => {
                            nombre_completo_detalle.value = lista.empleado;
                            departamento_detalle.value = lista.departamento;
                            fecha_trabajada_detalle.value = lista.fecha_trabajado;
                            empresa_detalle.value = lista.empresa;
                            horas_detalle.value = lista.horas;
                            jornada_detalle.value = lista.jornada;
                            monto_detalle.value = formatear_numeros(lista.monto);
                            observaciones_detalle.value = lista.observacion;
                            solicitador_detalle.value = lista.solicitador;
                            fecha_solicitado_detalle.value = lista.fecha_solicitado;
                            if (lista.estado == 3) {
                                input_obs_gerencia.style.display = "block";
                                obs_gerencia_detalle.value = lista.observacion_gerencia;
                            } else {
                                input_obs_gerencia.style.display = "none";
                            }
                        });
                        resolve('success');
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }).then(() => {
        try {
            $('#detalle').modal('show');
        } catch (error) {
            console.log();
        } finally {
            Swal.close();
        }
    })
}

function advertencia_anular_hora(id, origen = 'horas_extra') {
    Swal.fire({
        icon: 'question',
        title: '¿Está seguro de anular la hora extra?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Anular',
    }).then((result) => {
        if (result.isConfirmed) {
            anular_hora(id, origen);
        }
    });
}

function anular_hora(id, origen = 'horas_extra') {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'anular_hora_extra',
                id: id,
                origen: origen
            },
            dataType: 'json',
            success: function (res) {
                if (res && res.success) {
                    console.log('Hora Extra Anulada - IGSS del empleado actualizado');
                    resolve(res);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Anular Hora Extra',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve(null);
                }
            },
            error: function(xhr, status, error) {
                // Si la respuesta no es JSON, verificar si fue exitosa de otra forma
                if (xhr.responseText && !xhr.responseText.includes('Query Falló')) {
                    console.log('Hora Extra Anulada (respuesta legacy)');
                    resolve(xhr.responseText);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Anular Hora Extra',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(error);
                    resolve(null);
                }
            }
        })
    }).then((result) => {
        if (result) {
            Swal.fire({
                icon: 'success',
                title: 'Hora Extra Anulada',
                text: 'La hora extra ha sido anulada y el IGSS del empleado actualizado'
            }).then(() => {
                listado_horas();
            });
        }
    })
}

function confirmar_hora_extra(id, id_empleado, origen = 'horas_extra') {
    cargando();
    var chx = document.getElementById(id);
    var accion = chx.checked ? 'confirmar_hora_extra' : 'desaprobar_hora_extra';
    
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: accion,
            id: id,
            origen: origen
        },
        success: function (respuesta) {
            console.log('Respuesta servidor:', respuesta);
            var resp = String(respuesta || '');
            if (resp.indexOf('Falló') !== -1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error, por favor intentalo de nuevo'
                });
                chx.checked = !chx.checked;
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado',
                    text: 'Hora extra actualizada correctamente',
                    timer: 1500,
                    showConfirmButton: false
                });
                // Actualizar IGSS en segundo plano
                actualizar_igss_empleado_silencioso(id_empleado);
            }
        },
        error: function(xhr, status, error) {
            console.log('Error AJAX:', status, error, xhr.responseText);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor'
            });
            chx.checked = !chx.checked;
        }
    });
}

function actualizar_igss_empleado_silencioso(id) {
    // Actualiza IGSS sin mostrar ningún modal
    if (!id) {
        console.log('IGSS: ID de empleado no proporcionado');
        return;
    }
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: { quest: 'actualizar_igss_empleado', id: id },
        success: function(res) {
            console.log('IGSS actualizado correctamente:', res);
        },
        error: function(xhr, status, error) {
            console.log('Error al actualizar IGSS:', status, error);
        }
    });
}

function actualizar_igss_empleado(id) {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'actualizar_igss_empleado',
                id: id
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Actualizar IGSS',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else {
                    try {
                        console.log('IGSS Actualizado');
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('Error en petición AJAX horas_extra:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor para obtener las horas extra'
                });
                document.getElementById('chx_todos').style.display = 'none';
                resolve();
            }
        })
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

function click_seleccionar_todos() {
    var checkboxs = document.getElementsByClassName('form-check-input')
    if (checkboxs[0].checked == true) {
        for (let index = 0; index <= (checkboxs.length - 1); index++) {
            if (checkboxs[index].checked == false) {
                checkboxs[index].click()
            }
        }
    } else {
        for (let index = 0; index <= (checkboxs.length - 1); index++) {
            if (checkboxs[index].checked == true) {
                checkboxs[index].click()
            }
        }
    }
}