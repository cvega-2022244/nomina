var empleados_en_nomina = [];
var empleados_fuera_nomina = [];
var empleados = [];
var nomina_activa = sessionStorage.getItem('nomina_activa');
var id_lote_activo;

$(document).ready(function () {
    listado_empleados_en_nomina();
})

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
    window.location.href = './seleccion_bonos.html';
}

function horas_extra() {
    window.location.href = './horas_extra.html';
}

function dias_laborados() {
    window.location.href = './dias_laborados.html';
}

function descuentos() {
    window.location.href = './descuentos.html';
}

function pagos() {
    if (nomina_activa == 'false') {
        ingresar_pagos_lote();
    } else {
        actualizar_pago_lote();
    }
}

function isr() {
    window.location.href = './isr.html';
}

async function listado_empleados_en_nomina() {
    try {
        cargando();
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_empleados_nomina',
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
            console.log(resp);
            let lista = JSON.parse(resp);
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
            let lista = JSON.parse(resp);
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
            let lista = JSON.parse(resp);
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
            let lista = JSON.parse(resp);
            id_lote_activo = lista[0].id;
            nombre_lote.innerHTML = lista[0].nombre
        }
    } catch (error) {
        console.log(error);
    } finally {
        inicializar_select();
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
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Empresas Registradas',
                    });
                    console.log(res);
                } else {
                    try {
                        let lista = JSON.parse(res)
                        var slc_empresa = document.getElementById('slc_empresa')
                        var template = '';
                        lista.forEach(empresa => {
                            template += `<option value="${empresa.id}">${empresa.nombre_comercial}</option>`
                        })
                        slc_empresa.innerHTML = template;
                        selectBox = new vanillaSelectBox("#slc_empresa", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Empresa..."
                        });
                    } catch (error) {
                        console.log(error);
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
    sessionStorage.setItem('id_empresa_nomina', slc_empresa.value);
}

async function ingresar_pagos_lote() {
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
                        id_lote: id_lote_activo
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
                            let lista = JSON.parse(resp);
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
                                        console.log('Datos de pago de lote ingresados correctamente');
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
        console.log(error);
    } finally {
        nomina_activa = true;
        sessionStorage.setItem('nomina_activa', nomina_activa);
        Swal.close();
        window.location.href = './pagos.html';
    }
}


async function actualizar_pago_lote() {
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
                        id_lote: id_lote_activo
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
                            let lista = JSON.parse(resp);
                            console.log(lista[0].bonos);
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
        ingresar_pagos_lote_nuevos_empleados();
    }
}

async function ingresar_pagos_lote_nuevos_empleados() {
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
                        id_lote: id_lote_activo
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
                            let lista = JSON.parse(resp);
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