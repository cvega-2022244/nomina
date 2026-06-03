var bonos_confirmados = new Array();
var quincena = sessionStorage.getItem('quincena');

$(document).ready(function () {
    cargando();
    listado_lotes();
    cargar_empresas();
})

function cargar_empresas() {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        dataType: 'text',
        data: { quest: 'listado_empresas' },
        success: function (res) {
            if (typeof res === 'string' && (res.includes('Query Falló') || res.includes('No hay datos'))) {
                return;
            }
            try {
                let empresas = typeof res === 'string' ? JSON.parse(res) : res;
                let template = '<option value="">Seleccione una empresa...</option>';
                empresas.forEach(e => {
                    template += `<option value="${e.id}">${e.nombre_comercial}</option>`;
                });
                $('#slc_empresa_reporte').html(template);
            } catch (e) {
                console.log('Error parseando empresas', e);
            }
        }
    });
}

async function listado_lotes() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_lotes_cerrados',
            },
        });

        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al obtener los lotes, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else if (resp.includes('No hay datos')) {
            console.log('No hay lotes cerrados');
        } else {
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
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            template = '';
            lista.forEach(lista => {
                let fechaObj = new Date(lista.fecha + 'T00:00:00');
                let mesNombre = isNaN(fechaObj.getTime()) ? '-' : meses[fechaObj.getMonth()];
                let anio = isNaN(fechaObj.getTime()) ? '-' : fechaObj.getFullYear();
                let txtQuincena = lista.quincena == 0 ? 'Primera' : 'Segunda';

                template += `<tr>
                            <td>${lista.id}</td>
                            <td>${lista.nombre_empresa}</td>
                            <td>${lista.nombre}</td>
                            <td>${txtQuincena}</td>
                            <td>${mesNombre}</td>
                            <td>${anio}</td>
                            `;
                template += `
                            <td class="text-center">
                                <div class="action-btns">
                                    <a onclick="detalle(${lista.id}, '${lista.nombre}', ${lista.quincena}, ${lista.id_empresa})" class="action-btn btn-view bs-tooltip me-2"
                                        data-toggle="tooltip" data-placement="top" title="Detalle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </a>
                                    <a onclick="eliminarLote(${lista.id}, '${lista.nombre}')" class="action-btn btn-delete bs-tooltip"
                                        data-toggle="tooltip" data-placement="top" title="Eliminar">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-trash-2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
                "lengthMenu": [7, 10, 20, 50],
                "pageLength": 10
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        Swal.close();
    }
}

function detalle(id, nombre, quincena, id_empresa) {
    sessionStorage.setItem("id_lote_detalle", id);
    sessionStorage.setItem("nombre_lote_detalle", nombre);
    sessionStorage.setItem("quincena_detalle", quincena);
    sessionStorage.setItem("id_empresa_nomina", id_empresa);
    window.location.href = './detalle_lote_cerrado.html';
}

function libro_salarios() {
    var id_empresa = document.getElementById("slc_empresa_reporte").value;
    var fecha_inicio = document.getElementById("fecha_inicio").value;
    var fecha_final = document.getElementById("fecha_final").value;
    var enero = document.getElementById("enero").value;
    var febrero = document.getElementById("febrero").value;
    var marzo = document.getElementById("marzo").value;
    var abril = document.getElementById("abril").value;
    var mayo = document.getElementById("mayo").value;
    var junio = document.getElementById("junio").value;
    var julio = document.getElementById("julio").value;
    var agosto = document.getElementById("agosto").value;
    var septiembre = document.getElementById("septiembre").value;
    var octubre = document.getElementById("octubre").value;
    var noviembre = document.getElementById("noviembre").value;
    var diciembre = document.getElementById("diciembre").value;

    if (id_empresa == '' || fecha_inicio == '' || fecha_final == '' ||
        enero == '' || febrero == '' || marzo == '' || abril == ''
        || mayo == '' || junio == '' || julio == '' || agosto == ''
        || septiembre == '' || octubre == '' || noviembre == ''
        || diciembre == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan datos',
            text: 'Asegurese que todos los datos estén llenos correctamente y haya seleccionado una empresa.'
        });
    } else {
        sessionStorage.setItem('id_empresa_nomina', id_empresa);
        sessionStorage.setItem('fecha_inicio', fecha_inicio);
        sessionStorage.setItem('fecha_final', fecha_final);
        sessionStorage.setItem('enero', enero);
        sessionStorage.setItem('febrero', febrero);
        sessionStorage.setItem('marzo', marzo);
        sessionStorage.setItem('abril', abril);
        sessionStorage.setItem('mayo', mayo);
        sessionStorage.setItem('junio', junio);
        sessionStorage.setItem('julio', julio);
        sessionStorage.setItem('agosto', agosto);
        sessionStorage.setItem('septiembre', septiembre);
        sessionStorage.setItem('octubre', octubre);
        sessionStorage.setItem('noviembre', noviembre);
        sessionStorage.setItem('diciembre', diciembre);

        window.location.href = './salarios.html';
    }
}

function eliminarLote(id, nombre) {
    Swal.fire({
        title: '¿Estás seguro?',
        html: `¿Deseas eliminar el lote <strong>"${nombre}"</strong> (ID: ${id})?<br><br><span style="color: #ff6b6b;">Esta acción eliminará todos los registros de pago asociados y no se puede deshacer.</span>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'eliminar_lote_cerrado',
                    id: id
                },
                success: function (resp) {
                    if (resp.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Eliminar',
                            text: 'Ha ocurrido un error al intentar eliminar el lote, por favor, inténtalo de nuevo.'
                        });
                        console.log(resp);
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Lote Eliminado',
                            text: `El lote "${nombre}" ha sido eliminado correctamente.`,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 1500
                        }).then(() => {
                            listado_lotes();
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error AJAX al eliminar lote:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Comunicación',
                        text: 'No se pudo conectar con el servidor. Por favor, intenta de nuevo.'
                    });
                }
            });
        }
    });
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

