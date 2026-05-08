var empleados_en_nomina = [];
var empleados_fuera_nomina = [];
var empleados = [];
var id_lote_detalle = sessionStorage.getItem('id_lote_detalle');
var id_empresa_nomina = sessionStorage.getItem('id_empresa_nomina');

$(document).ready(function () {
    // Validar que existan los datos necesarios en sessionStorage
    if (!id_lote_detalle || !id_empresa_nomina) {
        Swal.fire({
            icon: 'warning',
            title: 'Datos no encontrados',
            text: 'Por favor, seleccione un lote desde el listado de lotes cerrados.',
            confirmButtonText: 'Ir al listado'
        }).then(() => {
            window.location.href = './listado_lotes_cerrados.html';
        });
        return;
    }
    cargando();
    inicializar_select_empresa();
})

function inicializar_select_empresa() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'listado_empresas_historial',
                id_lote: id_lote_detalle
            },
            success: function (res) {
                if (!res.includes('Query Falló') && !res.includes('No hay datos')) {
                    try {
                        let lista = JSON.parse(res);
                        var slc_empresa = document.getElementById('slc_empresa');
                        if (slc_empresa) {
                            var template = '';
                            lista.forEach(empresa => {
                                template += `<option value="${empresa.id}" ${empresa.id == id_empresa_nomina ? 'selected' : ''}>${empresa.nombre}</option>`;
                            });
                            slc_empresa.innerHTML = template;
                            if (window.selectBoxEmpresa) window.selectBoxEmpresa.destroy();
                            window.selectBoxEmpresa = new vanillaSelectBox("#slc_empresa", {
                                "keepInlineStyles": true,
                                "maxHeight": 300,
                                "minWidth": 200,
                                "search": true,
                                "placeHolder": "Empresas..."
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                resolve();
            }
        })
    }).then(() => {
        inicializar_select_centro_costo();
    })
}

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

function inicializar_select_centro_costo() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'listado_centros_costo',
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Áreas',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve();
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Áreas Registrados',
                    });
                    console.log(res);
                    resolve();
                } else {
                    try {
                        let lista = JSON.parse(res);
                        var slc_centro = document.getElementById('slc_centro_costo');
                        if (slc_centro) {
                            var template = '';
                            lista.forEach(centro => {
                                template += `<option value="${centro.id}">${centro.nombre}</option>`;
                            });
                            slc_centro.innerHTML = template;
                            if (window.selectBoxCentro) window.selectBoxCentro.destroy();
                            window.selectBoxCentro = new vanillaSelectBox("#slc_centro_costo", {
                                "keepInlineStyles": true,
                                "maxHeight": 300,
                                "minWidth": 200,
                                "search": true,
                                "placeHolder": "Áreas..."
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve();
                    }
                }
            }
        })
    }).then(() => {
        inicializar_select_departamento();
    })
}

function inicializar_select_departamento() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'listado_departamentos',
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Departamentos',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve();
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Departamentos Registrados',
                    });
                    console.log(res);
                    resolve();
                } else {
                    try {
                        let lista = JSON.parse(res);
                        var slc_departamento = document.getElementById('slc_departamento');
                        if (slc_departamento) {
                            var template = '';
                            lista.forEach(departamento => {
                                template += `<option value="${departamento.id}">${departamento.nombre}</option>`;
                            });
                            slc_departamento.innerHTML = template;
                            if (window.selectBoxDepartamento) window.selectBoxDepartamento.destroy();
                            window.selectBoxDepartamento = new vanillaSelectBox("#slc_departamento", {
                                "keepInlineStyles": true,
                                "maxHeight": 300,
                                "minWidth": 200,
                                "search": true,
                                "placeHolder": "Departamentos..."
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve();
                    }
                }
            }
        })
    }).then(() => {
        listado_pagos();
    })
}

