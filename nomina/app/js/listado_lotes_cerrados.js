var bonos_confirmados = new Array();
var quincena = sessionStorage.getItem('quincena');

$(document).ready(function () {
    cargando();
    listado_lotes();
})

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
            let lista = JSON.parse(resp);
            template = '';
            lista.forEach(lista => {

                template += `</tr>
                            <td>${lista.id}</td>
                            <td>${lista.nombre}</td>
                            `;
                template += `
                            <td class="text-center">
                                <div class="action-btns">
                                    <a onclick="detalle(${lista.id}, '${lista.nombre}', ${lista.quincena})" class="action-btn btn-view bs-tooltip me-2"
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
    } catch (error) {
        console.log(error);
    } finally {
        Swal.close();
    }
}

function detalle(id, nombre, quincena) {
    sessionStorage.setItem("id_lote_detalle", id);
    sessionStorage.setItem("nombre_lote_detalle", nombre);
    sessionStorage.setItem("quincena_detalle", quincena);
    window.location.href = './detalle_lote_cerrado.html';
}

function libro_salarios() {
    var fecha_inicio = document.getElementById("fecha_inicio").value;
    var fecha_final = document.getElementById("fecha_final").value;
    var enero = document.getElementById("enero").value;
    var febrero = document.getElementById("febrero").value;
    var marzo = document.getElementById("marzo").value;
    var abril = document.getElementById("abril").value;
    var marzo = document.getElementById("marzo").value;
    var mayo = document.getElementById("mayo").value;
    var junio = document.getElementById("junio").value;
    var julio = document.getElementById("julio").value;
    var agosto = document.getElementById("agosto").value;
    var septiembre = document.getElementById("septiembre").value;
    var octubre = document.getElementById("octubre").value;
    var noviembre = document.getElementById("noviembre").value;
    var diciembre = document.getElementById("diciembre").value;

    if (fecha_inicio == '' || fecha_final == '' ||
        enero == '' || febrero == '' || marzo == '' || abril == ''
        || mayo == '' || junio == '' || julio == '' || agosto == ''
        || septiembre == '' || octubre == '' || noviembre == ''
        || diciembre == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Faltan datos',
            text: 'Asegurese que todos los datos estén llenos correctamente.'
        });
    } else {
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
