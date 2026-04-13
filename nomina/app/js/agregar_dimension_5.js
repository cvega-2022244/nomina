function guardar_dimension_5() {
    if (validar_inputs()) {
        ingresar_dimension_5();
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
    nombre_dimension_5 = document.getElementById('nombre_dimension');
    if (nombre_dimension_5.value != "") {
        return true;
    } else {
        return false;
    }
}

function ingresar_dimension_5() {
    return new Promise((resolve) => {
        nombre_dimension_5 = document.getElementById('nombre_dimension');
        $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_dimension_5',
                nombre_dimension: nombre_dimension_5.value
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
                        title: 'Error al Agregar Nivel 5 :(',
                        html: 'A ocurrido un error al agregar la nivel 5, por favor, comunicate con sistemas',
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
        Swal.fire({
            title: 'Nivel 5 Agregada',
            html: 'La nivel 5 se agrego de manera exitosa.',
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            showCancelButton: false,
            timer: 1200
        }).then(() => {
            window.location.href = './dimension_5.html';
        });
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
        },
        timer: 1300
    });
}