var aux = 0;
var aux2 = 0;
var dimension_5 = new Array();

$(document).ready(function () {
    cargando();
    listado_dimension_5();
});

function listado_dimension_5() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_dimension_5'
            },
            success: function (res) {
                console.log('Respuesta nivel 5:', res);
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
                        console.error('Error al procesar nivel 5:', error);
                        resolve(); // Resolver aunque haya error
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error AJAX al cargar nivel 5:', error);
                resolve(); // Resolver para continuar con el flujo
            }
        });
    }).then(() => {
        Swal.close();
    })
}

function guardar_dimension_4() {
    if (validar_inputs()) {
        validar_dimension_5();
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
    nombre_dimension_4 = document.getElementById('nombre_dimension');
    if (nombre_dimension_4.value != "") {
        return true;
    } else {
        return false;
    }
}

function validar_dimension_5() {
    if (dimension_5.length <= 0) {
        Swal.fire({
            title: 'Nivel 5 Vacio',
            html: 'No ha ingresado ninguna nivel 5. ¿Desea Continuar?',
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
                ingresar_dimension_4();
            }
        });
    } else {
        cargando();
        ingresar_dimension_4();
    }

}

function ingresar_dimension_4() {
    nombre_dimension_4 = document.getElementById('nombre_dimension');
    
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: 'ingresar_dimension_4',
            nombre_dimension: nombre_dimension_4.value
        },
        success: function (res) {
            console.log('Respuesta del servidor:', res);
            let respuesta = String(res).trim();
            
            if (respuesta.includes('Successfully')) {
                if (dimension_5.length >= 1) {
                    agregar_dimension_5();
                } else {
                    Swal.fire({
                        title: 'Sub División Agregada',
                        html: 'La sub división se agregó de manera exitosa.',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = './dimension_4.html';
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error al Agregar Sub División',
                    html: 'Ha ocurrido un error al agregar la sub división, por favor, contacte con sistemas',
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

function agregar_dimension_5() {
    return new Promise((resolve) => {
        if (dimension_5.length >= 1) {
            try {
                dimension_5.forEach((dimension) => {
                    $.ajax({
                        url: 'php/servidor.php',
                        type: 'POST',
                        data: {
                            quest: 'agregar_dimension_5',
                            id_dimension_5: dimension[1],
                            dimension_4_existente: 'false'
                        },
                        success: function (resp) {
                            console.log(resp);
                            if (resp == 'Successfully') {
                                console.log('Nivel 5 Agregada');
                            } else {
                                Swal.fire({
                                    title: 'Error al Agregar Nivel 5 :(',
                                    html: 'A ocurrido un error al agregar la nivel 5, por favor, comunicate con sistemas.',
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
            title: 'Sub División Agregada',
            html: 'La sub división se agrego de manera exitosa.',
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            timer: 1200
        }).then(() => {
            window.location.href = './dimension_4.html';
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

function guardar_dimension_5() {
    if (validar_nombre_dimension_5()) {
        lista_dimension_5 = document.getElementById('dimension_5');
        id_dimencion_5 = lista_dimension_5.value;
        nombre_dimension_5 = lista_dimension_5.options[lista_dimension_5.selectedIndex].text;
        dimension_5.push([aux, id_dimencion_5, nombre_dimension_5]);
        aux = aux + 1;
        cargar_dimension_5();
        $('#modal_estudios').modal('hide');
        limpiar_inputs();
    } else {
        Swal.fire({
            title: 'Nivel 5 Vacio',
            html: 'Por favor, seleccione una nivel 5.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
    }

}

function validar_nombre_dimension_5() {
    nombre_dimension_5 = document.getElementsByClassName('title');
    if (nombre_dimension_5[0].innerText != "Nivel 5...") {
        return true;
    } else {
        return false;
    }
}

function limpiar_inputs() {
    listado_dimension_5();
}

function cargar_dimension_5() {
    let template = '';
    dimension_5.forEach(lista => {
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
    document.getElementById('listado_dimension_5').innerHTML = template;
}

function modal_editar_dimension(id) {
    sessionStorage.setItem('id_dimension_4', id)
    lista_dimension_5 = document.getElementById('dimension_5');
    combobox = document.getElementsByClassName('title');
    $('#modal_estudios').modal('show');
    document.getElementById('boton_agregar').hidden = true;
    document.getElementById('boton_editar').hidden = false;
    lista_dimension_5.value = dimension_5[id][1];
    combobox[0].innerText = dimension_5[id][2]
}

function editar_dimension_5() {
    if (validar_nombre_dimension_5()) {
        var id_dimencion_3 = sessionStorage.getItem('id_dimension_4');
        lista_dimension_5 = document.getElementById('dimension_5');
        nombre_dimension_5 = document.getElementsByClassName('title');
        dimension_5[id_dimencion_3][1] = lista_dimension_5.value;
        dimension_5[id_dimencion_3][2] = nombre_dimension_5[0].innerText;
        cargar_dimension_5();
        $('#modal_estudios').modal('hide');
        limpiar_inputs();
    } else {
        Swal.fire({
            title: 'Nivel 5 Vacio',
            html: 'Por favor, seleccione una nivel 5.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
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

function eliminar_dimension_5(id) {
    var index = dimension_5.findIndex((dimension) => dimension[0] == id);
    dimension_5.splice(index, 1);
    dimension_5.forEach((dimension) => {
        dimension[0] = aux2;
        aux2 = aux2 + 1;
    })
    cargar_dimension_5();
    aux = aux2;
    aux2 = 0;
}

function ocultar_botones() {
    document.getElementById('boton_agregar').hidden = false;
    document.getElementById('boton_editar').hidden = true;
}