function listado_pagos() {
    var quincena_detalle = sessionStorage.getItem('quincena_detalle');
    var btn_recibo_pago = document.getElementById('btn_recibo_pago');
    if (quincena_detalle == '1') {
        btn_recibo_pago.style.display = '';
    } else {
        btn_recibo_pago.style.display = 'none';
    }
    let filtros = {
        quest: 'listado_pagos_historial',
        id_lote: id_lote_detalle,
        id_empresa: id_empresa_nomina,
        empresas: $('#slc_empresa').val() || [id_empresa_nomina],
        centros: $('#slc_centro_costo').val() || [],
        departamentos: $('#slc_departamento').val() || []
    };
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            dataType: 'text',
            data: filtros,
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Pagos',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve();
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Pagos Registrados',
                    });
                    console.log(res);
                    resolve();
                } else {
                    try {
                        let lista = JSON.parse(res);
                        let template = '';
                        lista.forEach(item => {
                            template += ` 
                                    <td>${item.correlativo}</td>
                                    <td>${item.empleado}</td>
                                    <td>${item.nombre_comercial}</td>
                                    <td>${item.centro_costo}</td>
                                    <td>${item.departamento}</td>
                                    <td>${item.puesto}</td>
                                    <td>${item.dias_laborados}</td>
                                    <td>${formatear_numeros(item.salario_ordinario)}</td>
                                    <td>${formatear_numeros(item.bon_incentivo)}</td>
                                    <td>${formatear_numeros(item.bon_decreto)}</td>
                                    <td>${formatear_numeros(item.bonos)}</td>
                                    <td>${formatear_numeros(item.total_devengado)}</td>
                                    <td>${item.horas_simples}</td>
                                    <td>${formatear_numeros(item.valor_horas_simples)}</td>
                                    <td>${item.horas_dobles}</td>
                                    <td>${formatear_numeros(item.valor_horas_dobles)}</td>
                                    <td>${formatear_numeros(item.otros_ingresos)}</td>
                                    <td>${formatear_numeros(item.salario_total)}</td>
                                    <td>${formatear_numeros(item.igss)}</td>
                                    <td>${formatear_numeros(item.isr)}</td>
                                    <td>${formatear_numeros(item.cafeteria)}</td>
                                    <td>${formatear_numeros(item.celular)}</td>
                                    <td>${formatear_numeros(item.uniforme)}</td>
                                    <td>${formatear_numeros(item.calzado)}</td>
                                    <td>${formatear_numeros(item.equipo)}</td>
                                    <td>${formatear_numeros(item.producto)}</td>
                                    <td>${formatear_numeros(item.bancos)}</td>
                                    <td>${formatear_numeros(item.otros)}</td>
                                    <td>${formatear_numeros(item.judiciales)}</td>
                                    <td>${formatear_numeros(item.seguro)}</td>
                                    <td>${formatear_numeros(item.parqueo)}</td>
                                    <td>${formatear_numeros(item.boleta_ornato)}</td>
                                    <td>${formatear_numeros(item.otros_egresos)}</td>
                                    <td>${formatear_numeros(item.total_egresos)}</td>
                                    <td>${formatear_numeros(item.liquido_recibir)}</td>
                                    <td>${formatear_numeros(item.liquido_primer_quincena)}</td>
                                    <td>${formatear_numeros(item.liquido_segunda_quincena)}</td>
                                    `;
                            template += `
                                    <td class="text-center">
                                        <div class="action-btns">
                                            <a onclick="detalle(${item.id_lote}, ${item.id_empleado})" class="action-btn btn-view bs-tooltip me-2"
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
                                `;
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
                            "lengthMenu": [5, 10, 20, 50],
                            "pageLength": 10
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                }
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function aplicar_filtros() {
    cargando();
    listado_pagos();
}

function limpiar_filtros() {
    if (window.selectBoxEmpresa) {
        window.selectBoxEmpresa.setValue([id_empresa_nomina]); // Reset to active company
    }
    if (window.selectBoxCentro) window.selectBoxCentro.empty();
    if (window.selectBoxDepartamento) window.selectBoxDepartamento.empty();
    cargando();
    listado_pagos();
}

function detalle(id, id_empleado) {
    var id_empleado;
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'detalle_pago_historial',
                id_pago_lote: id,
                id_empleado: id_empleado
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Detalle Del Pago',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve();
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Datos Del Pago',
                    });
                    console.log(res);
                    resolve();
                } else {
                    try {
                        var nombre = document.getElementById('nombre');
                        var empresa = document.getElementById('empresa');
                        var departamento = document.getElementById('departamento');
                        var centro_costo = document.getElementById('centro_costo');
                        var condicion = document.getElementById('condicion');
                        var sueldo_total = document.getElementById('sueldo_total');
                        var otros_ingresos = document.getElementById('otros_ingresos');
                        var total_ingresos = document.getElementById('total_ingresos');
                        var bonificacion = document.getElementById('bonificacion');
                        var bon_dec_tot = document.getElementById('bon_dec_tot');
                        var bon_tot = document.getElementById('bon_tot');
                        var horas_dia = document.getElementById('horas_dia');
                        var horas_noche = document.getElementById('horas_noche');
                        var horas_tot = document.getElementById('horas_tot');
                        var ingresos_totales = document.getElementById('ingresos_totales');
                        var bonos_tot = document.getElementById('bonos_tot');
                        var vacaciones = document.getElementById('vacaciones');
                        var igss_quincenal = document.getElementById('igss_quincenal');
                        var isr_quincenal = document.getElementById('isr_quincenal');
                        var ornato = document.getElementById('ornato');
                        var cafeteria = document.getElementById('cafeteria');
                        var celular = document.getElementById('celular');
                        var uniforme = document.getElementById('uniforme');
                        var calzado = document.getElementById('calzado');
                        var equipo = document.getElementById('equipo');
                        var producto = document.getElementById('producto');
                        var bancos = document.getElementById('bancos');
                        var otros = document.getElementById('otros');
                        var judiciales = document.getElementById('judiciales');
                        var seguro = document.getElementById('seguro');
                        var parqueo = document.getElementById('parqueo');
                        var otros_egresos = document.getElementById('otros_egresos');
                        var total_egresos = document.getElementById('total_egresos');
                        var liquido_detalle = document.getElementById('liquido_detalle');
                        var metodo_detalle = document.getElementById('metodo_detalle');
                        var banco_detalle = document.getElementById('banco_detalle');
                        var detalle_cuenta = document.getElementById('detalle_cuenta');
                        var no_cuenta = document.getElementById('no_cuenta');
                        var tipo_cuenta = document.getElementById('tipo_cuenta');
                        let lista = JSON.parse(res);
                        var total1 = parseFloat(lista[0].salario_ordinario) + parseFloat(lista[0].otros_ingresos);
                        var total2 = parseFloat(lista[0].bon_incentivo) + parseFloat(lista[0].bon_decreto);
                        var total3 = parseFloat(lista[0].valor_horas_simples) + parseFloat(lista[0].valor_horas_dobles);
                        nombre.value = lista[0].nombre_empleado;
                        empresa.value = lista[0].empresa;
                        departamento.value = lista[0].departamento;
                        centro_costo.value = lista[0].centro_costo;
                        condicion.value = lista[0].condicion_laboral;
                        sueldo_total.value = formatear_numeros(lista[0].salario_ordinario);
                        otros_ingresos.value = formatear_numeros(lista[0].otros_ingresos);
                        total_ingresos.value = formatear_numeros(total1);
                        bonificacion.value = formatear_numeros(lista[0].bon_incentivo);
                        bon_dec_tot.value = formatear_numeros(lista[0].bon_decreto);
                        bon_tot.value = formatear_numeros(total2);
                        horas_dia.value = formatear_numeros(lista[0].valor_horas_simples);
                        horas_noche.value = formatear_numeros(lista[0].valor_horas_dobles);
                        horas_tot.value = formatear_numeros(total3);
                        bonos_tot.value = formatear_numeros(lista[0].bonos);
                        vacaciones.value = formatear_numeros(lista[0].vacaciones);
                        ingresos_totales.value = formatear_numeros(lista[0].salario_total);
                        igss_quincenal.value = formatear_numeros(lista[0].igss);
                        isr_quincenal.value = formatear_numeros(lista[0].isr);
                        ornato.value = formatear_numeros(lista[0].boleta_ornato);
                        cafeteria.value = formatear_numeros(lista[0].cafeteria);
                        uniforme.value = formatear_numeros(lista[0].uniforme);
                        celular.value = formatear_numeros(lista[0].celular);
                        calzado.value = formatear_numeros(lista[0].calzado);
                        equipo.value = formatear_numeros(lista[0].equipo);
                        producto.value = formatear_numeros(lista[0].producto);
                        bancos.value = formatear_numeros(lista[0].bancos);
                        otros.value = formatear_numeros(lista[0].otros);
                        judiciales.value = formatear_numeros(lista[0].judiciales);
                        seguro.value = formatear_numeros(lista[0].seguro);
                        parqueo.value = formatear_numeros(lista[0].parqueo);
                        otros_egresos.value = formatear_numeros(lista[0].otros_egresos);
                        total_egresos.value = formatear_numeros(lista[0].total_egresos);
                        liquido_detalle.value = formatear_numeros(lista[0].liquido_recibir);
                        metodo_detalle.value = lista[0].tipo_pago;
                        banco_detalle.value = lista[0].banco;
                        if (metodo_detalle.value == 'Transferencia') {
                            detalle_cuenta.hidden = false;
                            no_cuenta.value = lista[0].no_cuenta;
                            tipo_cuenta.value = lista[0].tipo_cuenta;
                        } else {
                            detalle_cuenta.hidden = true
                            no_cuenta.value = '';
                            tipo_cuenta.value = '';
                        }
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                }
            }
        })
    }).then(() => {
        detalle_descuentos_variables(id_lote_detalle, id_empleado);
    })
}

