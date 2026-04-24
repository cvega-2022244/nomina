var array_emleados = [];
var array_salarios = [];
var template = '';

$(document).ready(function () {
    // La notificación ahora es parte de la UI en salarios.html
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'usuarios_salario'
            },
            success: function (res) {
                try {
                    let lista = typeof res === 'string' ? JSON.parse(res) : res;
                    if (Array.isArray(lista)) {
                        array_emleados = lista;
                    }
                } catch (error) {
                    console.error("Error al cargar empleados:", error);
                } finally {
                    resolve();
                }
            }
        });
    }).then(() => {
        obtener_lista_salarios();
    });
});

// Función mensaje_margenes removida - integrada en la UI de salarios.html


function obtener_lista_salarios() {
    let total = array_emleados.length;
    let procesados = 0;

    return new Promise(async (resolve) => {
        try {
            for (const empleado of array_emleados) {
                procesados++;
                // Actualizar estado en la UI
                const loadingEl = document.querySelector(".loading-state p");
                if (loadingEl) {
                    loadingEl.innerText = `Procesando empleado ${procesados} de ${total}: ${empleado.nombre}`;
                }

                let sub_template = `
                <div class="cuerpo">
                    <div class="informacion_2">
                        <div class="fila">
                            <div class="columna_2">${empleado.nombre}</div>
                            <div class="columna_2">${empleado.edad}</div>
                            <div class="columna_2">${empleado.sexo}</div>
                            <div class="columna_2">${empleado.nacionalidad}</div>
                            <div class="columna_2">${empleado.puesto}</div>
                        </div>
                    </div>
                    <br><br><br>
                    <div class="informacion_3">
                        <div class="fila">
                            <div class="columna_3">${empleado.afilacion}</div>
                            <div class="columna_3">${empleado.dpi}</div>
                            <div class="columna_3">${empleado.fecha_ingreso}</div>
                            <div class="columna_3">${empleado.fecha_finalizacion}</div>
                        </div>
                    </div>
                    <br><br><br><br><br><br><br><br><br><br><br>
                `;

                await new Promise((resolveAjax) => {
                    $.ajax({
                        url: 'php/servidor.php',
                        type: 'GET',
                        data: {
                            quest: 'lista_libros',
                            id_empleado: empleado.id_empleado,
                            fecha_inicio: sessionStorage.getItem("fecha_inicio"),
                            fecha_final: sessionStorage.getItem("fecha_final"),
                            enero: sessionStorage.getItem("enero"),
                            febrero: sessionStorage.getItem("febrero"),
                            marzo: sessionStorage.getItem("marzo"),
                            abril: sessionStorage.getItem("abril"),
                            mayo: sessionStorage.getItem("mayo"),
                            junio: sessionStorage.getItem("junio"),
                            julio: sessionStorage.getItem("julio"),
                            agosto: sessionStorage.getItem("agosto"),
                            septiembre: sessionStorage.getItem("septiembre"),
                            octubre: sessionStorage.getItem("octubre"),
                            noviembre: sessionStorage.getItem("noviembre"),
                            diciembre: sessionStorage.getItem("diciembre")
                        },
                        success: function (respuesta) {
                            try {
                                let lista_salarios = typeof respuesta === 'string' ? JSON.parse(respuesta) : respuesta;
                                if (Array.isArray(lista_salarios) && lista_salarios.length > 0) {
                                    var i = 0;
                                    sub_template += `<div class="informacion">`;
                                    lista_salarios.forEach(lista => {
                                        i++;
                                        sub_template += `
                                            <div class="fila">
                                                <div class="columna">${i}</div>
                                                <div class="columna">${lista.periodo_trabajo}</div>
                                                <div class="columna">Q.${lista.salario}</div>
                                                <div class="columna">${lista.dias_trabajados}</div>
                                                <div class="columna">${lista.horas_ordinarias}</div>
                                                <div class="columna">${lista.horas_extraordinarias}</div>
                                                <div class="columna">Q.${lista.salario_ordinario}</div>            
                                                <div class="columna">Q.${lista.salario_extraordinario}</div>
                                                <div class="columna">Q.${lista.septimo_asuesto}</div>
                                                <div class="columna">Q.${lista.vacaciones}</div>
                                                <div class="columna">Q.${lista.salario_total}</div>
                                                <div class="columna">Q.${lista.igss}</div>
                                                <div class="columna">${lista.otras_deducciones}</div>
                                                <div class="columna">${lista.total_deducciones}</div>
                                                <div class="columna">${lista.aguinaldo_otros}</div>
                                                <div class="columna">${lista.bon_incentivo}</div>
                                                <div class="columna">${lista.liquido}</div>
                                                <div class="columna"></div>
                                                <div class="columna"></div>
                                            </div>
                                        `;
                                    });
                                    sub_template += `</div></div>`;
                                    template += sub_template;
                                }
                            } catch (e) {
                                console.error("Error procesando datos de empleado:", e);
                            } finally {
                                resolveAjax();
                            }
                        },
                        error: function (error) {
                            console.error("Error en petición lista_libros:", error);
                            resolveAjax(); // Continuar con el siguiente aunque falle
                        }
                    });
                });
            }
            resolve();
        } catch (error) {
            console.error("Error general en reporte:", error);
            resolve();
        }
    }).then(() => {
        if (template === '') {
            document.getElementById("cuerpo_documento").innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h3>No se encontraron registros</h3>
                    <p>No hay pagos registrados para los empleados en el rango de fechas seleccionado.</p>
                    <button onclick="window.history.back()" style="padding: 10px 20px; cursor: pointer;">Regresar</button>
                </div>`;
        } else {
            document.getElementById("cuerpo_documento").innerHTML = template;
        }
    });
}
