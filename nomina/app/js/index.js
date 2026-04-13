var fecha = new Date();

$(document).ready(function () {
    validar_nomina_activa();
    inicializar_select();
})

function validar_nomina_activa() {
    return new Promise((resolve) => {
        cargando();
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
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
                        titulo_nomina.innerHTML = "Crear Nómina";
                        btn_nomina.addEventListener("click", function () {
                            ingresar_lote();
                        }, false);
                        sessionStorage.setItem('nomina_activa', false);
                    } catch (error) {
                        log(error);
                    } finally {
                        resolve();
                    }
                } else {
                    try {
                        let lista = JSON.parse(resp);
                        if (lista[0].id_estado != 1) {
                            titulo_nomina.innerHTML = "Crear Nómina";
                            btn_nomina.addEventListener("click", function () {
                                ingresar_lote();
                            }, false);
                            sessionStorage.setItem('nomina_activa', false);
                        } else {
                            nombre_lote.innerHTML = lista[0].nombre
                            titulo_nomina.innerHTML = "Administrar Nómina";
                            btn_nomina.addEventListener("click", function () {
                                nomina();
                            }, false);
                            sessionStorage.setItem('nomina_activa', true);
                        }
                        if (lista[0].quincena == 0) {
                            sessionStorage.setItem('quincena', true);
                        } else {
                            sessionStorage.setItem('quincena', false);
                        }
                    } catch (error) {
                        console.log(error);
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

function ingresar_lote() {
    return new Promise((resolve) => {
        try {
            cargando();
            var fecha_actual = new Date();
            var dia_actual = String(fecha_actual.getDate()).padStart(2, '');
            var mes_actual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
            var anio_actual = fecha_actual.getFullYear();
            var tipo_quincena;
            var quincena
            if (dia_actual <= 15) {
                tipo_quincena = 'primera quincena',
                    quincena = 0
            } else {
                tipo_quincena = 'segunda quincena'
                quincena = 1
            }
            var nombre_lote = `Pago nómina ${tipo_quincena} de ${mes_actual} ${anio_actual}`
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: {
                    quest: 'ingresar_lote',
                    nombre_lote,
                    quincena
                },
                success: function (res) {
                    if (res.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Ingresar Lote',
                            text: 'Ah ocurrido un error al ingresar el lote, por favor, intentalo de nuevo'
                        });
                        console.log(res);
                    } else {
                        resolve();
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }).then(() => {
        reiniciar_dias_laborados();
    })
}

function reiniciar_dias_laborados() {
    return new Promise((resolve) => {
        try {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: {
                    quest: 'reiniciar_dias_laborados',
                },
                success: function (res) {
                    if (res.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Reiniciar Dias Laborados',
                            text: 'Ah ocurrido un error al reiniciar los dias laborados, por favor, comunicate con sistemas'
                        });
                        console.log(res);
                    } else {
                        resolve();
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }).then(() => {
        nomina();
    })
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
        const firstResponse = await $.ajax({
            url: 'php/servidor.php',
            type: 'POST',
            data: {
                quest: 'ingresar_bonos',
                query
            }
        });

        console.log(firstResponse);

        if (firstResponse.includes('Successfully')) {
            var query2 = ''
            if (mesActual >= 7) {
                query2 = "SELECT em.id id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AL, DATEDIFF( DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW(), '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW(), '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW(), '%Y-07-01') AND DATE_FORMAT(NOW() + INTERVAL 1 YEAR, '%Y-06-30') AND e.id IN( SELECT id_empleado FROM bono_real WHERE YEAR(al) = YEAR(NOW() + INTERVAL 1 YEAR)) GROUP BY ee.id"
            } else {
                query2 = "SELECT em.id id_empresa, ee.porcentaje, ee.principal, e.fecha_inicio, CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END AS periodo_pago, DATE_FORMAT(NOW(), '%Y-06-30') AL, DATEDIFF( DATE_FORMAT(NOW(), '%Y-07-01'), CASE WHEN e.fecha_inicio <= DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') THEN DATE_FORMAT( DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01'), '%Y-%m-%d' ) ELSE DATE_FORMAT(e.fecha_inicio, '%Y-%m-%d') END ) dias_pagar, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 7 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS julio, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 8 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS agosto, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 9 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS septiembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 10 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS octubre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 11 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS noviembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 12 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS diciembre, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 1 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS enero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 2 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS febrero, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 3 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS marzo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 4 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS abril, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 5 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS mayo, SUM( CASE WHEN MONTH(pl.fecha_pago_lote) = 6 THEN( pl.total_reporte_bono * ee.porcentaje / 100 ) ELSE 0 END ) AS junio, SUM( ( pl.total_reporte_bono * ee.porcentaje / 100 ) ) total_periodo, ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) bono, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) primer_pago, ( ( ( ( SUM(pl.total_reporte_bono) / 360 * 30 ) * ee.porcentaje / 100 ) ) / 2 ) segundo_pago, e.id FROM pago_lote pl INNER JOIN empleado e ON pl.id_empleado = e.id INNER JOIN empresa_empleado ee ON e.id = ee.id_empleado INNER JOIN empresa em ON ee.id_empresa = em.id WHERE pl.fecha_pago_lote BETWEEN DATE_FORMAT( NOW() - INTERVAL 1 YEAR, '%Y-07-01') AND DATE_FORMAT(NOW(), '%Y-06-30') AND e.id IN( SELECT id_empleado FROM bono_real WHERE YEAR(al) = YEAR(NOW())) GROUP BY ee.id";
            }
            const secondResponse = await $.ajax({
                url: 'php/servidor.php',
                type: 'GET',
                data: {
                    quest: 'reporte_bono',
                    query2
                }
            });

            const lista = JSON.parse(secondResponse);

            for (const item of lista) {
                const template = `UPDATE bono_real SET porcentaje = '${item.porcentaje}', fecha_inicio = '${item.fecha_inicio}', periodo_pago = '${item.periodo_pago}', dias_pagar = '${item.dias_pagar}', julio = '${item.julio}', agosto = '${item.agosto}', septiembre = '${item.septiembre}', octubre = '${item.octubre}', noviembre = '${item.noviembre}', diciembre = '${item.diciembre}', enero = '${item.enero}', febrero = '${item.febrero}', marzo = '${item.marzo}', abril = '${item.abril}', mayo = '${item.mayo}', junio = '${item.junio}', total_periodo = '${item.total_periodo}', bono = '${item.bono}', primer_pago = '${item.primer_pago}', segundo_pago = '${item.segundo_pago}' WHERE id_empleado = ${item.id_empleado} AND id_empresa = ${item.id_empresa} AND principal = ${item.principal} AND al = '${item.al}'`;

                const thirdResponse = await $.ajax({
                    url: 'php/servidor.php',
                    type: 'POST',
                    data: {
                        quest: 'update_bono',
                        query: template
                    }
                });

                console.log(thirdResponse);
            }

            Swal.close();
            window.location.href = './bono.html';
        }
    } catch (error) {
        console.error(error);
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
            }
        });

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
                }
            });

            const lista = JSON.parse(secondResponse);

            for (const item of lista) {
                const template = `UPDATE aguinaldo_real SET porcentaje = '${item.porcentaje}', fecha_inicio = '${item.fecha_inicio}', periodo_pago = '${item.periodo_pago}', dias_pagar = '${item.dias_pagar}', diciembre = '${item.diciembre}', enero = '${item.enero}', febrero = '${item.febrero}', marzo = '${item.marzo}', abril = '${item.abril}', mayo = '${item.mayo}', junio = '${item.junio}', julio = '${item.julio}', agosto = '${item.agosto}', septiembre = '${item.septiembre}', octubre = '${item.octubre}', noviembre = '${item.noviembre}', total_periodo = '${item.total_periodo}', bono = '${item.bono}', primer_pago = '${item.primer_pago}', segundo_pago = '${item.segundo_pago}' WHERE id_empleado = ${item.id_empleado} AND id_empresa = ${item.id_empresa} AND principal = ${item.principal} AND al = '${item.al}'`;

                const thirdResponse = await $.ajax({
                    url: 'php/servidor.php',
                    type: 'POST',
                    data: {
                        quest: 'update_aguinaldo',
                        query: template
                    }
                });

                console.log(thirdResponse);
            }

            Swal.close();
            window.location.href = './aguinaldo.html';
        }
    } catch (error) {
        console.error(error);
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
                        let lista = JSON.parse(res)
                        var slc_empresa = document.getElementById('slc_empresa')
                        var template = '';
                        lista.forEach(empresa => {
                            template += `<option value="${empresa.id}">${empresa.nombre_comercial}</option>`;
                        })
                        slc_empresa.innerHTML = template;
                        selectBox = new vanillaSelectBox("#slc_empresa", {
                            "keepInlineStyles": true,
                            "maxHeight": 678,
                            "minWidth": 200,
                            "search": true,
                            "placeHolder": "Empresa..."
                        });
                    } catch (error) {
                        console.log(error);
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

