var empleados_en_nomina = [];
var empleados_fuera_nomina = [];
var empleados = [];
var nomina_activa = sessionStorage.getItem('nomina_activa');
var id_lote_activo;
var rutaPendienteNomina = null;

$(document).ready(function () {
    inicializar_select().then(() => {
        validarEmpresaSeleccionada(true);
        listado_empleados_en_nomina();
    });
});

function recargarUnaVez() {
    const recargada = localStorage.getItem('recargada');
    if (!recargada) {
        localStorage.setItem('recargada', 'true');
        location.reload();
    }
}

localStorage.removeItem('recargada');
window.addEventListener('focus', recargarUnaVez);

function bonos() {
    navegarConEmpresa('./seleccion_bonos.html');
}

function horas_extra() {
    navegarConEmpresa('./horas_extra.html');
}

function dias_laborados() {
    navegarConEmpresa('./dias_laborados.html');
}

function descuentos() {
    navegarConEmpresa('./descuentos.html');
}

function pagos() {
    navegarConEmpresa('./pagos.html');
}

function isr() {
    navegarConEmpresa('./isr.html');
}

function comisiones() {
    navegarConEmpresa('./seleccion_bonos.html');
}

function obtenerIdEmpresaNomina() {
    const idEmpresa = parseInt(sessionStorage.getItem('id_empresa_nomina'), 10);
    return Number.isNaN(idEmpresa) ? 0 : idEmpresa;
}

function abrirModalEmpresa(ruta = null, forzarSeleccion = false) {
    rutaPendienteNomina = ruta;
    const modal = $('#modal_empresa');
    modal.data('forzar-seleccion', forzarSeleccion);
    modal.modal({
        backdrop: forzarSeleccion ? 'static' : true,
        keyboard: !forzarSeleccion
    });
    modal.modal('show');
}

function validarEmpresaSeleccionada(mostrarModal = false) {
    const idEmpresa = obtenerIdEmpresaNomina();
    if (idEmpresa > 0) {
        return true;
    }

    if (mostrarModal) {
        abrirModalEmpresa(null, true);
    }

    return false;
}

function navegarConEmpresa(ruta) {
    if (!validarEmpresaSeleccionada(false)) {
        abrirModalEmpresa(ruta, false);
        return;
    }
    window.location.href = ruta;
}

function continuarConEmpresaSeleccionada() {
    if (!validarEmpresaSeleccionada(false)) {
        Swal.fire({
            icon: 'warning',
            title: 'Empresa requerida',
            text: 'Selecciona una empresa para continuar con la nómina.'
        });
        return;
    }

    $('#modal_empresa').modal('hide');
    if (rutaPendienteNomina) {
        const ruta = rutaPendienteNomina;
        rutaPendienteNomina = null;
        window.location.href = ruta;
    }
}

