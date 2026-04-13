var lote_activo;
var array_empresas = [];

var fecha_verificador = sessionStorage.getItem('fecha_verificador');
var hora_verificador = sessionStorage.getItem('hora_verificador');
var tabla_cheques = document.getElementById("tabla_cheques");
var template_tabla = '';
var monto_empresa_transferencia = 0;
var monto_empresa = 0;
var monto_total = 0;

$(document).ready(function () {
    cargando();
    obtener_lote_activo();
});

function obtener_lote_activo() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lote_activo',
            },
            success: function (lote) {
                if (lote.includes('Query Fállo')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Lote Activo',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(lote);
                } else if (lote.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Lotes Activos',
                    });
                    console.log(lote);
                } else {
                    try {
                        let lote_parseado = JSON.parse(lote);
                        lote_activo = lote_parseado;
                    } catch (error) {
                        console.log(error);
                    } finally {
                        resolve();
                    }
                }
            }
        })
    }).then((lote) => {
        lista_empresas(lote);
    })
}

function lista_empresas() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_empresa_cheques_verificador',
                id_lote: lote_activo[0].id
            },
            success: function (empresas) {
                if (empresas.includes('Query Fállo')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Al Obtener Empresas',
                        text: 'Por favor, comunicate con sistemas'
                    });
                    console.log(empresas);
                } else if (empresas.includes('No hay datos')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Hay Empresas Registradas',
                    });
                    console.log(empresas);
                } else {
                    try {
                        let lista_empresas = JSON.parse(empresas);
                        lista_empresas.forEach(empresa => {
                            array_empresas.push(empresa);
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
        obtener_lista_cheques();
    })
}

function obtener_lista_cheques() {
    return new Promise((resolve) => {
        try {
            var nota_transferencia = document.getElementById('nota_transferencia');
            nota_transferencia.innerHTML = '<strong>Nota: Transferencia programada para ' + fecha_verificador + ' a las ' + hora_verificador + ' hrs.</strong>';
            template_tabla += `
            <tr>
                <td><strong>GRUPO ECONSA</strong></td>
            </tr>
            <tr>
                <td>VERIFICADOR DE PAGO</td>
            </tr>
            <tr>
                <td>FECHA DE PAGO: <strong>${fecha_verificador}</strong></td>
            </tr>
            <tr style="height: 20px; ">
            </tr>
            <tr style="text-align: center; ">
                <td style="border: 1px solid black; width: 25%; ">Nombre de colaborador</td>
                <td style="border: 1px solid black; width: 7%; ">Empresa</td>
                <td style="border: 1px solid black; width: 5%; ">Tipo de Personal</td>
                <td style="border: 1px solid black; width: 5%; ">LOTE A ELIMINAR</td>
                <td style="border: 1px solid black; width: 5%; ">LOTE CORRECTO</td>
                <td style="border: 1px solid black; width: 5%; ">Soporte</td>
                <td style="border: 1px solid black; width: 15%; ">Banco de Pago</td>
                <td style="border: 1px solid black; width: 10%; ">Medio de Pago</td>
                <td style="border: 1px solid black; width: 10%; ">Monto</td>
                <td style="border: 1px solid black; width: 15%;">Monto Total</td>
            </tr>`;
            array_empresas.forEach(empresa => {
                $.ajax({
                    url: 'php/servidor.php',
                    type: 'GET',
                    data: {
                        quest: 'lista_cheques',
                        id_lote: lote_activo[0].id,
                        id_empresa: empresa.id
                    },
                    success: function (cheques) {
                        if (cheques.includes('Query Fállo')) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error Al Obtener Cheques',
                                text: 'Por favor, comunicate con sistemas'
                            });
                            console.log(cheques);
                        } else if (cheques.includes('No hay datos')) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'No Hay Cheques Registrados',
                            });
                            console.log(cheques);
                        } else {
                            try {
                                monto_empresa = 0;
                                var lote_correcto = sessionStorage.getItem('lote_correcto');
                                var lote_eliminar = sessionStorage.getItem('lote_eliminar');
                                let lista_cheques = JSON.parse(cheques);
                                template_tabla += `
                                    <tr>
                                        <td style="height: 5vh; "><strong>Empresa: ${empresa.nombre}, S. A. </strong></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;">Varios Plantilla</td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;"></td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;"></td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;"><strong>${lote_eliminar}</strong></td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;"><strong>${lote_correcto}</strong></td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;">Nomina</td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;"><strong>${empresa.banco_empresa}</strong></td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;">Transferencia</td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double; text-align: right;"><strong>Q.${empresa.liquido_transferencia}</strong></td>
                                        <td style=" border-bottom: 5px solid black; border-bottom-style: double;"></td>
                                    </tr>`;
                                lista_cheques.forEach(function (cheque) {
                                    monto_empresa = monto_empresa + parseFloat(cheque.monto);
                                    monto_total = monto_total + parseFloat(cheque.monto)
                                    template_tabla += `
                                        <tr>
                                            <td>${cheque.empleado}</td>
                                            <td>${cheque.empresa}</td>
                                            <td>${cheque.tipo_personal}</td>
                                            <td></td>
                                            <td></td>
                                            <td>${cheque.soporte}</td>
                                            <td>${cheque.banco}</td>
                                            <td>${cheque.medio_pago}</td>
                                            <td style="text-align: right; ">Q.${cheque.monto}</td>
                                            <td></td>
                                        </tr>`;
                                })
                                monto_total = monto_total + parseFloat(empresa.liquido_transferencia);
                                monto_empresa_transferencia = monto_empresa + parseFloat(empresa.liquido_transferencia);
                                template_tabla += `
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style="text-align: right; ">Q.${monto_empresa.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style="height: 3vh; "></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style="text-align: right; "><strong>Q.${monto_empresa_transferencia.toFixed(2)}</strong></td>
                                    </tr>`;
                                $('#tabla_cheques').html(template_tabla);
                                document.getElementById('total_general').innerHTML = '<strong>Q' + (monto_total.toFixed(2)) + '</strong>';
                            } catch (error) {
                                console.log(error);
                            } finally {
                                resolve();
                            }
                        }
                    }
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            resolve();
        }
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