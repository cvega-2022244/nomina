const fecha = new Date();

var tabla_maestra = '';
$(document).ready(function () {
    cargarIntercompay();
    cargarCambios();
});

async function cargarCambios() {
    const mesActual = fecha.getMonth() + 1;
    var template_cambios = '';

    try {
        const listaRes = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_empresa'
            }
        });

        let lista = JSON.parse(listaRes);

        for (const item of lista) {
            var query = '';

            if (mesActual >= 7) {
                query = `SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, em.nombre_comercial empresa, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AS AL, DATEDIFF( DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) AS dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS junio, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo, ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) AS bono, ( ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) / 2 ) AS primer_pago, ( ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) / 2 ) AS segundo_pago FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW(), '%Y-07-01') AND DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado ) AND pl.id_empresa = ${item.id} GROUP BY e.id`;
            } else {
                query = `SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, em.nombre_comercial empresa, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d') ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT( NOW(), '%Y-06-30') AS AL, DATEDIFF( DATE_FORMAT( NOW(), '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d') ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) AS dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS junio, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo, ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) AS bono, ( ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) / 2 ) AS primer_pago, ( ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) / 2 ) AS segundo_pago FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01') AND DATE_FORMAT( NOW(), '%Y-06-30') AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado )AND pl.id_empresa = ${item.id} GROUP BY e.id`;
            }

            template_cambios += `
                <div class="p-2">
                    
                    <br>
                    <div class="statbox widget box box-shadow">
                        <div class="widget-content widget-content-area">
                            <table id="tabla_${item.id}" class="table dt-table-hover dataTable no-footer" style="width:100%"
                                role="grid" aria-describedby="zero-config_info">
                                <thead>
                                <h5 class="text-center">Cambios de empresa de ${item.nombre}</h5>
                                    <tr role="row">
                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Empleado</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Empresa</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Fecha Inicio</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Periodo de pago</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">al</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Días a pagar</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Julio</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Agosto</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Septiembre</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Octubre</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Noviembre</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Diciembre</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Enero</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Febrero</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Marzo</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Abril</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Mayo</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Junio</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Total</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Bono</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Primer Pago</th>

                                        <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                            colspan="1" style="width: 30.4844px;">Segundo Pago</th>

                                    </tr>
                                </thead>
                            <tbody>
            `;

            const res = await $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'cambios_personal',
                    query
                }
            });

            if (res.trim() != '') {
                let lista = JSON.parse(res);
                lista.forEach(element => {
                    template_cambios += `
                        <tr>
                            <td>${element.empleado}</td>
                            <td>${element.empresa}</td>
                            <td>${element.fecha_inicio}</td>
                            <td>${element.periodo_pago}</td>
                            <td>${element.al}</td>
                            <td>${element.dias_pagar}</td>
                            <td>${element.julio}</td>
                            <td>${element.agosto}</td>
                            <td>${element.septiembre}</td>
                            <td>${element.octubre}</td>
                            <td>${element.noviembre}</td>
                            <td>${element.diciembre}</td>
                            <td>${element.enero}</td>
                            <td>${element.febrero}</td>
                            <td>${element.marzo}</td>
                            <td>${element.abril}</td>
                            <td>${element.mayo}</td>
                            <td>${element.junio}</td>
                            <td>${element.total}</td>
                            <td>${element.bono}</td>
                            <td>${element.primer_pago}</td>
                            <td>${element.segundo_pago}</td>
                        </tr>
                    `;
                });

                template_cambios += `
                                </tbody>
                            </table>
                            <div class="col-5">
                                <button class="btn btn-success" onclick="excel_cambios_empresa(${item.id})">Descargar Excel</button>
                            </div>
                        </div>
                        <br>
                    </div>
                </div>
                <br>
                `;
            }
        }
        document.getElementById("tabla_cambios").innerHTML = template_cambios;
        dinamismo();
    } catch (error) {
        console.error(error);
    }
}

