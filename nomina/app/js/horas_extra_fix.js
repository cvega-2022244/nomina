// ARCHIVO NUEVO - horas_extra_fix.js
console.log('=== CARGANDO horas_extra_fix.js ===');

var bonos_confirmados = [];
var quincena = sessionStorage.getItem("quincena");

$(document).ready(function() {
    console.log('Document ready');
    cargando();
    listado_horas();
});

function formatear_numeros(numero) {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ',
        minimumIntegerDigits: 2
    }).format(numero);
}

function listado_horas() {
    $.get('php/servidor.php', { quest: 'horas_extra' }, function(res) {
        Swal.close();
        console.log('Listado horas respuesta:', res);
        
        if (res.indexOf('Query Falló') !== -1) {
            Swal.fire('Error', 'Error al obtener horas extra', 'error');
            $('#chx_todos').hide();
            return;
        }
        
        if (res.indexOf('No hay datos') !== -1) {
            Swal.fire('Info', 'No hay horas extras autorizadas', 'warning');
            $('#chx_todos').hide();
            return;
        }
        
        try {
            var lista = JSON.parse(res);
            var html = '';
            
            for (var i = 0; i < lista.length; i++) {
                var item = lista[i];
                html += '<tr>';
                html += '<td class="text-center"><input class="form-check-input chk-hora" type="checkbox" data-id="' + item.id + '" data-empleado="' + item.id_empleado + '"';
                if (item.seleccionado == 1) html += ' checked';
                html += ' id="chk_' + item.id + '"></td>';
                html += '<td>' + item.id + '</td>';
                html += '<td>' + item.empleado + '</td>';
                html += '<td>' + item.fecha_trabajado + '</td>';
                html += '<td>' + item.horas + '</td>';
                html += '<td>' + item.jornada + '</td>';
                html += '<td>' + formatear_numeros(item.monto) + '</td>';
                
                var badge = 'secondary';
                if (item.estado == 'Autorizado') badge = 'primary';
                else if (item.estado == 'Pagado') badge = 'success';
                else if (item.estado == 'Rechazado') badge = 'danger';
                else if (item.estado == 'Solicitado') badge = 'warning';
                html += '<td><span class="badge badge-' + badge + ' badge-pill">' + item.estado + '</span></td>';
                
                html += '<td><div class="action-btns">';
                html += '<a onclick="detalle_hora(' + item.id + ')" class="action-btn btn-view bs-tooltip me-2" title="Ver"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a>';
                html += '<a onclick="advertencia_anular_hora(' + item.id + ')" class="action-btn btn-delete bs-tooltip" title="Anular"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>';
                html += '</div></td></tr>';
            }
            
            $('#tabla').DataTable().destroy();
            $('#cuerpo_tabla').html(html);
            
            // Agregar evento a los checkboxes
            $('.chk-hora').off('change').on('change', function() {
                var id = $(this).data('id');
                var idEmpleado = $(this).data('empleado');
                var checked = $(this).is(':checked');
                procesarHoraExtra(id, idEmpleado, checked, this);
            });
            
            $('#tabla').DataTable({
                "lengthMenu": [1000, 2000],
                "pageLength": 1000
            });
            
        } catch (e) {
            console.log('Error parsing:', e);
            Swal.close();
        }
    }).fail(function() {
        Swal.close();
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

function procesarHoraExtra(id, idEmpleado, checked, checkbox) {
    console.log('procesarHoraExtra:', id, checked);
    
    var accion = checked ? 'confirmar_hora_extra' : 'desaprobar_hora_extra';
    
    Swal.fire({
        title: 'Guardando...',
        allowOutsideClick: false,
        didOpen: function() { Swal.showLoading(); }
    });
    
    $.post('php/servidor.php', { quest: accion, id: id }, function(resp) {
        console.log('Respuesta:', resp);
        Swal.close();
        
        if (resp.indexOf('Falló') !== -1) {
            Swal.fire('Error', 'No se pudo actualizar', 'error');
            checkbox.checked = !checked;
        } else {
            Swal.fire({ icon: 'success', title: 'OK', text: 'Actualizado', timer: 1000, showConfirmButton: false });
        }
    }).fail(function() {
        Swal.close();
        Swal.fire('Error', 'Error de conexión', 'error');
        checkbox.checked = !checked;
    });
}

// Mantener compatibilidad con onclick del HTML
function confirmar_hora_extra(id, idEmpleado) {
    var chk = document.getElementById(String(id)) || document.getElementById('chk_' + id);
    if (chk) {
        procesarHoraExtra(id, idEmpleado, chk.checked, chk);
    } else {
        alert('Checkbox no encontrado: ' + id);
    }
}

function detalle_hora(id) {
    cargando();
    $.get('php/servidor.php', { quest: 'detalle_horas_extra', id: id }, function(res) {
        Swal.close();
        if (res.indexOf('Falló') !== -1) {
            Swal.fire('Error', 'Error al cargar detalle', 'error');
            return;
        }
        var data = JSON.parse(res);
        if (data.length > 0) {
            var d = data[0];
            $('#nombre_completo_detalle').val(d.empleado);
            $('#departamento_detalle').val(d.departamento);
            $('#fecha_trabajada_detalle').val(d.fecha_trabajado);
            $('#empresa_detalle').val(d.empresa);
            $('#horas_trabajadas_detalle').val(d.horas);
            $('#jornada_detalle').val(d.jornada);
            $('#monto_detalle').val(formatear_numeros(d.monto));
            $('#observaciones_detalle').val(d.observacion);
            $('#solicitador_detalle').val(d.solicitador);
            $('#fecha_solicitado_detalle').val(d.fecha_solicitado);
            $('#detalle').modal('show');
        }
    }).fail(function() {
        Swal.close();
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

function advertencia_anular_hora(id) {
    Swal.fire({
        title: '¿Anular esta hora extra?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, anular',
        cancelButtonText: 'Cancelar'
    }).then(function(r) {
        if (r.isConfirmed) anular_hora(id);
    });
}

function anular_hora(id) {
    cargando();
    $.post('php/servidor.php', { quest: 'anular_hora_extra', id: id }, function(resp) {
        if (resp.indexOf('Falló') !== -1) {
            Swal.fire('Error', 'No se pudo anular', 'error');
        } else {
            Swal.fire('OK', 'Anulado correctamente', 'success').then(function() {
                cargando();
                listado_horas();
            });
        }
    }).fail(function() {
        Swal.close();
        Swal.fire('Error', 'Error de conexión', 'error');
    });
}

function cargando() {
    Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: function() { Swal.showLoading(); }
    });
}

function click_seleccionar_todos() {
    var chks = document.querySelectorAll('.chk-hora');
    var primero = chks[0];
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked !== primero.checked) {
            $(chks[i]).trigger('change');
        }
    }
}

console.log('=== horas_extra_fix.js CARGADO COMPLETAMENTE ===');
