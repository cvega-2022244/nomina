$(document).ready(function () {
    cargando();
    let indemnizacion_f = 0;
    let aguinaldo_f = 0;
    let bono_f = 0;
    let vacaciones_f = 0;

    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'liquidacion_empleado',
            id_empleado: sessionStorage.getItem("id_empleado_liquidacion")
        },
        success: function (res) {
            let empleado;
                if (typeof res === 'string') {
                    empleado = JSON.parse(res);
                } else {
                    empleado = res; // jQuery ya parseó el JSON
                }

            empleado.forEach(lista => {
                // const saldo_anadido = ((lista.sueldo_diario * lista.dias_exceso) * 0.0833);
                const saldo_anadido = 0;
                console.log(lista.dias_exceso);
                document.getElementById("empresa").innerHTML = lista.empresa;
                document.getElementById("nombre").innerHTML = `<small>${lista.nombre}</small>`;
                document.getElementById("fecha_ingreso").innerHTML = `<small>${lista.fecha_inicio}</small>`;
                document.getElementById("fecha_egreso").innerHTML = `<small>${lista.fecha_baja}</small>`;
                document.getElementById("sueldo_ordinario").innerHTML = `<small>${formatear_numeros(lista.sueldo_ordinario)}</small>`;
                document.getElementById("dias_trabajados").innerHTML = `<small>${lista.baja}</small>`;
                document.getElementById("indemnizacion").innerHTML = `<small>${formatear_numeros(lista.indemnizacion * (sessionStorage.getItem("porcentaje_liquidacion") / 100))}</small>`;
                indemnizacion_f = (lista.indemnizacion * (sessionStorage.getItem("porcentaje_liquidacion") / 100));
                document.getElementById("inde_aguinaldo").innerHTML = `<small>${formatear_numeros(lista.aguinaldo)}</small>`;
                document.getElementById("inde_bono").innerHTML = `<small>${formatear_numeros(lista.bono)}</small>`;
                document.getElementById("sueldo_base").innerHTML = `<small>${formatear_numeros(lista.sueldo_base)}</small>`;
                document.getElementById("base_calculo").innerHTML = `<small>${formatear_numeros(lista.base_calculo)}</small>`;
                document.getElementById("dias_calculo").innerHTML = `<small>${lista.baja}</small>`;
                document.getElementById("porcentaje").innerHTML = `<small>${sessionStorage.getItem("porcentaje_liquidacion")}%</small>`;
                document.getElementById("aguinaldo").innerHTML = `<small>${formatear_numeros((parseFloat(lista.aguinaldo_real) + saldo_anadido))}</small>`;
                aguinaldo_f = (parseFloat(lista.aguinaldo_real) + saldo_anadido);
                document.getElementById("dias_aguinaldo").innerHTML = `<small>${(lista.dias_aguinaldo)}</small>`;
                document.getElementById("inicio_aguinaldo").innerHTML = `<small>${(lista.inicio_aguinaldo)}</small>`;
                document.getElementById("final_aguinaldo").innerHTML = `<small>${(lista.fecha_baja)}</small>`;
                document.getElementById("bono").innerHTML = `<small>${formatear_numeros((parseFloat(lista.bono_real) + saldo_anadido))}</small>`;
                bono_f = (parseFloat(lista.bono_real) + saldo_anadido);
                document.getElementById("dias_bono").innerHTML = `<small>${(lista.dias_bono)}</small>`;
                document.getElementById("inicio_bono").innerHTML = `<small>${(lista.inicio_bono)}</small>`;
                document.getElementById("final_bono").innerHTML = `<small>${(lista.fecha_baja)}</small>`;
                document.getElementById("inicio_vac").innerHTML = `<small>${(lista.fecha_inicio)}</small>`;
                document.getElementById("final_vac").innerHTML = `<small>${(lista.fecha_baja)}</small>`;
                document.getElementById("dias_trab_vac").innerHTML = `<small>${(lista.baja)}</small>`;
                document.getElementById("dias_vacaciones").innerHTML = `<small>${parseFloat((lista.baja * 15) / 365).toFixed(2)}</small>`;

                $.ajax({
                    url: 'php/servidor.php',
                    type: 'GET',
                    data: {
                        quest: 'lista_vacaciones',
                        id_permiso: sessionStorage.getItem("id_permiso_liquidacion")
                    },
                    success: function (resp) {
                        console.log(resp);
                        let gozados = 0;
                        if (resp != 0) {
                            let vac;
                if (typeof resp === 'string') {
                    vac = JSON.parse(resp);
                } else {
                    vac = resp; // jQuery ya parseó el JSON
                }

                            vac.forEach(list => {
                                gozados += parseFloat(list.total_dias);
                            });
                        }

                        console.log(lista.sueldo_anual);
                        document.getElementById("dias_gozados").innerHTML = `<small>${(gozados)}</small>`;
                        document.getElementById("dias_sobrantes").innerHTML = `<small>${parseFloat(((lista.baja * 15) / 365) - gozados).toFixed(2)}</small>`;
                        document.getElementById("monto_vacaciones").innerHTML = `<small>${formatear_numeros((lista.sueldo_anual / 30) * (parseFloat(((lista.baja * 15) / 365) - gozados).toFixed(2)))}</small>`;
                        vacaciones_f = ((lista.sueldo_anual / 30) * (parseFloat(((lista.baja * 15) / 365) - gozados).toFixed(2)));
                        $.ajax({
                            url: 'php/servidor.php',
                            type: 'GET',
                            data: {
                                quest: 'descuentos_faltantes',
                                id_empleado: sessionStorage.getItem("id_empleado_liquidacion")
                            },
                            success: function (response) {
                                if (response.includes('Query Falló')) {
                                    Swal.fire({
                                        title: 'Error',
                                        html: 'Ha ocurrido un error al obtener los descuentos del empleado, por favor, comunicate con sistemas.',
                                        icon: 'error',
                                        allowOutsideClick: false,
                                        showConfirmButton: true,
                                    });
                                } else if (response.includes('No hay datos')) {
                                    console.log(response);
                                    Swal.close();
                                } else {
                                    let desc = JSON.parse(response);
                                    let template = '';
                                    let descuento = 0;
                                    desc.forEach(listado => {
                                        descuento += parseFloat(listado.falta);
                                        template +=
                                            `
                                            <div class="row justify-content-center">
                                                <div class="col-2"><h6><strong>${listado.egreso}:</strong></h6></div>
                                                <div class="col-3"><h6>${listado.falta}</h6></div>
                                            </div>
                                        `;
                                    });
                                    console.log(descuento);
                                    document.getElementById("monto_descuentos").innerHTML = formatear_numeros(descuento);
                                    document.getElementById("descuentos_variables").innerHTML = template;
                                    document.getElementById("total_ingresos").innerHTML = formatear_numeros(indemnizacion_f + aguinaldo_f + bono_f + vacaciones_f);
                                    var total = document.getElementById("total").innerHTML = formatear_numeros((indemnizacion_f + aguinaldo_f + bono_f + vacaciones_f) - descuento);
                                    Swal.close();
                                }
                            }
                        });
                    }
                });
            });
        }
    });
});

function formatear_numeros(numero) {
    const number = numero;
    const locale = 'es-GT'; // The locale of the user's browser

    const options = {
        style: 'currency',
        currency: 'GTQ',
        minimumIntegerDigits: 2,
    };

    const formattedNumber = new Intl.NumberFormat(locale, options).format(number);
    return formattedNumber;
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