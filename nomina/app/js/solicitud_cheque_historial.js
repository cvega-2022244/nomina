var id_lote_detalle = sessionStorage.getItem('id_lote_detalle');
var array_empresas = [];

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = dd + '/' + mm + '/' + yyyy;
var tabla_cheques = document.getElementById("tabla_cheques");
var template_tabla = '';
var monto_empresa = 0;
var monto_total = 0;

$(document).ready(function () {
    cargando();
    lista_empresas();
});

function lista_empresas() {
    return new Promise((resolve) => {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'lista_empresa_cheques_historial',
                id_lote: id_lote_detalle
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
            template_tabla += `
            <tr>
                <td><strong>GRUPO ECONSA</strong></td>
            </tr>
            <tr>
                <td>VERIFICADOR DE PAGO</td>
            </tr>
            <tr>
                <td>FECHA DE PAGO: <strong>${today}</strong></td>
            </tr>
            <tr style="height: 20px; ">
            </tr>
            <tr style="text-align: center; ">
                <td style="border: 1px solid black; width: 25%; ">Nombre de colaborador</td>
                <td style="border: 1px solid black; width: 7%; ">Empresa</td>
                <td style="border: 1px solid black; width: 5%; ">Tipo de Personal</td>
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
                        quest: 'lista_cheques_historial',
                        id_lote: id_lote_detalle,
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
                                    </tr>`;
                                lista_cheques.forEach(function (cheque) {
                                    monto_empresa = monto_empresa + parseFloat(cheque.monto);
                                    monto_total = monto_total + parseFloat(cheque.monto);
                                    template_tabla += `
                                        <tr>
                                            <td>${cheque.empleado}</td>
                                            <td>${cheque.empresa}</td>
                                            <td>${cheque.tipo_personal}</td>
                                            <td>${cheque.soporte}</td>
                                            <td>${cheque.banco}</td>
                                            <td>${cheque.medio_pago}</td>
                                            <td style="text-align: right; ">Q${cheque.monto}</td>
                                            <td></td>
                                        </tr>`;
                                })
                                template_tabla += `
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style="text-align: right; ">Q${monto_empresa.toFixed(2)}</td>
                                    </tr>`;
                                $('#tabla_cheques').html(template_tabla);
                                document.getElementById('total_general').innerHTML = 'Q' + monto_total.toFixed(2);
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