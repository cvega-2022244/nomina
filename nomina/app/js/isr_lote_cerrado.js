var lote = sessionStorage.getItem('id_lote_detalle');

$(document).ready(function () {
    cargando();
    listado_isr();
})

function listado_isr() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_isr_cerrados',
                id_lote: lote
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Listado de ISR',
                        text: 'Ah ocurrido un error al intentar obtener el listado de ISR, por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else {
                    let lista = JSON.parse(res);
                    let template = '';
                    if (lista != 0) {
                        lista.forEach(lista => {
                            template += `
                            <tr>
                                <td>${lista.id}</td>
                                <td>${lista.empleado}</td>
                                <td><input type="number" id="input_isr_${lista.id}" min="0" value="${lista.isr}" class="form-control" disabled></td>
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
                    } else {
                        resolve('false')
                        Swal.fire({
                            icon: 'warning',
                            title: 'Ningun Empleado Registrado',
                            text: 'Por el momento no hay ningun empleado registrado',
                        });
                    }
                }
            }
        });
    }).then((resp) => {
        if (resp != 'false') {
            Swal.close();
        }
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