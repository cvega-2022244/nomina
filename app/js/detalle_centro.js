//------------Inputs---------------//
nombre_dimension = document.getElementById('nombre_dimension');
boton_guardar = document.getElementById('boton_guardar');
boton_agregar = document.getElementById('boton_agregar');
//------------Inputs---------------//
var detalle = sessionStorage.getItem('detalle_centro');

$(document).ready(function () {
    cargando();
    activar_inputs();
    llenar_inputs();
});

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

function listado_dimension_3() {
    return new Promise((resolve, reject) => {
        var id_dimension = sessionStorage.getItem('id_centro_costo');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dimension3_dimension2',
                id_dimension
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener División',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve(); // Resolver aunque haya error
                } else if (res.includes('No hay datos')) {
                    console.log('No hay divisiones registradas');
                    // No mostrar alerta, solo continuar
                    resolve(0);
                } else {
                    try {
                        let template = "";
                        let template_encabezado = "";
                        if (res != 0) {
                            let lista;
                            if (typeof res === 'string') {
                                lista = JSON.parse(res);
                            } else {
                                lista = res; // jQuery ya parseó el JSON
                            }
                            lista.forEach(lista => {
                                if (detalle == 'true') {
                                    template += `
                            <tr>
                            <td>${lista.id}</td>
                            <td>${lista.nombre}</td>
                            </tr>`;
                                } else {
                                    template += `
                            <tr>
                            <td>${lista.id}</td>
                            <td>${lista.nombre}</td>
                            <td>
                                <div class="action-btns">
                                    <a onclick="modal_editar_dimension('${lista.nombre}', ${lista.id_centro_dimension3})"
                                        class="action-btn btn-edit bs-tooltip me-2"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Editar">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-edit-2">
                                            <path
                                                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z">
                                            </path>
                                        </svg>
                                    </a>
                                    <a onclick="advertencia_eliminar_dimension(${lista.id_centro_dimension3})"
                                        class="action-btn btn-delete bs-tooltip"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Borrar">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-trash-2">
                                            <polyline
                                                points="3 6 5 6 21 6">
                                            </polyline>
                                            <path
                                                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                            </path>
                                            <line x1="10" y1="11"
                                                x2="10" y2="17"></line>
                                            <line x1="14" y1="11"
                                                x2="14" y2="17"></line>
                                        </svg>
                                    </a>
                                </div>
                            </td>
                        </tr>   
                        `;
                                }
                            });
                            if (detalle == 'true') {
                                template_encabezado += `
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                            </tr>
                            <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
                            } else {
                                template_encabezado += `
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Opciones</th>
                            </tr>
                            <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;

                            }
                        } else {
                            template += `
                                <tr>
                                <td></td>
                                <td></td>
                                </tr>`;
                            template_encabezado += `
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                            </tr>
                            <tr aria-hidden="true" class="mt-3 d-block table-row-hidden"></tr>`;
                        }
                        document.getElementById('encabezado_dimensiones').innerHTML = template_encabezado;
                        document.getElementById('listado_dimensiones').innerHTML = template;
                    } catch (error) {
                        console.error('Error al procesar divisiones:', error);
                        resolve(); // Resolver aunque haya error
                    } finally {
                        resolve(res);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX al cargar divisiones:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudieron cargar las divisiones. Por favor, intente de nuevo.',
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
                resolve(); // Resolver para continuar con el flujo
            }
        });
    }).then(() => {
        listado_dimension_3_combobox();
    })
}

