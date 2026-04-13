// Obtener los datos almacenados en el sessionStorage
const datosAlmacenadosJSON = sessionStorage.getItem('bajas');

// Convertir los datos JSON a un objeto
const datosAlmacenados = JSON.parse(datosAlmacenadosJSON);

// Acceder a los valores de mes y año
const mes = datosAlmacenados.mes;
const anio = datosAlmacenados.anio;
$.ajax({
    url: 'php/servidor.php',
    type: 'GET',
    data: {
        quest: 'bajas_altas',
        mes,
        anio
    },
    success: function (resp) {

        if (resp.includes('Query Falló')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error al obtener las bajas, por favor, comunicate con sistemas.',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else if (resp.includes('No hay datos')) {
            Swal.fire({
                title: 'No hay bajas registradas',
                icon: 'warning',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
        } else {
            console.log(resp);
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
            let template = '<table class="table">';

            template += `
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Fecha de Baja</th>
                <th>Departamento</th>
            </tr>
        `;

            lista.forEach((empleado, index) => {
                const nombreCompleto = `${empleado.primer_nombre} ${empleado.segundo_nombre} ${empleado.otro_nombre} ${empleado.primer_apellido} ${empleado.segundo_apellido} ${empleado.apellido_casada}`.trim();
                const formattedFechaInicio = new Date(empleado.fecha_baja).toLocaleDateString('en-US');

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
            <div id="titulo">Bajas</div>
            ${template}
        `;
        }
    }
});
