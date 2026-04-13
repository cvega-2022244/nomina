//------------Inputs---------------//
nombre_dimension = document.getElementById('nombre_dimension');
boton_guardar = document.getElementById('boton_guardar');
boton_agregar = document.getElementById('boton_agregar');
//------------Inputs---------------//
var detalle = sessionStorage.getItem('detalle_dimension_4');

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

function listado_dimension_5() {
    return new Promise((resolve, reject) => {
        var id_dimension = sessionStorage.getItem('id_dimension_4');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dimension4_dimension5',
                id_dimension
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Nivel 5',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve(); // Resolver aunque haya error
                } else if (res.includes('No hay datos')) {
                    console.log('No hay nivel 5 registradas');
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
                                    <a onclick="modal_editar_dimension('${lista.nombre}', ${lista.id_dimension4_dimension5})"
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
                                    <a onclick="advertencia_eliminar_dimension(${lista.id_dimension4_dimension5})"
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
                        console.error('Error al procesar nivel 5:', error);
                        resolve(); // Resolver aunque haya error
                    } finally {
                        resolve(res);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX al cargar nivel 5:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudieron cargar los niveles 5. Por favor, intente de nuevo.',
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
                resolve(); // Resolver para continuar con el flujo
            }
        });
    }).then(() => {
        listado_dimension_5_combobox();
    })
}

function listado_dimension_5_combobox() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dimension_5'
            },
            success: function (res) {
                console.log('Nivel 5 combobox:', res);
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Nivel 5 (Combobox)',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve(); // Resolver aunque haya error
                } else if (res.includes('No hay datos')) {
                    console.log('No hay nivel 5 disponibles en combobox');
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
                        document.getElementById('dimension_5').innerHTML = template;
                        selectBox = new vanillaSelectBox("#dimension_5", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Nivel 5..."
                        });
                        resolve(res);
                    } catch (error) {
                        console.error('Error al procesar combobox de nivel 5:', error);
                        resolve(); // Resolver aunque haya error
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX al cargar combobox de nivel 5:', error);
                resolve(); // Resolver para continuar con el flujo
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function editar_dimension_4() {
    var id_dimension = sessionStorage.getItem('id_dimension_4');
    var nombre_dimension = document.getElementById('nombre_dimension');
    
    if (nombre_dimension.value != "") {
        cargando();
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            dataType: 'text',
            data: {
                quest: 'editar_dimension_4',
                id_dimension,
                nombre_dimension: nombre_dimension.value,
            },
            success: function (res) {
                console.log('Respuesta del servidor:', res);
                let respuesta = String(res).trim();
                
                if (respuesta.includes('Successfully')) {
                    Swal.fire({
                        title: 'Sub División Editada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = './dimension_4.html';
                    });
                } else {
                    Swal.fire({
                        title: 'Error al Editar Sub División',
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
            text: 'Por favor, ingrese el nombre de la sub división.',
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
        var id_dimension = sessionStorage.getItem('id_dimension_4');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_dimension_4',
                id_dimension,
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Sub División',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                    resolve(); // Resolver aunque haya error
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Información De La Sub División',
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
        listado_dimension_5();
    })
}

function modal_editar_dimension(dimension_5, id_dimension4_dimension5) {
    sessionStorage.setItem('id_dimension4_dimension5', id_dimension4_dimension5)
    lista_dimension = document.getElementById('dimension_5');
    nombre_dimension_5 = document.getElementsByClassName('title');
    $('#modal_estudios').modal('show');
    document.getElementById('boton_agregar_dimension').hidden = true;
    document.getElementById('boton_editar').hidden = false;
    nombre_dimension_5[0].innerText = dimension_5;
    for (var i = 0; i < lista_dimension.options.length; i++) {
        if (lista_dimension.options[i].text == dimension_5) {
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

function editar_dimension_5() {
    var id_dimension4_dimension5 = sessionStorage.getItem('id_dimension4_dimension5');
    var lista_dimension = document.getElementById('dimension_5');
    var id_dimension = lista_dimension.options[lista_dimension.selectedIndex].value;
    nombre_dimension = document.getElementsByClassName('title');
    if (nombre_dimension[0].innerText != "Nivel 5...") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'editar_dimension4_dimension5',
                id_dimension4_dimension5,
                id_dimension
            },
            success: function (res) {
                if (res == 'Successfully') {
                    Swal.fire({
                        title: 'Nivel 5 Editada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1200
                    }).then(() => {
                        sessionStorage.removeItem('id_dimension4_dimension5');
                        listado_dimension_5();
                        $('#modal_estudios').modal('hide');
                    });
                } else {
                    console.log(res);
                    Swal.fire({
                        title: 'Error al Editar Nivel 5',
                        text: 'Por favor, comunicate con sistemas',
                        icon: 'error',
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confimButtonText: 'Ok'
                    })
                }
            }
        });
    } else {
        Swal.fire({
            title: 'Campos Vacios',
            text: 'Por favor, ingrese la información necesaria.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        })
    }
}

function guardar_dimension_5() {
    var lista_dimension = document.getElementById('dimension_5');
    var id_dimension_5 = lista_dimension.options[lista_dimension.selectedIndex].value;
    var nombre_dimension = document.getElementsByClassName('title');
    var id_dimension_4 = sessionStorage.getItem('id_dimension_4')
    if (nombre_dimension[0].innerText != "Nivel 5...") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'agregar_dimension_5',
                id_dimension_4,
                id_dimension_5,
                dimension_4_existente: 'true',
            },
            success: function (res) {
                if (res == 'Successfully') {
                    Swal.fire({
                        title: 'Nivel 5 Agregada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1200
                    }).then(() => {
                        listado_dimension_5();
                        $('#modal_estudios').modal('hide');
                    });
                } else {
                    Swal.fire({
                        title: 'Error al Agregar Nivel 5',
                        text: 'Por favor, comunicate con sistemas',
                        icon: 'error',
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confimButtonText: 'Ok'
                    })
                }
            }
        });
    } else {
        Swal.fire({
            title: 'Nivel 5 Vacia',
            text: 'Por favor, seleccione una nivel 5.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        })
    }
}


function advertencia_eliminar_dimension(id) {
    Swal.fire({
        title: '¿Esta seguro de eliminar la nivel 5?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminar_dimension_5(id);
        }
    })
}

function eliminar_dimension_5(id_dimension4_dimension5) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: {
            quest: 'eliminar_dimesion4_dimension5',
            id_dimension4_dimension5
        },
        success: function (res) {
            if (res == "Successfully") {
                Swal.fire({
                    title: 'Nivel 5 Eliminada',
                    icon: 'success',
                    showCancelButton: false,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 1200
                }).then(() => {
                    listado_dimension_5();
                })
            }
        }
    });
}

function ocultar_botones() {
    document.getElementById('boton_agregar_dimension').hidden = false;
    document.getElementById('boton_editar').hidden = true;
}

function limpiar_inputs() {
    nombre_dimension = document.getElementsByClassName('title');
    nombre_dimension[0].innerText = 'Nivel 5...';
}


