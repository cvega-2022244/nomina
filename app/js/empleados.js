$(document).ready(function () {
    reiniciar_variable_recarga();
    cargando();
    listado_empleados();
    cargar_select_empresa_reporte();

    // Verificar si hay un parámetro de recarga forzada pero evitar bucle infinito
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('t') && !sessionStorage.getItem('reloaded_t_' + urlParams.get('t'))) {
        // Forzar recarga de datos sin cache una sola vez
        sessionStorage.setItem('reloaded_t_' + urlParams.get('t'), 'true');
        setTimeout(() => {
            location.reload(true);
        }, 100);
    }
});

function reiniciar_variable_recarga() {
    localStorage.setItem('paginaRecargada', 'false');
}

function listado_empleados() {
    return new Promise((resolve) => {
        try {
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                cache: false, // Deshabilitar cache para obtener datos frescos
                data: {
                    quest: 'listado_empleados',
                    _t: new Date().getTime() // Parámetro de tiempo para evitar cache
                },
                success: function (resp) {
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
                    <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.id}</td>
                    <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.segundo_nombre}</td>
                    <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.dpi}</td>
                    <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.empresa}</td>
                    <td class="text-center">
                        <div class="action-btns">
                            <a onclick="detalle_empleado(${lista.id})" class="action-btn btn-view bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Detalle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-eye">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </a>
                            <a onclick="editar_empleado(${lista.id})" class="action-btn btn-edit bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="feather feather-edit-2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                                    </path>
                                </svg>
                            </a>`;
                        if (lista.id_permisos == '0') {
                            template += `
                            <b style="color: red">*</b>
                            </div>
                            </td>
                            </tr>`
                        } else {
                            template += `</div>
                            </td>
                            </tr>`
                        }
                    });
                    document.getElementById('listado_empleados').innerHTML = template;
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
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            resolve();
        }
    }).then(() => {
        cargar_select_empresa();
    })
}

function cargar_datos_empleado() {
    // 1. Obtener el ID guardado en la sesión
    let id_empleado = sessionStorage.getItem('id_empleado');
    let es_vista_detalle = sessionStorage.getItem('detalle_empleado') === 'true';

    if (!id_empleado) {
        Swal.fire('Error', 'No se ha seleccionado ningún empleado', 'error');
        return;
    }

    cargando(); // Tu función de carga existente

    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'info_completa_empleado', // El nuevo quest PHP
            id_empleado: id_empleado,
            _t: new Date().getTime() // Evitar caché
        },
        success: function (resp) {
            Swal.close();

            try {
                let data = (typeof resp === 'string') ? JSON.parse(resp) : resp;

                if (data.error) {
                    Swal.fire('Error', data.error, 'error');
                    return;
                }

                // El PHP devuelve un array con un objeto en la posición 0
                let empleado = data[0];

                // 2. Rellenar los campos del formulario
                // Asumiendo que tus inputs tienen IDs iguales a las columnas de la BD
                // Ejemplo: <input id="primer_nombre">, <input id="dpi">, etc.

                // Datos Personales
                $('#primer_nombre').val(empleado.primer_nombre);
                $('#segundo_nombre').val(empleado.segundo_nombre);
                $('#otro_nombre').val(empleado.otro_nombre);
                $('#primer_apellido').val(empleado.primer_apellido);
                $('#segundo_apellido').val(empleado.segundo_apellido);
                $('#apellido_casada').val(empleado.apellido_casada);
                $('#fecha_nacimiento').val(empleado.fecha_nacimiento);
                $('#dpi').val(empleado.dpi);
                $('#nit').val(empleado.nit);
                $('#direccion').val(empleado.direccion);
                $('#telefono').val(empleado.telefono);
                $('#email').val(empleado.email); // Si existe en la tabla
                $('#estado_civil').val(empleado.estado_civil); // Select
                $('#genero').val(empleado.genero); // Select

                // Datos Laborales
                $('#fecha_inicio').val(empleado.fecha_inicio);
                $('#puesto').val(empleado.puesto);
                $('#sueldo_ordinario').val(empleado.sueldo_ordinario);
                $('#bon_incentivo').val(empleado.bon_incentivo);

                // Selects dinámicos (Empresa, Departamento, etc.)
                // Nota: Asegúrate de que los selects ya estén cargados antes de asignar el valor
                $('#centro_de_costo').val(empleado.centro_de_costo);
                $('#departamento_laboral').val(empleado.departamento_laboral);

                // Empresa Principal (Del JOIN que hicimos)
                // Si tienes un select de empresa, usa el ID de la empresa
                $('#id_empresa').val(empleado.id_empresa_principal);

                // 3. Manejar modo "Solo Ver" vs "Editar"
                if (es_vista_detalle) {
                    // Si es solo ver detalle, deshabilitamos todos los inputs
                    $('input, select, textarea').prop('disabled', true);
                    // Ocultar botón de guardar si existe
                    $('#btn_guardar_empleado').hide();
                } else {
                    // Si es editar, habilitamos
                    $('input, select, textarea').prop('disabled', false);
                    $('#btn_guardar_empleado').show();
                }

                // Opcional: Actualizar librerías de select si usas vanillaSelectBox o Select2
                // Example: selectBoxEmpresa.setValue(empleado.id_empresa_principal);

            } catch (e) {
                console.error(e);
                Swal.fire('Error', 'Error al procesar los datos del empleado', 'error');
            }
        },
        error: function () {
            Swal.close();
            Swal.fire('Error', 'Error de conexión con el servidor', 'error');
        }
    });
}
function cargar_select_empresa_reporte() {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: { quest: 'listado_empresas' },
        success: function (res) {
            try {
                let lista = (typeof res === 'string') ? JSON.parse(res) : res;
                let template = '<option value="">Todas las empresas</option>';

                if (Array.isArray(lista)) {
                    lista.forEach(empresa => {
                        template += `<option value="${empresa.id}">${empresa.nombre_comercial}</option>`;
                    });
                    document.getElementById('slc_empresa_reporte').innerHTML = template;
                }
            } catch (error) {
                console.error("Error cargando empresas para reporte", error);
            }
        }
    });
}

// Función que ejecuta el botón "Reporte Empleados"
function descargar_reporte() {
    let id_empresa = document.getElementById('slc_empresa_reporte').value;
    let estado = document.getElementById('slc_estado_reporte').value;

    // Opción A: Abrir en una nueva pestaña (Ideal para PDFs o Excels generados por PHP)
    // Asumiendo que tienes un archivo reporte_empleados.php o usas el mismo servidor.php para generar un archivo
    let url = `php/servidor.php?quest=generar_excel_empleados&id_empresa=${id_empresa}&estado=${estado}`;
    window.open(url, '_blank');

    $('#modalReporte').modal('hide');
}

function descargar_reporte_completo() {
    Swal.fire({
        title: 'Generando Reporte...',
        text: 'Por favor espere mientras se descarga el archivo.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Llamamos al servidor solicitando el reporte excel
    // Usamos un timeout pequeño para cerrar el Swal, ya que el navegador manejará la descarga
    window.location.href = 'php/servidor.php?quest=reporte_completo_excel';

    setTimeout(() => {
        Swal.close();
    }, 3000);
}

function cargar_select_empresa() {
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
        listado_empleados_baja();
    })
}

function listado_empleados_baja() {
    return new Promise((resolve) => {
        try {
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'listado_empleados_baja'
                },
                success: function (resp) {
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
                    <td class="text-center">${lista.id}</td>
                    <td class="text-center">${lista.primer_nombre}</td>
                    <td class="text-center">${lista.primer_apellido}</td>
                    <td class="text-center">${lista.dpi}</td>
                    <td class="text-center">${lista.empresa}</td>
                    <td class="text-center">
                        <div class="action-btns">
                            <a onclick="detalle_empleado(${lista.id})" class="action-btn btn-view bs-tooltip me-2"
                                        data-toggle="tooltip" data-placement="top" title="Detalle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </a>
                            <a onclick="vacaciones(${lista.id_permisos})" class="action-btn btn-view bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Vacaciones">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            </a>
                            <a onclick="finiquito_vacacional(${lista.id})" class="action-btn btn-edit bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Finiquito Vacacional">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </a>
                            <a onclick="modal_liquidacion(${lista.id}, ${lista.id_permisos})" class="action-btn btn-edit bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Liquidacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
                            </a>`;
                        if (lista.id_permisos == '0') {
                            template += `
                            <b style="color: red">*</b>
                            </div>
                            </td>
                            </tr>`
                        } else {
                            template += `</div>
                            </td>
                            </tr>`
                        }
                    });
                    document.getElementById('listado_empleados_baja').innerHTML = template;
                    $('#tabla_baja').DataTable({
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
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            resolve();
        }
    }).then(() => {
        cargar_select_empresa_baja();
    })
}

