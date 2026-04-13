$(document).ready(function () {
    var id_empleado = sessionStorage.getItem('id_empleado_finiquito');
    datos_empleado(id_empleado);
});

async function datos_empleado(id) {
    var id_permiso;
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'datos_empleado_finiquito',
                id_empleado: id
            },
        })
        if (resp.includes('Query Falló')) {
            console.log('Error al obtener datos del usuario. ' + resp);
        } else if (resp.includes('No hay datos')) {
            console.log('No hay datos del empleado.' + resp);
        } else {
            let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
            var nombre_empleado = document.getElementById('nombre_empleado');
            var puesto_empleado = document.getElementById('puesto_empleado');
            var fecha_alta = document.getElementById('fecha_alta');
            var empresa_empleado = document.getElementById('empresa_empleado');
            var fechas_finiquito = document.getElementById('fechas_finiquito');
            var mes_finiquito_inicio = sessionStorage.getItem('mes_finiquito_inicio');
            var mes_finiquito_final = sessionStorage.getItem('mes_finiquito_final');
            var anio_finiquito_inicio = sessionStorage.getItem('anio_finiquito_inicio');
            var anio_finiquito_final = sessionStorage.getItem('anio_finiquito_final');
            id_permiso = lista[0].id_permisos;
            nombre_empleado.innerHTML = lista[0].nombre;
            puesto_empleado.innerHTML = lista[0].puesto;
            fecha_alta.innerHTML = lista[0].fecha_alta;
            fechas_finiquito.innerHTML = mes_finiquito_inicio + '/' + anio_finiquito_inicio + '   A   ' + mes_finiquito_final + '/' + anio_finiquito_final;
            empresa_empleado.innerHTML = lista[0].empresa + `<font class="font514322">
                        el más completo y eficaz </font>
                    <font class="font614322">FINIQUITO
                        DE VACACIONES LABORALES</font>
                    <font class="font514322">, por</font>`;
        }
    } catch (error) {
        console.log(error);
    } finally {
        vacaciones_gozadas(id_permiso);
    }
}

async function vacaciones_gozadas(id) {
    const resp = await $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lista_vacaciones',
            id_permiso: id
        },
    })
    if (resp.includes('Query Falló')) {
        console.log('Error al obtener datos del usuario. ' + resp);
    } else if (resp.includes('No hay datos')) {
        console.log('No hay datos del empleado.' + resp);
    } else {
        var vacaciones = document.getElementById('vacaciones_gozadas');
        let lista;
                if (typeof resp === 'string') {
                    let lista;

                    if (typeof resp === 'string') {

                        lista = JSON.parse(resp);

                    } else {

                        lista = resp; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = resp; // jQuery ya parseó el JSON
                }
        var dias = 0.0
        lista.forEach(dia => {
            dias = dias + parseFloat(dia.total_dias);
        });
        vacaciones.innerHTML = dias + ' Día(s)';
    }
}
