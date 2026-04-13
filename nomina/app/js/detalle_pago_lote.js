$(document).ready(function () {
    cargando()
    informacion_pago()
})

function informacion_pago() {
    return new Promise((resolve) => {
        try {
            var id_pago_lote = sessionStorage.getItem('id_pago_lote')
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'detalle_pago_lote',
                    id_pago_lote
                },
                success: function (res) {
                    console.log(res);
                    let lista = JSON.parse(res)
                    document.getElementById('nombre').value = lista[0].nombre_empleado
                    document.getElementById('puesto').value = lista[0].puesto
                    document.getElementById('empresa').value = lista[0].empresa_trabajo
                    document.getElementById('concepto').value = lista[0].tarea
                    document.getElementById('valor').value = lista[0].liquido
                    document.getElementById('bon_dec_31_2001').value = lista[0].bon_dec_37_2001
                    document.getElementById('anticipo_quincenal').value = lista[0].anticipo_quincenal
                    document.getElementById('bon_productiva').value = lista[0].bon_productiva
                    document.getElementById('bantrab').value = lista[0].bantrab
                    document.getElementById('bon_incentivo').value = lista[0].bon_incentivo
                    document.getElementById('ornato').value = lista[0].boleto_de_ornato
                    document.getElementById('comisiones').value = lista[0].comisiones
                    document.getElementById('cafetería').value = lista[0].cafeteria
                    document.getElementById('horas_extras_dobles').value = lista[0].horas_extras_dobles
                    document.getElementById('celular').value = lista[0].celular
                    document.getElementById('horas_simples').value = lista[0].horas_extras_simples
                    document.getElementById('igss_laboral').value = lista[0].igss_laboral
                    document.getElementById('IGSS_patronal_gasto').value = lista[0].igss_patronal_gasto
                    document.getElementById('igss_patronal').value = lista[0].igss_patronal
                    document.getElementById('sueldo_ordinario').value = lista[0].sueldo_ordinario
                    document.getElementById('isr').value = lista[0].isr
                    document.getElementById('otros_ingresos').value = lista[0].otro_ingresos
                    document.getElementById('otros_egresos').value = lista[0].otro_descuentos
                    document.getElementById('total_IGSS').value = lista[0].total_igss
                    document.getElementById('prestamo_empresa_planilla').value = lista[0].prestamo_empresa
                    document.getElementById('vacaciones_planilla').value = lista[0].vacaciones
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            resolve('true')
        }
    }).then(() => {
        lista_bonos()
    })
}

function lista_bonos() {
    var id_pago_lote = sessionStorage.getItem('id_pago_lote')
    return new Promise ((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_bonos_pago_lote',
                id_pago_lote
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
                resolve('true')
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