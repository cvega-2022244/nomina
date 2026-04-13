traer_cumpleañeros();
function traer_cumpleañeros() {
    let anio = sessionStorage.getItem('ano_cumple');
    let mes = sessionStorage.getItem('mes_cumple');
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'cumpleañeros',
            mes,
            anio

        },
        success: function (res) {
            if (res.includes('Query Falló')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Obtener Bancos',
                    text: 'Por favor, comunicate con sistemas'
                });
                console.log(res);
            } else if (res.includes('No hay datos')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No hay registros',
                });
                console.log(res);
            } else {
                try {
                    let lista;
                if (typeof res === 'string') {
                    let lista;

                    if (typeof res === 'string') {

                        lista = JSON.parse(res);

                    } else {

                        lista = res; // jQuery ya parseó el JSON

                    }
                } else {
                    lista = res; // jQuery ya parseó el JSON
                }

                    function formatearNombreEmpleado(item) {
                        let nombre_empleado = `${item.primer_nombre}${item.segundo_nombre ? ` ${item.segundo_nombre}` : ''}${item.otro_nombre ? ` ${item.otro_nombre}` : ''}${item.primer_apellido ? ` ${item.primer_apellido}` : ''}${item.segundo_apellido ? ` ${item.segundo_apellido}` : ''}`;
                        return nombre_empleado.trim();
                    }

                    function formatearFecha(fecha) {
                        return new Date(fecha).toLocaleDateString(undefined, { day: 'numeric' });
                    }

                    function ajustarFecha(fecha) {
                        console.log(fecha);
                        let fechaNacimiento = new Date(fecha);
                        let diaSemana = fechaNacimiento.getDay();

                        if (diaSemana === 6) { // Sábado
                            fechaNacimiento.setDate(fechaNacimiento.getDate() - 1);
                        } else if (diaSemana === 0) { // Domingo
                            fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);
                        }

                        return formatearFecha(fechaNacimiento);
                    }

                    let template = lista.map(item => `
                        <tr>
                            <td>${formatearNombreEmpleado(item)}</td>
                            <td>${item.departamento}</td>
                            <td>${formatearFecha(item.fecha_nacimiento)}</td>
                            <td>${ajustarFecha(item.fecha_nacimiento)}</td>
                        </tr>
                    `).join('');

                    document.getElementById('cuerpo_tabla').innerHTML = template;

                } catch (error) {
                    console.log(error);
                }
            }
        }
    });
        
    // Array con los nombres de los meses en español
    let nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    // Actualizar el contenido del elemento h1 con el mensaje adecuado
    let tituloCumpleaneros = document.getElementById("titulo_cumpleaneros");
    tituloCumpleaneros.innerText = `Cumpleañeros del mes de ${nombresMeses[(mes-1)]} de ${anio}`;
}

function excel_cumpleaneros() {
    let nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    let anio = sessionStorage.getItem('ano_cumple');
    let mes = sessionStorage.getItem('mes_cumple');
    window.location.href = './php/cumpleaneros.php?mes=' + mes + '&anio=' + anio + '&mes_texto=' + nombresMeses[(mes-1)];
}