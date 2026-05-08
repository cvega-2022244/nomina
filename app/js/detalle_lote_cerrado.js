var empleados_en_nomina = [];
var empleados_fuera_nomina = [];
var empleados = [];
var nomina_activa = sessionStorage.getItem('nomina_activa');
var id_lote_activo;

$(document).ready(function () {
    nombre_lote_cerrado();
})

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

function descuentos() {
    window.location.href = './descuentos_lote_cerrado.html';
}

function pagos() {
    window.location.href = './pagos_lote_cerrado.html';
}

function isr() {
    window.location.href = './isr_lote_cerrado.html';
}

function facturacion() {
    window.location.href = './facturacion.html';
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