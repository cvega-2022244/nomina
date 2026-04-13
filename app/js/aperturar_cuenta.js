$(document).ready(function () {
    const fecha = new Date();
    const hoy = fecha.getDate();
    let mes_actual = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date());
    const ano_actual = fecha.getFullYear();
    
    document.getElementById("fecha_actual").innerHTML = `Guatemala, ${hoy} de ${mes_actual} del ${ano_actual}`;
    document.getElementById("nombre_banco").innerHTML = sessionStorage.getItem("banco");
    document.getElementById("nombre_empleado").innerHTML = `Monetaria Planilla a nombre de ${sessionStorage.getItem("nombre_empleado").toUpperCase()}`;
    document.getElementById("dpi").innerHTML = `${sessionStorage.getItem("dpi").toUpperCase()}`;
    document.getElementById("representante").innerHTML = `${sessionStorage.getItem("representante")}`;
});