async function listado_empleados_en_nomina() {
    try {
        cargando();
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_empleados_nomina',
                id_empresa: obtenerIdEmpresaNomina()
            },
            dataType: 'text',
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
            console.log('No hay datos en empleados en nómina');
        } else {
            // Verificar si la respuesta es JSON válido antes de parsear
            if (resp.trim().startsWith('<') || resp.includes('<br') || resp.includes('Query Falló') || resp.includes('Successfully') || resp.trim() === 'No') {
                console.log('Respuesta no válida para listado_empleados_nomina:', resp);
                return;
            }
            
            let lista;
            if (typeof resp === 'string') {
                try {
                    lista = JSON.parse(resp);
                } catch (error) {
                    console.error('Error parseando JSON en listado_empleados_nomina:', error, 'Respuesta:', resp);
                    return;
                }
            } else {
                lista = resp; // jQuery ya parseó el JSON
            }
            
            if (lista && Array.isArray(lista)) {
                lista.forEach(empleado => {
                    empleados_en_nomina.push({
                        id_empleado: empleado.id_empleado,
                    });
                });
            } else {
                console.warn('Lista de empleados en nómina no es un array válido');
            }
        }
    } catch (error) {
        console.error('Error en listado_empleados_en_nomina:', error);
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
                id_empresa: obtenerIdEmpresaNomina()
            },
            dataType: 'text',
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
            console.log('No hay empleados fuera de nómina');
        } else {
            let lista;
            if (typeof resp === 'string') {
                lista = JSON.parse(resp);
            } else {
                lista = resp; // jQuery ya parseó el JSON
            }
            
            if (lista && Array.isArray(lista)) {
                lista.forEach(empleado => {
                    empleados_fuera_nomina.push({
                        id_empleado: empleado.id_empleado,
                    });
                });
            } else {
                console.warn('Lista de empleados fuera de nómina no es un array válido');
            }
        }
    } catch (error) {
        console.error('Error en listado_empleados_fuera_nomina:', error);
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
                id_empresa: obtenerIdEmpresaNomina()
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
            
        } else {
            let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
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
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
            id_lote_activo = lista[0].id;
            nombre_lote.innerHTML = lista[0].nombre
        }
    } catch (error) {
        
    } finally {
        Swal.close();
    }
}

function inicializar_select() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_empresas',
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Empresas',
                        text: 'Por favor, comunicate con sistemas'
                    });
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Empresas Registradas',
                    });
                } else {
                    try {
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
                        var slc_empresa = document.getElementById('slc_empresa')
                        var template = '';
                        lista.forEach(empresa => {
                            template += `<option value="${empresa.id}">${empresa.nombre_comercial}</option>`
                        })
                        slc_empresa.innerHTML = template;
                        const idEmpresaGuardada = obtenerIdEmpresaNomina();
                        if (idEmpresaGuardada > 0) {
                            slc_empresa.value = String(idEmpresaGuardada);
                        }
                        selectBox = new vanillaSelectBox("#slc_empresa", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Empresa..."
                        });
                    } catch (error) {
                        
                    } finally {
                        resolve();
                    }
                }
            }
        })
    }).then(() => {
        Swal.close();
    })
}

function seleccionar_empresa() {
    const slcEmpresa = document.getElementById('slc_empresa');
    if (!slcEmpresa || !slcEmpresa.value) {
        sessionStorage.removeItem('id_empresa_nomina');
        return;
    }
    sessionStorage.setItem('id_empresa_nomina', slcEmpresa.value);
}

