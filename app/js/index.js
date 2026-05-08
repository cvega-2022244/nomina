var fecha = new Date();

$(document).ready(function () {
    // Remover todas las restricciones de roles - Sistema sin roles activado
    $('.role-restricted').removeClass('role-restricted');
    $('.menu-item-restricted').removeClass('menu-item-restricted');
    console.log('✅ Sistema sin roles activado - Todos los elementos visibles');

    // Agregar event listener al botón de nómina de inmediato
    var btn_nomina = document.getElementById('btn_nomina');
    if (btn_nomina) {
        btn_nomina.addEventListener("click", function () {
            console.log('Clic en botón nómina detectado');
            manejar_click_nomina();
        }, false);
        console.log('✅ Event listener agregado');
    }

    validar_nomina_activa();
    if (document.getElementById('slc_empresa')) {
        inicializar_select();
    }
})

var hay_lote_activo = false;

function manejar_click_nomina() {
    // Verificar el rol del usuario
    const rol = sessionStorage.getItem('rol') || '';

    if (hay_lote_activo) {
        console.log('Redirigiendo a administrar nómina');
        window.location.href = './nomina.html';
    } else {
        // Solo admin puede crear nuevo lote
        if (rol === 'rh') {
            console.log('Abriendo modal para crear nueva nómina');
            abrirModalCrearNomina();
        } else {
            console.log('Usuario sin permisos para crear lote');
            Swal.fire({
                icon: 'warning',
                title: 'Sin Nómina Activa',
                text: 'No hay ninguna nómina activa. Contacta a un administrador para crear una.'
            });
        }
    }
}

function validar_nomina_activa() {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'lote_activo',
            },
            success: function (resp) {
                var titulo_nomina = document.getElementById('titulo_nomina');
                var btn_nomina = document.getElementById('btn_nomina');
                if (resp.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Datos',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(resp);
                } else if (resp.includes('No hay datos')) {
                    try {
                        // Verificar el rol del usuario
                        const rol = sessionStorage.getItem('rol') || '';

                        if (rol === 'rh') {
                            // Solo admin puede ver "Crear Nómina"
                            titulo_nomina.innerHTML = "Crear Nómina";
                            btn_nomina.style.display = 'block';
                        } else {
                            // Otros roles no pueden crear nómina, ocultar el botón o mostrar mensaje
                            titulo_nomina.innerHTML = "Sin Nómina Activa";
                            // Ocultar el botón para operaciones cuando no hay lote activo
                            if (rol === 'operaciones') {
                                btn_nomina.style.display = 'none';
                            }
                        }

                        hay_lote_activo = false;
                        sessionStorage.setItem('nomina_activa', false);
                        console.log('✅ No hay lote activo - Rol: ' + rol);
                    } catch (error) {
                        console.error('Error:', error);
                    } finally {
                        resolve();
                    }
                } else {
                    try {
                        // Verificar si la respuesta es JSON válido
                        if (typeof resp === 'string' && (resp.trim().startsWith('<') || resp.includes('<br') || resp.includes('Query Falló'))) {
                            console.error('Respuesta del servidor no es JSON válido:', resp);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error Al Obtener Datos',
                                text: 'El servidor devolvió una respuesta inválida'
                            });
                            return;
                        }

                        let lista;
                        if (typeof resp === 'string') {
                            lista = JSON.parse(resp);
                        } else {
                            lista = resp; // jQuery ya parseó el JSON
                        }

                        // Asignar funcionalidad al botón de nómina cuando hay datos
                        titulo_nomina.innerHTML = "Administrar Nómina";
                        hay_lote_activo = true;
                        sessionStorage.setItem('nomina_activa', true);
                        console.log('✅ Lote activo encontrado - Botón configurado para administrar');

                    } catch (error) {
                        console.error('Error:', error);
                    } finally {
                        resolve();
                    }
                }
            }
        })
    }).then(() => {
        Swal.close();
    })
}

function administrar_nomina() {
    // Redirigir a la página de administración de nómina
    window.location.href = './nomina.html';
}

