var quincena = sessionStorage.getItem('quincena');
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
    listado_departamentos();
});

function listado_departamentos() {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_departamentos'
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Departamentos',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(resp);
                } else {
                    try {
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
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <option value="${lista.id}">${lista.nombre}</option>
                            `
                        });
                        document.getElementById('slc_departamento').innerHTML = template;
                        selectBox = new vanillaSelectBox("#slc_departamento", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Departamento..."
                        });

                        selectBox = new vanillaSelectBox("#empleado", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Empleado..."
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve('success')
                    }
                }
            }
        });
    }).then(() => {
        listado_incidencias();
    })
}

function listado_empleados() {
    var depto = document.getElementById('slc_departamento').value;
    var nombre_completo = document.getElementById('nombre_completo');
    var centro_costo = document.getElementById('centro_costo');
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'listado_empleados_dl',
            departamento: depto,
            id_empresa: id_empresa_nomina
        },
        success: function (resp) {
            if (resp.includes('Query Falló')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Obtener Empleados',
                    text: 'Por favor, comunicate con sistemas'
                });
                console.log(resp);
            } else if (resp.includes('No se encontraron resultados')) {
                nombre_completo.value = "";
                centro_costo.value = "";
                document.getElementById('empleado').innerHTML = "";
                selectBox = new vanillaSelectBox("#empleado", {
                    "keepInlineStyles": true,
                    "maxHeight": 678,
                    "minWidth": 200,
                    "search": true,
                    "placeHolder": "Empleado..."
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
                let template = '';
                lista.forEach(lista => {
                    template += `
                    <option value="${lista.id}">${lista.primer_nombre} ${lista.primer_apellido}</option>
                    `
                });
                document.getElementById('empleado').innerHTML = template;
                nombre_completo.value = "";
                centro_costo.value = "";
                selectBox = new vanillaSelectBox("#empleado", {
                    "keepInlineStyles": true,
                    "maxHeight": 678,
                    "minWidth": 200,
                    "search": true,
                    "placeHolder": "Empleado..."
                });
            }
        }
    });
}

function datos_empleado() {
    var slc_empleado = document.getElementById("empleado");
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'datos_empleado_dias_laborados',
            id: slc_empleado.value,
            id_empresa: id_empresa_nomina
        },
        success: function (resp) {
            if (resp.includes('Query Falló')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Obtener Datos',
                    text: 'Por favor, comunicate con sistemas'
                });
                console.log(resp);
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
                var nombre_completo = document.getElementById('nombre_completo');
                var centro_costo = document.getElementById('centro_costo');
                lista.forEach(lista => {
                    nombre_completo.value = lista.nombre_completo;
                    centro_costo.value = lista.centro;
                });
            }
        }
    });
}

function listado_incidencias() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_incidencias'
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Incidencias',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(resp);
                } else {
                    try {
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
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <option value="${lista.id}">${lista.nombre}</option>
                            `
                        });
                        document.getElementById('slc_incidencia').innerHTML = template;
                        selectBox = new vanillaSelectBox("#slc_incidencia", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Incidencia..."
                        });
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve('success')
                    }
                }
            }
        });
    }).then(() => {
        listado_dias_laborados();
    })
}

