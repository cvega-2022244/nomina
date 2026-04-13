$(document).ready(function () {
    var id_lote = sessionStorage.getItem("id_lote_detalle");
    traer_empleados(id_lote);
})


async function traer_empleados(id_lote) {
    const listaEmpleado = await $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'lista_recibo_pago',
            id_lote
        }
    });

    let empleados = JSON.parse(listaEmpleado);
    let template = '';

    empleados.forEach(empleado => {
        console.log(empleado.lote);
        template += `
            <div class="container">
                <br>
                <div>
                    <div class="row">
                        <div class="col-6" style="float: left;">
                            <img src="./img/Econsa.png" height="70px">
                        </div>
                        <div class="col-6"><strong>Recibo de pago de sueldos y salarios</strong></div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="nombre_empleado"><strong>Nombre:</strong> ${empleado.empleado}
                            </div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="puesto"><strong>Puesto:</strong> ${empleado.puesto}</div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="recibe"><strong>Recibe de:</strong> ${empleado.empresa}
                            </div>
                        </div>
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="recibe"><strong>El valor:</strong> ${formatear_numeros(empleado.segunda)}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                        <div style="float: left; margin-left: 20%;" id="pago_nomina"><strong>Por concepto de:</strong> Pago de nómina ${obtenerNombreDelMes(empleado.lote)}</div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: right;">(+) Desglose</div>
                        </div>
                        <div class="col-6">
                            <div style="float: right;">(-) Descuentos</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Días laborados:</strong></div>
                            <div style="float: right;" id="dias_laborados">${empleado.dias_laborados}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>IGSS Mensual:</strong></div>
                            <div style="float: right;" id="igss_mensual">${formatear_numeros(empleado.igss)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Sueldo devengado:</strong></div>
                            <div style="float: right;" id="sueldo">${formatear_numeros(empleado.sueldo_devengado)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>Bancos:</strong></div>
                            <div style="float: right;" id="bancos">${formatear_numeros(empleado.banco)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Bonificación inc. Dec. 37</strong></div>
                            <div style="float: right;" id="bonificacion">${formatear_numeros(empleado.bonificacion)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>ISR Mensual:</strong></div>
                            <div style="float: right;" id="isr">${formatear_numeros(empleado.isr)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Horas Extras Diurnas</strong></div>
                            <div style="float: right;" id="horas_diurnas">${(empleado.cantidad_horas_dia)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>Celulares:</strong></div>
                            <div style="float: right;" id="celular">${formatear_numeros(empleado.celular)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Monto de Hrs. Extras Diurnas</strong></div>
                            <div style="float: right;" id="monto_diurnas">${formatear_numeros(empleado.horas_dia)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>Otros descuentos:</strong></div>
                            <div style="float: right;" id="otros_descuentos">${formatear_numeros(empleado.descuentos)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Horas Extras Nocturnas</strong></div>
                            <div style="float: right;" id="horas_nocturnas">${(empleado.cantidad_horas_noche)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>PRIMERA QUINCENA:</strong></div>
                            <div style="float: right;" id="primera_quincena">${formatear_numeros(empleado.primera)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Monto de Hrs. Extras Nocturnas</strong></div>
                            <div style="float: right;" id="monto_nocturnas">${formatear_numeros(empleado.horas_noche)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>Otros Egresos:</strong></div>
                            <div style="float: right;" id="otros_egresos">
                                ${ formatear_numeros(parseFloat(empleado.igss) + parseFloat(empleado.banco) + parseFloat(empleado.isr) + parseFloat(empleado.celular) + parseFloat(empleado.descuentos))}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Otros Ingresos</strong></div>
                            <div style="float: right;" id="otros_ingresos">${empleado.otros_ingresos}</div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>TOTAL INGRESOS</strong></div>
                            <div style="float: right;" id="total_ingresos">
                                ${formatear_numeros(Math.round(parseFloat(empleado.sueldo_devengado) + parseFloat(empleado.bonificacion) + parseFloat(empleado.horas_dia) + 
                                    parseFloat(empleado.horas_noche) + parseFloat(empleado.horas_noche)).toFixed(2))}
                            </div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <div class="row">
                        <div class="col-6"></div>
                        <div class="col-6">
                            <div style="float: left;"><strong>LÍQUIDO A RECIBIR:</strong></div>
                            <div style="float: right;" id="liquido_recibir">
                                ${formatear_numeros(empleado.segunda)}
                            </div>
                        </div>
                    </div>
                    <br><br><br>
                    <div class="row">
                        <div class="col">
                            <div style="float: right;">Recibí conforme</div>
                        </div>
                        <div class="col">
                            <div>________________________________________</div>
                        </div>
                        <div class="col">
                            <div style="float: left;">
                                Guatemala, 30/09/2023
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col"></div>
                        <div class="col" id="empleado"></div>
                        <div class="col"></div>
                    </div>
                </div>
                - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                <div>
                    <div class="row">
                        <div class="col-6" style="float: left;">
                            <img src="./img/Econsa.png" height="70px">
                        </div>
                        <div class="col-6"><strong>Recibo de pago de sueldos y salarios</strong></div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="nombre_empleado"><strong>Nombre:</strong> ${empleado.empleado}
                            </div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="puesto"><strong>Puesto:</strong> ${empleado.puesto}</div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="recibe"><strong>Recibe de:</strong> ${empleado.empresa}
                            </div>
                        </div>
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="recibe"><strong>El valor:</strong> ${formatear_numeros(empleado.segunda)}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;" id="pago_nomina"><strong>Por concepto de:</strong> Pago de nómina ${obtenerNombreDelMes(empleado.lote)}</div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: right;">(+) Desglose</div>
                        </div>
                        <div class="col-6">
                            <div style="float: right;">(-) Descuentos</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Días laborados:</strong></div>
                            <div style="float: right;" id="dias_laborados">${empleado.dias_laborados}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>IGSS Mensual:</strong></div>
                            <div style="float: right;" id="igss_mensual">${formatear_numeros(empleado.igss)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Sueldo devengado:</strong></div>
                            <div style="float: right;" id="sueldo">${formatear_numeros(empleado.sueldo_devengado)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>Bancos:</strong></div>
                            <div style="float: right;" id="bancos">${formatear_numeros(empleado.banco)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Bonificación inc. Dec. 37</strong></div>
                            <div style="float: right;" id="bonificacion">${formatear_numeros(empleado.bonificacion)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>ISR Mensual:</strong></div>
                            <div style="float: right;" id="isr">${formatear_numeros(empleado.isr)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Horas Extras Diurnas</strong></div>
                            <div style="float: right;" id="horas_diurnas">${formatear_numeros(empleado.cantidad_horas_dia)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>Celulares:</strong></div>
                            <div style="float: right;" id="celular">${formatear_numeros(empleado.celular)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Monto de Hrs. Extras Diurnas</strong></div>
                            <div style="float: right;" id="monto_diurnas">${formatear_numeros(empleado.horas_dia)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>Otros descuentos:</strong></div>
                            <div style="float: right;" id="otros_descuentos">${formatear_numeros(empleado.descuentos)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Horas Extras Nocturnas</strong></div>
                            <div style="float: right;" id="horas_nocturnas">${formatear_numeros(empleado.cantidad_horas_noche)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>PRIMERA QUINCENA:</strong></div>
                            <div style="float: right;" id="primera_quincena">${formatear_numeros(empleado.primera)}</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Monto de Hrs. Extras Nocturnas</strong></div>
                            <div style="float: right;" id="monto_nocturnas">${formatear_numeros(empleado.horas_noche)}</div>
                        </div>
                        <div class="col-6">
                            <div style="float: left;"><strong>Otros Egresos:</strong></div>
                            <div style="float: right;" id="otros_egresos">
                                ${ formatear_numeros(parseFloat(empleado.igss) + parseFloat(empleado.banco) + parseFloat(empleado.isr) + parseFloat(empleado.celular) + parseFloat(empleado.descuentos))}
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>Otros Ingresos</strong></div>
                            <div style="float: right;" id="otros_ingresos">${empleado.otros_ingresos}</div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div style="float: left; margin-left: 20%;"><strong>TOTAL INGRESOS</strong></div>
                            <div style="float: right;" id="total_ingresos">
                                ${formatear_numeros(Math.round(parseFloat(empleado.sueldo_devengado) + parseFloat(empleado.bonificacion) + parseFloat(empleado.horas_dia) + 
                                    parseFloat(empleado.horas_noche) + parseFloat(empleado.horas_noche)).toFixed(2))}
                            </div>
                        </div>
                        <div class="col-6"></div>
                    </div>
                    <div class="row">
                        <div class="col-6"></div>
                        <div class="col-6">
                            <div style="float: left;"><strong>LÍQUIDO A RECIBIR:</strong></div>
                            <div style="float: right;" id="liquido_recibir">
                                ${formatear_numeros(empleado.segunda)}
                            </div>
                        </div>
                    </div>
                    <br><br><br>
                    <div class="row">
                        <div class="col">
                            <div style="float: right;">Recibí conforme</div>
                        </div>
                        <div class="col">
                            <div>________________________________________</div>
                        </div>
                        <div class="col">
                            <div style="float: left;">
                                Guatemala, 30/09/2023
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col"></div>
                        <div class="col" id="empleado"></div>
                        <div class="col"></div>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('recibo_pago').innerHTML = template;
}

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

function obtenerNombreDelMes(numeroMes) {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Restamos 1 al número del mes para que coincida con el índice del array
    if (numeroMes >= 1 && numeroMes <= 12) {
        return meses[numeroMes - 1];
    } else {
        return "Mes no válido";
    }
}