function ingresar_lote() {
    cargando();
    return new Promise((resolve, reject) => {
        try {
            var fecha_actual = new Date();
            var dia_actual = String(fecha_actual.getDate()).padStart(2, '0');
            var mes_actual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
            var anio_actual = fecha_actual.getFullYear();
            var tipo_quincena;
            var quincena;
            if (dia_actual <= 15) {
                tipo_quincena = 'primera quincena';
                quincena = 0;
            } else {
                tipo_quincena = 'segunda quincena';
                quincena = 1;
            }
            var nombre_lote = `Pago nómina ${tipo_quincena} de ${mes_actual} ${anio_actual}`;
            console.log('Creando lote:', nombre_lote);

            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'ingresar_lote',
                    nombre_lote,
                    quincena
                },
                success: function (res) {
                    console.log('Respuesta ingresar_lote:', res);
                    if (res.includes('Query Falló')) {
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Ingresar Lote',
                            text: 'Ha ocurrido un error al ingresar el lote'
                        });
                        reject(res);
                    } else {
                        resolve();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error AJAX ingresar_lote:', error);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Conexión',
                        text: 'No se pudo conectar al servidor'
                    });
                    reject(error);
                }
            });
        } catch (error) {
            console.error('Error en ingresar_lote:', error);
            Swal.close();
            reject(error);
        }
    }).then(() => {
        return reiniciar_dias_laborados();
    }).catch((error) => {
        console.error('Error completo:', error);
        Swal.close();
    });
}

function reiniciar_dias_laborados() {
    return new Promise((resolve, reject) => {
        try {
            console.log('Reiniciando días laborados...');
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'reiniciar_dias_laborados',
                },
                success: function (res) {
                    console.log('Respuesta reiniciar_dias_laborados:', res);
                    if (res.includes('Query Falló')) {
                        Swal.close();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Reiniciar Dias Laborados',
                            text: 'Ha ocurrido un error al reiniciar los dias laborados'
                        });
                        reject(res);
                    } else {
                        resolve();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error AJAX reiniciar_dias_laborados:', error);
                    Swal.close();
                    reject(error);
                }
            });
        } catch (error) {
            console.error('Error en reiniciar_dias_laborados:', error);
            Swal.close();
            reject(error);
        }
    }).then(() => {
        console.log('Redirigiendo a nomina.html...');
        Swal.close();
        sessionStorage.removeItem('id_empresa_nomina');
        window.location.href = './nomina.html';
    }).catch((error) => {
        console.error('Error completo:', error);
        Swal.close();
    });
}

function datos_maestros() {
    window.location.href = './datos_maestros.html';
}

function nomina() {
    window.location.href = './nomina.html';
}

function historial() {
    window.location.href = './listado_lotes_cerrados.html';
}

