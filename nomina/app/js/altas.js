// Obtener los datos almacenados en el sessionStorage
const datosAlmacenadosJSON = sessionStorage.getItem('altas_bajas');

// Convertir los datos JSON a un objeto
const datosAlmacenados = JSON.parse(datosAlmacenadosJSON);

// Acceder a los valores de mes y año
const mes = datosAlmacenados.mes;
const anio = datosAlmacenados.anio;
$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'altas_bajas',
        mes,
        anio
    },
    success: function (resp) {
        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al obtener las altas, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else if (resp.includes('No hay datos')) {
            Swal.fire({
                title: 'No hay altas registradas',
                icon: 'warning',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log(resp);
            let lista = JSON.parse(resp);
            let template = '<table class="table">';

            template += `
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Fecha de Inicio</th>
                <th>Departamento</th>
            </tr>
        `;

            lista.forEach((empleado, index) => {
                const nombreCompleto = `${empleado.primer_nombre} ${empleado.segundo_nombre} ${empleado.otro_nombre} ${empleado.primer_apellido} ${empleado.segundo_apellido} ${empleado.apellido_casada}`.trim();
                const formattedFechaInicio = new Date(empleado.fecha_inicio).toLocaleDateString('en-US');

                template += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${nombreCompleto}</td>
                    <td>${formattedFechaInicio}</td>
                    <td>${empleado.departamento}</td>
                </tr>
            `;
            });

            template += '</table>';
            document.getElementById('listado_empleados').innerHTML = `
            <div id="titulo">Altas</div>
            ${template}
        `;
        }
        }
});
