var id_lote_detalle = sessionStorage.getItem('id_lote_detalle');

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'aguinaldo_real',
        anio: sessionStorage.getItem("anio_aguinaldo")
    },
    success: function (resp) {
        let lista = JSON.parse(resp);
        let template = '';
        lista.forEach(lista => {
            template += `
                <tr role="row">
                    <td>${lista.empresa}</td>
                    <td>${lista.d1}</td>
                    <td>${lista.d2}</td>
                    <td>${lista.d3}</td>
                    <td>${lista.d4}</td>
                    <td>${lista.d5}</td>
                    <td>${lista.diciembre}</td>
                    <td>${lista.enero}</td>
                    <td>${lista.febrero}</td>
                    <td>${lista.marzo}</td>
                    <td>${lista.abril}</td>
                    <td>${lista.mayo}</td>
                    <td>${lista.junio}</td>
                    <td>${lista.julio}</td>
                    <td>${lista.agosto}</td>
                    <td>${lista.septiembre}</td>
                    <td>${lista.octubre}</td>
                    <td>${lista.noviembre}</td>
                    <td>${lista.suma}</td>
                    <td>${lista.total}</td>
                </tr>
            `;
        });
        document.getElementById("cuerpo_real").innerHTML = template;
        $('#tabla_real').DataTable({
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
});

function excel_real() {
    var anio = sessionStorage.getItem("anio_aguinaldo")
    window.location.href = './php/facturacion_aguinaldo_real.php?anio=' + anio;
}

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'aguinaldo_contable',
        anio: sessionStorage.getItem("anio_aguinaldo")
    },
    success: function (resp) {
        let lista = JSON.parse(resp);
        let template = '';
        lista.forEach(lista => {
            template += `
                <tr role="row">
                    <td>${lista.empresa}</td>
                    <td>${lista.d1}</td>
                    <td>${lista.d2}</td>
                    <td>${lista.d3}</td>
                    <td>${lista.d4}</td>
                    <td>${lista.d5}</td>
                    <td>${lista.diciembre}</td>
                    <td>${lista.enero}</td>
                    <td>${lista.febrero}</td>
                    <td>${lista.marzo}</td>
                    <td>${lista.abril}</td>
                    <td>${lista.mayo}</td>
                    <td>${lista.junio}</td>
                    <td>${lista.julio}</td>
                    <td>${lista.agosto}</td>
                    <td>${lista.septiembre}</td>
                    <td>${lista.octubre}</td>
                    <td>${lista.noviembre}</td>
                    <td>${lista.suma}</td>
                    <td>${lista.total}</td>
                </tr>
            `;
        });
        document.getElementById("cuerpo_contable").innerHTML = template;
        $('#tabla_contable').DataTable({
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
});

function excel_contable() {
    var anio = sessionStorage.getItem("anio_aguinaldo")
    window.location.href = './php/facturacion_aguinaldo_contable.php?anio=' + anio;
}

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'aguinaldo_ajuste',
        anio: sessionStorage.getItem("anio_aguinaldo")
    },
    success: function (resp) {
        let lista = JSON.parse(resp);
        let template = '';
        lista.forEach(lista => {
            template += `
                <tr role="row">
                    <td>${lista.empresa}</td>
                    <td>${lista.d1}</td>
                    <td>${lista.d2}</td>
                    <td>${lista.d3}</td>
                    <td>${lista.d4}</td>
                    <td>${lista.d5}</td>
                    <td>${lista.diciembre}</td>
                    <td>${lista.enero}</td>
                    <td>${lista.febrero}</td>
                    <td>${lista.marzo}</td>
                    <td>${lista.abril}</td>
                    <td>${lista.mayo}</td>
                    <td>${lista.junio}</td>
                    <td>${lista.julio}</td>
                    <td>${lista.agosto}</td>
                    <td>${lista.septiembre}</td>
                    <td>${lista.octubre}</td>
                    <td>${lista.noviembre}</td>
                    <td>${lista.suma}</td>
                    <td>${lista.total}</td>
                </tr>
            `;
        });
        document.getElementById("cuerpo_rh").innerHTML = template;
        $('#tabla_rh').DataTable({
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
});

function excel_ajuste_rh() {
    var anio = sessionStorage.getItem("anio_aguinaldo")
    window.location.href = './php/facturacion_aguinaldo_ajuste_rh.php?anio=' + anio;
}

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'aguinaldo_determinacion',
        anio: sessionStorage.getItem("anio_aguinaldo")
    },
    success: function (resp) {
        let lista = JSON.parse(resp);
        let template = '';
        lista.forEach(lista => {
            template += `
                <tr role="row">
                    <td>${lista.empresa}</td>
                    <td>${lista.diciembre}</td>
                    <td>${lista.enero}</td>
                    <td>${lista.febrero}</td>
                    <td>${lista.marzo}</td>
                    <td>${lista.abril}</td>
                    <td>${lista.mayo}</td>
                    <td>${lista.junio}</td>
                    <td>${lista.julio}</td>
                    <td>${lista.agosto}</td>
                    <td>${lista.septiembre}</td>
                    <td>${lista.octubre}</td>
                    <td>${lista.noviembre}</td>
                    <td>${lista.suma}</td>
                    <td>${lista.total}</td>
                </tr>
            `;
        });
        document.getElementById("cuerpo_deter").innerHTML = template;
        $('#tabla_deter').DataTable({
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
});

function excel_determinacion() {
    var anio = sessionStorage.getItem("anio_aguinaldo")
    window.location.href = './php/facturacion_aguinaldo_determinacion.php?anio=' + anio;
}

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'aguinaldo_intercompany',
        anio: sessionStorage.getItem("anio_aguinaldo")
    },
    success: function (resp) {
        let lista = JSON.parse(resp);
        let template = '';
        lista.forEach(lista => {
            template += `
                <tr role="row">
                    <td>${lista.factura}</td>
                    <td>${lista.base}</td>
                    <td>${lista.iva}</td>
                    <td>${lista.total}</td>
                </tr>
            `;
        });
        document.getElementById("cuerpo_int").innerHTML = template;
        $('#tabla_int').DataTable({
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
});

function excel_intercompany() {
    var anio = sessionStorage.getItem("anio_aguinaldo")
    window.location.href = './php/facturacion_aguinaldo_intercompany.php?anio=' + anio;
}