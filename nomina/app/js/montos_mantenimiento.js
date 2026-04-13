var input_monto = document.getElementById('monto');
var id_monto = document.getElementById('id_monto');

$(document).ready(function () {
    listado_montos();
});

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

function listado_montos() {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_montos_mantenimiento'
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        title: 'Error Al Obtener Montos',
                        text: 'Ah ocurrido un error al intentar obtener los montos, por favor, intentalo de nuevo.',
                        icon: 'error',
                        showCancelButton: false
                    })
                    console.log(resp);
                } else {
                    try {
                        let lista = JSON.parse(resp);
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                        <tr>
                        <td class="text-center">${lista.id}</td>
                        <td class="text-center">${formatear_numeros(lista.monto)}</td>
                        <td class="text-center">
                            <div class="action-btns">
                                <a class="action-btn btn-edit bs-tooltip me-2" data-toggle="modal" data-target="#modal_agregar_monto" data-original-title="Agregar"
                                    onclick="ocultar_botones_editar_monto(${lista.id}, '${lista.monto}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                        class="feather feather-edit-2">
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                                        </path>
                                    </svg>
                                </a>
                            </div>
                        </td>
                        </tr>`;
                        });
                        $('#tabla_montos').DataTable().destroy();
                        document.getElementById('listado_montos').innerHTML = template;
                        $('#tabla_montos').DataTable({
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
                            "lengthMenu": [5, 10, 20, 50],
                            "pageLength": 10
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve('success');
                    }
                }
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function ocultar_botones_agregar_monto() {
    document.getElementById('modal_agregarLabelMonto').innerText = 'Agregar Monto';
    document.getElementById('boton_agregar_monto').hidden = false;
    document.getElementById('boton_editar_monto').hidden = true;
    limpiar_inputs_monto();
}

function ocultar_botones_editar_monto(id, monto) {
    document.getElementById('modal_agregarLabelMonto').innerText = 'Editar Monto';
    limpiar_inputs_monto();
    id_monto.value = id;
    input_monto.value = monto;
    document.getElementById('boton_agregar_monto').hidden = true;
    document.getElementById('boton_editar_monto').hidden = false;
}

function limpiar_inputs_monto() {
    id_monto.value = "";
    input_monto.value = "";
}

function validar_inputs_monto() {
    if (input_monto.value != "") {
        return true;
    } else {
        return false;
    }
}

function guardar_monto() {
    cargando()
    if (validar_inputs_monto()) {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_monto_mantenimiento',
                monto: input_monto.value
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Ingresar Monto',
                        text: 'Ah ocurrido un error al intentar ingresar el monto, por favor, intentalo de nuevo.'
                    });
                    console.log(resp);
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Monto Ingresado',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        timer: 1300
                    }).then(() => {
                        listado_montos();
                        $('#modal_agregar_monto').modal('hide');
                        limpiar_inputs_monto();
                    });
                }
            }
        })
    } else {
        Swal.fire({
            title: 'Campos Vacios',
            html: 'Por favor, asegurese de haber llenado todos los campos',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
    }
}

function editar_monto() {
    cargando()
    if (validar_inputs_monto()) {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'editar_monto_mantenimiento',
                monto: input_monto.value,
                id: id_monto.value
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Editar Monto',
                        text: 'Ah ocurrido un error al intentar editar el monto, por favor, intentalo de nuevo.'
                    });
                    console.log(resp);
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Monto Editado',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        timer: 1300
                    }).then(() => {
                        listado_montos();
                        $('#modal_agregar_monto').modal('hide');
                        limpiar_inputs_monto();
                    });
                }
            }
        })
    } else {
        Swal.fire({
            title: 'Campos Vacios',
            html: 'Por favor, asegurese de haber llenado todos los campos',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
    }
}
