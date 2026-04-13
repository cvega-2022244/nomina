var empleados_en_nomina = [];
var empleados_fuera_nomina = [];
var empleados = [];
var nomina_activa = sessionStorage.getItem('nomina_activa');
var id_lote_activo;
var tipo_modal;

$(document).ready(function () {
    inicializar_select();
})

function inicializar_select() {
    return new Promise((resolve) => {
        cargando();
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
                            template += `<option value="${empresa.id}">${empresa.nombre_comercial}</option>`
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
        nombre_lote_cerrado();
    })
}

function nombre_lote_cerrado() {
    try {
        var titulo_lote = document.getElementById('titulo_lote_cerrado');
        var nombre_lote = sessionStorage.getItem('nombre_lote_detalle');
        titulo_lote.innerHTML = nombre_lote;
    } catch (error) {
        console.log(error);
    } finally {
        validacion_quincena_facturacion();
    }
}

function validacion_quincena_facturacion() {
    try {
        var quincena = sessionStorage.getItem('quincena_detalle');
        var btn_facturacion = document.getElementById('btn_facturacion');
        if (quincena == '0') {
            btn_facturacion.style.display = 'none';
        } else {
            btn_facturacion.style.display = '';
        }
    } catch (error) {
        console.log(error);
    } finally {
        Swal.close();
    }
}

function bonos() {
    window.location.href = './seleccion_bonos_lote_cerrado.html';
}

function horas_extra() {
    window.location.href = './horas_extra_lote_cerrado.html';
}

function dias_laborados() {
    window.location.href = './dias_laborados_lote_cerrado.html';
}

function mostrar_modal(tipo) {
    tipo_modal = tipo
    $('#modal_empresa').modal('show')
}

function descuentos_pago() {
    if (tipo_modal == 0) {
        window.location.href = './descuentos_lote_cerrado.html';
    } else {
        window.location.href = './pagos_lote_cerrado.html';
    }
}

function isr() {
    window.location.href = './isr_lote_cerrado.html';
}

function facturacion() {
    window.location.href = './facturacion.html';
}

function seleccionar_empresa() {
    sessionStorage.setItem('id_empresa_nomina', slc_empresa.value);
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