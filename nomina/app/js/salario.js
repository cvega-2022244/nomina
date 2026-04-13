var array_emleados = [];
var array_salarios = [];
var template = '';

$(document).ready(function () {
    mensaje_margenes();
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'usuarios_salario'
            },
            success: function (res) {
                try {
                    let lista = JSON.parse(res);
                    lista.forEach(element => {
                        array_emleados.push(element);
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    resolve();
                }
            }
        });
    }).then(() => {
        obtener_lista_salarios();
    });
});

function mensaje_margenes() {
    alert(`Poner la siguiente configuración al momento de imprimir:

Tamaño de papel: Oficio o legal
Escala: 55
Margen Izquierdo: 34mm
Margen Superior: 42mm
Margen Derecho: 12.5mm
Margen Inferior:0mm`);
}


function obtener_lista_salarios() {
    return new Promise(async (resolve) => {
        try {
            for (const empleado of array_emleados) {
                template += `
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

                await new Promise((resolveAjax, rejectAjax) => {
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
                            let lista_salarios = JSON.parse(respuesta);
                            var i = 0;
                            template += `<div class="informacion">`;

                            lista_salarios.forEach(lista => {
                                i++;
                                template += `
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

                            template += `
                                    </div>
                                </div>
                            `;
                            resolveAjax();
                        },
                        error: function (error) {
                            rejectAjax(error);
                        }
                    });
                });
            }

            resolve();
        } catch (error) {
            console.log(error);
        }
    }).then(() => {
        document.getElementById("cuerpo_documento").innerHTML = template;
    });
}