async function ingresar_pagos_lote() {
    if (!validarEmpresaSeleccionada(true)) {
        return;
    }
    try {
        cargando();
        const promesas = empleados.map(empleado => {
            return new Promise((resolve) => {
                $.ajax({
                    url: 'php/servidor.php',
                    type: 'GET',
                    data: {
                        quest: 'datos_empleados_pago_lote',
                        id_empleado: empleado.id_empleado,
                        nomina_activa: nomina_activa,
                        id_lote: id_lote_activo,
                        id_empresa: obtenerIdEmpresaNomina()
                    },
                    success: function (resp) {
                        if (resp.includes('Query Falló')) {
                            Swal.fire({
                                title: 'Error Al Obtener Datos De Empleados',
                                html: 'Ha ocurrido un error al obtener los datos del empleado, por favor, comunícate con sistemas.',
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
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
                            $.ajax({
                                url: 'php/servidor.php',
                                type: 'POST',
                                data: {
                                    quest: 'ingresar_pago_lote',
                                    id_empresa: lista[0].id_empresa, 
                                    id_empleado: empleado.id_empleado,
                                    centro_costo: lista[0].centro_costo,
                                    departamento: lista[0].departamento,
                                    puesto: lista[0].puesto,
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
                                    id_lote: lista[0].id_lote,
                                    fecha_pago_lote: lista[0].fecha_pago_lote,
                                    igss_patronal: lista[0].igss_patronal,
                                    intecap: lista[0].intecap,
                                    irtra: lista[0].irtra,
                                    dias_laborados: lista[0].dias_laborados,
                                    dias_bono: lista[0].dias_bono
                                },
                                success: function (res) {
                                    if (res.includes('Query Falló')) {
                                        Swal.fire({
                                            title: 'Error',
                                            html: 'Ha ocurrido un error al ingresar los datos de pago de lote, por favor, comunícate con sistemas.',
                                            icon: 'error',
                                            allowOutsideClick: false,
                                            showConfirmButton: true,
                                        });
                                    } else {
                                        
                                    }
                                    resolve(); // Resolvemos la promesa una vez que la petición AJAX termine
                                }
                            });
                        }
                    }
                });
            });
        });
        await Promise.all(promesas); // Esperamos a que todas las promesas se resuelvan
    } catch (error) {
        
    } finally {
        nomina_activa = true;
        sessionStorage.setItem('nomina_activa', nomina_activa);
        Swal.close();
        window.location.href = './pagos.html';
    }
}

async function actualizar_pago_lote() {
    if (!validarEmpresaSeleccionada(true)) {
        return;
    }
    try {
        cargando();
        const promesas = empleados_en_nomina.map(empleado => {
            return new Promise((resolve) => {
                $.ajax({
                    url: 'php/servidor.php',
                    type: 'GET',
                    data: {
                        quest: 'datos_empleados_pago_lote',
                        id_empleado: empleado.id_empleado,
                        nomina_activa: nomina_activa,
                        id_lote: id_lote_activo,
                        id_empresa: obtenerIdEmpresaNomina()
                    },
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
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
                            
                            $.ajax({
                                url: 'php/servidor.php',
                                type: 'POST',
                                data: {
                                    quest: 'actualizar_pago_lote',
                                    id_empresa: lista[0].id_empresa,
                                    id_empleado: empleado.id_empleado,
                                    centro_costo: lista[0].centro_costo,
                                    departamento: lista[0].departamento,
                                    puesto: lista[0].puesto,
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
                                    condicion_laboral: lista[0].condicion_laboral,
                                    cheque: lista[0].cheque,
                                    id_banco: lista[0].banco,
                                    no_cuenta: lista[0].no_cuenta,
                                    id_tipo_cuenta: lista[0].tipo_cuenta,
                                    id_lote: id_lote_activo,
                                    igss_patronal: lista[0].igss_patronal,
                                    intecap: lista[0].intecap,
                                    irtra: lista[0].irtra,
                                    dias_laborados: lista[0].dias_laborados,
                                    dias_bono: lista[0].dias_bono
                                },
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
        
    } finally {
        ingresar_pagos_lote_nuevos_empleados();
    }
}

async function ingresar_pagos_lote_nuevos_empleados() {
    if (!validarEmpresaSeleccionada(true)) {
        return;
    }
    try {
        const promesas = empleados_fuera_nomina.map(empleado => {
            return new Promise((resolve) => {
                $.ajax({
                    url: 'php/servidor.php',
                    type: 'GET',
                    data: {
                        quest: 'datos_empleados_pago_lote',
                        id_empleado: empleado.id_empleado,
                        nomina_activa: nomina_activa,
                        id_lote: id_lote_activo,
                        id_empresa: obtenerIdEmpresaNomina()
                    },
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
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
                            $.ajax({
                                url: 'php/servidor.php',
                                type: 'POST',
                                data: {
                                    quest: 'ingresar_pago_lote_activo',
                                    id_empresa: lista[0].id_empresa,
                                    id_empleado: empleado.id_empleado,
                                    centro_costo: lista[0].centro_costo,
                                    departamento: lista[0].departamento,
                                    puesto: lista[0].puesto,
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
                                    dias_bono: lista[0].dias_bono
                                },
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
        
    } finally {
        nomina_activa = true
        sessionStorage.setItem('nomina_activa', nomina_activa);
        Swal.close();
        window.location.href = './pagos.html';
    }
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