function excel_cambios_empresa(id_empresa) {
    const mesActual = fecha.getMonth() + 1;
    var query = '';
    return new Promise((resolve) => {
        if (mesActual >= 7) {
            query = `SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, em.nombre_comercial empresa, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AS AL, DATEDIFF( DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) AS dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS junio, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo, ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) AS bono, ( ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) / 2 ) AS primer_pago, ( ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) / 2 ) AS segundo_pago FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW(), '%Y-07-01') AND DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado ) AND pl.id_empresa = ${id_empresa} GROUP BY e.id`;
        } else {
            query = `SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, em.nombre_comercial empresa, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d') ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT( NOW(), '%Y-06-30') AS AL, DATEDIFF( DATE_FORMAT( NOW(), '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d') ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) AS dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN pl.total_reporte_bono * ee.porcentaje / 100 ELSE 0 END ) AS junio, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo, ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) AS bono, ( ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) / 2 ) AS primer_pago, ( ( SUM(pl.total_reporte_bono) / 360 * 30 * ee.porcentaje / 100 ) / 2 ) AS segundo_pago FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT(NOW() - INTERVAL 1 YEAR, '%Y-07-01') AND DATE_FORMAT( NOW(), '%Y-06-30') AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado )AND pl.id_empresa = ${id_empresa} GROUP BY e.id`;
        }
        resolve(window.location.href = './php/cambios_empresa_b14.php?query=' + query);
    });
}