function cargar_select_empresa_baja() {
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
                        var slc_empresa = document.getElementById('slc_empresa_baja')
                        var template = '';
                        lista.forEach(empresa => {
                            template += `<option value="${empresa.id}">${empresa.nombre_comercial}</option>`
                        })
                        slc_empresa.innerHTML = template;
                        selectBox = new vanillaSelectBox("#slc_empresa_baja", {
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
    try {
        cargando();
        var slc_empresa = document.getElementById('slc_empresa')
        var id_empresa = slc_empresa.value;
    } catch (error) {
        console.log(error);
    } finally {
        listado_empleados_empresa(id_empresa);
    }
}

function seleccionar_empresa_baja() {
    try {
        cargando();
        var slc_empresa = document.getElementById('slc_empresa_baja')
        var id_empresa = slc_empresa.value;
    } catch (error) {
        console.log(error);
    } finally {
        listado_empleados_empresa_baja(id_empresa);
    }
}

function listado_empleados_empresa(id_empresa) {
    return new Promise((resolve) => {
        try {
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'listado_empleados_empresa',
                    id_empresa
                },
                success: function (resp) {
                    if (resp.includes('Query Falló')) {
                        Swal.fire({
                            title: 'Error Al Obtener Empleados',
                            html: 'Ha ocurrido un error al intentar obtener los empleados, por favor, comunicate con sistemas.',
                            icon: 'error',
                            allowOutsideClick: false,
                            showConfirmButton: true,
                        });
                        console.log(resp);
                    } else if (resp.includes('No hay datos')) {
                        Swal.fire({
                            title: 'No hay empleados en la empresa seleccionada',
                            icon: 'warning',
                            allowOutsideClick: false,
                            showConfirmButton: true,
                        });
                        document.getElementById('listado_empleados').innerHTML = '';
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
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <tr>
                            <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.id}</td>
                            <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.primer_nombre}</td>
                            <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.primer_apellido}</td>
                            <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.dpi}</td>
                            <td class="text-center" onclick = "detalle_empleado(${lista.id})">${lista.empresa}</td>
                            <td class="text-center">
                                <div class="action-btns">
                                    <a onclick="detalle_empleado(${lista.id})" class="action-btn btn-view bs-tooltip me-2"
                                        data-toggle="tooltip" data-placement="top" title="Detalle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </a>
                                    <a onclick="editar_empleado(${lista.id})" class="action-btn btn-edit bs-tooltip me-2"
                                        data-toggle="tooltip" data-placement="top" title="Editar">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-edit-2">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                                            </path>
                                        </svg>
                                    </a>`;
                            if (lista.id_permisos == '0') {
                                template += `
                            <b style="color: red">*</b>
                            </div>
                            </td>
                            </tr>`
                            } else {
                                template += `</div>
                            </td>
                            </tr>`
                            }
                        });
                        document.getElementById('listado_empleados').innerHTML = template;
                    }
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            resolve();
        }
    }).then(() => {
        Swal.close();
    })
}

function listado_empleados_empresa_baja(id_empresa) {
    return new Promise((resolve) => {
        try {
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'listado_empleados_empresa_baja',
                    id_empresa
                },
                success: function (resp) {
                    if (resp.includes('Query Falló')) {
                        Swal.fire({
                            title: 'Error Al Obtener Empleados',
                            html: 'Ha ocurrido un error al intentar obtener los empleados, por favor, comunicate con sistemas.',
                            icon: 'error',
                            allowOutsideClick: false,
                            showConfirmButton: true,
                        });
                        console.log(resp);
                    } else if (resp.includes('No hay datos')) {
                        Swal.fire({
                            title: 'No hay empleados en la empresa seleccionada',
                            icon: 'warning',
                            allowOutsideClick: false,
                            showConfirmButton: true,
                        });
                        document.getElementById('listado_empleados_baja').innerHTML = '';
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
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <tr>
                            <td class="text-center">${lista.id}</td>
                            <td class="text-center">${lista.primer_nombre}</td>
                            <td class="text-center">${lista.primer_apellido}</td>
                            <td class="text-center">${lista.dpi}</td>
                            <td class="text-center">${lista.empresa}</td>
                            <a onclick="detalle_empleado(${lista.id})" class="action-btn btn-view bs-tooltip me-2"
                                        data-toggle="tooltip" data-placement="top" title="Detalle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </a>
                            <td class="text-center">
                                <div class="action-btns">
                                     <a onclick="vacaciones(${lista.id_permisos})" class="action-btn btn-view bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Vacaciones">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            </a>
                            <a onclick="finiquito_vacacional(${lista.id})" class="action-btn btn-edit bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Finiquito Vacacional">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </a>
                            <a onclick="modal_liquidacion(${lista.id}, ${lista.id_permisos})"  class="action-btn btn-edit bs-tooltip me-2"
                                data-toggle="tooltip" data-placement="top" title="Liquidacion">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
                            </a>`;
                            if (lista.id_permisos == '0') {
                                template += `
                            <b style="color: red">*</b>
                            </div>
                            </td>
                            </tr>`
                            } else {
                                template += `</div>
                            </td>
                            </tr>`
                            }
                        });
                        document.getElementById('listado_empleados_baja').innerHTML = template;
                    }
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            resolve();
        }
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

