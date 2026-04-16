var id_empleado = sessionStorage.getItem('id_permiso');

$(document).ready(function () {
    cargando();
    selects();
});

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

async function test() {
    try {
        const resp = await $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_vacaciones',
                id_permiso: id_empleado
            },
        });
        if (resp.includes('Query Falló - OBDC')) {
            Swal.fire({
                title: 'Error',
                html: 'Ha ocurrido un error, por favor, comunicate con sistemas',
                icon: 'error',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
            console.log(resp);
        } else if (resp.includes('No hay datos')) {
            Swal.fire({
                title: 'No hay registros',
                html: 'No se encontraron registros de vacaciones',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: true,
            });
            document.getElementById('listado_empleados').innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4"><i class="feather feather-info mb-2" style="font-size: 24px;"></i><br>No se encontraron registros de vacaciones para mostrar.</td></tr>';
            console.log(resp);
        } else {
            var dias = 0.0;
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
            let template = '';
            lista.forEach(lista => {
                dias = dias + parseFloat(lista.total_dias);
                template += `
                    <tr>
                        <td>${lista.id_boleta}</td>
                        <td>${lista.correlativo}</td>
                        <td>${lista.fechaSolicitud}</td>
                        <td>${parseFloat(lista.total_dias)}</td>
                        <td>${lista.fecha_aut}</td>
                        <td>${lista.creador}</td>
                        <td>${lista.departamento}</td>
                        <td>${lista.estado}</td>
                    </tr>
                `;
            });
            document.getElementById('dias_vacaciones').innerHTML = '<strong>Días en total: </strong>' + dias;
            document.getElementById('listado_empleados').innerHTML = template;
            $('#tabla').DataTable({
                "dom": "<'dt--top-section'<'row'<'col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center'l><'col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3'f>>>" +
                    "<'table-responsive'tr>" +
                    "<'dt--bottom-section d-sm-flex justify-content-sm-between text-center'<'dt--pages-count  mb-sm-0 mb-3'i><'dt--pagination'p>>",
                "oLanguage": {
                    "oPaginate": { "sPrevious": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' },
                    "sInfo": "Showing page _PAGE_ of _PAGES_",
                    "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
                    "sSearchPlaceholder": "Search...",
                    "sLengthMenu": "Results :  _MENU_",
                },
                "stripeClasses": [],
                "lengthMenu": [5, 10, 20, 50],
                "pageLength": 10
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        Swal.close();
    }
}

function selects() {
    return new Promise((resolve) => {
        try {
            // Configuración común para todos los select boxes
            const commonOptions = {
                "keepInlineStyles": true,
                "maxHeight": 200,
                "minWidth": 600,
                "search": true,
                "placeHolder": "Elige..."
            };

            // Obtén una lista de los IDs o clases de los select boxes que deseas inicializar
            const selectIds = ["select1", "select2", "select3", "select4", "select5", "select6", "select7", "select8", "select9", "select10"];

            // Inicializa cada select box con la configuración común
            selectIds.forEach(selectId => {
                const selectBox = new vanillaSelectBox(`#${selectId}`, commonOptions);
            });
        } catch (error) {
            console.log(error);
        } finally {
            resolve();
        }
    }).then(() => {
        test();
    })
}

function guardar_vacaciones() {
    cargando();
    var dias_totales = 0;
    var template =
        `INSERT INTO BoletaVacaciones (correlativo, observaciones1, fechaSolicitud, fecha1, fecha2, fecha3, fecha4, fecha5, fecha6, fecha7, fecha8, fecha9, fecha10, 
        desc1, desc2, desc3, desc4, desc5, desc6, desc7, desc8, desc9, desc10, totalD, idSolicitante, idCreador, idDepartamento, fecha_actualizado, idEstado)
    VALUES(
    (select MAX(correlativo) + 1 FROM BoletaVacaciones),
    '${document.getElementById('observacion').value}',
    GETDATE(),
    `;
    for (var i = 1; i <= 10; i++) {
        var fechaInput = document.getElementById(`fecha_${i}`).value.trim();
        if (fechaInput !== '') {
            template += `'${fechaInput}',`
        } else {
            template += `NULL,`
        }
    }
    for (var i = 1; i <= 10; i++) {
        var selectInput = document.getElementById(`select${i}`).value.trim();
        if (selectInput !== '0') {
            template += `'${selectInput}',`
            if (selectInput == 'Todo el dia.') {
                dias_totales++;
            } else {
                dias_totales += 0.5;
            }
        } else {
            template += `NULL,`
        }
    }
    template += `${dias_totales}, ${id_empleado}, ${id_empleado}, (SELECT idDepartamentoP FROM Usuario WHERE idUsuario = ${id_empleado}), GETDATE(), 4);`;
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: {
            quest: 'insertar_vacaciones',
            template
        },
        success: function (res) {
            if (res.trim() == 'Successfully') {
                Swal.fire({
                    icon: 'success', // Icono de éxito
                    title: 'Días ingresados con éxito!',
                    showConfirmButton: true, // Muestra el botón de confirmación
                    allowOutsideClick: false, // Evita cerrar el cuadro de diálogo haciendo clic fuera de él
                    confirmButtonText: 'Ok' // Cambia el texto del botón de confirmación
                }).then(() => {
                    location.reload();
                });
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    // Obtener elementos select y input
    var selectElement1 = document.getElementById('select1');
    var fechaInput1 = document.getElementById('fecha_1');

    // Agregar un controlador de eventos change al select
    selectElement1.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement1.value);
        if (selectElement1.value !== '0') {
            fechaInput1.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput1.disabled = true;
        }
    });
    // Obtener elementos select y input
    var selectElement2 = document.getElementById('select2');
    var fechaInput2 = document.getElementById('fecha_2');

    // Agregar un controlador de eventos change al select
    selectElement2.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement2.value);
        if (selectElement2.value !== '0') {
            fechaInput2.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput2.disabled = true;
        }
    });

    // Obtener elementos select y input
    var selectElement3 = document.getElementById('select3');
    var fechaInput3 = document.getElementById('fecha_3');

    // Agregar un controlador de eventos change al select
    selectElement3.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement3.value);
        if (selectElement3.value !== '0') {
            fechaInput3.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput3.disabled = true;
        }
    });

    // Obtener elementos select y input
    var selectElement4 = document.getElementById('select4');
    var fechaInput4 = document.getElementById('fecha_4');

    // Agregar un controlador de eventos change al select
    selectElement4.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement4.value);
        if (selectElement4.value !== '0') {
            fechaInput4.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput4.disabled = true;
        }
    });

    // Obtener elementos select y input
    var selectElement5 = document.getElementById('select5');
    var fechaInput5 = document.getElementById('fecha_5');

    // Agregar un controlador de eventos change al select
    selectElement5.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement5.value);
        if (selectElement5.value !== '0') {
            fechaInput5.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput5.disabled = true;
        }
    });

    // Obtener elementos select y input
    var selectElement6 = document.getElementById('select6');
    var fechaInput6 = document.getElementById('fecha_6');

    // Agregar un controlador de eventos change al select
    selectElement6.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement6.value);
        if (selectElement6.value !== '0') {
            fechaInput6.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput6.disabled = true;
        }
    });

    // Obtener elementos select y input
    var selectElement7 = document.getElementById('select7');
    var fechaInput7 = document.getElementById('fecha_7');

    // Agregar un controlador de eventos change al select
    selectElement7.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement7.value);
        if (selectElement7.value !== '0') {
            fechaInput7.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput7.disabled = true;
        }
    });

    // Obtener elementos select y input
    var selectElement8 = document.getElementById('select8');
    var fechaInput8 = document.getElementById('fecha_8');

    // Agregar un controlador de eventos change al select
    selectElement8.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement8.value);
        if (selectElement8.value !== '0') {
            fechaInput8.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput8.disabled = true;
        }
    });

    // Obtener elementos select y input
    var selectElement9 = document.getElementById('select9');
    var fechaInput9 = document.getElementById('fecha_9');

    // Agregar un controlador de eventos change al select
    selectElement9.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement9.value);
        if (selectElement9.value !== '0') {
            fechaInput9.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput9.disabled = true;
        }
    });

    // Obtener elementos select y input
    var selectElement10 = document.getElementById('select10');
    var fechaInput10 = document.getElementById('fecha_10');

    // Agregar un controlador de eventos change al select
    selectElement10.addEventListener('change', function () {
        // Habilitar el campo de fecha si la opción seleccionada no es "Seleccionar..."
        console.log(selectElement10.value);
        if (selectElement10.value !== '0') {
            fechaInput10.disabled = false;
        } else {
            // Deshabilitar el campo de fecha si se selecciona "Seleccionar..."
            fechaInput10.disabled = true;
        }
    });
});