var bonos_confirmados = new Array();
var quincena = sessionStorage.getItem('quincena');

$(document).ready(function () {
    cargando();
    listado_bonos();
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

function listado_bonos() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_bonos_autorizados'
            },
            success: function (res) {
                let lista = JSON.parse(res);
                let template = '';
                if (lista != 0) {
                    lista.forEach(lista => {
                        template += `
                        <tr role="row">
                            <td class="text-center"><input class="form-check-input" type="checkbox"
                            value="" onclick="confirmar_bono(${lista.id})"`
                        if (lista.seleccionado == 1) {
                            template += ` checked `
                        }
                        template += ` 
                            id="${lista.id}"></td>
                            <td>${lista.id}</td>
                            <td>${lista.departamento}</td>
                            <td>${lista.empleado}</td>
                            <td>${lista.solicitante}</td>
                            <td>${lista.fecha_generado}</td>
                            <td>${formatear_numeros(lista.monto)}</td>
                            `;
                        if (lista.estado == 'Solicitado') {
                            template += `
                                    <td><div class="badge badge-warning badge-pill">Solicitado</div></td>
                                `;
                        } else if (lista.estado == 'Autorizado') {
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
                        }
                        template += `
                            <td class="text-center">
                                <div class="action-btns">
                                    <a onclick="detalle(${lista.id}, ${lista.id_empleado})" class="action-btn btn-view bs-tooltip me-2"
                                        data-toggle="tooltip" data-placement="top" title="Detalle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </a>
                                    <a onclick="advertencia_anular_bono(${lista.id})"class="action-btn btn-delete bs-tooltip"
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
                    resolve('true')
                } else {
                    try {
                        document.getElementById("cuerpo_tabla").innerHTML = '';
                        document.getElementById('chx_todos').style.display = 'none'
                        Swal.fire({
                            icon: 'warning',
                            title: 'Ningun Bono Autorizado',
                            text: 'Por el momento no hay ningun bono autorizado'
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve('false')
                    }
                }
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function detalle(id, id_empleado) {
    sessionStorage.setItem("id_bono", id);
    sessionStorage.setItem("id_empleado", id_empleado);
    window.location.href = './detalle_bono.html';
}

function advertencia_anular_bono(id) {
    Swal.fire({
        icon: 'question',
        title: '¿Está seguro de anular el bono?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Anular',
    }).then((result) => {
        if (result.isConfirmed) {
            anular_bono(id);
        }
    });
}

function anular_bono(id) {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'anular_bono',
                id: id
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Anular Bono',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else {
                    try {
                        console.log('Bono Anulado');
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                }
            }
        })
    }).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Bono Anulado',
            text: 'El bono ha sido anulado exitosamente'
        }).then(() => {
            listado_bonos();
        });
    })
}

function confirmar_bono(id) {
    return new Promise((resolve) => {
        cargando();
        var chx = document.getElementById(id);
        if (chx.checked == true) {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: {
                    quest: 'confirmar_bono',
                    id: id
                },
                success: function (respuesta) {
                    if (respuesta.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Confirmar Bono',
                            text: 'Ah ocurrido un error al intentar confirmar el bono, por favor, intentalo de nuevo',
                            showcancelButton: false
                        });
                        console.log(respuesta);
                    } else {
                        resolve('success')
                    }
                }
            })
        } else {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: {
                    quest: 'desaprobar_bono',
                    id: id
                },
                success: function (respuesta) {
                    if (respuesta.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Desaprobar Bono',
                            text: 'Ah ocurrido un error al intentar desaprobar el bono, por favor, intentalo de nuevo',
                            showcancelButton: false
                        });
                        console.log(respuesta);
                    } else {
                        resolve('success')
                    }
                }
            })
        }
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
        for (let index = 1; index <= (checkboxs.length - 1); index++) {
            if (checkboxs[index].checked == false) {
                checkboxs[index].click()
            }
        }
    } else {
        for (let index = 1; index <= (checkboxs.length - 1); index++) {
            if (checkboxs[index].checked == true) {
                checkboxs[index].click()
            }
        }
    }
}