function generar_reporte_ejecutivo() {
    var id_empresa = document.getElementById("slc_empresa_reporte").value;
    var fecha_inicio = document.getElementById("fecha_inicio").value;
    var fecha_final = document.getElementById("fecha_final").value;
    var enero = document.getElementById("enero").value;
    var febrero = document.getElementById("febrero").value;
    var marzo = document.getElementById("marzo").value;
    var abril = document.getElementById("abril").value;
    var mayo = document.getElementById("mayo").value;
    var junio = document.getElementById("junio").value;
    var julio = document.getElementById("julio").value;
    var agosto = document.getElementById("agosto").value;
    var septiembre = document.getElementById("septiembre").value;
    var octubre = document.getElementById("octubre").value;
    var noviembre = document.getElementById("noviembre").value;
    var diciembre = document.getElementById("diciembre").value;

    if (id_empresa == '' || fecha_inicio == '' || fecha_final == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Datos requeridos',
            text: 'Para el reporte ejecutivo, debes seleccionar una empresa e ingresar el rango de fechas.'
        });
    } else {
        sessionStorage.setItem('id_empresa_nomina', id_empresa);
        sessionStorage.setItem('fecha_inicio', fecha_inicio);
        sessionStorage.setItem('fecha_final', fecha_final);
        sessionStorage.setItem('enero', enero);
        sessionStorage.setItem('febrero', febrero);
        sessionStorage.setItem('marzo', marzo);
        sessionStorage.setItem('abril', abril);
        sessionStorage.setItem('mayo', mayo);
        sessionStorage.setItem('junio', junio);
        sessionStorage.setItem('julio', julio);
        sessionStorage.setItem('agosto', agosto);
        sessionStorage.setItem('septiembre', septiembre);
        sessionStorage.setItem('octubre', octubre);
        sessionStorage.setItem('noviembre', noviembre);
        sessionStorage.setItem('diciembre', diciembre);

        window.location.href = './reporte_ejecutivo.html';
    }
}