function listado_dimension_3_combobox() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dimension_3'
            },
            success: function (res) {
                console.log('Divisiones combobox:', res);
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener División (Combobox)',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve(); // Resolver aunque haya error
                } else if (res.includes('No hay datos')) {
                    console.log('No hay divisiones disponibles en combobox');
                    resolve(); // Resolver aunque no haya datos
                } else {
                    try {
                        let lista;
                        if (typeof res === 'string') {
                            lista = JSON.parse(res);
                        } else {
                            lista = res; // jQuery ya parseó el JSON
                        }
                        
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <option value="${lista.id}">${lista.nombre}</option>
                            `
                        });
                        document.getElementById('dimension_3').innerHTML = template;
                        selectBox = new vanillaSelectBox("#dimension_3", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "División..."
                        });
                        resolve(res);
                    } catch (error) {
                        console.error('Error al procesar combobox de divisiones:', error);
                        resolve(); // Resolver aunque haya error
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX al cargar combobox de divisiones:', error);
                resolve(); // Resolver para continuar con el flujo
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function editar_dimension_2() {
    var id_centro = sessionStorage.getItem('id_centro_costo');
    var nombre_dimension = document.getElementById('nombre_dimension');
    
    if (nombre_dimension.value != "") {
        cargando();
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            dataType: 'text',
            data: {
                quest: 'editar_centro_costo',
                id_centro,
                nombre_centro: nombre_dimension.value,
            },
            success: function (res) {
                console.log('Respuesta del servidor:', res);
                let respuesta = String(res).trim();
                
                if (respuesta.includes('Successfully')) {
                    Swal.fire({
                        title: 'Área Editada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = './centros_costo.html';
                    });
                } else {
                    Swal.fire({
                        title: 'Error al Editar Área',
                        text: 'Por favor, inténtalo de nuevo',
                        icon: 'error',
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Ok'
                    });
                    console.error('Error en la respuesta:', respuesta);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor. Por favor, intente de nuevo.',
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
            }
        });
    } else {
        Swal.fire({
            title: 'Campos Vacíos',
            text: 'Por favor, ingrese el nombre del área.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        });
    }
}

function llenar_inputs() {
    return new Promise((resolve, reject) => {
        var id_centro = sessionStorage.getItem('id_centro_costo');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_centro_costo',
                id_centro,
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Área',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve(); // Resolver aunque haya error para continuar
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Información De La Área',
                    });
                    console.log(res);
                    resolve(); // Resolver aunque no haya datos
                } else {
                    try {
                        let lista;
                        if (typeof res === 'string') {
                            lista = JSON.parse(res);
                        } else {
                            lista = res; // jQuery ya parseó el JSON
                        }
                        
                        lista.forEach(lista => {
                            nombre_dimension.value = lista.nombre;
                        });
                        resolve(res);
                    } catch (error) {
                        console.error('Error al parsear datos:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al Procesar Datos',
                            text: 'Por favor, recargue la página'
                        });
                        resolve(); // Resolver aunque haya error
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor. Por favor, intente de nuevo.',
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
                resolve(); // Resolver para continuar con el flujo
            }
        });
    }).then(() => {
        listado_dimension_3();
    })
}

function modal_editar_dimension(dimension_3, id_centro_dimension3) {
    sessionStorage.setItem('id_centro_dimension3', id_centro_dimension3)
    lista_dimension = document.getElementById('dimension_3');
    nombre_dimension_3 = document.getElementsByClassName('title');
    $('#modal_estudios').modal('show');
    document.getElementById('boton_agregar_dimension').hidden = true;
    document.getElementById('boton_editar').hidden = false;
    nombre_dimension_3[0].innerText = dimension_3;
    for (var i = 0; i < lista_dimension.options.length; i++) {
        if (lista_dimension.options[i].text == dimension_3) {
            lista_dimension.options[i].selected = true;
            return;
        }
    }
}

function activar_inputs() {
    if (detalle == 'true') {
        nombre_dimension.disabled = true;
        boton_guardar.style.display = 'none';
        boton_agregar.style.display = 'none';
    } else {
        nombre_dimension.disabled = false;
        boton_guardar.style.display = '';
        boton_agregar.style.display = '';
    }
}

function editar_dimension_3() {
    var id_centro_dimension3 = sessionStorage.getItem('id_centro_dimension3')
    var lista_dimension = document.getElementById('dimension_3');
    var id_dimension = lista_dimension.options[lista_dimension.selectedIndex].value;
    nombre_dimension = document.getElementsByClassName('title');
    
    if (nombre_dimension[0].innerText != "División...") {
        cargando();
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            dataType: 'text',
            data: {
                quest: 'editar_centro_dimension3',
                id_centro_dimension3,
                id_dimension
            },
            success: function (res) {
                console.log('Respuesta editar división:', res);
                let respuesta = String(res).trim();
                
                if (respuesta.includes('Successfully')) {
                    Swal.fire({
                        title: 'División Editada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1500
                    }).then(() => {
                        sessionStorage.removeItem('id_centro_dimension3');
                        $('#modal_estudios').modal('hide');
                        listado_dimension_3();
                    });
                } else {
                    Swal.fire({
                        title: 'Error Al Editar División',
                        text: 'Por favor, comunicate con sistemas',
                        icon: 'error',
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Ok'
                    });
                    console.error('Error en la respuesta:', respuesta);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX al editar división:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor. Por favor, intente de nuevo.',
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
            }
        });
    } else {
        Swal.fire({
            title: 'Campos Vacíos',
            text: 'Por favor, ingrese la información necesaria.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        });
    }
}

function guardar_dimension_3() {
    var lista_dimension = document.getElementById('dimension_3');
    var id_dimension_3 = lista_dimension.options[lista_dimension.selectedIndex].value;
    var nombre_dimension = document.getElementsByClassName('title');
    var id_dimension_2 = sessionStorage.getItem('id_centro_costo')
    
    if (nombre_dimension[0].innerText != "División...") {
        cargando();
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            dataType: 'text',
            data: {
                quest: 'agregar_dimension_3',
                id_dimension_3,
                id_dimension_2,
                dimension_2_existente: 'true',
            },
            success: function (res) {
                console.log('Respuesta agregar división:', res);
                let respuesta = String(res).trim();
                
                if (respuesta.includes('Successfully')) {
                    Swal.fire({
                        title: 'División Agregada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1500
                    }).then(() => {
                        $('#modal_estudios').modal('hide');
                        listado_dimension_3();
                    });
                } else {
                    Swal.fire({
                        title: 'Error al Agregar División',
                        text: 'Por favor, comunicate con sistemas',
                        icon: 'error',
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Ok'
                    });
                    console.error('Error en la respuesta:', respuesta);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX al agregar división:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor. Por favor, intente de nuevo.',
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
            }
        });
    } else {
        Swal.fire({
            title: 'División Vacía',
            text: 'Por favor, seleccione una división.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        });
    }
}


function advertencia_eliminar_dimension(id) {
    Swal.fire({
        title: '¿Esta seguro de eliminar la división?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminar_dimension_3(id);
        }
    })
}

function eliminar_dimension_3(id_centro_dimension3) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: 'eliminar_centro_dimension3',
            id_centro_dimension3
        },
        success: function (res) {
            console.log('Respuesta eliminar división:', res);
            let respuesta = String(res).trim();
            
            if (respuesta.includes('Successfully')) {
                Swal.fire({
                    title: 'División Eliminada',
                    icon: 'success',
                    showCancelButton: false,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    listado_dimension_3();
                });
            } else {
                Swal.fire({
                    title: 'Error Al Eliminar División',
                    text: 'Ha ocurrido un error al eliminar la división',
                    icon: 'error',
                    showCancelButton: false,
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
                console.error('Error en la respuesta:', respuesta);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error AJAX al eliminar división:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Por favor, intente de nuevo.',
                allowOutsideClick: false,
                showConfirmButton: true
            });
        }
    });
}

function ocultar_botones() {
    document.getElementById('boton_agregar_dimension').hidden = false;
    document.getElementById('boton_editar').hidden = true;
}

function limpiar_inputs() {
    nombre_dimension = document.getElementsByClassName('title');
    nombre_dimension[0].innerText = 'División...';
}