function limpiar_duplicados() {
    Swal.fire({
        title: '¿Limpiar Duplicados?',
        text: 'Esta acción limpiará los duplicados de empleados y marcará una empresa principal para cada empleado. ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'limpiar_duplicados_empleados'
                },
                success: function (resp) {
                    if (resp.includes('success')) {
                        Swal.fire({
                            title: 'Duplicados Limpiados',
                            text: 'Los duplicados han sido limpiados exitosamente',
                            icon: 'success'
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un error al limpiar los duplicados',
                            icon: 'error'
                        });
                    }
                },
                error: function () {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error de conexión',
                        icon: 'error'
                    });
                }
            });
        }
    });
}

function corregir_empleados_sin_empresa() {
    Swal.fire({
        title: '¿Corregir Empleados Sin Empresa?',
        text: 'Esta acción corregirá los empleados que aparecen "Sin Empresa" asignándoles una empresa principal. ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, corregir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'corregir_empleados_sin_empresa'
                },
                success: function (resp) {
                    try {
                        const response = JSON.parse(resp);
                        if (response.success) {
                            Swal.fire({
                                title: 'Empleados Corregidos',
                                text: `Se corrigieron ${response.empleados_corregidos} empleados de ${response.total_empleados_sin_empresa} empleados sin empresa`,
                                icon: 'success'
                            }).then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: response.error || 'Hubo un error al corregir los empleados',
                                icon: 'error'
                            });
                        }
                    } catch (e) {
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un error al procesar la respuesta',
                            icon: 'error'
                        });
                    }
                },
                error: function () {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error de conexión',
                        icon: 'error'
                    });
                }
            });
        }
    });
}

