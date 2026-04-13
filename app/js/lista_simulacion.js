$(document).ready(function () {
    cargando();
    listado_bonos();
})

function listado_bonos() {
    return new Promise((resolve) => {
        var bonos = sessionStorage.getItem('bonos_confirmados');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_bonos_confirmados',
                id_bonos: bonos
            },
            success: function (res) {
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
                let template = '';
                lista.forEach(lista => {
                    template += `
                    <tr role="row">
                        <td>${lista.empresa}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.empleado}</td>
                        <td>${lista.sueldo}</td>
                        <td>${lista.bonificaciones}</td>
                        <td>${lista.descuentos}</td>
                        <td>${lista.bonos}</td>
                        <td>${lista.liquido}</td>
                        `;
                    template += `
                        <td class="text-center">
                            <svg style="cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye" onclick="detalle(${lista.id_empleado})"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </td>
                    </tr>
                    `
                });
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
                    "lengthMenu": [7, 10, 20, 50],
                    "pageLength": 10
                });
                resolve('true')
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

function detalle(id_empleado) {
    sessionStorage.setItem('id_empleado_detalle', id_empleado)
    window.location.href = './detalle_simulacion.html';
}

function limpiar_inputs() {
    var input_nombre_lote = document.getElementById('nombre_lote')
    input_nombre_lote.value = '';
}

function aplicar_simulacion() {
    mostar_modal_lote();
}

function mostar_modal_lote() {
    var fecha_actual = new Date();
    var dia_actual = String(fecha_actual.getDate()).padStart(2, '');
    var mes_actual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    var anio_actual = fecha_actual.getFullYear();
    var tipo_quincena;
    if (dia_actual <= 15) {
        tipo_quincena = 'primera quincena'
    } else {
        tipo_quincena = 'segunda quincena'
    }
    var nombre_lote = `Pago nómina ${tipo_quincena} de ${mes_actual} ${anio_actual}`
    var input_nombre_lote = document.getElementById('nombre_lote')
    input_nombre_lote.value = nombre_lote
    $('#modal_lote').modal('show');
}

function guardar_lote() {
    Swal.fire({
        icon: 'warning',
        title: '¿Está seguro de guardar el lote?',
        showDenyButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
    }).then((result) => {
        if (result.isConfirmed) {
            ingresar_lote();
        }
    });
}

function ingresar_lote() {
    $('#modal_lote').modal('hide');
    cargando()
    return new Promise((resolve) => {
        var input_nombre_lote = document.getElementById('nombre_lote')
        var nombre_lote = input_nombre_lote.value
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_lote',
                nombre_lote
            },
            success: function (res) {
                if (res != 'Successfully') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Ingresar Lote',
                        text: 'Ah ocurrido un error al ingresar el lote, por favor, intentalo de nuevo'
                    });
                    console.log(res);
                } else {
                    resolve('success')
                }
            }
        });
    }).then(() => {
        ingresar_pago_lote();
    })
}

function ingresar_pago_lote() {
    return new Promise((resolve) => {
        var input_nombre_lote = document.getElementById('nombre_lote')
        var nombre_lote = input_nombre_lote.value
        var bonos = sessionStorage.getItem('bonos_confirmados');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_bonos_confirmados',
                id_bonos: bonos
            },
            success: function (res_lbc) {
                try {
                    let lista = JSON.parse(res_lbc);
                    lista.forEach(lista => {
                        insertar_pago_lote(lista, bonos, nombre_lote, resolve)
                    });
                } catch (error) {
                    console.log(error);
                } 
            }
        });
    }).then(() => {
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'Lote Ingresado Exitosamente',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1300
        }).then(() => {
            window.location.href = './lista_lotes.html'
        });
    })
}

function insertar_pago_lote(lista, bonos, nombre_lote, resolve) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: {
            quest: 'ingresar_pago_lote',
            id_empresa: lista.id_empresa,
            id_departamento: lista.id_departamento,
            nombre_empleado: lista.empleado,
            sueldo: lista.sueldo,
            bonificacion: lista.bonificaciones,
            descuento: lista.descuentos,
            bonos: lista.bonos,
            liquido: lista.liquido
        },
        success: function (res_ipl) {
            if (res_ipl == 'Query Falló') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Ingresar El Pago Del Lote',
                    text: 'Ah ocurrido un error al ingresar el pago del lote, por favor, intentalo de nuevo'
                });
                console.log(res_ipl);
            } else {
                ingresar_bonos_pago_lote(lista.id_empleado, bonos, nombre_lote, res_ipl, resolve)
            }
        }
    });
}

