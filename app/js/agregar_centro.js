var aux = 0;
var aux2 = 0;
var dimension_3 = new Array();

$(document).ready(function () {
    cargando();
    listado_dimension_3();
});

function listado_dimension_3() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dimension_3'
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
                        title: 'No Hay División Registrados',
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
                        document.getElementById('dimension_3').innerHTML = template;
                        selectBox = new vanillaSelectBox("#dimension_3", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "División..."
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

function guardar_dimension_2() {
    if (validar_inputs()) {
        validar_dimension_3();
    } else {
        Swal.fire({
            title: 'Nombre Vacio',
            html: 'Por favor, asegurese de haber llenado el campo de Nombre correctamente.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
    }
}

function agregar_dimension_3() {
    return new Promise((resolve) => {
        if (dimension_3.length >= 1) {
            try {
                dimension_3.forEach((dimension) => {
                    $.ajax({
                        url: 'php/servidor.php',
                        type: 'POST',
                        data: {
                            quest: 'agregar_dimension_3',
                            id_dimension_3: dimension[1],
                            dimension_2_existente: 'false'
                        },
                        success: function (resp) {
                            console.log(resp);
                            if (resp == 'Successfully') {
                                console.log('División Agregada');
                            } else {
                                Swal.fire({
                                    title: 'Error al Agregar División :(',
                                    html: 'A ocurrido un error al agregar la división, por favor, comunicate con sistemas.',
                                    icon: 'warning',
                                    allowOutsideClick: false,
                                    showConfirmButton: true,
                                    showCancelButton: false
                                });
                            }
                        }
                    });
                })
            } catch (error) {
                console.log(error);
            } finally {
                resolve('success');
            }

        }
    }).then(() => {
        listado_empresas();
    })
}

function listado_empresas() {
    return new Promise((resolve) => {
        try {
            $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'lista_empresa'
                },
                success: function (resp) {
                    if (resp.includes('Query Falló')) {
                        console.log('Error Al Obtener Empresas');
                    } else if (resp.includes('No hay datos')) {
                        console.log('No hay Empresas Registradas');
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
                        lista.forEach((lista) => {
                            $.ajax({
                                url: 'php/servidor.php',
                                type: 'POST',
                                data: {
                                    quest: 'agregar_empresa_centro',
                                    centro_existente: 'false',
                                    id_empresa: lista.id
                                },
                                success: function (res) {
                                    console.log(res);
                                }
                            });
                        })
                    }
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            resolve('success');
        }
    }).then(() => {
        Swal.fire({
            title: 'Área Agregada',
            html: 'La dimension 2 se agrego de manera exitosa.',
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            timer: 1200
        }).then(() => {
            window.location.href = './centros_costo.html';
        });
    })
}

function validar_inputs() {
    nombre_dimension_2 = document.getElementById('nombre_centro');
    if (nombre_dimension_2.value != "") {
        return true;
    } else {
        return false;
    }
}

function validar_dimension_3() {
    if (dimension_3.length <= 0) {
        Swal.fire({
            title: 'División Vacio',
            html: 'No ha ingresado ningun división. ¿Desea Continuar?',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Continuar',
            cancelButtonColor: '#FF0000'
        }).then((result) => {
            if (result.isConfirmed) {
                cargando();
                ingresar_dimension_2();
            }
        });
    } else {
        cargando();
        ingresar_dimension_2();
    }

}

function ingresar_dimension_2() {
    nombre_dimension_2 = document.getElementById('nombre_centro');
    
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: 'agregar_dimension_2',
            nombre_centro: nombre_dimension_2.value
        },
        success: function (res) {
            console.log('Respuesta del servidor:', res);
            let respuesta = String(res).trim();
            
            if (respuesta.includes('Successfully')) {
                if (dimension_3.length >= 1) {
                    agregar_dimension_3();
                } else {
                    Swal.fire({
                        title: 'Área Agregada',
                        html: 'El área se agregó de manera exitosa.',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = './centros_costo.html';
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error al Agregar Área',
                    html: 'Ha ocurrido un error al agregar el área, por favor, contacte con sistemas',
                    icon: 'error',
                    allowOutsideClick: false,
                    showConfirmButton: true,
                    showCancelButton: false
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

function guardar_dimension_3() {
    if (validar_nombre_dimension_3()) {
        lista_dimension_3 = document.getElementById('dimension_3');
        id_dimencion_3 = lista_dimension_3.value;
        nombre_dimension_3 = lista_dimension_3.options[lista_dimension_3.selectedIndex].text;
        dimension_3.push([aux, id_dimencion_3, nombre_dimension_3]);
        aux = aux + 1;
        cargar_dimension_3();
        $('#modal_estudios').modal('hide');
        limpiar_inputs();
    } else {
        Swal.fire({
            title: 'División Vacio',
            html: 'Por favor, seleccione una división.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
    }

}

function validar_nombre_dimension_3() {
    nombre_dimension_3 = document.getElementsByClassName('title');
    if (nombre_dimension_3[0].innerText != "División...") {
        return true;
    } else {
        return false;
    }
}

function limpiar_inputs() {
    listado_dimension_3();
}

function cargar_dimension_3() {
    let template = '';
    dimension_3.forEach(lista => {
        template += `
        <tr>
        <td>${lista[0]}</td>
        <td>${lista[2]}</td>
        <td>
            <div class="action-btns">
                <a onclick="modal_editar_dimension(${lista[0]})"
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
                <a onclick="advertencia_eliminar_dimension(${lista[0]})"
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
    })
    document.getElementById('listado_dimension_3').innerHTML = template;
}

function modal_editar_dimension(id) {
    sessionStorage.setItem('id_centro', id)
    lista_dimension_3 = document.getElementById('dimension_3');
    combobox = document.getElementsByClassName('title');
    $('#modal_estudios').modal('show');
    document.getElementById('boton_agregar').hidden = true;
    document.getElementById('boton_editar').hidden = false;
    lista_dimension_3.value = dimension_3[id][1];
    combobox[0].innerText = dimension_3[id][2]
}

function editar_dimension_3() {
    if (validar_nombre_dimension_3()) {
        var id_dimencion_2 = sessionStorage.getItem('id_centro')
        lista_dimension_3 = document.getElementById('dimension_3');
        nombre_dimension_3 = document.getElementsByClassName('title');
        dimension_3[id_dimencion_2][1] = lista_dimension_3.value;
        dimension_3[id_dimencion_2][2] = nombre_dimension_3[0].innerText;
        cargar_dimension_3();
        $('#modal_estudios').modal('hide');
        limpiar_inputs();
    } else {
        Swal.fire({
            title: 'División Vacio',
            html: 'Por favor, seleccione una división.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
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

function eliminar_dimension_3(id) {
    var index = dimension_3.findIndex((dimension) => dimension[0] == id);
    dimension_3.splice(index, 1);
    dimension_3.forEach((dimension) => {
        dimension[0] = aux2;
        aux2 = aux2 + 1;
    })
    cargar_dimension_3();
    aux = aux2;
    aux2 = 0;
}

function ocultar_botones() {
    document.getElementById('boton_agregar').hidden = false;
    document.getElementById('boton_editar').hidden = true;
}