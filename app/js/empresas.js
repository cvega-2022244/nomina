$(document).ready(function () {
    listado_empresas();
});

function listado_empresas() {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'listado_empresas'
        },
        success: function (resp) {
            let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                    <td class="text-center" onclick = "detalle_empresa(${lista.id})">${lista.nit}</td>
                    <td class="text-center" onclick = "detalle_empresa(${lista.id})">${lista.nombre_comercial}</td>
                    <td class="text-center" onclick = "detalle_empresa(${lista.id})">${lista.razon_social}</td>
                    <td class="text-center">
                        <div class="action-btns">
                            <a onclick="detalle_empresa(${lista.id})" class="action-btn btn-view bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Detalle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-eye">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </a>
                            <a onclick="editar_empresa(${lista.id})" class="action-btn btn-edit bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-edit-2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                                    </path>
                                </svg>
                            </a>
                            <a onclick="eliminar_empresa(${lista.id})" class="action-btn btn-delete bs-tooltip"
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
                    </tr>`;
            });
            $('#tabla').DataTable().destroy();
            document.getElementById('listado_empresas').innerHTML = template;
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
                "lengthMenu": [5, 10, 20, 50],
                "pageLength": 10
            });
        }
    });
}

function detalle_empresa(id) {
    sessionStorage.setItem('id_empresa', id);
    sessionStorage.setItem('editar', false);
    window.location.href = './detalle_empresa.html';
}

function editar_empresa(id) {
    sessionStorage.setItem('id_empresa', id);
    sessionStorage.setItem('editar', true);
    window.location.href = './detalle_empresa.html';
}

function eliminar_empresa(id) {
    Swal.fire({
        title: '¿Esta Seguro de Eliminar la Empresa?',
        text: "Estos cambios son irreversibles.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'eliminar_empresa',
                    id_empresa: id
                },
                success: function (res) {
                    if (res.includes('Successfully')) {
                        Swal.fire({
                            title: 'Empresa Eliminada',
                            icon: 'success',
                            showCancelButton: false,
                            showCloseButton: false,
                            showConfirmButton: false,
                            timer: 1300
                        }).then(() => {
                            listado_empresas();
                        })
                    } else {
                        Swal.fire(
                            'Error Al Eliminar Empresa',
                            'A ocurrido un error al momento de eliminar la empresa, por favor, intentalo más tarde.',
                            'error'
                        )
                        console.log(res);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error AJAX al eliminar empresa:", error);
                    console.error("Detalles:", xhr.responseText);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Comunicación',
                        text: 'No se pudo conectar con el servidor. Por favor, intenta de nuevo.'
                    });
                }
            });
        }
    })
}

function empresas() {
    window.location.href = './empresas.html';
}

function departamentos() {
    window.location.href = './departamentos.html';
}

function empleados() {
    window.location.href = './empleados.html';
}

function agregar_empresas() {
    window.location.href = './agregar_empresa.html';
}