function corregir_todos_empleados_sin_empresa() {
    Swal.fire({
        title: '¿Corregir Empleados Sin Empresa?',
        text: 'Esta acción corregirá los empleados que aparecen "Sin Empresa" asignándoles una empresa principal. ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, corregir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();

            // Agregar timeout para evitar carga infinita
            const timeout = setTimeout(() => {
                Swal.close();
                Swal.fire({
                    title: 'Tiempo Agotado',
                    text: 'La operación está tomando demasiado tiempo. Por favor, recarga la página e intenta de nuevo.',
                    icon: 'warning'
                });
            }, 30000); // 30 segundos timeout

            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                timeout: 25000, // 25 segundos timeout
                data: {
                    quest: 'corregir_todos_empleados_sin_empresa'
                },
                success: function (resp) {
                    clearTimeout(timeout);
                    Swal.close();

                    try {
                        const response = JSON.parse(resp);
                        if (response.success) {
                            Swal.fire({
                                title: 'Corrección Completada',
                                text: `Se corrigieron ${response.empleados_corregidos} empleados de ${response.total_empleados_sin_empresa} empleados sin empresa`,
                                icon: 'success'
                            }).then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: response.error || 'Hubo un error al corregir los empleados',
                                icon: 'error'
                            });
                        }
                    } catch (e) {
                        Swal.fire({
                            title: 'Error',
                            text: 'Hubo un error al procesar la respuesta: ' + e.message,
                            icon: 'error'
                        });
                    }
                },
                error: function (xhr, status, error) {
                    clearTimeout(timeout);
                    Swal.close();

                    let errorMessage = 'Hubo un error de conexión';
                    if (status === 'timeout') {
                        errorMessage = 'La operación tardó demasiado tiempo';
                    } else if (xhr.responseText) {
                        errorMessage = 'Error del servidor: ' + xhr.responseText;
                    }

                    Swal.fire({
                        title: 'Error',
                        text: errorMessage,
                        icon: 'error'
                    });
                }
            });
        }
    });
}

