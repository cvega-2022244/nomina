var aux = 0;
var aux2 = 0;
var dimension_4 = new Array();

$(document).ready(function () {
    cargando();
    listado_dimension_4();
});

function listado_dimension_4() {
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
                        title: 'Error Al Obtener Sub División',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Sub División Registrados',
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

function guardar_dimension_3() {
    if (validar_inputs()) {
        validar_dimension_4();
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

function validar_inputs() {
    nombre_dimension_3 = document.getElementById('nombre_dimension');
    if (nombre_dimension_3.value != "") {
        return true;
    } else {
        return false;
    }
}

function validar_dimension_4() {
    if (dimension_4.length <= 0) {
        Swal.fire({
            title: 'Sub División Vacio',
            html: 'No ha ingresado ningun sub división. ¿Desea Continuar?',
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
                ingresar_dimension_3();
            }
        });
    } else {
        cargando();
        ingresar_dimension_3();
    }

}

function ingresar_dimension_3() {
    return new Promise((resolve) => {
        nombre_dimension_3 = document.getElementById('nombre_dimension');
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_dimension_3',
                nombre_dimension: nombre_dimension_3.value
            },
            success: function (res) {
                if (res.includes('Successfully')) {
                    try {
                        console.log(res);
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                } else {
                    Swal.fire({
                        title: 'Error al Agregar División :(',
                        html: 'A ocurrido un error al agregar la división, por favor, comunicate con sistemas',
                        icon: 'warning',
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        showCancelButton: false
                    });
                    console.log(res);
                }
            }
        });
    }).then(() => {
        if (dimension_4.length >= 1) {
            agregar_dimension_4();
        } else {
            Swal.fire({
                title: 'División Agregada',
                html: 'La división se agrego de manera exitosa.',
                icon: 'success',
                allowOutsideClick: false,
                showConfirmButton: false,
                showCancelButton: false,
                timer: 1200
            }).then(() => {
                window.location.href = './dimension_3.html';
            });
        }
    });
}

function agregar_dimension_4() {
    return new Promise((resolve) => {
        if (dimension_4.length >= 1) {
            try {
                dimension_4.forEach((dimension) => {
                    $.ajax({
                        url: 'php/servidor.php',
                        type: 'POST',
                        data: {
                            quest: 'agregar_dimension_4',
                            id_dimension_4: dimension[1],
                            dimension_3_existente: 'false'
                        },
                        success: function (resp) {
                            console.log(resp);
                            if (resp == 'Successfully') {
                                console.log('Sub División Agregada');
                            } else {
                                Swal.fire({
                                    title: 'Error al Agregar Sub División :(',
                                    html: 'A ocurrido un error al agregar la sub división, por favor, comunicate con sistemas.',
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
        Swal.fire({
            title: 'División Agregada',
            html: 'La división se agrego de manera exitosa.',
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            timer: 1200
        }).then(() => {
            window.location.href = './dimension_3.html';
        });
    })
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

function guardar_dimension_4() {
    if (validar_nombre_dimension_4()) {
        lista_dimension_4 = document.getElementById('dimension_4');
        id_dimencion_4 = lista_dimension_4.value;
        nombre_dimension_4 = lista_dimension_4.options[lista_dimension_4.selectedIndex].text;
        dimension_4.push([aux, id_dimencion_4, nombre_dimension_4]);
        aux = aux + 1;
        cargar_dimension_4();
        $('#modal_estudios').modal('hide');
        limpiar_inputs();
    } else {
        Swal.fire({
            title: 'Sub División Vacio',
            html: 'Por favor, seleccione una sub división.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
    }

}

function validar_nombre_dimension_4() {
    nombre_dimension_4 = document.getElementsByClassName('title');
    if (nombre_dimension_4[0].innerText != "Sub División...") {
        return true;
    } else {
        return false;
    }
}

function limpiar_inputs() {
    listado_dimension_4();
}

function cargar_dimension_4() {
    let template = '';
    dimension_4.forEach(lista => {
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
    document.getElementById('listado_dimension_4').innerHTML = template;
}

function modal_editar_dimension(id) {
    sessionStorage.setItem('id_dimension_3', id)
    lista_dimension_4 = document.getElementById('dimension_4');
    combobox = document.getElementsByClassName('title');
    $('#modal_estudios').modal('show');
    document.getElementById('boton_agregar').hidden = true;
    document.getElementById('boton_editar').hidden = false;
    lista_dimension_4.value = dimension_4[id][1];
    combobox[0].innerText = dimension_4[id][2]
}

function editar_dimension_4() {
    if (validar_nombre_dimension_4()) {
        var id_dimencion_3 = sessionStorage.getItem('id_dimension_3');
        lista_dimension_4 = document.getElementById('dimension_4');
        nombre_dimension_4 = document.getElementsByClassName('title');
        dimension_4[id_dimencion_3][1] = lista_dimension_4.value;
        dimension_4[id_dimencion_3][2] = nombre_dimension_4[0].innerText;
        cargar_dimension_4();
        $('#modal_estudios').modal('hide');
        limpiar_inputs();
    } else {
        Swal.fire({
            title: 'Sub División Vacio',
            html: 'Por favor, seleccione una sub división.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
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

function eliminar_dimension_4(id) {
    var index = dimension_4.findIndex((dimension) => dimension[0] == id);
    dimension_4.splice(index, 1);
    dimension_4.forEach((dimension) => {
        dimension[0] = aux2;
        aux2 = aux2 + 1;
    })
    cargar_dimension_4();
    aux = aux2;
    aux2 = 0;
}

function ocultar_botones() {
    document.getElementById('boton_agregar').hidden = false;
    document.getElementById('boton_editar').hidden = true;
}