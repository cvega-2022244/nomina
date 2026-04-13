const objetoString = sessionStorage.getItem('datos_constancia');
const miObjeto = JSON.parse(objetoString);
console.log(miObjeto);

document.getElementById("nombre_empleado").innerHTML = miObjeto.nombre_empleado;
document.getElementById("dpi").innerHTML = miObjeto.dpi;
document.getElementById("fecha_inicio").innerHTML = formato_fechas(miObjeto.fecha_inicio);
document.getElementById("fecha_final").innerHTML = formato_fechas(miObjeto.fecha_final);
document.getElementById("puesto").innerHTML = miObjeto.puesto;
document.getElementById("area").innerHTML = miObjeto.area;
document.getElementById("salario").innerHTML = miObjeto.salario_ordinario;
document.getElementById("bonificacion").innerHTML = miObjeto.bonficacion;
document.getElementById("total").innerHTML = (miObjeto.salario_ordinario + miObjeto.bonficacion);
document.getElementById("firma").innerHTML = miObjeto.representante;

function formato_fechas(fecha_x){
    const fecha = new Date(fecha_x);

    // Obtenemos el día del mes
    const dia = fecha.getDate();

    // Obtenemos el mes (los meses en JavaScript van de 0 a 11, por lo que sumamos 1)
    const mes = fecha.getMonth() + 1;

    // Obtenemos el año
    const anio = fecha.getFullYear();

    // Creamos un objeto Date con el formato deseado
    const nuevaFecha = new Date(anio, mes - 1, dia);

    // Obtenemos el nombre del mes en formato texto
    const nombreMes = nuevaFecha.toLocaleString('es-ES', { month: 'long' });

    // Creamos la fecha en el formato deseado
    const fechaFinal = `${dia} de ${nombreMes} del ${anio}`;

    return fechaFinal; // Output: 26 de julio del 2023
}