function corregir_empleados_simple() {
    Swal.fire({
        title: '¿Corregir Empleados Sin Empresa?',
        text: 'Esta es una versión simplificada que corregirá los empleados sin empresa. ¿Desea continuar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, corregir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();

            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                timeout: 15000, // 15 segundos timeout
                data: {
                    quest: 'corregir_empleados_simple'
                },
                success: function (resp) {
                    Swal.close();

                    try {
                        const response = JSON.parse(resp);
                        if (response.success) {
                            Swal.fire({
                                title: 'Corrección Completada',
                                text: `Se corrigieron ${response.empleados_corregidos} empleados`,
                                icon: 'success'
                            }).then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: response.error || 'Hubo un error al corregir los empleados',
                                icon: 'error'
                            });
                        }
                    } catch (e) {
                        Swal.fire({
                            title: 'Error',
                            text: 'Error al procesar la respuesta: ' + e.message,
                            icon: 'error'
                        });
                    }
                },
                error: function (xhr, status, error) {
                    Swal.close();

                    let errorMessage = 'Error de conexión';
                    if (status === 'timeout') {
                        errorMessage = 'La operación tardó demasiado tiempo';
                    }

                    Swal.fire({
                        title: 'Error',
                        text: errorMessage,
                        icon: 'error'
                    });
                }
            });
        }
    });
}

function empresas() {
    window.location.href = './empresas.html';
}

function departamentos() {
    window.location.href = './departamentos.html';
}

function empleados() {
    window.location.href = './empleados.html';
}

function detalle_empleado(id) {
    sessionStorage.setItem('id_empleado', id);
    sessionStorage.setItem('detalle_empleado', true);
    window.location.href = './detalle_empleado.html';
}

