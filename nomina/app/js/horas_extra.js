var bonos_confirmados = new Array();
var quincena = sessionStorage.getItem("quincena");

$(document).ready(function () {
    cargando();
    listado_horas();
})

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

function listado_horas() {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: { quest: 'horas_extra' },
        success: function (res) {
            Swal.close();
            if (res.includes('Query Falló')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Obtener Horas Extra',
                    text: 'Ha ocurrido un error, por favor comunicate con sistemas'
                });
                document.getElementById('chx_todos').style.display = 'none';
            } else if (res.includes('No hay datos')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Hay Horas Extra',
                    text: 'No hay registro de horas extras autorizadas'
                });
                document.getElementById('chx_todos').style.display = 'none';
            } else {
                try {
                    let lista = JSON.parse(res);
                    console.log('Respuesta del servidor horas_extra:', res);
                    let template = '';
                    lista.forEach(function(item) {
                        template += '<tr role="row">';
                        template += '<td class="text-center"><input class="form-check-input" type="checkbox" value="" onclick="confirmar_hora_extra(' + item.id + ', ' + item.id_empleado + ')"';
                        if (item.seleccionado == 1) {
                            template += ' checked';
                        }
                        template += ' id="' + item.id + '"></td>';
                        template += '<td>' + item.id + '</td>';
                        template += '<td>' + item.empleado + '</td>';
                        template += '<td>' + item.fecha_trabajado + '</td>';
                        template += '<td>' + item.horas + '</td>';
                        template += '<td>' + item.jornada + '</td>';
                        template += '<td>' + formatear_numeros(item.monto) + '</td>';
                        
                        if (item.estado == 'Solicitado') {
                            template += '<td><div class="badge badge-warning badge-pill">Solicitado</div></td>';
                        } else if (item.estado == 'Autorizado') {
                            template += '<td><div class="badge badge-primary badge-pill">Autorizado</div></td>';
                        } else if (item.estado == 'Rechazado') {
                            template += '<td><div class="badge badge-danger badge-pill">Rechazado</div></td>';
                        } else if (item.estado == 'Pagado') {
                            template += '<td><div class="badge badge-success badge-pill">Pagado</div></td>';
                        }
                        
                        template += '<td><div class="action-btns">';
                        template += '<a onclick="detalle_hora(' + item.id + ')" class="action-btn btn-view bs-tooltip me-2" title="Detalle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a>';
                        template += '<a onclick="advertencia_anular_hora(' + item.id + ')" class="action-btn btn-delete bs-tooltip" title="Borrar"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></a>';
                        template += '</div></td></tr>';
                    });
                    
                    $('#tabla').DataTable().destroy();
                    document.getElementById("cuerpo_tabla").innerHTML = template;
                    $('#tabla').DataTable({
                        "dom": "<'dt--top-section'<'row'<'col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center'l><'col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3'f>>><'table-responsive'tr><'dt--bottom-section d-sm-flex justify-content-sm-between text-center'<'dt--pages-count mb-sm-0 mb-3'i><'dt--pagination'p>>",
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
                    console.log('Error:', error);
                    Swal.close();
                }
            }
        },
        error: function() {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo conectar con el servidor'
            });
        }
    });
}

function detalle_hora(id) {
    cargando();
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: { quest: 'detalle_horas_extra', id: id },
        success: function (res) {
            Swal.close();
            if (res.includes('Query Falló')) {
                Swal.fire({ title: 'Error', text: "Por favor comunicate con sistemas", icon: 'error' });
            } else {
                let lista = JSON.parse(res);
                lista.forEach(function(item) {
                    document.getElementById("nombre_completo_detalle").value = item.empleado;
                    document.getElementById("departamento_detalle").value = item.departamento;
                    document.getElementById("fecha_trabajada_detalle").value = item.fecha_trabajado;
                    document.getElementById("empresa_detalle").value = item.empresa;
                    document.getElementById("horas_trabajadas_detalle").value = item.horas;
                    document.getElementById("jornada_detalle").value = item.jornada;
                    document.getElementById("monto_detalle").value = formatear_numeros(item.monto);
                    document.getElementById("observaciones_detalle").value = item.observacion;
                    document.getElementById("solicitador_detalle").value = item.solicitador;
                    document.getElementById("fecha_solicitado_detalle").value = item.fecha_solicitado;
                    if (item.estado == 3) {
                        document.getElementById("input_obs_gerencia").style.display = "block";
                        document.getElementById("obs_gerencia_detalle").value = item.observacion_gerencia;
                    } else {
                        document.getElementById("input_obs_gerencia").style.display = "none";
                    }
                });
                $('#detalle').modal('show');
            }
        },
        error: function() {
            Swal.close();
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión' });
        }
    });
}

function advertencia_anular_hora(id) {
    Swal.fire({
        icon: 'question',
        title: '¿Está seguro de anular la hora extra?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Anular',
    }).then(function(result) {
        if (result.isConfirmed) {
            anular_hora(id);
        }
    });
}

function anular_hora(id) {
    cargando();
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: { quest: 'anular_hora_extra', id: id },
        success: function (res) {
            if (res.includes('Query Falló')) {
                Swal.fire({ icon: 'error', title: 'Error Al Anular', text: 'Por favor, comunicate con sistemas' });
            } else {
                Swal.fire({ icon: 'success', title: 'Hora Extra Anulada', text: 'La hora extra ha sido anulada exitosamente' }).then(function() {
                    cargando();
                    listado_horas();
                });
            }
        },
        error: function() {
            Swal.close();
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión' });
        }
    });
}

// FUNCIÓN PRINCIPAL - CONFIRMAR HORA EXTRA
function confirmar_hora_extra(id, id_empleado) {
    var chx = document.getElementById(String(id));
    if (!chx) {
        alert('Error: checkbox no encontrado');
        return;
    }
    
    var estaChecked = chx.checked;
    var accion = estaChecked ? 'confirmar_hora_extra' : 'desaprobar_hora_extra';
    
    // Mostrar loading
    Swal.fire({
        title: 'Procesando...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: function() { Swal.showLoading(); }
    });
    
    $.post('php/servidor.php', { quest: accion, id: id })
        .done(function(respuesta) {
            console.log('Respuesta:', respuesta);
            Swal.close();
            if (respuesta.indexOf('Query Falló') !== -1) {
                Swal.fire('Error', 'Error en el servidor', 'error');
                chx.checked = !estaChecked;
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado',
                    text: 'Hora extra actualizada correctamente',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        })
        .fail(function(xhr, status, error) {
            console.log('Error:', error);
            Swal.close();
            Swal.fire('Error', 'Error de conexión', 'error');
            chx.checked = !estaChecked;
        });
}

function cargando() {
    Swal.fire({
        title: 'Procesando...',
        html: 'Esto puede demorar unos momentos, de tardar demasiado recargue la pagina',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: function() { Swal.showLoading(); }
    });
}

function click_seleccionar_todos() {
    var checkboxs = document.getElementsByClassName('form-check-input');
    if (checkboxs[0].checked == true) {
        for (var i = 0; i < checkboxs.length; i++) {
            if (checkboxs[i].checked == false) {
                checkboxs[i].click();
            }
        }
    } else {
        for (var i = 0; i < checkboxs.length; i++) {
            if (checkboxs[i].checked == true) {
                checkboxs[i].click();
            }
        }
    }
}
