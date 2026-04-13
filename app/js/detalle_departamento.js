//------------Inputs---------------//
nombre_depto = document.getElementById('nombre_departamento');
gerente = document.getElementById('gerente');
boton_agregar = document.getElementById('boton_agregar');
boton_guardar = document.getElementById('boton_guardar');
//------------Inputs---------------//

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

function listado_centros_costo_combobox() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_centros_costo'
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Áreas',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Áreas Registrados',
                        timer: 1300
                    }).then(() => {
                        resolve(0);
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
                        let template = '';
                        lista.forEach(lista => {
                            template += `
                            <option value="${lista.id}">${lista.nombre}</option>
                            `
                        });
                        document.getElementById('centro_costo').innerHTML = template;
                        selectBox = new vanillaSelectBox("#centro_costo", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Área..."
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

function listado_centros_costo() {
    return new Promise((resolve) => {
        var detalle = sessionStorage.getItem('detalle_depto');
        var id_departamento = sessionStorage.getItem('id_departamento');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_centros_costo_depto',
                id_departamento
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Áreas',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Áreas Registrados',
                    });
                    console.log(res);
                } else {
                    try {
                        let template = "";
                        let template_encabezado = "";
                        if (res != 'No') {
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
                                    <a onclick="modal_editar_centro('${lista.nombre}', ${lista.id_departamento_centro})"
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
                                    <a onclick="advertencia_eliminar_centro(${lista.id_departamento_centro})"
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

                        document.getElementById('encabezado_centro').innerHTML = template_encabezado;
                        document.getElementById('listado_centros_costo').innerHTML = template;
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                }
            }
        });
    }).then(() => {
        listado_centros_costo_combobox();
    })
}

function modal_editar_centro(centro_costo, id_depto_centro) {
    sessionStorage.setItem('id_depto_centro', id_depto_centro)
    lista_centro = document.getElementById('centro_costo');
    nombre_centro_costo = document.getElementsByClassName('title');
    $('#modal_estudios').modal('show');
    document.getElementById('boton_agregar_centro').hidden = true;
    document.getElementById('boton_editar').hidden = false;
    nombre_centro_costo[0].innerText = centro_costo;
    for (var i = 0; i < lista_centro.options.length; i++) {
        if (lista_centro.options[i].text == centro_costo) {
            lista_centro.options[i].selected = true;
            return;
        }
    }
}

function editar_departamento() {
    var id_departamento = sessionStorage.getItem('id_departamento');
    var nombre_departamento = document.getElementById('nombre_departamento');
    var gerente = document.getElementById('gerente');
    if (nombre_departamento.value != "" && gerente.value != "") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'editar_departamento',
                id_departamento,
                nombre_departamento: nombre_departamento.value,
                gerente: gerente.value
            },
            success: function (res) {
                if (res == 'Successfully') {
                    Swal.fire({
                        title: 'Departamento Editado Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1200
                    }).then(() => {
                        llenar_inputs();
                    });
                } else {
                    Swal.fire({
                        title: 'Error al Editar Departamento',
                        text: 'Por favor, intentalo de nuevo',
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

function llenar_inputs() {
    return new Promise((resolve) => {
        var id_departamento = sessionStorage.getItem('id_departamento');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_departamento',
                id_departamento,
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Departamento',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Datos Del Departamento',
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
                        lista.forEach(lista => {
                            nombre_depto.value = lista.nombre;
                            gerente.value = lista.gerente;
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
        listado_centros_costo();
    })
}

function editar_centro_costo() {
    var id_depto_centro = sessionStorage.getItem('id_depto_centro')
    var lista_centro = document.getElementById('centro_costo');
    var id_centro = lista_centro.options[lista_centro.selectedIndex].value;
    nombre_centro = document.getElementsByClassName('title');
    if (nombre_centro[0].innerText != "Área...") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'editar_departamento_centro',
                id_depto_centro,
                id_centro
            },
            success: function (res) {
                if (res == 'Successfully') {
                    Swal.fire({
                        title: 'Área Editado Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1200
                    }).then(() => {
                        sessionStorage.removeItem('id_depto_centro')
                        listado_centros_costo();
                        $('#modal_estudios').modal('hide');
                    });
                } else {
                    Swal.fire({
                        title: 'Error Al Editar Área',
                        text: 'Por favor, intentalo de nuevo',
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

function guardar_centro_costo() {
    var lista_centro = document.getElementById('centro_costo');
    var id_centro = lista_centro.options[lista_centro.selectedIndex].value;
    var nombre_centro = document.getElementsByClassName('title');
    var id_departamento = sessionStorage.getItem('id_departamento')
    if (nombre_centro[0].innerText != "Área...") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'agregar_centro_costo',
                id_centro,
                id_departamento,
                departamento_existente: 'true',
            },
            success: function (res) {
                if (res == 'Successfully') {
                    Swal.fire({
                        title: 'Área Agregado Exitosamente',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1200
                    }).then(() => {
                        listado_centros_costo();
                        $('#modal_estudios').modal('hide');
                    });
                } else {
                    Swal.fire({
                        title: 'Error al Agregar Área',
                        text: 'Por favor, intentalo de nuevo',
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
            title: 'Centro Vacio',
            text: 'Por favor, seleccione un dimension 2.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok'
        })
    }
}


function advertencia_eliminar_centro(id) {
    Swal.fire({
        title: '¿Esta seguro de eliminar el dimension 2?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminar_centro_costo(id);
        }
    })
}

function eliminar_centro_costo(id_depto_centro) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: {
            quest: 'eliminar_departamento_centro',
            id_depto_centro
        },
        success: function (res) {
            if (res == "Successfully") {
                Swal.fire({
                    title: 'Área Eliminado',
                    icon: 'success',
                    showCancelButton: false,
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 1200
                }).then(() => {
                    listado_centros_costo();
                })
            }
        }
    });
}

function activar_inputs() {
    var detalle = sessionStorage.getItem('detalle_depto');
    if (detalle == 'true') {
        nombre_depto.disabled = true;
        gerente.disabled = true;
        boton_guardar.style.display = 'none';
        boton_agregar.style.display = 'none';
    } else {
        nombre_depto.disabled = false;
        gerente.disabled = false;
        boton_guardar.style.display = '';
        boton_agregar.style.display = '';
    }
}

function ocultar_botones() {
    document.getElementById('boton_agregar_centro').hidden = false;
    document.getElementById('boton_editar').hidden = true;
}

function limpiar_inputs() {
    nombre_centro_costo = document.getElementsByClassName('title');
    nombre_centro_costo[0].innerText = 'Área...';
}
