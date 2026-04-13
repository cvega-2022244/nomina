//------------Inputs---------------//
nombre_dimension = document.getElementById('nombre_dimension');
boton_guardar = document.getElementById('boton_guardar');
boton_agregar = document.getElementById('boton_agregar');
//------------Inputs---------------//
var detalle = sessionStorage.getItem('detalle_dimension_3');

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

function listado_dimension_4() {
    return new Promise((resolve) => {
        var id_dimension = sessionStorage.getItem('id_dimension_3');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dimension3_dimension4',
                id_dimension
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Sub División',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Sub División Registradas',
                        timer: 1300
                    }).then(() => {
                        resolve(0);
                    });
                    console.log(res);
                } else {
                    try {
                        let template = "";
                        let template_encabezado = "";
                        if (res != 0) {
                            let lista = JSON.parse(res);
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
                                    <a onclick="modal_editar_dimension('${lista.nombre}', ${lista.id_dimension3_dimension4})"
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
                                    <a onclick="advertencia_eliminar_dimension(${lista.id_dimension3_dimension4})"
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
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                }
            }
        });
    }).then(() => {
        listado_dimension_4_combobox();
    })
}

function listado_dimension_4_combobox() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dimension_4'
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Sub División (Combobox)',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Sub División Registradas (Combobox)',
                    });
                    console.log(res);
                } else {
                    try {
                        let lista = JSON.parse(res);
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <option value="${lista.id}">${lista.nombre}</option>
                            `
                        });
                        document.getElementById('dimension_4').innerHTML = template;
                        selectBox = new vanillaSelectBox("#dimension_4", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Sub División..."
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

function editar_dimension_3() {
    var id_dimension = sessionStorage.getItem('id_dimension_3');
    var nombre_dimension = document.getElementById('nombre_dimension');
    if (nombre_dimension.value != "") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'editar_dimension_3',
                id_dimension,
                nombre_dimension: nombre_dimension.value,
            },
            success: function (res) {
                if (res == 'Successfully') {
                    Swal.fire({
                        title: 'División Editada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1200
                    }).then(() => {
                        llenar_inputs();
                    });
                } else {
                    console.log(res);
                    Swal.fire({
                        title: 'Error al Editar División',
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
            text: 'Por favor, ingrese el nombre de la dimension.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        })
    }
}

function llenar_inputs() {
    return new Promise((resolve) => {
        var id_dimension = sessionStorage.getItem('id_dimension_3');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_dimension_3',
                id_dimension,
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener División',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Información De La División',
                    });
                    console.log(res);
                } else {
                    try {
                        let lista = JSON.parse(res);
                        lista.forEach(lista => {
                            nombre_dimension.value = lista.nombre;
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
        listado_dimension_4();
    })
}

function modal_editar_dimension(dimension_4, id_dimension3_dimension4) {
    sessionStorage.setItem('id_dimension3_dimension4', id_dimension3_dimension4)
    lista_dimension = document.getElementById('dimension_4');
    nombre_dimension_4 = document.getElementsByClassName('title');
    $('#modal_estudios').modal('show');
    document.getElementById('boton_agregar_dimension').hidden = true;
    document.getElementById('boton_editar').hidden = false;
    nombre_dimension_4[0].innerText = dimension_4;
    for (var i = 0; i < lista_dimension.options.length; i++) {
        if (lista_dimension.options[i].text == dimension_4) {
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

function editar_dimension_4() {
    var id_dimension3_dimension4 = sessionStorage.getItem('id_dimension3_dimension4');
    var lista_dimension = document.getElementById('dimension_4');
    var id_dimension = lista_dimension.options[lista_dimension.selectedIndex].value;
    nombre_dimension = document.getElementsByClassName('title');
    console.log(id_dimension3_dimension4);
    if (nombre_dimension[0].innerText != "Sub División...") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'editar_dimension3_dimension4',
                id_dimension3_dimension4,
                id_dimension
            },
            success: function (res) {
                if (res == 'Successfully') {
                    Swal.fire({
                        title: 'Sub División Editada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1200
                    }).then(() => {
                        sessionStorage.removeItem('id_dimension3_dimension4');
                        listado_dimension_4();
                        $('#modal_estudios').modal('hide');
                    });
                } else {
                    console.log(res);
                    Swal.fire({
                        title: 'Error al Editar Sub División',
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

function guardar_dimension_4() {
    var lista_dimension = document.getElementById('dimension_4');
    var id_dimension_4 = lista_dimension.options[lista_dimension.selectedIndex].value;
    var nombre_dimension = document.getElementsByClassName('title');
    var id_dimension_3 = sessionStorage.getItem('id_dimension_3')
    if (nombre_dimension[0].innerText != "Sub División...") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'agregar_dimension_4',
                id_dimension_3,
                id_dimension_4,
                dimension_3_existente: 'true',
            },
            success: function (res) {
                if (res == 'Successfully') {
                    Swal.fire({
                        title: 'Sub División Agregada Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1200
                    }).then(() => {
                        listado_dimension_4();
                        $('#modal_estudios').modal('hide');
                    });
                } else {
                    Swal.fire({
                        title: 'Error al Agregar Sub División',
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
            title: 'Sub División Vacia',
            text: 'Por favor, seleccione una sub división.',
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
        title: '¿Esta seguro de eliminar la sub división?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminar_dimension_4(id);
        }
    })
}

function eliminar_dimension_4(id_dimension3_dimension4) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: {
            quest: 'eliminar_dimesion3_dimension4',
            id_dimension3_dimension4
        },
        success: function (res) {
            if (res == "Successfully") {
                Swal.fire({
                    title: 'Sub División Eliminada',
                    icon: 'success',
                    showCancelButton: false,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 1200
                }).then(() => {
                    listado_dimension_4();
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
    nombre_dimension[0].innerText = 'Sub División...';
}


