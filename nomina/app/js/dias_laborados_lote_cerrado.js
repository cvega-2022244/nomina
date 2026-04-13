var lote = sessionStorage.getItem('id_lote_detalle');

$(document).ready(function () {
    listado_dias_laborados();
});

function listado_dias_laborados() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dias_laborados_cerrados',
                id_lote: lote
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Dias Laborados',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(resp);
                } else if (resp.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Dias Laborados',
                        text: 'No hay dias laborados registrados en este lote'
                    });
                    console.log(resp);
                } else {
                    try {
                        $('#tabla').DataTable().destroy();
                        let lista = JSON.parse(resp);
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <tr>
                            <td>${lista.id}</td>
                            <td>${lista.empleado}</td>
                            <td>${lista.departamento}</td>
                            <td>${lista.centro_costo}</td>
                            <td>${lista.incidencia}</td>
                            <td>${lista.fecha_descuento}</td>
                            <td>${lista.fecha_generado}</td>
                            <td>
                                <div class="action-btns">
                                    <a href="javascript:void(0);" data-toggle="modal"
                                        data-target="#detalle" onclick="detalle(${lista.id})"
                                        class="action-btn btn-edit bs-tooltip me-2"
                                        data-toggle="tooltip" data-placement="top" title="Detalle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                            height="24" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z">
                                            </path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        `
                        });
                        document.getElementById('cuerpo_tabla').innerHTML = template;
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

function detalle(id) {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_dias_laborados',
                id: id
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Detalle',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(resp);
                } else {
                    try {
                        let lista = JSON.parse(resp);
                        var nombre_completo_detalle = document.getElementById("nombre_completo_detalle");
                        var departamento_detalle = document.getElementById("departamento_detalle");
                        var centro_costo_detalle = document.getElementById("centro_costo_detalle");
                        var dias_descontados_detalle = document.getElementById("dias_descontados_detalle");
                        var fecha_descuento_detalle = document.getElementById("fecha_descuento_detalle");
                        var fecha_generado_detalle = document.getElementById("fecha_generado_detalle");
                        var fecha_final_detalle = document.getElementById("fecha_final_detalle");
                        var observaciones_detalle = document.getElementById("observaciones_detalle");
                        var incidencia_detalle = document.getElementById("incidencia_detalle");
                        var septimo_detalle = document.getElementById("septimo_detalle");
                        nombre_completo_detalle.value = lista[0].empleado;
                        departamento_detalle.value = lista[0].departamento;
                        centro_costo_detalle.value = lista[0].centro_costo;
                        dias_descontados_detalle.value = lista[0].descuento_dias;
                        fecha_descuento_detalle.value = lista[0].fecha_descuento;
                        fecha_generado_detalle.value = lista[0].fecha_generado;
                        fecha_final_detalle.value = lista[0].fecha_final;
                        observaciones_detalle.value = lista[0].observaciones;
                        incidencia_detalle.value = lista[0].incidencia;
                        if (lista[0].septimo != 1) {
                            septimo_detalle.checked = false;
                        } else {
                            septimo_detalle.checked = true;
                        }
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve('success')
                    }
                }
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