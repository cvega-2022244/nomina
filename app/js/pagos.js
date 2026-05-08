var empleados_en_nomina = [];
var empleados_fuera_nomina = [];
var empleados = [];
var nomina_activa = sessionStorage.getItem('nomina_activa');
var id_lote_activo;
var id_empresa_nomina = sessionStorage.getItem('id_empresa_nomina');

$(document).ready(function () {
    if (!id_empresa_nomina) {
        Swal.fire({
            icon: 'warning',
            title: 'Empresa no seleccionada',
            text: 'Selecciona la empresa de nómina antes de continuar.'
        }).then(() => {
            window.location.href = './nomina.html';
        });
        return;
    }
    cargando();
    inicializar_select_centro_costo();
})

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

function inicializar_select_centro_costo() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_centros_costo',
            },
            dataType: 'text',
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Áreas',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve();
                    return;
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Áreas Registrados',
                    });
                    console.log(res);
                    resolve();
                    return;
                } else {
                    // Verificar si la respuesta es JSON válido antes de parsear
                    if (res.trim().startsWith('<') || res.includes('<br') || res.includes('Query Falló') || res.includes('Successfully') || res.trim() === 'No') {
                        console.log('Respuesta no válida para listado_centros_costo:', res);
                        resolve();
                        return;
                    }

                    try {
                        let lista;
                        if (typeof res === 'string') {
                            try {
                                lista = JSON.parse(res);
                            } catch (error) {
                                console.error('Error parseando JSON en listado_centros_costo:', error, 'Respuesta:', res);
                                resolve();
                                return;
                            }
                        } else {
                            lista = res; // jQuery ya parseó el JSON
                        }

                        var slc_centro = document.getElementById('slc_centro_costo');
                        if (slc_centro) {
                            var template = '';
                            lista.forEach(centro => {
                                template += `<option value="${centro.id}">${centro.nombre}</option>`
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
                        } else {
                            console.error('No se encontró el elemento #slc_centro_costo');
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
            data: {
                quest: 'listado_departamentos',
            },
            dataType: 'text',
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Departamentos',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve();
                    return;
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Departamentos Registrados',
                    });
                    console.log(res);
                    resolve();
                    return;
                } else {
                    // Verificar si la respuesta es JSON válido antes de parsear
                    if (res.trim().startsWith('<') || res.includes('<br') || res.includes('Query Falló') || res.includes('Successfully') || res.trim() === 'No') {
                        console.log('Respuesta no válida para listado_departamentos:', res);
                        resolve();
                        return;
                    }

                    try {
                        let lista;
                        if (typeof res === 'string') {
                            try {
                                lista = JSON.parse(res);
                            } catch (error) {
                                console.error('Error parseando JSON en listado_departamentos:', error, 'Respuesta:', res);
                                resolve();
                                return;
                            }
                        } else {
                            lista = res; // jQuery ya parseó el JSON
                        }

                        var slc_departamento = document.getElementById('slc_departamento');
                        if (slc_departamento) {
                            var template = '';
                            lista.forEach(departamento => {
                                template += `<option value="${departamento.id}">${departamento.nombre}</option>`
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
                        } else {
                            console.error('No se encontró el elemento #slc_departamento');
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
    return new Promise((resolve) => {
        let filtros = {
            quest: 'listado_pagos',
            id_empresa: id_empresa_nomina,
            centros: $('#slc_centro_costo').val() || [],
            departamentos: $('#slc_departamento').val() || []
        };
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: filtros,
            dataType: 'text',
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Pagos',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve();
                    return;
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Pagos Registrados',
                    });
                    console.log(res);
                    resolve();
                    return;
                } else {
                    // Verificar si la respuesta es JSON válido antes de parsear
                    if (res.trim().startsWith('<') || res.includes('<br') || res.includes('Query Falló') || res.includes('Successfully') || res.trim() === 'No') {
                        console.log('Respuesta no válida para listado_pagos:', res);
                        resolve();
                        return;
                    }

                    try {
                        let lista;
                        if (typeof res === 'string') {
                            try {
                                lista = JSON.parse(res);
                            } catch (error) {
                                console.error('Error parseando JSON en listado_pagos:', error, 'Respuesta:', res);
                                resolve();
                                return;
                            }
                        } else {
                            lista = res; // jQuery ya parseó el JSON
                        }

                        let template = '';
                        lista.forEach(lista => {
                            template += `
                                <tr role="row">
                                    <td>${lista.correlativo}</td>
                                    <td>${lista.nombre_empleado}</td>
                                    <td>${lista.empresa}</td>
                                    <td>${lista.centro_costo}</td>
                                    <td>${lista.departamento}</td>
                                    <td>${lista.puesto}</td>
                                    <td>${lista.dias_laborados}</td>
                                    <td>${formatear_numeros(lista.salario_ordinario)}</td>
                                    <td>${formatear_numeros(lista.bon_incentivo)}</td>
                                    <td>${formatear_numeros(lista.bon_decreto)}</td>
                                    <td>${formatear_numeros(lista.bonos)}</td>
                                    <td>${formatear_numeros(lista.total_devengado)}</td>
                                    <td>${lista.horas_simples}</td>
                                    <td>${formatear_numeros(lista.valor_horas_simples)}</td>
                                    <td>${lista.horas_dobles}</td>
                                    <td>${formatear_numeros(lista.valor_horas_dobles)}</td>
                                    <td>${formatear_numeros(lista.otros_ingresos)}</td>
                                    <td>${formatear_numeros(lista.salario_total)}</td>
                                    <td>${formatear_numeros(lista.igss)}</td>
                                    <td>${formatear_numeros(lista.isr)}</td>
                                    <td>${formatear_numeros(lista.cafeteria)}</td>
                                    <td>${formatear_numeros(lista.celular)}</td>
                                    <td>${formatear_numeros(lista.uniforme)}</td>
                                    <td>${formatear_numeros(lista.calzado)}</td>
                                    <td>${formatear_numeros(lista.equipo)}</td>
                                    <td>${formatear_numeros(lista.producto)}</td>
                                    <td>${formatear_numeros(lista.bancos)}</td>
                                    <td>${formatear_numeros(lista.otros)}</td>
                                    <td>${formatear_numeros(lista.judiciales)}</td>
                                    <td>${formatear_numeros(lista.seguro)}</td>
                                    <td>${formatear_numeros(lista.parqueo)}</td>
                                    <td>${formatear_numeros(lista.boleta_ornato)}</td>
                                    <td>${formatear_numeros(lista.otros_egresos)}</td>
                                    <td>${formatear_numeros(lista.total_egresos)}</td>
                                    <td>${formatear_numeros(lista.liquido_recibir)}</td>
                                    <td>${formatear_numeros(lista.liquido_primer_quincena)}</td>
                                    <td>${formatear_numeros(lista.liquido_segunda_quincena)}</td>
                                    `;
                            template += `
                                    <td class="text-center">
                                        <div class="action-btns">
                                            <a onclick="detalle(${lista.id_empleado})" class="action-btn btn-view bs-tooltip me-2"
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
    if (window.selectBoxCentro) window.selectBoxCentro.empty();
    if (window.selectBoxDepartamento) window.selectBoxDepartamento.empty();
    cargando();
    listado_pagos();
}

function detalle(id) {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_pago',
                id_empleado: id
            },
            dataType: 'text',
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Detalle Del Pago',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Datos Del Pago',
                    });
                    console.log(res);
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
                        let lista;
                        if (typeof res === 'string') {
                            try {
                                lista = JSON.parse(res);
                            } catch (error) {
                                console.error('Error parseando JSON:', error, 'Respuesta:', res);
                                resolve();
                                return;
                            }
                        } else {
                            lista = res; // jQuery ya parseó el JSON
                        }
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
    window.location.href = './php/plantilla_proquima.php';
}

function plantilla_unhesa() {
    window.location.href = './php/plantilla_unhesa.php';
}

function reporte_cheques() {
    window.location.href = "./solicitud_cheque.html";
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
        window.location.href = "./verificador_pago.html";
    }
}

function verificador_cierre_nomina() {
    Swal.fire({
        title: '¿Cerrar Nómina?',
        html: '¿Está segura de cerrar la nómina?',
        allowOutsideClick: false,
        confirmButtonText: 'Cerrar Nómina',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            cerrar_nomina();
        }
    })
}

async function cerrar_nomina() {
    await listado_empleados_en_nomina();
}

async function listado_empleados_en_nomina() {
    try {
        cargando();
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_empleados_nomina',
                id_empresa: id_empresa_nomina
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al obtener los empleados de nomina, por favor, comunícate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else if (resp.includes('No hay datos')) {
            console.log('No hay datos en pagos lote');
        } else {
            let lista;
            if (typeof resp === 'string') {
                lista = JSON.parse(resp);
            } else {
                lista = resp; // jQuery ya parseó el JSON
            }
            lista.forEach(empleado => {
                empleados_en_nomina.push({
                    id_empleado: empleado.id_empleado,
                });
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        await listado_empleados_fuera_nomina();
    }
}

async function listado_empleados_fuera_nomina() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_empleados_fuera_nomina',
                id_empresa: id_empresa_nomina
            },
        });

        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al obtener los empleados fuera de nomina, por favor, comunícate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else if (resp.includes('No hay datos')) {
            console.log('No hay datos de empleados fuera de nomina');
        } else {
            let lista;
            if (typeof resp === 'string') {
                lista = JSON.parse(resp);
            } else {
                lista = resp; // jQuery ya parseó el JSON
            }
            lista.forEach(empleado => {
                empleados_fuera_nomina.push({
                    id_empleado: empleado.id_empleado,
                });
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        await listado_completo_empleados();
    }
}

async function listado_completo_empleados() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_empleados',
                id_empresa: id_empresa_nomina
            },
        });

        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al obtener los empleados, por favor, comunícate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else if (resp.includes('No hay datos')) {
            console.log('No hay datos en empleados');
        } else {
            let lista;
            if (typeof resp === 'string') {
                lista = JSON.parse(resp);
            } else {
                lista = resp; // jQuery ya parseó el JSON
            }
            lista.forEach(empleado => {
                empleados.push({
                    id_empleado: empleado.id,
                    id_empresa: empleado.id_empresa,
                });
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        await obtener_lote_activo();
    }
}

async function obtener_lote_activo() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lote_activo',
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al obtener el lote activo, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else if (resp.includes('No hay datos')) {
            Swal.fire({
                title: 'No hay lote activo',
                icon: 'warning',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            let lista;
            if (typeof resp === 'string') {
                lista = JSON.parse(resp);
            } else {
                lista = resp; // jQuery ya parseó el JSON
            }
            id_lote_activo = lista[0].id;
        }
    } catch (error) {
        console.log(error);
    } finally {
        await actualizar_pago_lote();
    }
}

async function actualizar_pago_lote() {
    try {
        const promesas = empleados_en_nomina.map(empleado => {
            return new Promise((resolve) => {
                if (!empleado.id_empleado || !nomina_activa || !id_lote_activo) {
                    console.error('Parámetros inválidos para datos_empleados_pago_lote', empleado.id_empleado, nomina_activa, id_lote_activo);
                    return resolve();
                }
                $.ajax({
                    url: 'php/servidor.php',
                    type: 'GET',
                    data: {
                        quest: 'datos_empleados_pago_lote',
                        id_empleado: empleado.id_empleado,
                        nomina_activa: nomina_activa,
                        id_lote: id_lote_activo,
                        id_empresa: id_empresa_nomina
                    },
                    dataType: 'text',
                    success: function (resp) {
                        if (resp.includes('Query Falló')) {
                            Swal.fire({
                                title: 'Error Al Obtener Datos De Empleados',
                                html: 'Ha ocurrido un error al obtener los datos del empleado, por favor, comunicate con sistemas.',
                                icon: 'error',
                                allowOutsideClick: false,
                                showConfirmButton: true,
                            });
                        } else if (resp.includes('No hay datos')) {
                            Swal.fire({
                                title: 'No Hay Datos De Empleados',
                                html: 'No hay datos de empleados en la base de datos',
                                icon: 'warning',
                                allowOutsideClick: false,
                                showConfirmButton: true,
                            });
                        } else {
                            let lista;
                            if (typeof resp === 'string') {
                                lista = JSON.parse(resp);
                            } else {
                                lista = resp;
                            }

                            if (!lista || lista.length === 0) {
                                console.error('❌ Sin datos para empleado:', empleado.id_empleado);
                                resolve();
                                return;
                            }

                            $.ajax({
                                url: 'php/servidor.php',
                                type: 'POST',
                                data: {
                                    quest: 'actualizar_pago_lote',
                                    id_empresa: lista[0].id_empresa,
                                    id_empleado: empleado.id_empleado,
                                    centro_costo: lista[0].centro_costo || 0,
                                    departamento: lista[0].departamento || 0,
                                    puesto: lista[0].puesto || '',
                                    bon_tot: lista[0].bon_incentivo,
                                    bon_dec_tot: lista[0].bon_decreto,
                                    horas_dia: lista[0].horas_dia,
                                    horas_noche: lista[0].horas_noche,
                                    cantidad_horas_dia: lista[0].cantidad_horas_dia,
                                    cantidad_horas_noche: lista[0].cantidad_horas_noche,
                                    sueldo_quincenal: lista[0].sueldo_quincenal,
                                    otros_ingresos: lista[0].otros_ingresos,
                                    vacaciones: lista[0].vacaciones,
                                    bonos: lista[0].bonos,
                                    desc_variables: lista[0].descuentos_variables,
                                    boleta_ornato: lista[0].boleto_de_ornato,
                                    igss: lista[0].igss_laboral,
                                    isr: lista[0].isr,
                                    otros_egresos: lista[0].otro_descuentos,
                                    judiciales: lista[0].judiciales,
                                    seguro: lista[0].seguro,
                                    parqueo: lista[0].parqueo,
                                    ingresos_tot: lista[0].total_ingresos,
                                    egresos_tot: lista[0].total_egresos,
                                    liquido: lista[0].liquido,
                                    total_reporte_bono: lista[0].total_reporte_bono,
                                    total_reporte_comision: lista[0].total_reporte_comision,
                                    condicion_laboral: lista[0].condicion_laboral,
                                    cheque: lista[0].cheque,
                                    id_banco: lista[0].banco,
                                    no_cuenta: lista[0].no_cuenta,
                                    id_tipo_cuenta: lista[0].tipo_cuenta,
                                    id_lote: id_lote_activo,
                                    fecha_pago_lote: lista[0].fecha_pago_lote,
                                    igss_patronal: lista[0].igss_patronal,
                                    intecap: lista[0].intecap,
                                    irtra: lista[0].irtra,
                                    dias_laborados: lista[0].dias_laborados,
                                    dias_bono: lista[0].dias_laborados
                                },
                                dataType: 'text',
                                success: function (res) {
                                    if (res.includes('Query Falló')) {
                                        Swal.fire({
                                            title: 'Error',
                                            html: 'Ha ocurrido un error al ingresar los datos de pago de lote, por favor, comunicate con sistemas.',
                                            icon: 'error',
                                            allowOutsideClick: false,
                                            showConfirmButton: true,
                                        });
                                    } else {
                                        console.log('Datos de pago de lote actualizados correctamente');
                                    }
                                    resolve();
                                }
                            });
                        }
                    }
                });
            })
        })
        await Promise.all(promesas);
    } catch (error) {
        console.log(error);
    } finally {
        await ingresar_pagos_lote_nuevos_empleados();
    }
}

async function ingresar_pagos_lote_nuevos_empleados() {
    try {
        const promesas = empleados_fuera_nomina.map(empleado => {
            return new Promise((resolve) => {
                if (!empleado.id_empleado || !nomina_activa || !id_lote_activo) {
                    console.error('Parámetros inválidos para datos_empleados_pago_lote', empleado.id_empleado, nomina_activa, id_lote_activo);
                    return resolve();
                }
                $.ajax({
                    url: 'php/servidor.php',
                    type: 'GET',
                    data: {
                        quest: 'datos_empleados_pago_lote',
                        id_empleado: empleado.id_empleado,
                        nomina_activa: nomina_activa,
                        id_lote: id_lote_activo,
                        id_empresa: id_empresa_nomina
                    },
                    dataType: 'text',
                    success: function (resp) {
                        if (resp.includes('Query Falló')) {
                            Swal.fire({
                                title: 'Error Al Obtener Datos De Empleados',
                                html: 'Ha ocurrido un error al obtener los datos del empleado, por favor, comunicate con sistemas.',
                                icon: 'error',
                                allowOutsideClick: false,
                                showConfirmButton: true,
                            });
                        } else if (resp.includes('No hay datos')) {
                            Swal.fire({
                                title: 'No Hay Datos De Empleados',
                                html: 'No hay datos de empleados en la base de datos',
                                icon: 'warning',
                                allowOutsideClick: false,
                                showConfirmButton: true,
                            });
                        } else {
                            let lista;
                            if (typeof resp === 'string') {
                                lista = JSON.parse(resp);
                            } else {
                                lista = resp;
                            }

                            if (!lista || lista.length === 0) {
                                console.error('❌ Sin datos para ingresar pago, empleado:', empleado.id_empleado);
                                resolve();
                                return;
                            }

                            $.ajax({
                                url: 'php/servidor.php',
                                type: 'POST',
                                data: {
                                    quest: 'ingresar_pago_lote_activo',
                                    id_empresa: lista[0].id_empresa,
                                    id_empleado: empleado.id_empleado,
                                    centro_costo: lista[0].centro_costo || 0,
                                    departamento: lista[0].departamento || 0,
                                    puesto: lista[0].puesto || '',
                                    bon_tot: lista[0].bon_incentivo,
                                    bon_dec_tot: lista[0].bon_decreto,
                                    horas_dia: lista[0].horas_dia,
                                    horas_noche: lista[0].horas_noche,
                                    cantidad_horas_dia: lista[0].cantidad_horas_dia,
                                    cantidad_horas_noche: lista[0].cantidad_horas_noche,
                                    sueldo_quincenal: lista[0].sueldo_quincenal,
                                    otros_ingresos: lista[0].otros_ingresos,
                                    vacaciones: lista[0].vacaciones,
                                    bonos: lista[0].bonos,
                                    desc_variables: lista[0].descuentos_variables,
                                    boleta_ornato: lista[0].boleto_de_ornato,
                                    igss: lista[0].igss_laboral,
                                    isr: lista[0].isr,
                                    prestamo_empresa: lista[0].prestamo_empresa,
                                    otros_egresos: lista[0].otro_descuentos,
                                    judiciales: lista[0].judiciales,
                                    seguro: lista[0].seguro,
                                    parqueo: lista[0].parqueo,
                                    ingresos_tot: lista[0].total_ingresos,
                                    egresos_tot: lista[0].total_egresos,
                                    liquido: lista[0].liquido,
                                    total_reporte_bono: lista[0].total_reporte_bono,
                                    condicion_laboral: lista[0].condicion_laboral,
                                    cheque: lista[0].cheque,
                                    id_banco: lista[0].banco,
                                    no_cuenta: lista[0].no_cuenta,
                                    id_tipo_cuenta: lista[0].tipo_cuenta,
                                    id_lote: id_lote_activo,
                                    fecha_pago_lote: lista[0].fecha_pago_lote,
                                    igss_patronal: lista[0].igss_patronal,
                                    intecap: lista[0].intecap,
                                    irtra: lista[0].irtra,
                                    dias_laborados: lista[0].dias_laborados,
                                    dias_bono: lista[0].dias_laborados
                                },
                                dataType: 'text',
                                success: function (res) {
                                    console.log(res);
                                    if (res.includes('Query Falló')) {
                                        Swal.fire({
                                            title: 'Error',
                                            html: 'Ha ocurrido un error al ingresar los datos de pago de lote, por favor, comunicate con sistemas.',
                                            icon: 'error',
                                            allowOutsideClick: false,
                                            showConfirmButton: true,
                                        });
                                    } else {
                                        console.log('Datos de pago de lote ingresados correctamente');
                                    }
                                    resolve();
                                }
                            });
                        }
                    }
                });
            })
        })
        await Promise.all(promesas);
    } catch (error) {
        console.log(error);
    } finally {
        await restar_dias_laborados();
    }
}

async function restar_dias_laborados() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'restar_dias_laborados',
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al restar los dias laborados, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Dias restados correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await ingresar_pago_real();
    }
}

async function ingresar_pago_real() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_pago_real',
                id_lote: id_lote_activo
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al ingresar el pago real, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Pago real ingresado correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await ingresar_pago_contable();
    }
}

async function ingresar_pago_contable() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_pago_contable',
                id_lote: id_lote_activo
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al ingresar el pago contable, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Pago contable ingresado correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await ingresar_bonos_pago_lote();
    }
}

async function ingresar_bonos_pago_lote() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_bonos_pago_lote',
                id_lote: id_lote_activo
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al ingresar los bonos pago lote, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Bonos pago lote ingresados correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await pagar_bonos();
    }
}

async function pagar_bonos() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'pagar_bonos'
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al pagar los bonos, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Bonos pagados correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await ingresar_comisiones_pago_lote();
    }
}

// === PROCESAR COMISIONES (tabla comision) ===
async function ingresar_comisiones_pago_lote() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_comisiones_pago_lote',
                id_lote: id_lote_activo
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al ingresar las comisiones al pago lote, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Comisiones pago lote ingresadas correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await pagar_comisiones();
    }
}

async function pagar_comisiones() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'pagar_comisiones'
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al pagar las comisiones, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Comisiones pagadas correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await ingresar_horas_extra_lote();
    }
}

async function ingresar_horas_extra_lote() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_horas_extra_lote',
                id_lote: id_lote_activo
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al ingresar las horas extra lote, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Horas extra lote ingresadas correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await pagar_horas_extra();
    }
}

async function pagar_horas_extra() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'pagar_horas_extra'
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al pagar las horas extras, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Horas extra pagadas correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await ingresar_descuentos_lote();
    }
}

async function ingresar_descuentos_lote() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_descuento_lote',
                id_lote: id_lote_activo
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al ingresar los descuentos lote, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Descuentos lote ingresados correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await cerrar_descuentos();
    }
}

async function cerrar_descuentos() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'cerrar_descuentos_variables'
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al cerrar los descuentos variables, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Descuentos variables cerrados correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await cambiar_estado_nomina();
    }
}

async function cambiar_estado_nomina() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'cerrar_nomina'
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al cambiar el estado de la nomina, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Cambio de estado de la nomina correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await pagar_otros_ingresos_empleados();
    }
}

async function pagar_otros_ingresos_empleados() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'pagar_otros_ingresos_empleado'
            },
        });
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al cambiar otros ingresos del empleado, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log('Otros ingresos del empleado pagados correctamente');
        }
    } catch (error) {
        console.log(error);
    } finally {
        Swal.fire({
            title: 'Nomina Cerrada',
            icon: 'success',
            html: 'La nomina se ha cerrado correctamente',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            sessionStorage.removeItem('id_empresa_nomina');
            window.location.href = './index.html';
        });
    }
}