function dias_descontar() {
    var slc_incidencia = document.getElementById("slc_incidencia");
    var input_dias = document.getElementById("descuento_dias");
    var input_dias_quincena = document.getElementById("descuento_dias_quincena");
    var div_fecha = document.getElementById("div_fecha_descuento");
    var div_fecha_inicio = document.getElementById("div_fecha_inicio");
    var div_fecha_final = document.getElementById("div_fecha_final");
    var div_septimo_dia = document.getElementById("div_septimo_dia");
    var div_fecha_baja = document.getElementById("div_fecha_baja");
    var div_fecha_alta = document.getElementById("div_fecha_alta");
    var div_incidencia = document.getElementById("div_incidencia");
    var div_dias_quincena = document.getElementById("div_dias_quincena");
    var div_dias_total = document.getElementById("div_dias_total");
    var fecha_alta = document.getElementById("fecha_alta");
    var fecha_baja = document.getElementById("fecha_baja");
    var fecha_inicio = document.getElementById("fecha_inicio");
    var fecha_final = document.getElementById("fecha_final");
    switch (slc_incidencia.value) {
        case "1":
            input_dias.value = "0"
            div_fecha.style.display = "";
            div_septimo_dia.style.display = "none";
            div_fecha_inicio.style.display = "none";
            div_fecha_final.style.display = "none";
            div_fecha_baja.style.display = "none";
            div_fecha_alta.style.display = "none";
            div_dias_quincena.style.display = "none";
            input_dias_quincena.value = "0"
            div_dias_total.className = "col-6"
            div_incidencia.className = "col-6"
            fecha_alta.value = "";
            fecha_baja.value = "";
            fecha_inicio.value = "";
            fecha_final.value = "";
            break;
        case "2":
            input_dias.value = "1"
            div_fecha.style.display = "";
            div_septimo_dia.style.display = "";
            div_fecha_inicio.style.display = "none";
            div_fecha_final.style.display = "none";
            div_fecha_baja.style.display = "none";
            div_fecha_alta.style.display = "none";
            div_dias_quincena.style.display = "none";
            div_dias_total.className = "col-6"
            div_incidencia.className = "col-6"
            input_dias_quincena.value = "0"
            fecha_alta.value = "";
            fecha_baja.value = "";
            fecha_inicio.value = "";
            fecha_final.value = "";
            break;
        case "3":
            input_dias.value = ""
            div_fecha.style.display = "none";
            div_septimo_dia.style.display = "none";
            div_fecha_inicio.style.display = "";
            div_fecha_final.style.display = "";
            div_fecha_baja.style.display = "none";
            div_fecha_alta.style.display = "none";
            div_dias_quincena.style.display = "";
            div_dias_total.className = "col-4"
            div_incidencia.className = "col-4"
            fecha_alta.value = "";
            fecha_baja.value = "";
            fecha_inicio.value = "";
            fecha_final.value = "";
            break;
        case "4":
            input_dias.value = ""
            div_fecha.style.display = "none";
            div_septimo_dia.style.display = "none";
            div_fecha_inicio.style.display = "";
            div_fecha_final.style.display = "";
            div_fecha_baja.style.display = "none";
            div_fecha_alta.style.display = "none";
            div_dias_quincena.style.display = "";
            div_dias_total.className = "col-4"
            div_incidencia.className = "col-4"
            fecha_alta.value = "";
            fecha_baja.value = "";
            fecha_inicio.value = "";
            fecha_final.value = "";
            break;
        case "5":
            input_dias.value = ""
            div_fecha.style.display = "none";
            div_septimo_dia.style.display = "none";
            div_fecha_inicio.style.display = "none";
            div_fecha_final.style.display = "none";
            div_fecha_baja.style.display = "";
            div_fecha_alta.style.display = "none";
            div_dias_quincena.style.display = "none";
            div_dias_total.className = "col-6"
            div_incidencia.className = "col-6"
            input_dias_quincena.value = "0"
            fecha_alta.value = "";
            fecha_baja.value = "";
            fecha_inicio.value = "";
            fecha_final.value = "";
            break;
        case "6":
            input_dias.value = ""
            div_fecha.style.display = "none";
            div_septimo_dia.style.display = "none";
            div_fecha_inicio.style.display = "none";
            div_fecha_final.style.display = "none";
            div_fecha_baja.style.display = "none";
            div_fecha_alta.style.display = "";
            div_dias_quincena.style.display = "none";
            div_dias_total.className = "col-6"
            div_incidencia.className = "col-6"
            input_dias_quincena.value = "0"
            fecha_alta.value = "";
            fecha_baja.value = "";
            fecha_inicio.value = "";
            fecha_final.value = "0";
            break;
        default:
            input_dias.value = "0"
            div_fecha.style.display = "none";
            div_septimo_dia.style.display = "none";
            div_fecha_inicio.style.display = "none";
            div_fecha_final.style.display = "none";
            div_fecha_baja.style.display = "none";
            div_dias_quincena.style.display = "none";
            div_dias_total.className = "col-6"
            div_incidencia.className = "col-6"
            input_dias_quincena.value = "0"
            fecha_alta.value = "";
            fecha_baja.value = "";
            fecha_inicio.value = "";
            fecha_final.value = "";
            break;
    }
}

function septimo_dia() {
    var chx_septimo_dia = document.getElementById("quitar_septimo_dia");
    var input_dias = document.getElementById("descuento_dias");
    if (chx_septimo_dia.checked) {
        input_dias.value = "2"
    } else {
        input_dias.value = "1"
    }
}