async function bono() {
    try {
        cargando();
        const mesActual = fecha.getMonth() + 1;
        var query = '';
        if (mesActual >= 7) {
            query = "INSERT INTO bono_real SELECT '', ee.id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AL, DATEDIFF( DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_salario_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT(NOW(), '%Y-07-01') AND DATE_FORMAT( NOW() + INTERVAL 1 YEAR, '%Y-06-30') AND e.id NOT IN( SELECT id_empleado FROM bono_real WHERE YEAR(al) = YEAR(NOW()  + INTERVAL 1 YEAR)) GROUP BY ee.id"
        } else {
            query = "INSERT INTO bono_real SELECT '', ee.id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW(), '%Y-06-30') AL, DATEDIFF( DATE_FORMAT(NOW(), '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_salario_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') AND DATE_FORMAT(NOW(), '%Y-06-30') AND e.id NOT IN( SELECT id_empleado FROM bono_real WHERE YEAR(al) = YEAR(NOW())) GROUP BY ee.id";
        }
        let firstResponse;
        try {
            firstResponse = await $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: {
                    quest: 'ingresar_bonos',
                    query
                },
                dataType: 'text' // Evitar que jQuery intente parsear como JSON
            });
        } catch (error) {
            console.error('Error en ingresar_bonos:', error);
            Swal.close();
            return;
        }

        console.log(firstResponse);

        if (firstResponse.includes('Successfully')) {
            var query2 = ''
            if (mesActual >= 7) {
                query2 = "SELECT em.id id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AL, DATEDIFF( DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW(), '%Y-07-01') AND DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AND e.id IN( SELECT id_empleado FROM bono_real WHERE YEAR(al) = YEAR(NOW() + INTERVAL 1 YEAR)) GROUP BY ee.id"
            } else {
                query2 = "SELECT em.id id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW(), '%Y-06-30') AL, DATEDIFF( DATE_FORMAT(NOW(), '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') AND DATE_FORMAT(NOW(), '%Y-06-30') AND e.id IN( SELECT id_empleado FROM bono_real WHERE YEAR(al) = YEAR(NOW())) GROUP BY ee.id";
            }
            let secondResponse;
            try {
                secondResponse = await $.ajax({
                    url: 'php/servidor.php',
                    type: 'GET',
                    data: {
                        quest: 'reporte_bono',
                        query2
                    },
                    dataType: 'text' // Evitar que jQuery intente parsear como JSON
                });
            } catch (error) {
                console.error('Error en reporte_bono:', error);
                Swal.close();
                return;
            }

            // Verificar si la respuesta es JSON válido
            if (secondResponse.trim().startsWith('<') || secondResponse.includes('<br') || secondResponse.includes('Query Falló') || secondResponse.includes('Successfully')) {
                console.error('Respuesta del servidor no es JSON válido:', secondResponse);
                Swal.close();
                window.location.href = './bono.html';
                return;
            }

            // Verificar si la respuesta es JSON válido antes de parsear
            if (secondResponse.trim() === 'No' || secondResponse.trim().startsWith('<') || secondResponse.includes('<br') || secondResponse.includes('Query Falló') || secondResponse.includes('Successfully')) {
                console.log('No hay datos para procesar o respuesta no válida:', secondResponse);
                Swal.close();
                window.location.href = './bono.html';
                return;
            }

            let lista;
            if (typeof secondResponse === 'string') {
                lista = JSON.parse(secondResponse);
            } else {
                lista = secondResponse; // jQuery ya parseó el JSON
            }

            for (const item of lista) {
                const template = `UPDATE bono_real SET porcentaje = '${item.porcentaje}', fecha_inicio = '${item.fecha_inicio}', periodo_pago = '${item.periodo_pago}', dias_pagar = '${item.dias_pagar}', julio = '${item.julio}', agosto = '${item.agosto}', septiembre = '${item.septiembre}', octubre = '${item.octubre}', noviembre = '${item.noviembre}', diciembre = '${item.diciembre}', enero = '${item.enero}', febrero = '${item.febrero}', marzo = '${item.marzo}', abril = '${item.abril}', mayo = '${item.mayo}', junio = '${item.junio}', total_periodo = '${item.total_periodo}', bono = '${item.bono}', primer_pago = '${item.primer_pago}', segundo_pago = '${item.segundo_pago}' WHERE id_empleado = ${item.id_empleado} AND id_empresa = ${item.id_empresa} AND principal = ${item.principal} AND al = '${item.al}'`;

                let thirdResponse;
                try {
                    thirdResponse = await $.ajax({
                        url: 'php/servidor.php',
                        type: 'POST',
                        data: {
                            quest: 'update_bono',
                            query: template
                        },
                        dataType: 'text' // Evitar que jQuery intente parsear como JSON
                    });
                } catch (error) {
                    console.error('Error en update_bono:', error);
                }

                console.log(thirdResponse);
            }

            Swal.close();
            window.location.href = './bono.html';
        } else {
            console.error('El primer paso de bono no fue exitoso:', firstResponse);
            Swal.close();
            window.location.href = './bono.html';
        }
    } catch (error) {
        console.error('Error en la función bono:', error);
        Swal.close();
        window.location.href = './bono.html';
    }
}


