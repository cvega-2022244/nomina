$(document).ready(function () {
    cargando()
    lista_bonos()
})

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

function lista_bonos() {
    return new Promise ((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_bonos'
            },
            success: function (res) {
                console.log(res);
                let lista = JSON.parse(res);
                let template = '';
                lista.forEach(lista => {
                    template += `
                    <tr role="row">
                        <td>${lista.id}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.empleado}</td>
                        <td>${lista.solicitante}</td>
                        <td>${lista.fecha_generado}</td>
                        <td>${lista.monto}</td>
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
                        <td class="text-center">
                            <svg style="cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye" onclick="detalle(${lista.id}, ${lista.id_empleado})"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </td>
                    </tr>
                    `
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
                    "lengthMenu": [7, 10, 20, 50],
                    "pageLength": 10
                });
                resolve('true')
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function detalle(id, id_empleado){
    sessionStorage.setItem("id_bono", id);
    sessionStorage.setItem("id_empleado", id_empleado);
    window.location.href = './detalle_bono.html';
}