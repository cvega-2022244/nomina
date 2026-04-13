// Función para obtener la fecha actual en formato localizado (día de la semana, día del mes, mes y año)
function obtenerFechaActual() {
    const fecha = new Date();
    const opcionesFecha = { day: 'numeric', month: 'long', year: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opcionesFecha);
}

function inyectarInformacion() {
    const datos = obtenerDatosFromSessionStorage();

    // Mostrar información de Guatemala
    const informacion = `Guatemala\n${obtenerFechaActual()}`;
    document.getElementById('guatemala').innerText = informacion;

    // Mostrar nombre del empleado
    const nombre_empleado = datos?.nombreCompleto || 'Nombre de empleado no disponible';
    document.getElementById('nombre_empleado').innerText = nombre_empleado;
    document.getElementById('nombre_empleado_2').innerText = nombre_empleado;

    // Mostrar fecha desde el sessionStorage
    const fecha = datos?.fecha || 'Fecha no disponible';
    document.getElementById('fecha').innerText = fecha;

    // Mostrar la firma desde el sessionStorage
    const firma = datos?.representante || 'Firma no disponible';
    document.getElementById('firma').innerText = firma;
}

// Función para obtener los datos almacenados en el sessionStorage
function obtenerDatosFromSessionStorage() {
    const datosJSON = sessionStorage.getItem('cancelacion_contrato');
    return datosJSON ? JSON.parse(datosJSON) : null;
}

// Ejemplo de uso: Llama a la función inyectarInformacion() para mostrar la información en la página
inyectarInformacion();