function detalle_descuentos_variables(id_lote, id_empleado) {
    var detalle_descuentos = document.getElementById('detalle_descuentos');
    var titulo_detalle_descuentos = document.getElementById('titulo_detalle_descuentos');
    var espacio_detalle_descuentos = document.getElementById('espacio_detalle_descuentos');
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'detalle_descuentos_variables_otros',
                id_lote: id_lote,
                id_empleado: id_empleado
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Descuentos',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve();
                } else if (res.includes('No hay datos')) {
                    try {
                        detalle_descuentos.style.display = 'none';
                        titulo_detalle_descuentos.style.display = 'none';
                        espacio_detalle_descuentos.style.display = 'none';
                        $('#detalle_descuentos').DataTable().destroy();
                        $('#detalle').modal('show');
                    } catch (error) {
                        console.log(error);
                    } finally {
                        Swal.close();
                    }
                    console.log(res);
                    resolve();
                } else {
                    try {
                        detalle_descuentos.style.display = '';
                        titulo_detalle_descuentos.style.display = '';
                        espacio_detalle_descuentos.style.display = '';
                        let lista = JSON.parse(res);
                        let template = '';
                        lista.forEach(item => {
                            template += `<td>${item.tipo_egreso}</td>
                                    <td>${formatear_numeros(item.monto)}</td>
                                    <td>${item.lote}</td>
                                    </tr>`;
                        });
                        $('#detalle_descuentos').DataTable().destroy();
                        document.getElementById("cuerpo_detalle_descuentos").innerHTML = template;
                        $('#detalle_descuentos').DataTable({
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
                        resolve(res);
                    }
                }
            }
        });
    }).then(() => {
        try {
            $('#detalle').modal('show');
        } catch (error) {
            console.log(error);
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

function plantilla_proquima() {
    window.location.href = './php/plantilla_proquima_historial.php?id_lote=' + id_lote_detalle;
}

function plantilla_unhesa() {
    window.location.href = './php/plantilla_unhesa_historial.php?id_lote=' + id_lote_detalle;
}

function reporte_cheques() {
    window.location.href = "./solicitud_cheque_historial.html";
}

function recibo_de_pago() {
    window.location.href = "./recibo.html";
}

function igss() {
    window.location.href = "./php/igss.php?lote=" + id_lote_detalle + "&empresa=" + id_empresa_nomina;
}

function informe_mintrab() {
    window.location.href = "./php/mintrab.php?lote=" + id_lote_detalle + "&empresa=" + id_empresa_nomina;
}

function verificador_pago() {
    $('#modal_verificador_pago').modal('show');
}

function limpiar_inputs_verificador() {
    lote_eliminar.value = "";
    lote_correcto.value = "";
}

function validar_verificador() {
    var fecha_verificador = document.getElementById('fecha_verificador');
    var hora_verificador = document.getElementById('hora_verificador');
    if (fecha_verificador.value != "" && hora_verificador.value != "") {
        guardar_verificador();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha U Hora Vacios',
            text: 'Por favor, asegurese de haber llenado el campo de fecha y hora de transferencia',
            showCancelButton: false
        });
    }
}

function guardar_verificador() {
    try {
        var lote_correcto = document.getElementById('lote_correcto');
        var lote_eliminar = document.getElementById('lote_eliminar');
        var fecha_verificador = document.getElementById('fecha_verificador');
        var hora_verificador = document.getElementById('hora_verificador');
        var fecha_verificador_parseada = new Date(fecha_verificador.value);
        sessionStorage.setItem('lote_correcto', lote_correcto.value);
        sessionStorage.setItem('lote_eliminar', lote_eliminar.value);
        sessionStorage.setItem('fecha_verificador', fecha_verificador_parseada.toLocaleDateString('es-ES'));
        sessionStorage.setItem('hora_verificador', hora_verificador.value);
    } catch (error) {
        console.log(error);
    } finally {
        limpiar_inputs_verificador();
        window.location.href = "./verificador_pago_historial.html";
    }
}

