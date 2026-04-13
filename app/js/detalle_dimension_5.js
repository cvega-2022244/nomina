//------------Inputs---------------//
nombre_dimension = document.getElementById('nombre_dimension');
boton_guardar = document.getElementById('boton_guardar');
//------------Inputs---------------//
var detalle = sessionStorage.getItem('detalle_dimension_5');

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

function editar_dimension_5() {
    var id_dimension = sessionStorage.getItem('id_dimension_5');
    var nombre_dimension = document.getElementById('nombre_dimension');
    if (nombre_dimension.value != "") {
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'editar_dimension_5',
                id_dimension,
                nombre_dimension: nombre_dimension.value,
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
                        llenar_inputs();
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
        var id_dimension = sessionStorage.getItem('id_dimension_5');
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_dimension_5',
                id_dimension,
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Nivel 5',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Información De La Nivel 5',
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
        Swal.close();
    })
}

function activar_inputs() {
    if (detalle == 'true') {
        nombre_dimension.disabled = true;
        boton_guardar.style.display = 'none';
    } else {
        nombre_dimension.disabled = false;
        boton_guardar.style.display = '';
    }
}


