var lote = sessionStorage.getItem('id_lote_detalle');

$(document).ready(function () {
    cargando();
    listado_horas();
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

function listado_horas() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_horas_cerradas',
                id_lote: lote
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Horas Extra',
                        text: 'Ah ocurrido un error al intentar obtener las horas extra, por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Horas Extra',
                        text: 'No hay registro de horas extras en este lote'
                    });
                    console.log(res);
                } else {
                    try {
                        let lista = JSON.parse(res);
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                        <tr>
                            <td>${lista.id}</td>
                            <td>${lista.empleado}</td>
                            <td>${lista.fecha_trabajado}</td>
                            <td>${lista.horas}</td>
                            <td>${lista.jornada}</td>
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
                        </td>
                        <td>
                            <div class="action-btns">
                                <a onclick="detalle_hora(${lista.id})" class="action-btn btn-view bs-tooltip me-2"
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
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve();
                    }
                }
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function detalle_hora(id) {
    return new Promise((resolve) => {
        try {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'detalle_horas_extra',
                    id
                },
                success: function (res) {
                    if (res.includes('Query Falló')) {
                        Swal.fire({
                            title: '¡Hubo un error!',
                            text: "Por favor comunicate con sistemas",
                            icon: 'error'
                        });
                        console.log(res);
                    } else {
                        let lista = JSON.parse(res);
                        var nombre_completo_detalle = document.getElementById("nombre_completo_detalle");
                        var departamento_detalle = document.getElementById("departamento_detalle");
                        var fecha_trabajada_detalle = document.getElementById("fecha_trabajada_detalle");
                        var empresa_detalle = document.getElementById("empresa_detalle");
                        var horas_detalle = document.getElementById("horas_trabajadas_detalle");
                        var jornada_detalle = document.getElementById("jornada_detalle");
                        var monto_detalle = document.getElementById("monto_detalle");
                        var observaciones_detalle = document.getElementById("observaciones_detalle");
                        var solicitador_detalle = document.getElementById("solicitador_detalle");
                        var fecha_solicitado_detalle = document.getElementById("fecha_solicitado_detalle");
                        var input_obs_gerencia = document.getElementById("input_obs_gerencia");
                        var obs_gerencia_detalle = document.getElementById("obs_gerencia_detalle");
                        lista.forEach(lista => {
                            nombre_completo_detalle.value = lista.empleado;
                            departamento_detalle.value = lista.departamento;
                            fecha_trabajada_detalle.value = lista.fecha_trabajado;
                            empresa_detalle.value = lista.empresa;
                            horas_detalle.value = lista.horas;
                            jornada_detalle.value = lista.jornada;
                            monto_detalle.value = formatear_numeros(lista.monto);
                            observaciones_detalle.value = lista.observacion;
                            solicitador_detalle.value = lista.solicitador;
                            fecha_solicitado_detalle.value = lista.fecha_solicitado;
                            if (lista.estado == 3) {
                                input_obs_gerencia.style.display = "block";
                                obs_gerencia_detalle.value = lista.observacion_gerencia;
                            } else {
                                input_obs_gerencia.style.display = "none";
                            }
                        });
                        resolve('success');
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }).then(() => {
        try {
            $('#detalle').modal('show');
        } catch (error) {
            console.log();
        } finally {
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