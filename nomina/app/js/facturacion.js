var id_lote_detalle = sessionStorage.getItem('id_lote_detalle');

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'pago_real',
        id_lote: id_lote_detalle
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
                    <td>${lista.salario}</td>
                    <td>${lista.bono}</td>
                    <td>${lista.cantidad_simple}</td>
                    <td>${lista.horas_simple}</td>
                    <td>${lista.cantidad_doble}</td>
                    <td>${lista.horas_doble}</td>
                    <td>${lista.cuota_patronal}</td>
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

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'pago_contable',
        id_lote: id_lote_detalle
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
                    <td>${lista.salario}</td>
                    <td>${lista.bono}</td>
                    <td>${lista.cantidad_simple}</td>
                    <td>${lista.horas_simple}</td>
                    <td>${lista.cantidad_doble}</td>
                    <td>${lista.horas_doble}</td>
                    <td>${lista.cuota_patronal}</td>
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

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'ajuste_rh',
        id_lote: id_lote_detalle
    },
    success: function (resp) {
        console.log(resp);
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
                    <td>${lista.salario}</td>
                    <td>${lista.bono}</td>
                    <td>${lista.cantidad_simple}</td>
                    <td>${lista.horas_simple}</td>
                    <td>${lista.cantidad_doble}</td>
                    <td>${lista.horas_doble}</td>
                    <td>${lista.cuota_patronal}</td>
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

$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'determinacion',
        id_lote: id_lote_detalle
    },
    success: function (resp) {
        let lista = JSON.parse(resp);
        let template = '';
        lista.forEach(lista => {
            template += `
                <tr role="row">
                    <td>${lista.empresa}</td>
                    <td>${lista.salario}</td>
                    <td>${lista.bono}</td>
                    <td>${lista.cantidad_simple}</td>
                    <td>${lista.horas_simple}</td>
                    <td>${lista.cantidad_doble}</td>
                    <td>${lista.horas_doble}</td>
                    <td>${lista.cuota_patronal}</td>
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


$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'intercompany',
        id_lote: id_lote_detalle
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