$(document).ready(function () {
    listado_departamentos();
    traer_descuentos();
    selectBox = new vanillaSelectBox("#empleado", {
        "keepInlineStyles": true,
        "maxHeight": 678,
        "minWidth": 200,
        "search": true,
        "placeHolder": "Empleado..."
    });
    document.getElementById("slc_egreso").innerHTML = `
        <option value="Celular">Celular</option>
        <option value="Cafeteria">Cafetería</option>
        <option value="Uniforme">Uniforme</option>
        <option value="Calzado">Calzado</option>
        <option value="Equipo">Equipo</option>
        <option value="Producto">Producto</option>
        <option value="Bancos">Bancos</option>
        <option value="Otros">Otros...</option>
    `;
    selectBox = new vanillaSelectBox("#slc_egreso", {
        "keepInlineStyles": true,
        "maxHeight": 678,
        "minWidth": 300,
        "search": true,
        "placeHolder": "Tipo de egreso..."
    });
});

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
        Swal.close();
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
            departamento: depto
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
            id: slc_empleado.value
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

document.getElementById('slc_egreso').addEventListener('change', event => {

    let opcion = document.getElementById("slc_egreso").value;
    document.getElementById("otro_egreso").value = opcion;
    if (opcion == 'Otros') {
        document.getElementById("otro_egreso").hidden = false;
        document.getElementById("titulo_otro_egreso").hidden = false;
    } else {
        document.getElementById("otro_egreso").hidden = true;
        document.getElementById("titulo_otro_egreso").hidden = true;
    }
});

function guardar() {
    var egreso = document.getElementById("otro_egreso").value;
    var monto_total = document.getElementById("monto_total").value;
    var cuotas = document.getElementById("cuota").value;
    var id_empleado = document.getElementById("empleado").value;
    // 1 significa activo, 0 inactivo
    var estado = 1;
    // 1 significa activo, 0 inactivo
    var seleccionado = 1;

    if (egreso != '' && monto_total != '' && cuotas != '' && id_empleado != '' && estado != '' && seleccionado != '') {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_descuento',
                egreso,
                monto_total,
                cuotas,
                id_empleado,
                estado,
                seleccionado
            },
            success: function (res) {
                if (res === 'No') {
                    Swal.fire({
                        title: 'Ha ocurrido un error!',
                        text: "Un error ha ocurrido al intentar ingresar este descuento, por favor intente más tarde!",
                        icon: 'error',
                        confirmButtonText: 'Okay'
                    });
                } else {
                    Swal.fire({
                        title: 'Descuento registrado con éxito!',
                        text: "El descuento se ha registrado con exito!",
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1300
                    }).then(() => {
                        window.location.reload();
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: 'Faltan datos!',
            text: "Revise si ha llenado todos los datos del formulario correctamente!",
            icon: 'warning'
        });
    }
}

function cargando() {
    Swal.fire({
        title: 'Procesando...',
        html: 'Esto puede demorar unos momentos',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}


function pago_unico() {
    var checkBox = document.getElementById("tipo_pago");
    if (checkBox.checked == true) {
        document.getElementById("cuota").value = 1;
        document.getElementById("cuota").disabled = true;
    } else {
        document.getElementById("cuota").value = "";
        document.getElementById("cuota").disabled = false;
    }
}

function traer_descuentos() {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lista_descuentos'
        },
        success: function (res) {
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
            let template = '';
            lista.forEach(lista => {
                template += `
                    <tr>
                        <td>
                            `;
                if (lista.seleccionado == 1) {
                    template += `<input type="checkbox" class="form-check-input" id="${lista.id}" onclick="validacion_check(${lista.id})" checked></input>`;
                } else {
                    template += `<input type="checkbox" class="form-check-input" id="${lista.id}" onclick="validacion_check(${lista.id})"></input>`;
                }
                template += `
                        </td>
                        <td>${lista.id}</td>
                        <td>${lista.nombre}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.tipo_egreso}</td>
                        <td>${formatear_numeros(lista.monto_total)}</td>
                        <td>${formatear_numeros(lista.monto_total / lista.cuotas)}</td>
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
                `;
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
                "lengthMenu": [1000, 2000, 3000, 5000],
                "pageLength": 1000
            });
        }
    });
}

function detalle(id) {
    cargando();
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lista_descuento',
            id
        },
        success: function (res) {
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
            lista.forEach(lista => {
                document.getElementById("nombre_completo_detalle").value = lista.nombre;
                document.getElementById("departamento_detalle").value = lista.departamento;
                document.getElementById("centro_costo_detalle").value = lista.centro_costo;
                document.getElementById("tipo_egreso_detalle").value = lista.tipo_egreso;
                document.getElementById("monto_total_detalle").value = formatear_numeros(lista.monto_total);
                document.getElementById("monto_descuento_detalle").value = formatear_numeros(lista.monto_total / lista.cuotas);
                document.getElementById("cuota_total_detalle").value = lista.cuotas;
                document.getElementById("cuota_faltante_detalle").value = lista.faltan;
                document.getElementById("fecha_generado_detalle").value = lista.fecha_generado;
                if (lista.seleccionado == 1) {
                    document.getElementById("seleccionado_detalle").value = 'En estado válido para descontar en esta quincena';
                } else {
                    document.getElementById("seleccionado_detalle").value = 'En estado inválido para descontar en esta quincena';
                }
                Swal.close();
            });
        }
    });

    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lote_descuentos_anteriores',
            id_descuento: id
        },
        success: function (res) {
            if (res.includes('No')) {
                document.getElementById("descuento_lotes").innerHTML = '';
            } else {
                console.log(res);
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
                let template = '';
                lista.forEach(lista => {
                    template += `
                    <tr>
                        <td>${lista.nombre}</td>
                    </tr>
                    `;
                });
                document.getElementById("descuento_lotes").innerHTML = template;
            }
        }
    });
}

function click_seleccionar_todos() {
    var checkboxs = document.getElementsByClassName('form-check-input')
    if (checkboxs[1].checked == true) {
        for (let index = 2; index <= (checkboxs.length - 1); index++) {
            if (checkboxs[index].checked == false) {
                checkboxs[index].click()
            }
        }
    } else {
        for (let index = 2; index <= (checkboxs.length - 1); index++) {
            if (checkboxs[index].checked == true) {
                checkboxs[index].click()
            }
        }
    }
}

function validacion_check(id) {
    return new Promise((resolve) => {
        cargando();
        var chx = document.getElementById(id);
        if (chx.checked == true) {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: {
                    quest: 'confirmar_descuento',
                    id: id
                },
                success: function (respuesta) {
                    if (respuesta.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Confirmar Descuento',
                            text: 'Ah ocurrido un error al intentar confirmar el descuento, por favor, intentalo de nuevo',
                            showcancelButton: false
                        });
                        console.log(respuesta);
                    } else {
                        resolve('success')
                    }
                }
            })
        } else {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: {
                    quest: 'desaprobar_descuento',
                    id: id
                },
                success: function (respuesta) {
                    if (respuesta.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Desaprobar Descuento',
                            text: 'Ah ocurrido un error al intentar desaprobar el descuento, por favor, intentalo de nuevo',
                            showcancelButton: false
                        });
                        console.log(respuesta);
                    } else {
                        resolve('success')
                    }
                }
            })
        }
    }).then(() => {
        Swal.close();
    })
}
