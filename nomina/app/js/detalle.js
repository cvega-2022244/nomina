$(document).ready(function () {
    cargando();
    datos_empleado();
});

function formatear_numeros(numero) {
    const number = numero;
    const locale = 'es-GT'; // The locale of the user's browser

    const options = {
        style: 'currency',
        currency: 'GTQ',
        minimumIntegerDigits: 2,
    };

    const formattedNumber = new Intl.NumberFormat(locale, options).format(number);
    return formattedNumber;
}

function datos_empleado() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'datos_empleado_bono',
                id_empleado: sessionStorage.getItem("id_empleado")
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Datos Del Empleado',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Bonos Del Empleado',
                    });
                    console.log(res);
                } else {
                    try {
                        let lista = JSON.parse(res);
                        lista.forEach(lista => {
                            document.getElementById("primer_nombre").value = lista.primer_nombre;
                            document.getElementById("segundo_nombre").value = lista.segundo_nombre;
                            document.getElementById("otro_nombre").value = lista.otro_nombre;
                            document.getElementById("primer_apellido").value = lista.primer_apellido;
                            document.getElementById("segundo_apellido").value = lista.segundo_apellido;
                            document.getElementById("departamento").value = lista.nombre_departamento;
                        });
                    } catch (error) {
                        console.log(res);
                        console.log(error);
                    } finally {
                        resolve(res);
                    }
                }
            }
        });
    }).then(() => {
        datos_bono();
    })
}

function datos_bono() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'detalle_bono',
                id: sessionStorage.getItem("id_bono")
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Datos Del Bono',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Datos Del Bono',
                    });
                    console.log(res);
                } else {
                    try {
                        let lista = JSON.parse(res);
                        lista.forEach(lista => {
                            document.getElementById("empresa_labor").value = lista.empresa;
                            document.getElementById("fecha_labor").value = lista.fecha_trabajado;
                            document.getElementById("fecha_solicitud").value = lista.fecha_generado;
                            document.getElementById("horas_trabajadas").value = lista.horas;
                            if (lista.tipo_jornada == 0) {
                                document.getElementById("jornada").value = "Diurna";
                            } else {
                                document.getElementById("jornada").value = "Nocturna";
                            }
                            document.getElementById("monto").value = formatear_numeros(lista.monto);
                            document.getElementById("solicitante").value = lista.usuario;
                            document.getElementById("tarea").value = lista.tarea;
                            document.getElementById("estado").value = lista.estado;
                            if (lista.estado == "Rechazado") {
                                document.getElementById("input_obs_gerencia").style.display = "block";
                                document.getElementById("obs_gerencia").value = lista.observacion;
                            }
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