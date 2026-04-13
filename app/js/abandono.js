$(document).ready(function () {
    const fecha = new Date();
    const hoy = fecha.getDate();
    let mes_actual = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date());
    const ano_actual = fecha.getFullYear();

    const fecha_labor = new Date(sessionStorage.getItem("fecha_labor"));
    const dia = fecha_labor.getDay();
    let mes = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(fecha_labor);
    const ano = fecha_labor.getFullYear();
    
    document.getElementById("fecha_actual").innerHTML = `Guatemala, ${hoy} de ${mes_actual} del ${ano_actual}`;
    
    document.getElementById("nombre_empleado").innerHTML = `${sessionStorage.getItem("nombre_empleado")}`;
    document.getElementById("dpi").innerHTML = sessionStorage.getItem("dpi");
    document.getElementById("dia_labor").innerHTML = `${dia} de ${mes} del ${ano}`;
    document.getElementById("firma").innerHTML = sessionStorage.getItem("representante");

});