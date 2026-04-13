var aux = 0;
var aux2 = 0;
var centros_costo = new Array();

$(document).ready(function () {
    cargando();
    listado_centros_costo();
});

function listado_centros_costo() {
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
                        title: 'Error Al Obtener Área',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Área Registrados',
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

function guardar_departamento() {
    if (validar_inputs()) {
        validar_centro();
    } else {
        Swal.fire({
            title: 'Nombre o Gerente Vacio',
            html: 'Por favor, asegurese de haber llenado los campos de Nombre y Gerente correctamente.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
    }
}

function agregar_centro_costo() {
    return new Promise((resolve) => {
        if (centros_costo.length >= 1) {
            try {
                centros_costo.forEach((centro) => {
                    $.ajax({
                        url: 'php/servidor.php',
                        type: 'POST',
                        data: {
                            quest: 'agregar_centro_costo',
                            id_centro: centro[1],
                            departamento_existente: 'false'
                        },
                        success: function (resp) {
                            console.log(resp);
                            if (resp == 'Successfully') {
                                console.log('Centro Agregado');
                            } else {
                                Swal.fire({
                                    title: 'Error al Agregar Departamento :(',
                                    html: 'A ocurrido un error al agregar el dimension 1, por favor, intentalo de nuevo.',
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
            title: 'Departamento Agregado',
            html: 'El dimension 1 de agrego de manera exitosa.',
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            timer: 1200
        }).then(() => {
            window.location.href = './departamentos.html';
        });
    })
}

function validar_inputs() {
    nombre_departamento = document.getElementById('nombre_departamento');
    gerente = document.getElementById('gerente');
    if (nombre_departamento.value != "" && gerente.value != "") {
        return true;
    } else {
        return false;
    }
}

function validar_centro() {
    if (centros_costo.length <= 0) {
        Swal.fire({
            title: 'Área Vacio',
            html: 'No ha ingresado ningun dimension 2. ¿Desea Continuar?',
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
                ingresar_departamento();
            }
        });
    } else {
        cargando();
        ingresar_departamento();
    }

}

function ingresar_departamento() {
    nombre_departamento = document.getElementById('nombre_departamento');
    gerente = document.getElementById('gerente');
    
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: 'agregar_departamento',
            nombre_departamento: nombre_departamento.value,
            gerente: gerente.value,
        },
        success: function (res) {
            console.log('Respuesta del servidor:', res);
            console.log('Tipo de respuesta:', typeof res);
            
            let respuesta = String(res).trim();
            
            if (respuesta.includes('Successfully')) {
                // Si hay centros de costo para agregar
                if (centros_costo.length >= 1) {
                    agregar_centro_costo();
                } else {
                    Swal.fire({
                        title: 'Departamento Agregado',
                        html: 'El departamento se agregó de manera exitosa.',
                        icon: 'success',
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = './departamentos.html';
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error al Agregar Departamento',
                    html: 'Ha ocurrido un error al agregar el departamento, por favor, contacte con sistemas',
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
            console.error('Status:', status);
            console.error('Response:', xhr.responseText);
            
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

function guardar_centro_costo() {
    if (validar_nombre_centro_costo()) {
        lista_centros_costo = document.getElementById('centro_costo');
        id_centro_costo = lista_centros_costo.value;
        nombre_centro_costo = lista_centros_costo.options[lista_centros_costo.selectedIndex].text;
        centros_costo.push([aux, id_centro_costo, nombre_centro_costo]);
        aux = aux + 1;
        cargar_centros_costo();
        $('#modal_estudios').modal('hide');
        limpiar_inputs();
    } else {
        Swal.fire({
            title: 'Área Vacio',
            html: 'Por favor, seleccione un dimension 2.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
    }

}

function validar_nombre_centro_costo() {
    nombre_centro_costo = document.getElementsByClassName('title');
    if (nombre_centro_costo[0].innerText != "Área...") {
        return true;
    } else {
        return false;
    }
}

function limpiar_inputs() {
    listado_centros_costo();
}

function cargar_centros_costo() {
    let template = '';
    centros_costo.forEach(lista => {
        template += `
        <tr>
        <td>${lista[0]}</td>
        <td>${lista[2]}</td>
        <td>
            <div class="action-btns">
                <a onclick="modal_editar_centro(${lista[0]})"
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
                <a onclick="advertencia_eliminar_centro(${lista[0]})"
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
    document.getElementById('listado_centros_costo').innerHTML = template;
}

function modal_editar_centro(id) {
    sessionStorage.setItem('id_centro', id)
    lista_centros_costo = document.getElementById('centro_costo');
    combobox = document.getElementsByClassName('title');
    $('#modal_estudios').modal('show');
    document.getElementById('boton_agregar').hidden = true;
    document.getElementById('boton_editar').hidden = false;
    lista_centros_costo.value = centros_costo[id][1];
    combobox[0].innerText = centros_costo[id][2]
}

function editar_centro_costo() {
    if (validar_nombre_centro_costo()) {
        var id_centro = sessionStorage.getItem('id_centro')
        lista_centro = document.getElementById('centro_costo');
        nombre_centro = document.getElementsByClassName('title');
        centros_costo[id_centro][1] = lista_centro.value;
        centros_costo[id_centro][2] = nombre_centro[0].innerText;
        cargar_centros_costo();
        $('#modal_estudios').modal('hide');
        limpiar_inputs();
    } else {
        Swal.fire({
            title: 'Área Vacio',
            html: 'Por favor, seleccione un dimension 2.',
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: true,
            showCancelButton: false
        });
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

function eliminar_centro_costo(id) {
    var index = centros_costo.findIndex((centro) => centro[0] == id);
    centros_costo.splice(index, 1);
    centros_costo.forEach((centro) => {
        centro[0] = aux2;
        aux2 = aux2 + 1;
    })
    cargar_centros_costo();
    aux = aux2;
    aux2 = 0;
}

function ocultar_botones() {
    document.getElementById('boton_agregar').hidden = false;
    document.getElementById('boton_editar').hidden = true;
}