function editar_empleado(id) {
    sessionStorage.setItem('id_empleado', id);
    sessionStorage.setItem('detalle_empleado', false);
    window.location.href = './detalle_empleado.html';
}

function agregar_empleados() {
    window.location.href = './agregar_empleados.html';
}

function modal_cumpleaños() {
    $('#modal_cumpleaneros').modal('show');
}

function reporte_cumpleaños() {
    let mes_cumple = document.getElementById('mes_cumple').value;
    let ano_cumple = document.getElementById('ano_cumple').value;
    sessionStorage.setItem('mes_cumple', mes_cumple);
    sessionStorage.setItem('ano_cumple', ano_cumple);
    window.location.href = './cumpleañeros.html';
}

function vacaciones(id_permisos) {
    sessionStorage.setItem('id_permiso', id_permisos);
    window.location.href = './vacaciones.html';
}

function finiquito_vacacional(id) {
    sessionStorage.setItem('id_empleado_finiquito', id);
    $('#modal_finiquito').modal('show');
}

function guardar_datos_finiquito() {
    var mes_finiquito_inicio = document.getElementById('mes_finiquito_inicio').value;
    var mes_finiquito_final = document.getElementById('mes_finiquito_final').value;
    var anio_finiquito_inicio = document.getElementById('anio_finiquito_inicio').value;
    var anio_finiquito_final = document.getElementById('anio_finiquito_final').value;
    sessionStorage.setItem('mes_finiquito_inicio', mes_finiquito_inicio);
    sessionStorage.setItem('mes_finiquito_final', mes_finiquito_final);
    sessionStorage.setItem('anio_finiquito_inicio', anio_finiquito_inicio);
    sessionStorage.setItem('anio_finiquito_final', anio_finiquito_final);
    $('#modal_finiquito').modal('hide');
    window.location.href = "./finiquito_vacacional.htm";
}

function guardarBajas() {
    const mesSeleccionado = document.getElementById('mes_bajas').value;
    const anioSeleccionado = document.getElementById('anio_bajas').value;

    // Crear un objeto con los datos de mes y año
    const datosReporte = {
        mes: mesSeleccionado,
        anio: anioSeleccionado,
    };

    // Convertir el objeto a JSON
    const datosReporteJSON = JSON.stringify(datosReporte);

    // Guardar el JSON en el sessionStorage con el id 'bajas'
    sessionStorage.setItem('bajas', datosReporteJSON);
    window.location.href = "./bajas.html";
}

function guardarDatosReporte() {
    const mesSeleccionado = document.getElementById('mes').value;
    const anioSeleccionado = document.getElementById('anio').value;

    // Crear un objeto con los datos de mes y año
    const datosReporte = {
        mes: mesSeleccionado,
        anio: anioSeleccionado,
    };

    // Convertir el objeto a JSON
    const datosReporteJSON = JSON.stringify(datosReporte);

    // Guardar el JSON en el sessionStorage con el id 'altas_bajas'
    sessionStorage.setItem('altas_bajas', datosReporteJSON);
    window.location.href = "./altas.html";
}

function modal_liquidacion(id_empleado, id_permiso) {
    sessionStorage.setItem('id_empleado_liquidacion', id_empleado);
    sessionStorage.setItem('id_permiso_liquidacion', id_permiso);
    $('#modal_liquidacion').modal('show');
}

function guardar_porcentaje_liquidacion() {
    var porcentaje = document.getElementById('porcentaje_liquidacion').value;
    if (porcentaje < 0 || porcentaje > 100) {
        Swal.fire({
            icon: 'warning',
            title: 'Porcentaje Invalido',
            html: 'Por favor, ingrese un valor entre 0 y 100',
        });
        return;
    } else {
        sessionStorage.setItem('porcentaje_liquidacion', porcentaje);
        $('#modal_liquidacion').modal('hide');
        window.location.href = "./liquidacion.html";
    }
}