function ingresar_bonos_pago_lote(id_empleado, bonos_confirmados, nombre_lote, res_ipl, resolve) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lista_bonos_confirmados',
            bonos_confirmados,
            id_empleado
        },
        success: function (res_lbc) {
            let lista_bonos = JSON.parse(res_lbc);
            lista_bonos.forEach(bono => {
                $.ajax({
                    url: 'php/servidor.php',
                    type: 'POST',
                    data: {
                        quest: 'ingresar_bono_pago_lote',
                        id_bono: bono.id,
                        id_pago_lote: res_ipl
                    },
                    success: function (res_ibpl) {
                        if (res_ibpl == 'Query Falló') {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error Al Ingresar El Bono Del Pago Del Lote',
                                text: 'Ah ocurrido un error al ingresar el bono pago del lote, por favor, intentalo de nuevo'
                            });
                            console.log(res_ibpl);
                        }
                    }
                })
            });
            ingresar_detalle_pago_lote(id_empleado, bonos_confirmados, nombre_lote, res_ipl, resolve)
        }
    })
}

function ingresar_detalle_pago_lote(id_empleado, bonos_confirmados, nombre_lote, res_ipl, resolve) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'detalle_pago_empleado',
            id_empleado,
            bonos_confirmados
        },
        success: function (res_dpe) {
            let lista_dpe = JSON.parse(res_dpe)
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: {
                    quest: 'ingresar_detalle_pago_lote',
                    nombre_empleado: lista_dpe[0].nombre_empleado,
                    puesto_empleado: lista_dpe[0].puesto,
                    empresa_empleado: lista_dpe[0].empresa_trabajo,
                    concepto: nombre_lote,
                    liquido: lista_dpe[0].liquido,
                    bon_37_2001: lista_dpe[0].bon_dec_37_2001,
                    anticipo_quincenal: lista_dpe[0].anticipo_quincenal,
                    bon_productiva: lista_dpe[0].bon_productiva,
                    bantrab: lista_dpe[0].bantrab,
                    bon_incentivo: lista_dpe[0].bon_incentivo,
                    boleto_ornato: lista_dpe[0].boleto_de_ornato,
                    comisiones: lista_dpe[0].comisiones,
                    cafeteria: lista_dpe[0].cafeteria,
                    horas_extras_dobles: lista_dpe[0].horas_extras_dobles,
                    celular: lista_dpe[0].celular,
                    horas_extras: lista_dpe[0].horas_extras_simples,
                    igss_laboral: lista_dpe[0].igss_laboral,
                    igss_patronal_gasto: lista_dpe[0].igss_patronal_gasto,
                    igss_patronal: lista_dpe[0].igss_patronal,
                    sueldo_ordinario: lista_dpe[0].sueldo_ordinario,
                    isr: lista_dpe[0].isr,
                    otros_ingresos: lista_dpe[0].otro_ingresos,
                    otros_egresos: lista_dpe[0].otro_descuentos,
                    total_igss: lista_dpe[0].total_igss,
                    prestamo_empresa: lista_dpe[0].prestamo_empresa,
                    vacaciones: lista_dpe[0].vacaciones,
                    id_pago_lote: res_ipl
                },
                success: function (res_idpl) {
                    if (res_idpl != 'Successfully') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Ingresar El Detalle Del Pago Del Lote',
                            text: 'Ah ocurrido un error al ingresar el detalle del pago del lote, por favor, intentalo de nuevo'
                        });
                        console.log(res_idpl);
                    } else {
                        cambiar_estado_bonos(bonos_confirmados, resolve)
                    }
                }
            })
        }
    });
}

function cambiar_estado_bonos(bonos_confirmados, resolve) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: {
            quest: 'cambiar_estado_bonos',
            bonos_confirmados
        },
        success: function (res_ceb) {
            if (res_ceb == 'Query Falló') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Cambiar Estado De Los Bonos',
                    text: 'Ah ocurrido un error al intentar cambiar el estado de los bonos, por favor, intentalo de nuevo'
                });
                console.log(res_ceb);
            } else {
                resolve('true')
            }
        }
    })
}