async function aguinaldo() {
    try {
        cargando();
        const mesActual = fecha.getMonth() + 1;
        var query = '';
        if (mesActual >= 12) {
            query = "INSERT INTO aguinaldo_real SELECT '', ee.id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT(NOW(), '%Y-12-01') THEN DATE_FORMAT( DATE_FORMAT(NOW(), '%Y-12-01'), '%Y-%m-%d') ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT( NOW() + INTERVAL 1 YEAR, '%Y-11-30') AL, DATEDIFF( DATE_FORMAT( NOW() + INTERVAL 1 YEAR, '%Y-12-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_salario_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT(NOW(), '%Y-12-01') AND DATE_FORMAT( NOW() + INTERVAL 1 YEAR, '%Y-11-30') AND e.id NOT IN( SELECT id_empleado FROM aguinaldo_real WHERE YEAR(al) = YEAR(NOW() + INTERVAL 1 YEAR)) GROUP BY ee.id"
        } else {
            query = "INSERT INTO aguinaldo_real SELECT '', ee.id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW(), '%Y-11-30') AL, DATEDIFF( DATE_FORMAT(NOW(), '%Y-12-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_salario_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01') AND DATE_FORMAT(NOW(), '%Y-11-30') AND e.id NOT IN( SELECT id_empleado FROM aguinaldo_real WHERE YEAR(al) = YEAR(NOW())) GROUP BY ee.id";
        }
        const firstResponse = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_aguinaldos',
                query
            },
            dataType: 'text' // Evitar que jQuery intente parsear como JSON
        });

        // Verificar si la respuesta es válida
        if (firstResponse.trim().startsWith('<') || firstResponse.includes('<br') || firstResponse.includes('Query Falló') || firstResponse.trim() === 'No') {
            console.error('Respuesta del servidor no es válida:', firstResponse);
            Swal.close();
            return;
        }

        if (firstResponse.includes('Successfully')) {
            var query2 = ''
            if (mesActual >= 12) {
                query2 = "SELECT em.id id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT(NOW(), '%Y-12-01') THEN DATE_FORMAT( DATE_FORMAT(NOW(), '%Y-12-01'), '%Y-%m-%d') ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT( NOW() + INTERVAL 1 YEAR, '%Y-11-30') AL, DATEDIFF( DATE_FORMAT( NOW() + INTERVAL 1 YEAR, '%Y-12-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT(NOW(), '%Y-12-01') THEN DATE_FORMAT( DATE_FORMAT(NOW(), '%Y-12-01'), '%Y-%m-%d') ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT(NOW(), '%Y-12-01') AND DATE_FORMAT( NOW() + INTERVAL 1 YEAR, '%Y-11-30') AND e.id IN( SELECT id_empleado FROM aguinaldo_real WHERE YEAR(al) = YEAR(NOW() + INTERVAL 1 YEAR)) GROUP BY ee.id"
            } else {
                query2 = "SELECT em.id id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW(), '%Y-11-30') AL, DATEDIFF( DATE_FORMAT(NOW(), '%Y-12-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-12-01') AND DATE_FORMAT(NOW(), '%Y-11-30') AND e.id IN( SELECT id_empleado FROM aguinaldo_real WHERE YEAR(al) = YEAR(NOW())) GROUP BY ee.id";
            }
            const secondResponse = await $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'reporte_aguinaldo',
                    query2
                },
                dataType: 'text' // Evitar que jQuery intente parsear como JSON
            });

            // Verificar si la respuesta es JSON válido
            if (secondResponse.trim().startsWith('<') || secondResponse.includes('<br') || secondResponse.includes('Query Falló') || secondResponse.includes('Successfully') || secondResponse.trim() === 'No') {
                console.error('Respuesta del servidor no es JSON válido:', secondResponse);
                Swal.close();
                window.location.href = './aguinaldo.html';
                return;
            }

            let lista;
            if (typeof secondResponse === 'string') {
                try {
                    lista = JSON.parse(secondResponse);
                } catch (error) {
                    console.error('Error parseando JSON en aguinaldo:', error, 'Respuesta:', secondResponse);
                    Swal.close();
                    window.location.href = './aguinaldo.html';
                    return;
                }
            } else {
                lista = secondResponse; // jQuery ya parseó el JSON
            }

            for (const item of lista) {
                const template = `UPDATE aguinaldo_real SET porcentaje = '${item.porcentaje}', fecha_inicio = '${item.fecha_inicio}', periodo_pago = '${item.periodo_pago}', dias_pagar = '${item.dias_pagar}', diciembre = '${item.diciembre}', enero = '${item.enero}', febrero = '${item.febrero}', marzo = '${item.marzo}', abril = '${item.abril}', mayo = '${item.mayo}', junio = '${item.junio}', julio = '${item.julio}', agosto = '${item.agosto}', septiembre = '${item.septiembre}', octubre = '${item.octubre}', noviembre = '${item.noviembre}', total_periodo = '${item.total_periodo}', bono = '${item.bono}', primer_pago = '${item.primer_pago}', segundo_pago = '${item.segundo_pago}' WHERE id_empleado = ${item.id_empleado} AND id_empresa = ${item.id_empresa} AND principal = ${item.principal} AND al = '${item.al}'`;

                const thirdResponse = await $.ajax({
                    url: 'php/servidor.php',
                    type: 'POST',
                    data: {
                        quest: 'update_aguinaldo',
                        query: template
                    },
                    dataType: 'text' // Evitar que jQuery intente parsear como JSON
                });

                console.log(thirdResponse);
            }

            Swal.close();
            window.location.href = './aguinaldo.html';
        } else {
            console.error('El primer paso de aguinaldo no fue exitoso:', firstResponse);
            Swal.close();
            window.location.href = './aguinaldo.html';
        }
    } catch (error) {
        console.error('Error en la función aguinaldo:', error);
        Swal.close();
        window.location.href = './aguinaldo.html';
    }
}

