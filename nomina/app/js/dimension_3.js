$(document).ready(function () {
    listado_dimensiones();
});

function listado_dimensiones() {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'listado_dimension_3'
        },
        success: function (resp) {
            let lista = JSON.parse(resp);
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                    <td class="text-center" onclick="detalle_dimension(${lista.id})">${lista.id}</td>
                    <td class="text-center" onclick="detalle_dimension(${lista.id})">${lista.nombre}</td>
                    <td class="text-center">
                        <div class="action-btns">
                            <a onclick="detalle_dimension(${lista.id})" class="action-btn btn-view bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Detalle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-eye">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </a>
                            <a onclick="editar_dimension(${lista.id})" class="action-btn btn-edit bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-edit-2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                                    </path>
                                </svg>
                            </a>
                            <a onclick="modal_eliminar_dimension(${lista.id})" class="action-btn btn-delete bs-tooltip"
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
            document.getElementById('listado_dimensiones').innerHTML = template;
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

function empresas(){
    window.location.href = './empresas.html';
}

function departamentos(){
    window.location.href = './departamentos.html';
}

function empleados(){
    window.location.href = './empleados.html';
}

function agregar_dimension(){
    window.location.href = './agregar_dimension_3.html';
}

function detalle_dimension(id) {
    sessionStorage.setItem('id_dimension_3', id);
    sessionStorage.setItem('detalle_dimension_3', true);
    window.location.href = './detalle_dimension_3.html';
}

function editar_dimension(id) {
    sessionStorage.setItem('id_dimension_3', id);
    sessionStorage.setItem('detalle_dimension_3', false);
    window.location.href = './detalle_dimension_3.html';
}

function modal_eliminar_dimension(id) {
    Swal.fire({
        title: '¿Esta seguro de eliminar la dimension?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminar_dimension(id);
        }
    })
}

function eliminar_dimension(id) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: {
            quest: 'eliminar_dimension_3',
            id_dimension: id
        },
        success: function (resp) {
            console.log(resp);
            if (resp == 'Successfully') {
                Swal.fire({
                    title: 'Dimension Eliminada Exitosamente',
                    icon: 'success',
                    showConfirmButton: false,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    timer: 1200
                }).then(() => {
                    listado_dimensiones();
                })
            } else {
                Swal.fire({
                    title: 'Error Al Eliminar Dimension',
                    text: 'Ha ocurrido un error al eliminar la dimension, por favor, comunicate con el departamento de informatica',
                    icon: 'error',
                    showCancelButton: false,
                    allowOutsideClick: false,
                })
            }
        }
    });
}