async function dinamismo() {
    const listaRes = await $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lista_empresa'
        }
    });

    let lista = JSON.parse(listaRes);

    for (const item of lista) {
        $(`#tabla_${item.id}`).DataTable({
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
}

async function cargarIntercompay() {
    try {
        await cargarDatos();
        await cargarEmpresasDeudoras();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function cargarDatos() {
    const mesActual = fecha.getMonth() + 1;
    var anio = 2000;
    return new Promise((resolve, reject) => {
        if (mesActual >= 7) {
            anio = fecha.getFullYear() + 1;
        } else {
            anio = fecha.getFullYear();
        }
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_bono_anual',
                anio,
                id_empresa: sessionStorage.getItem("id_empresa_nomina")
            },
            success: function (res) {
                if (res == 'No') {
                    btn_excel_bonos_empleados.style.display = 'none';
                } else {
                    btn_excel_bonos_empleados.style.display = '';
                }
                let lista = JSON.parse(res);
                let template = '';
                lista.forEach(item => {
                    template += `
                    <tr role="row">
                        <td>${item.empleado}</td>
                        <td>${item.empresa}</td>
                        <td>${item.porcentaje}</td>
                        <td>${item.fecha_inicio}</td>
                        <td>${item.periodo_pago}</td>
                        <td>${item.al}</td>
                        <td>${item.dias_pagar}</td>
                        <td>${item.julio}</td>
                        <td>${item.agosto}</td>
                        <td>${item.septiembre}</td>
                        <td>${item.octubre}</td>
                        <td>${item.noviembre}</td>
                        <td>${item.diciembre}</td>
                        <td>${item.enero}</td>
                        <td>${item.febrero}</td>
                        <td>${item.marzo}</td>
                        <td>${item.abril}</td>
                        <td>${item.mayo}</td>
                        <td>${item.junio}</td>
                        <td>${item.total_periodo}</td>
                        <td>${item.bono}</td>
                        <td>
                        </td>
                    </tr>
                    `;
                });
                document.getElementById("cuerpo_tabla").innerHTML = template;
                $('#tabla_b').DataTable({
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
                resolve();
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function excel_bonos_empleados() {
    const mesActual = fecha.getMonth() + 1;
    var anio = 2000;
    var id_empresa = sessionStorage.getItem("id_empresa_nomina")
    return new Promise((resolve) => {
        if (mesActual >= 7) {
            anio = fecha.getFullYear() + 1;
        } else {
            anio = fecha.getFullYear();
        }
        resolve(window.location.href = './php/bonos_empleados_b14.php?anio=' + anio + '&id_empresa=' + id_empresa);
    });
}

function cargarEmpresasDeudoras() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_empresa'
            },
            success: function (res) {
                let listaEmpresas = JSON.parse(res);
                let loadedPromises = [];

                for (const empresa of listaEmpresas) {
                    const promise = cargarEmpresaDeudora(empresa)
                        .catch(error => {
                            console.error("Error cargando empresa deudora:", error);
                        });
                    loadedPromises.push(promise);
                }

                Promise.all(loadedPromises)
                    .then(() => {
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}




function cargarEmpresaDeudora(empresa) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_empresa_filtro',
                id_empresa: empresa.id
            },
            success: function (resp) {
                let listaDeudas = JSON.parse(resp);
                let loadedPromises = [];

                for (const deuda of listaDeudas) {
                    const promise = obtenerIntercompanyData(deuda, empresa)
                        .then(intercompanyData => {
                            if (intercompanyData.trim() !== '') {
                                const tablaIntercompany = generarTablaIntercompany(intercompanyData, deuda, empresa);
                                agregarTablaMaestra(tablaIntercompany);
                            } else {
                            }
                        })
                        .catch(error => {
                            console.error("Error en intercompany:", error);
                        });
                    loadedPromises.push(promise);
                }

                Promise.all(loadedPromises)
                    .then(() => {
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}


async function obtenerIntercompanyData(deuda, empresa) {
    const mesActual = fecha.getMonth() + 1;
    var template = '';
    return new Promise((resolve, reject) => {
        if (mesActual >= 7) {
            template = `SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, eD.nombre_comercial empresa_deudora, ( SELECT eA.nombre_comercial FROM empresa_empleado ee2 INNER JOIN empresa eA ON eA.id = ee2.id_empresa WHERE ee2.id_empleado = e.id AND ee2.principal = 1 ) empresa_acreedora, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo FROM pago_lote pl INNER JOIN empresa eD ON eD.id = pl.id_empresa INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW(), '%Y-07-01') AND DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AND pl.id_empresa !=( SELECT ee2.id_empresa FROM empresa_empleado ee2 WHERE ee2.id_empleado = e.id AND ee2.principal = 1 AND ee2.id_empresa = ${empresa.id} ) AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado ) AND pl.id_empresa = ${deuda.id} GROUP BY e.id`; // Tu consulta SQL
        } else {
            template = `SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, eD.nombre_comercial empresa_deudora, ( SELECT eA.nombre_comercial FROM empresa_empleado ee2 INNER JOIN empresa eA ON eA.id = ee2.id_empresa WHERE ee2.id_empleado = e.id AND ee2.principal = 1 ) empresa_acreedora, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo FROM pago_lote pl INNER JOIN empresa eD ON eD.id = pl.id_empresa INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') AND DATE_FORMAT(NOW(), '%Y-06-30') AND pl.id_empresa !=( SELECT ee2.id_empresa FROM empresa_empleado ee2 WHERE ee2.id_empleado = e.id AND ee2.principal = 1 AND ee2.id_empresa = ${empresa.id} ) AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado ) AND pl.id_empresa = ${deuda.id} GROUP BY e.id`; // Tu consulta SQL
        }
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'intercompany_bonos',
                query: template
            },
            success: function (respuesta) {
                if (respuesta.trim() != '') {
                    resolve(respuesta);
                }
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function generarTablaIntercompany(intercompanyData, deuda, empresa) {
    var total_reporte = 0;
    let tabla_intercompany = `<h5>${deuda.nombre} le debe a ${empresa.nombre}</h5><br>`;
    tabla_intercompany = `
    <div class="p-2">
        <h5 class="text-center">Facturación de ${empresa.nombre} a ${deuda.nombre}</h5>
        <br>
        <div class="statbox widget box box-shadow">
            <div class="widget-content widget-content-area">
                <table id="tabla_b" class="table dt-table-hover dataTable no-footer" style="width:100%"
                    role="grid" aria-describedby="zero-config_info">
                    <thead>
                        <tr role="row">
                            <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                colspan="1" style="width: 30.4844px;">Empleado</th>

                            <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                colspan="1" style="width: 30.4844px;">Empresa Deudora</th>

                            <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                colspan="1" style="width: 30.4844px;">Empresa Acreedora</th>

                            <th class="sorting" tabindex="0" aria-controls="zero-config" rowspan="1"
                                colspan="1" style="width: 30.4844px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        `;
    let lista_intercompanyData = JSON.parse(intercompanyData);
    lista_intercompanyData.forEach(lista_ajuste => {
        total_reporte += parseFloat(lista_ajuste.total);
        tabla_intercompany += `
            <tr>
                <td>${lista_ajuste.empleado}</td>
                <td>${lista_ajuste.empresa_deudora}</td>
                <td>${lista_ajuste.empresa_acreedora}</td>
                <td>${lista_ajuste.total}</td>
            </tr>
        `;
    });
    tabla_intercompany += `
                    </tbody>
                    <tfoot>
                        <th>TOTAL</th>
                        <th>${deuda.nombre}</th>
                        <th>${empresa.nombre}</th>
                        <th>${total_reporte}</th>
                    </tfoot>
                </table>
                <div class="col-5">
                    <button class="btn btn-success" onclick="excel_facturacion(${deuda.id},${empresa.id})">Descargar Excel</button>
                </div>
            </div>
            <br>
        </div>
    </div>
    `;
    return tabla_intercompany;
}

function excel_facturacion(deuda, empresa) {
    const mesActual = fecha.getMonth() + 1;
    var template = '';
    return new Promise((resolve) => {
        if (mesActual >= 7) {
            template = `SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, eD.nombre_comercial empresa_deudora, ( SELECT eA.nombre_comercial FROM empresa_empleado ee2 INNER JOIN empresa eA ON eA.id = ee2.id_empresa WHERE ee2.id_empleado = e.id AND ee2.principal = 1 ) empresa_acreedora, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo FROM pago_lote pl INNER JOIN empresa eD ON eD.id = pl.id_empresa INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW(), '%Y-07-01') AND DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AND pl.id_empresa !=( SELECT ee2.id_empresa FROM empresa_empleado ee2 WHERE ee2.id_empleado = e.id AND ee2.principal = 1 AND ee2.id_empresa = ${empresa} ) AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado ) AND pl.id_empresa = ${deuda} GROUP BY e.id`; // Tu consulta SQL
        } else {
            template = `SELECT CONCAT_WS(' ', e.primer_nombre, e.segundo_nombre, e.otro_nombre, e.primer_apellido, e.segundo_apellido, e.apellido_casada) empleado, eD.nombre_comercial empresa_deudora, ( SELECT eA.nombre_comercial FROM empresa_empleado ee2 INNER JOIN empresa eA ON eA.id = ee2.id_empresa WHERE ee2.id_empleado = e.id AND ee2.principal = 1 ) empresa_acreedora, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo FROM pago_lote pl INNER JOIN empresa eD ON eD.id = pl.id_empresa INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') AND DATE_FORMAT(NOW(), '%Y-06-30') AND pl.id_empresa !=( SELECT ee2.id_empresa FROM empresa_empleado ee2 WHERE ee2.id_empleado = e.id AND ee2.principal = 1 AND ee2.id_empresa = ${empresa} ) AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado ) AND pl.id_empresa = ${deuda} GROUP BY e.id`; // Tu consulta SQL
        }
        resolve(window.location.href = './php/facturacion_b14.php?query=' + template);
    });
}

function obtenerTotalIntercompany(deuda, empresa, callback) {
    const template = `SELECT 'Total' empleado, eD.nombre_comercial empresa_deudora, ( SELECT eA.nombre_comercial FROM empresa_empleado ee2 INNER JOIN empresa eA ON eA.id = ee2.id_empresa WHERE ee2.id_empleado = e.id AND ee2.principal = 1 ) empresa_acreedora, SUM( pl.total_reporte_bono * ee.porcentaje / 100 ) AS total_salario_periodo FROM pago_lote pl INNER JOIN empresa eD ON eD.id = pl.id_empresa INNER JOIN empleado e ON pl.id_empleado = e.id RIGHT JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') AND DATE_FORMAT(NOW(), '%Y-06-30') AND pl.id_empresa !=( SELECT ee2.id_empresa FROM empresa_empleado ee2 WHERE ee2.id_empleado = e.id AND ee2.principal = 1 AND ee2.id_empresa = ${empresa.id} ) AND e.id IN( SELECT DISTINCT a.id_empleado FROM pago_lote a INNER JOIN pago_lote b ON a.id_empleado = b.id_empleado AND a.fecha_pago_lote < b.fecha_pago_lote WHERE a.id_empresa <> b.id_empresa GROUP BY a.id_empleado ) AND pl.id_empresa = ${deuda.id}`;

    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'intercompany_bonos',
            query: template
        },
        success: function (respuesta) {
            if (respuesta.trim() !== '') {
                callback(null, respuesta);
            }
        },
        error: function (error) {
            callback(error, null);
        }
    });
}

function agregarTablaMaestra(tablaIntercompany) {
    tabla_maestra += tablaIntercompany;
    $('#tablas').html(tabla_maestra);
}