function activar_fecha_final() {
    var fecha_descuento = document.getElementById("fecha_descuento");
    var dtp_fecha_inicio = document.getElementById("fecha_inicio");
    fecha_descuento.value = dtp_fecha_inicio.value
    $('#fecha_final').attr('readonly', false)
}

function obtener_dias_descontar() {
    var descuento_dias = document.getElementById("descuento_dias");
    var input_dias_quincena = document.getElementById("descuento_dias_quincena");
    var dtp_fecha_inicio = document.getElementById("fecha_inicio");
    var dtp_fecha_final = document.getElementById("fecha_final");
    var fecha_inicio_parseada = new Date(dtp_fecha_inicio.value + "T00:00:00");
    var fecha_final_parseada = new Date(dtp_fecha_final.value + "T00:00:00");
    var dias = Math.ceil(((fecha_final_parseada - fecha_inicio_parseada)) / (1000 * 3600 * 24));
    var dia_fecha_inicio = String(fecha_inicio_parseada.getDate()).padStart(2, '0');
    if (quincena == 'true') {
        if (Number(fecha_final_parseada.getDate()) <= 15) {
            input_dias_quincena.value = dias + 1
        } else {
            if (dia_fecha_inicio >= "15") {
                try {
                    var dias_descontar_quincena = (30 - parseInt(dia_fecha_inicio))
                } catch (error) {
                    console.log(error);
                } finally {
                    if (dias_descontar_quincena <= 0) {
                        input_dias_quincena.value = 1;
                    } else if (dias_descontar_quincena > 15) {
                        input_dias_quincena.value = 15
                    } else {
                        input_dias_quincena.value = dias_descontar_quincena + 1
                    }
                }
            } else {
                try {
                    var dias_descontar_quincena = (15 - parseInt(dia_fecha_inicio))
                } catch (error) {
                    console.log(error);
                } finally {
                    if (dias_descontar_quincena <= 0) {
                        input_dias_quincena.value = 1;
                    } else if (dias_descontar_quincena > 15) {
                        input_dias_quincena.value = 15
                    } else {
                        input_dias_quincena.value = dias_descontar_quincena + 1
                    }
                }
            }
        }
    } else {
        if (Number(fecha_final_parseada.getDate()) <= 30) {
            input_dias_quincena.value = dias + 1
        } else {
            if (dia_fecha_inicio >= "15") {
                try {
                    var dias_descontar_quincena = (30 - parseInt(dia_fecha_inicio))
                } catch (error) {
                    console.log(error);
                } finally {
                    if (dias_descontar_quincena <= 0) {
                        input_dias_quincena.value = 1;
                    } else if (dias_descontar_quincena > 15) {
                        input_dias_quincena.value = 15
                    } else {
                        input_dias_quincena.value = dias_descontar_quincena + 1
                    }
                }
            } else {
                try {
                    var dias_descontar_quincena = (15 - parseInt(dia_fecha_inicio))
                } catch (error) {
                    console.log(error);
                } finally {
                    if (dias_descontar_quincena <= 0) {
                        input_dias_quincena.value = 1;
                    } else if (dias_descontar_quincena > 15) {
                        input_dias_quincena.value = 15
                    } else {
                        input_dias_quincena.value = dias_descontar_quincena + 1
                    }
                }
            }
        }
    }

    if (dias < 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Fechas Invalidas',
            text: 'Por favor, asegurese que las fechas sean correctas'
        });
        descuento_dias.value = ""
    } else {
        descuento_dias.value = dias + 1
    }
}

function dias_descontar_baja() {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'obtener_quincena_lote'
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Quincena',
                        text: 'Por favor, comunicate con sistemas'
                    })
                    console.log(resp);
                } else {
                    try {
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
                        var quincena = lista[0].quincena;
                        var fecha_baja = document.getElementById("fecha_baja");
                        var fecha_descuento = document.getElementById("fecha_descuento");
                        var fecha_baja_parseada = new Date(fecha_baja.value + "T00:00:00");
                        var dia_fecha_baja = (fecha_baja_parseada).getDate();
                        var input_dias = document.getElementById("descuento_dias");
                        var dias_descontar;
                        if ((dia_fecha_baja) > 30) {
                            dias_descontar = 1;
                        } else if (quincena != 1) {
                            dias_descontar = 16 - (dia_fecha_baja);
                            if (dias_descontar < 0) {
                                dias_descontar = 0;
                            }
                        } else {
                            dias_descontar = 31 - (dia_fecha_baja);
                            if (dias_descontar > 15) {
                                dias_descontar = 0;
                            }
                        }
                        input_dias.value = dias_descontar
                        fecha_descuento.value = fecha_baja.value
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve('success');
                    }
                }
            }
        })
    }).then(() => {
        Swal.close();
    })
}

