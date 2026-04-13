var lote = sessionStorage.getItem("id_lote_detalle");

$(document).ready(function () {
    traer_descuentos_general();
});

function formatear_numeros(numero) {
    const number = numero;
    const locale = 'es-GT';

    const options = {
        style: 'currency',
        currency: 'GTQ',
        minimumIntegerDigits: 2,
    };

    const formattedNumber = new Intl.NumberFormat(locale, options).format(number);
    return formattedNumber;
}

async function traer_descuentos_general() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        cargando();
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos generales');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos generales');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
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
                "lengthMenu": [5, 10, 20, 50],
                "pageLength": 10
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        await traer_descuentos_cafeteria();
    }
}

async function traer_descuentos_cafeteria() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados_cafeteria',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos cafeteria');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos cafeteria');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
            });
            document.getElementById("cuerpo_tabla_cafeteria").innerHTML = template;
            $('#tabla_cafeteria').DataTable({
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
    } catch (error) {
        console.log(error);
    } finally {
        await traer_descuentos_celular();
    }
}

async function traer_descuentos_celular() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados_celular',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos celular');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos celular');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
            });
            document.getElementById("cuerpo_tabla_celular").innerHTML = template;
            $('#tabla_celular').DataTable({
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
    } catch (error) {
        console.log(error);
    } finally {
        await traer_descuentos_uniforme();
    }
}

async function traer_descuentos_uniforme() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados_uniforme',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos uniforme');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos uniforme');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
            });
            document.getElementById("cuerpo_tabla_uniforme").innerHTML = template;
            $('#tabla_uniforme').DataTable({
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
    } catch (error) {
        console.log(error);
    } finally {
        await traer_descuentos_calzado();
    }
}

async function traer_descuentos_calzado() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados_calzado',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos calzado');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos calzado');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
            });
            document.getElementById("cuerpo_tabla_calzado").innerHTML = template;
            $('#tabla_calzado').DataTable({
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
    } catch (error) {
        console.log(error);
    } finally {
        await traer_descuentos_equipo();
    }
}

async function traer_descuentos_equipo() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados_equipo',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos equipo');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos equipo');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
            });
            document.getElementById("cuerpo_tabla_equipo").innerHTML = template;
            $('#tabla_equipo').DataTable({
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
    } catch (error) {
        console.log(error);
    } finally {
        await traer_descuentos_producto();
    }
}

async function traer_descuentos_producto() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados_producto',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos producto');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos producto');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
            });
            document.getElementById("cuerpo_tabla_producto").innerHTML = template;
            $('#tabla_producto').DataTable({
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
    } catch (error) {
        console.log(error);
    } finally {
        await traer_descuentos_bancos();
    }
}

async function traer_descuentos_bancos() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados_bancos',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos bancos');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos bancos');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
            });
            document.getElementById("cuerpo_tabla_bancos").innerHTML = template;
            $('#tabla_bancos').DataTable({
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
    } catch (error) {
        console.log(error);
    } finally {
        await traer_descuentos_otros();
    }
}

async function traer_descuentos_otros() {
    try {
        var id_empresa_nomina = sessionStorage.getItem("id_empresa_nomina");
        const res = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_descuentos_cerrados_otros',
                id_lote: lote,
                id_empresa: id_empresa_nomina
            },
        });

        if (res.includes('Query Falló')) {
            console.log('Error al obtener descuentos otros');
        } else if (res.includes('No hay datos')) {
            console.log('No hay descuentos otros');
        } else {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>${lista.id_descuento}</td>
                        <td>${lista.nombre_empleado}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_pagar)}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>
                            <div class="action-btns">
                                <a href="javascript:void(0);" data-toggle="modal"
                                    data-target="#detalle" onclick="detalle(${lista.id_descuento})"
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
                `;
            });
            document.getElementById("cuerpo_tabla_otros").innerHTML = template;
            $('#tabla_otros').DataTable({
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
    } catch (error) {
        console.log(error);
    } finally {
        Swal.close();
    }
}



function detalle(id) {
    cargando();
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lista_descuento',
            id
        },
        success: function (res) {
            let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
            lista.forEach(lista => {
                document.getElementById("nombre_completo_detalle").value = lista.nombre;
                document.getElementById("departamento_detalle").value = lista.departamento;
                document.getElementById("centro_costo_detalle").value = lista.centro_costo;
                document.getElementById("tipo_egreso_detalle").value = lista.tipo_egreso;
                document.getElementById("monto_total_detalle").value = formatear_numeros(lista.monto_total);
                document.getElementById("monto_descuento_detalle").value = formatear_numeros(lista.monto_total / lista.cuotas);
                document.getElementById("cuota_total_detalle").value = lista.cuotas;
                document.getElementById("cuota_faltante_detalle").value = lista.faltan;
                document.getElementById("fecha_generado_detalle").value = lista.fecha_generado;
                if (lista.seleccionado == 1) {
                    document.getElementById("seleccionado_detalle").value = 'En estado válido para descontar en esta quincena';
                } else {
                    document.getElementById("seleccionado_detalle").value = 'En estado inválido para descontar en esta quincena';
                }
                Swal.close();
            });
        }
    });

    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lote_descuentos_anteriores',
            id_descuento: id
        },
        success: function (res) {
            if (res.includes('No')) {
                document.getElementById("descuento_lotes").innerHTML = '';
            } else {
                console.log(res);
                let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }
                let template = '';
                lista.forEach(lista => {
                    template += `
                    <tr>
                        <td>${lista.nombre}</td>
                    </tr>
                    `;
                });
                document.getElementById("descuento_lotes").innerHTML = template;
            }
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