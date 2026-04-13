var lote = sessionStorage.getItem('id_lote_detalle');

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
    if (!lote) {
        Swal.fire({
            title: 'Error',
            html: 'No se ha seleccionado un lote',
            icon: 'error',
            allowOutsideClick: false,
            showConfirmButton: true,
        }).then(() => {
            window.location.href = './listado_lotes_cerrados.html';
        });
        return Promise.resolve();
    }
    
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'listado_bonos_cerrados',
                id_lote: lote
            },
            success: function (res) {
                Swal.close(); // Cerrar el modal de carga
                
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        title: 'Error',
                        html: 'Ha ocurrido un error al obtener los bonos, por favor, comunicate con sistemas.',
                        icon: 'error',
                        allowOutsideClick: false,
                        showConfirmButton: true,
                    });
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        title: 'No hay bonos registrados',
                        html: 'No hay bonos registrados en este lote',
                        icon: 'warning',
                        allowOutsideClick: false,
                        showConfirmButton: true,
                    });
                } else {
                    let template = '';
                    let lista;
                    
                    if (typeof res === 'string') {
                        lista = JSON.parse(res);
                    } else {
                        lista = res; // jQuery ya parseó el JSON
                    }
                    
                    lista.forEach(lista => {
                        template += `
                        <tr>
                            <td>${lista.id}</td>
                            <td>${lista.departamento}</td>
                            <td>${lista.empleado}</td>
                            <td>${lista.solicitante}</td>
                            <td>${lista.fecha_solicitado}</td>
                            <td>${formatear_numeros(lista.monto)}</td>
                            `;
                        if (lista.estado_bono == 'Solicitado') {
                            template += `
                                    <td><div class="badge badge-warning badge-pill">Solicitado</div></td>
                                `;
                        } else if (lista.estado_bono == 'Autorizado') {
                            template += `
                                    <td><div class="badge badge-primary badge-pill">Autorizado</div></td>
                                `;
                        } else if (lista.estado_bono == 'Rechazado') {
                            template += `
                                    <td><div class="badge badge-danger badge-pill">Rechazado</div></td>
                                `;
                        } else if (lista.estado_bono == 'Pagado') {
                            template += `
                                    <td><div class="badge badge-success badge-pill">Pagado</div></td>
                                `;
                        }
                        template += `
                            <td class="text-center">
                                <div class="action-btns">
                                    <a onclick="detalle(${lista.id}, ${lista.id_empleado}, '${lista.origen || 'bono'}')" class="action-btn btn-view bs-tooltip me-2"
                                        data-toggle="tooltip" data-placement="top" title="Detalle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
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
                        "lengthMenu": [7, 10, 20, 50],
                        "pageLength": 10
                    });
                }
                resolve('true');
            },
            error: function (xhr, status, error) {
                Swal.close();
                Swal.fire({
                    title: 'Error',
                    html: 'Error de conexión al obtener los bonos. Inténtelo nuevamente.',
                    icon: 'error',
                    allowOutsideClick: false,
                    showConfirmButton: true,
                });
                resolve('false');
            }
        });
    })
}

function detalle(id, id_empleado, origen) {
    sessionStorage.setItem("id_bono", id);
    sessionStorage.setItem("id_empleado", id_empleado);
    sessionStorage.setItem("origen_bono", origen || 'bono');
    window.location.href = './detalle_bono_lote_cerrado.html';
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