function dias_sumar_alta() {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'obtener_quincena_lote'
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Quincena',
                        text: 'Por favor, comunicate con sistemas'
                    })
                    console.log(resp);
                } else {
                    try {
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
                        var quincena = lista[0].quincena;
                        var fecha_alta = document.getElementById("fecha_alta");
                        var fecha_descuento = document.getElementById("fecha_descuento");
                        var fecha_alta_parseada = new Date(fecha_alta.value + "T00:00:00");
                        var dia_fecha_alta = (fecha_alta_parseada).getDate();
                        var input_dias = document.getElementById("descuento_dias");
                        var dias_sumar;
                        if ((dia_fecha_alta) > 30) {
                            dias_sumar = -1;
                        } else if (quincena != 1) {
                            dias_sumar = (dia_fecha_alta) - 16;
                            dias_sumar = 15 + dias_sumar
                            if (dias_sumar > 0) {
                                dias_sumar = 0;
                            }
                        } else {
                            dias_sumar = (dia_fecha_alta) - 31;
                            dias_sumar = 15 + dias_sumar
                            if (dias_sumar < -15) {
                                dias_sumar = 0;
                            }
                        }
                        input_dias.value = dias_sumar
                        fecha_descuento.value = fecha_alta.value
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve('success');
                    }
                }
            }
        })
    }).then(() => {
        Swal.close();
    })
}

function ingresar_dias_laborados() {
    return new Promise((resolve) => {
        cargando();
        if (validar_inputs()) {
            if (validar_selects()) {
                var slc_empleado = document.getElementById("empleado");
                var slc_incidencia = document.getElementById("slc_incidencia");
                var input_dias = document.getElementById("descuento_dias");
                var input_dias_quincena = document.getElementById("descuento_dias_quincena");
                var fecha_descuento = document.getElementById("fecha_descuento");
                var septimo_dia = document.getElementById("quitar_septimo_dia");
                var observaciones = document.getElementById("observaciones");
                var fecha_final = document.getElementById("fecha_final");
                var centro_costo = document.getElementById("centro_costo");
                var fecha_inicio = document.getElementById("fecha_inicio");
                var nombre_completo = document.getElementById("nombre_completo");
                var div_fecha_descuento = document.getElementById("div_fecha_descuento");
                var div_fecha_inicio = document.getElementById("div_fecha_inicio");
                var div_fecha_final = document.getElementById("div_fecha_final");
                var div_incidencia = document.getElementById("div_incidencia");
                var div_dias_quincena = document.getElementById("div_dias_quincena");
                var div_dias_total = document.getElementById("div_dias_total");
                $.ajax({
                    url: 'php/servidor.php',
                    type: 'POST',
                    data: {
                        quest: 'ingresar_dias_laborados',
                        descuento_dias: input_dias.value,
                        faltan_quincena: input_dias_quincena.value,
                        observaciones: observaciones.value,
                        fecha_descuento: fecha_descuento.value,
                        fecha_final: fecha_final.value,
                        septimo: septimo_dia.checked,
                        id_incidencia: slc_incidencia.value,
                        id_empleado: slc_empleado.value,
                    },
                    success: function (resp) {
                        console.log(resp);
                        if (resp.includes('Query Falló')) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error Al Ingresar Dias Laborados',
                                text: 'Por favor, comunicate con sistemas'
                            });
                            console.log(resp);
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Dias Laborados Ingresados Correctamente',
                                showConfirmButton: false,
                                timer: 1300
                            }).then(() => {
                                try {
                                    nombre_completo.value = ""
                                    input_dias.value = ""
                                    input_dias_quincena.value = ""
                                    centro_costo.value = ""
                                    fecha_inicio.value = ""
                                    fecha_final.value = ""
                                    septimo_dia.checked = false
                                    div_fecha_descuento.style.display = "none";
                                    div_fecha_inicio.style.display = "none";
                                    div_fecha_final.style.display = "none";
                                    div_dias_quincena.style.display = "none";
                                    div_incidencia.className = "col-6";
                                    div_dias_total.className = "col-6";
                                    observaciones.value = ""
                                } catch (error) {
                                    console.log(error);
                                } finally {
                                    resolve('success');
                                }
                            })
                        }
                    }
                })
            }
        }
    }).then(() => {
        listado_departamentos();
    })
}

