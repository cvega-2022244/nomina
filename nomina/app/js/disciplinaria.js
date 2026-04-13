$(document).ready(function () {
    var id_empleado = sessionStorage.getItem("id_empleado");
    datos_empleado(id_empleado);
})

function datos_empleado(id_empleado) {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'datos_empleado_disciplinaria',
            id_empleado: id_empleado
        },
        success: function (res) {
            if (res.includes('Query Falló')) {
                console.log('Error al obtener datos del empleado. ' + res);
            } else if (res.includes('No hay datos')) {
                console.log('No hay datos del empleado. ' + res);
            } else {
                var nombre = document.getElementById('nombre');
                var cargo = document.getElementById('cargo');
                var empresa = document.getElementById('empresa');
                let lista = JSON.parse(res);
                nombre.innerHTML = lista[0].nombre;
                cargo.innerHTML = lista[0].cargo;
                empresa.innerHTML = lista[0].empresa;
            }
        }
    });
}