function seleccionar_empresa() {
    sessionStorage.setItem('id_empresa_nomina', slc_empresa.value);
}

function variable(opcion) {
    opcion_variable = opcion;
}

function iniciar() {
    if (opcion_variable == 0) {
        bono();
    } else {
        aguinaldo();
    }
}


function inicializar_select() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'listado_empresas',
            },
            success: function (res) {
                if (res.includes('Query Falló')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Empresas',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(res);
                } else if (res.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Empresas Registradas',
                    });
                    console.log(res);
                } else {
                    try {
                        // Verificar si la respuesta es JSON válido
                        if (typeof res === 'string' && (res.trim().startsWith('<') || res.includes('<br') || res.includes('Query Falló'))) {
                            console.error('Respuesta del servidor no es JSON válido:', res);
                            return;
                        }
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
                        var slc_empresa = document.getElementById('slc_empresa')
                        var template = '';
                        lista.forEach(empresa => {
                            template += `<option value="${empresa.id}">${empresa.nombre_comercial}</option>`;
                        })
                        slc_empresa.innerHTML = template;
                        // Verificar si vanillaSelectBox está disponible antes de usarlo
                        if (typeof vanillaSelectBox !== 'undefined') {
                            selectBox = new vanillaSelectBox("#slc_empresa", {
                                "keepInlineStyles": true,
                                "maxHeight": 678,
                                "minWidth": 200,
                                "search": true,
                                "placeHolder": "Empresa..."
                            });
                        } else {
                            // Si vanillaSelectBox no está disponible, usar select nativo
                            // Sin mensajes en consola
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    } finally {
                        resolve();
                    }
                }
            }
        })
    }).then(() => {
        Swal.close();
    })
}

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

function facturacion_intercompany() {
    var anio = document.getElementById("anio_bono").value;
    if (anio > 2000) {
        if (opcion_variable == 0) {
            sessionStorage.setItem("anio_bono", anio)
            window.location.href = './facturacion_bono.html';
        } else {
            sessionStorage.setItem("anio_aguinaldo", anio)
            window.location.href = './facturacion_aguinaldo.html';
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Un problema con la fecha',
            text: 'Asegurese que la fecha sea mayor al año 2000'
        });
    }
}

// ========== NUEVAS FUNCIONES PARA CREAR NÓMINA CON SELECCIÓN DE EMPRESAS ==========

function abrirModalCrearNomina() {
    // Actualizar información de período
    const fecha_actual = new Date();
    const dia_actual = fecha_actual.getDate();
    const mes_actual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(fecha_actual);
    const anio_actual = fecha_actual.getFullYear();

    let tipo_quincena = dia_actual <= 15 ? 'Primera Quincena' : 'Segunda Quincena';

    document.getElementById('info_periodo').textContent = `${mes_actual} ${anio_actual}`;
    document.getElementById('info_quincena').textContent = tipo_quincena;

    // Mostrar modal
    $('#modal_crear_nomina').modal({
        backdrop: 'static',
        keyboard: false
    });
    $('#modal_crear_nomina').modal('show');
}

function crearNominaConEmpresas() {
    $('#modal_crear_nomina').modal('hide');
    ingresar_lote();
}

function crear_bono_variable() {
    window.location.href = 'crear-bono-variable.html';
}

function bono_14() {
    bono();
}