function validar_inputs() {
    var nombre_completo = document.getElementById("nombre_completo");
    var centro_costo = document.getElementById("centro_costo");
    var descuento_dias = document.getElementById("descuento_dias");
    var fecha_descuento = document.getElementById("fecha_descuento");
    var fecha_final = document.getElementById("fecha_final");
    var slc_incidencia = document.getElementById("slc_incidencia");
    if (nombre_completo.value == "" || centro_costo.value == "" || descuento_dias.value == "" || fecha_descuento.value == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Vacios',
            text: 'Por favor, asegurate de haber llenado todos los campos'
        });
        return false;
    } else if ((slc_incidencia.value == "3" || slc_incidencia.value == "4") && fecha_final.value == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Vacios',
            text: 'Por favor, asegurate de haber llenado todos los campos'
        });
        return false;
    } else {
        return true;
    }
}

function validar_selects() {
    var selects = document.getElementsByClassName("title");
    if (selects[0].innerHTML == "Departamento..." || selects[1].innerHTML == "Empleado..." || selects[2].innerHTML == "Incidencia...") {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Vacios',
            text: 'Por favor, asegurate de haber llenado todos los campos'
        });
        return false;
    } else {
        return true;
    }
}

function listado_dias_laborados() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dias_laborados'
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Dias Laborados',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(resp);
                } else {
                    try {
                        $('#tabla').DataTable().destroy();
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
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <tr>
                            <td>${lista.id}</td>
                            <td>${lista.nombre}</td>
                            <td>${lista.departamento}</td>
                            <td>${lista.centro_costo}</td>
                            <td>${lista.incidencia}</td>
                            <td>${lista.fecha_descuento}</td>
                            <td>${lista.fecha_generado}</td>
                            <td>
                                <div class="action-btns">
                                    <a href="javascript:void(0);" data-toggle="modal"
                                        data-target="#detalle" onclick="detalle(${lista.id})"
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
                        `
                        });
                        document.getElementById('cuerpo_tabla').innerHTML = template;
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
                        resolve('success');
                    }
                }
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function detalle(id) {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_dias_laborados',
                id: id
            },
            success: function (resp) {
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Detalle',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(resp);
                } else {
                    try {
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
                        var nombre_completo_detalle = document.getElementById("nombre_completo_detalle");
                        var departamento_detalle = document.getElementById("departamento_detalle");
                        var centro_costo_detalle = document.getElementById("centro_costo_detalle");
                        var dias_descontados_detalle = document.getElementById("dias_descontados_detalle");
                        var fecha_descuento_detalle = document.getElementById("fecha_descuento_detalle");
                        var fecha_generado_detalle = document.getElementById("fecha_generado_detalle");
                        var fecha_final_detalle = document.getElementById("fecha_final_detalle");
                        var observaciones_detalle = document.getElementById("observaciones_detalle");
                        var incidencia_detalle = document.getElementById("incidencia_detalle");
                        var septimo_detalle = document.getElementById("septimo_detalle");
                        nombre_completo_detalle.value = lista[0].empleado;
                        departamento_detalle.value = lista[0].departamento;
                        centro_costo_detalle.value = lista[0].centro_costo;
                        dias_descontados_detalle.value = lista[0].descuento_dias;
                        fecha_descuento_detalle.value = lista[0].fecha_descuento;
                        fecha_generado_detalle.value = lista[0].fecha_generado;
                        fecha_final_detalle.value = lista[0].fecha_final;
                        observaciones_detalle.value = lista[0].observaciones;
                        incidencia_detalle.value = lista[0].incidencia;
                        if (lista[0].septimo != 1) {
                            septimo_detalle.checked = false;
                        } else {
                            septimo_detalle.checked = true;
                        }
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve('success')
                    }
                }
            }
        });
    }).then(() => {
        Swal.close();
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
