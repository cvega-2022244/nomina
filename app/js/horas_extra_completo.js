var horas_confirmados = new Array();
var quincena = sessionStorage.getItem('quincena');

// Función para generar botones según el rol del usuario
function getActionButtonsHoras(horaId, idEmpleado) {
    const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
    const userRole = userData ? userData.rol : null;
    const empleadoId = idEmpleado || 0;
    
    if (userRole === 'operaciones' || userRole === 'empleado') {
        // Operaciones solo puede ver detalles
        return `
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalleHora(${horaId}, ${empleadoId})" title="Ver Detalles">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        `;
    } else if (userRole === 'admin') {
        // Admin puede aprobar/rechazar
        return `
            <button type="button" class="btn btn-outline-success btn-sm" onclick="aprobar_hora(${horaId})" title="Aprobar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
            </button>
            <button type="button" class="btn btn-outline-warning btn-sm" onclick="rechazar_hora(${horaId})" title="Rechazar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </button>
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalleHora(${horaId}, ${empleadoId})" title="Ver Detalles">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        `;
    } else {
        // Por defecto, solo ver detalles
        return `
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalleHora(${horaId}, ${empleadoId})" title="Ver Detalles">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        `;
    }
}

function obtener_lote_activo_info() {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: { quest: 'lote_activo' },
        success: function (resp) {
            try {
                let lista = typeof resp === 'string' ? JSON.parse(resp) : resp;
                if (lista && lista.length > 0) {
                    const badge = document.getElementById('nombre_lote_badge');
                    if (badge) badge.innerHTML = lista[0].nombre;
                }
            } catch (e) {}
        }
    });
}

$(document).ready(function () {
    obtener_lote_activo_info();
    console.log('🚀 Iniciando carga de horas extra con pestañas...');
    cargando();
    
    // Establecer fecha por defecto (último mes)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    $('#filtro_fecha_desde_horas').val(haceUnMes.toISOString().split('T')[0]);
    $('#filtro_fecha_hasta_horas').val(hoy.toISOString().split('T')[0]);
    
    // Cargar historial completo primero
    cargar_historial_horas();
    
    // Cargar las otras pestañas
    Promise.all([
        listado_horas_pendientes(),
        listado_horas_autorizadas(),
        listado_horas_rechazadas()
    ]).then(() => {
        console.log('✅ Todas las pestañas de horas extra cargadas correctamente');
        Swal.close();
    }).catch((error) => {
        console.error('❌ Error en la carga:', error);
        Swal.close();
    });
    
    // Inicializar las pestañas de Bootstrap manualmente
    var tabElements = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabElements.forEach(function(tabEl) {
        tabEl.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remover clase active de todas las pestañas y contenidos
            document.querySelectorAll('#myTabHoras .nav-link').forEach(function(tab) {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('#myTabContentHoras .tab-pane').forEach(function(pane) {
                pane.classList.remove('show', 'active');
            });
            
            // Activar la pestaña clickeada
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Mostrar el contenido correspondiente
            var targetId = this.getAttribute('data-bs-target');
            var targetPane = document.querySelector(targetId);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
            
            console.log('📑 Pestaña activada:', targetId);
        });
    });
    
    // Cargar rechazadas cuando se hace clic en la pestaña
    $('#rechazadas-horas-tab').on('click', function() {
        console.log('🔄 Cargando horas extra rechazadas...');
        listado_horas_rechazadas();
    });
    
    // Recargar historial cuando se hace clic en la pestaña
    $('#historial-horas-tab').on('click', function() {
        console.log('🔄 Recargando historial de horas extra...');
        cargar_historial_horas();
    });
    
    // Recargar pendientes cuando se hace clic en la pestaña
    $('#pendientes-horas-tab').on('click', function() {
        console.log('🔄 Recargando horas extra pendientes...');
        listado_horas_pendientes();
    });
    
    // Recargar autorizadas cuando se hace clic en la pestaña
    $('#autorizadas-horas-tab').on('click', function() {
        console.log('🔄 Recargando horas extra autorizadas...');
        listado_horas_autorizadas();
    });
    
    // Botón de aplicar filtros
    $('#btn_aplicar_filtros_horas').on('click', function() {
        cargar_historial_horas();
    });
});

function formatear_numeros(numero) {
    const number = numero;
    const locale = 'es-GT';
    const options = {
        style: 'currency',
        currency: 'GTQ',
        minimumIntegerDigits: 2,
    };
    const formattedNumber = new Intl.NumberFormat(locale, options).format(number);
    return formattedNumber;
}

// ====== PESTAÑA PENDIENTES ======
function listado_horas_pendientes() {
    return new Promise((resolve, reject) => {
        console.log('📊 Cargando horas extra pendientes...');
        
        const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
        const userId = userData ? userData.id : null;
        const userRole = userData ? userData.rol : null;
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'lista_comisiones_pendientes',
                user_id: userId,
                user_role: userRole
            },
            success: function (res) {
                try {
                    if (!res || res === '0' || res.includes('No hay datos')) {
                        $('#cuerpo_tabla_pendientes_horas').html('<tr><td colspan="9" class="text-center">No hay comisiones pendientes de aprobación</td></tr>');
                        $('#chx_todos_pendientes_horas').hide();
                        resolve();
                        return;
                    }
                    
                    let lista;
                    if (typeof res === 'string') {
                        lista = JSON.parse(res);
                    } else {
                        lista = res;
                    }
                    
                    let template = '';
                    const isOperaciones = userRole === 'operaciones' || userRole === 'empleado';
                    
                    if (lista && lista.length > 0) {
                        lista.forEach(item => {
                            template += `
                            <tr role="row">
                                ${isOperaciones ? '' : `<td class="text-center admin-only-aprobar"><input class="form-check-input" type="checkbox"
                                    id="pend-hora-${item.id}" onchange="aprobar_hora(${item.id})"></td>`}
                                <td class="text-center">${item.id}</td>
                                <td class="text-center">${item.empleado}</td>
                                <td class="text-center">${item.fecha_trabajado || 'N/A'}</td>
                                <td class="text-center">${item.horas || 0}</td>
                                <td class="text-center">${item.jornada || 'N/A'}</td>
                                <td class="text-center">${formatear_numeros(item.monto)}</td>
                                <td class="text-center"><span class="badge badge-warning">${item.estado}</span></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        ${getActionButtonsHoras(item.id, item.id_empleado)}
                                    </div>
                                </td>
                            </tr>
                            `;
                        });
                        $('#chx_todos_pendientes_horas').show();
                    } else {
                        template = '<tr><td colspan="9" class="text-center">No hay comisiones pendientes de aprobación</td></tr>';
                        $('#chx_todos_pendientes_horas').hide();
                    }
                    
                    $('#cuerpo_tabla_pendientes_horas').html(template);
                    console.log('✅ Horas extra pendientes cargadas');
                    resolve();
                    
                } catch (error) {
                    console.error('❌ Error al parsear horas pendientes:', error);
                    reject(error);
                }
            },
            error: function (xhr, status, error) {
                console.error('❌ Error AJAX en horas pendientes:', error);
                reject(error);
            }
        });
    });
}

// ====== PESTAÑA AUTORIZADAS ======
function listado_horas_autorizadas() {
    return new Promise((resolve, reject) => {
        console.log('📊 Cargando horas extra autorizadas...');
        
        const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
        const userId = userData ? userData.id : null;
        const userRole = userData ? userData.rol : null;
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'lista_comisiones_autorizados',
                user_id: userId,
                user_role: userRole
            },
            success: function (res) {
                try {
                    if (!res || res === '0' || res.includes('No hay datos')) {
                        $('#cuerpo_tabla_autorizadas_horas').html('<tr><td colspan="9" class="text-center">No hay comisiones autorizadas</td></tr>');
                        $('#chx_todos_autorizadas_horas').hide();
                        resolve();
                        return;
                    }
                    
                    let lista;
                    if (typeof res === 'string') {
                        lista = JSON.parse(res);
                    } else {
                        lista = res;
                    }
                    
                    let template = '';
                    const isOperaciones = userRole === 'operaciones' || userRole === 'empleado';
                    
                    if (lista && lista.length > 0) {
                        lista.forEach(item => {
                            const isChecked = item.seleccionado == 1 ? 'checked' : '';
                            template += `
                            <tr role="row">
                                ${isOperaciones ? '' : `<td class="text-center admin-only-confirmar"><input class="form-check-input" type="checkbox"
                                    id="aut-hora-${item.id}" ${isChecked} onchange="toggle_confirmar_hora(${item.id}, this.checked)"></td>`}
                                <td class="text-center">${item.id}</td>
                                <td class="text-center">${item.empleado}</td>
                                <td class="text-center">${item.fecha_trabajado || 'N/A'}</td>
                                <td class="text-center">${item.horas || 0}</td>
                                <td class="text-center">${item.jornada || 'N/A'}</td>
                                <td class="text-center">${formatear_numeros(item.monto)}</td>
                                <td class="text-center"><span class="badge badge-success">${item.estado}</span></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalleHora(${item.id}, ${item.id_empleado})">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                        ${isOperaciones ? '' : `<button type="button" class="btn btn-outline-danger btn-sm" onclick="advertencia_anular_hora(${item.id})">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                        </button>`}
                                    </div>
                                </td>
                            </tr>
                            `;
                        });
                        $('#chx_todos_autorizadas_horas').show();
                    } else {
                        template = '<tr><td colspan="9" class="text-center">No hay comisiones autorizadas</td></tr>';
                        $('#chx_todos_autorizadas_horas').hide();
                    }
                    
                    $('#cuerpo_tabla_autorizadas_horas').html(template);
                    console.log('✅ Horas extra autorizadas cargadas');
                    resolve();
                    
                } catch (error) {
                    console.error('❌ Error al parsear horas autorizadas:', error);
                    reject(error);
                }
            },
            error: function (xhr, status, error) {
                console.error('❌ Error AJAX en horas autorizadas:', error);
                reject(error);
            }
        });
    });
}

// ====== PESTAÑA RECHAZADAS ======
function listado_horas_rechazadas() {
    return new Promise((resolve, reject) => {
        console.log('📊 Cargando horas extra rechazadas...');
        
        const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
        const userId = userData ? userData.id : null;
        const userRole = userData ? userData.rol : null;
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            dataType: 'text',
            data: {
                quest: 'lista_comisiones_rechazadas',
                user_id: userId,
                user_role: userRole
            },
            success: function (res) {
                try {
                    if (!res || res === '0' || res.includes('No hay datos')) {
                        $('#cuerpo_tabla_rechazadas_horas').html('<tr><td colspan="9" class="text-center">No hay comisiones rechazadas</td></tr>');
                        $('#chx_todos_rechazadas_horas').hide();
                        resolve();
                        return;
                    }
                    
                    let lista;
                    if (typeof res === 'string') {
                        lista = JSON.parse(res);
                    } else {
                        lista = res;
                    }
                    
                    let template = '';
                    const isOperaciones = userRole === 'operaciones' || userRole === 'empleado';
                    
                    if (lista && lista.length > 0) {
                        lista.forEach(item => {
                            template += `
                            <tr role="row">
                                ${isOperaciones ? '' : `<td class="text-center admin-only-reactivar"><input class="form-check-input" type="checkbox"
                                    id="rech-hora-${item.id}" onchange="reactivar_hora(${item.id})"></td>`}
                                <td class="text-center">${item.id}</td>
                                <td class="text-center">${item.empleado}</td>
                                <td class="text-center">${item.fecha_trabajado || 'N/A'}</td>
                                <td class="text-center">${item.horas || 0}</td>
                                <td class="text-center">${item.jornada || 'N/A'}</td>
                                <td class="text-center">${formatear_numeros(item.monto)}</td>
                                <td class="text-center"><span class="badge badge-danger">${item.estado}</span></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalleHora(${item.id}, ${item.id_empleado})">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            `;
                        });
                        $('#chx_todos_rechazadas_horas').show();
                    } else {
                        template = '<tr><td colspan="9" class="text-center">No hay comisiones rechazadas</td></tr>';
                        $('#chx_todos_rechazadas_horas').hide();
                    }
                    
                    $('#cuerpo_tabla_rechazadas_horas').html(template);
                    console.log('✅ Horas extra rechazadas cargadas');
                    resolve();
                    
                } catch (error) {
                    console.error('❌ Error al parsear horas rechazadas:', error);
                    reject(error);
                }
            },
            error: function (xhr, status, error) {
                console.error('❌ Error AJAX en horas rechazadas:', error);
                reject(error);
            }
        });
    });
}

// ====== HISTORIAL COMPLETO ======
function cargar_historial_horas() {
    console.log('📊 Cargando historial completo de horas extra...');
    
    const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
    const userId = userData ? userData.id : null;
    const userRole = userData ? userData.rol : null;
    
    const filtros = {
        buscar: $('#filtro_buscar_horas').val() || '',
        estado: $('#filtro_estado_horas').val() || '',
        fecha_desde: $('#filtro_fecha_desde_horas').val() || '',
        fecha_hasta: $('#filtro_fecha_hasta_horas').val() || '',
        user_id: userId,
        user_role: userRole
    };
    
    $.ajax({
        url: 'servidor-bonos.php',
        type: 'GET',
        data: {
            quest: 'historial_completo_bonos',
            ...filtros
        },
        dataType: 'json',
        beforeSend: function() {
            $('#cuerpo_tabla_historial_horas').html('<tr><td colspan="10" class="text-center">Cargando historial...</td></tr>');
        },
        success: function(res) {
            console.log('✅ Historial de horas recibido:', res);
            
            if (res.error) {
                $('#cuerpo_tabla_historial_horas').html('<tr><td colspan="10" class="text-center text-danger">Error: ' + res.error + '</td></tr>');
                return;
            }
            
            let template = '';
            
            if (res && res.length > 0) {
                res.forEach(item => {
                    const estadoBadge = item.estado === 'Autorizado' || item.estado === 'Aprobado RH' 
                        ? 'badge-success' 
                        : item.estado === 'Rechazado' 
                        ? 'badge-danger' 
                        : 'badge-warning';
                    
                    template += `
                        <tr role="row">
                            <td class="text-center">${item.id}</td>
                            <td class="text-center">${item.fecha_trabajado || 'N/A'}</td>
                            <td class="text-center">${item.fecha_generado || 'N/A'}</td>
                            <td class="text-center">${item.empleado || 'N/A'}</td>
                            <td class="text-center">${item.departamento || 'N/A'}</td>
                            <td class="text-center">${item.horas || 0}</td>
                            <td class="text-center">${item.jornada || 'N/A'}</td>
                            <td class="text-center">${formatear_numeros(item.monto)}</td>
                            <td class="text-center"><span class="badge ${estadoBadge}">${item.estado || 'N/A'}</span></td>
                            <td class="text-center">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalleHora(${item.id}, ${item.id_empleado || 0})" title="Ver Detalles">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            } else {
                template = '<tr><td colspan="10" class="text-center">No hay registros en el historial</td></tr>';
            }
            
            $('#cuerpo_tabla_historial_horas').html(template);
            console.log('✅ Historial de horas cargado correctamente');
        },
        error: function(xhr, status, error) {
            console.error('❌ Error al cargar historial de horas:', error);
            $('#cuerpo_tabla_historial_horas').html('<tr><td colspan="10" class="text-center text-danger">Error al cargar historial</td></tr>');
        }
    });
}

// ====== FUNCIONES DE ACCIÓN ======
function detalleHora(id, id_empleado) {
    window.location.href = './detalle_comision.html?id=' + id + '&id_empleado=' + id_empleado;
}

function aprobar_hora(id) {
    Swal.fire({
        title: '¿Aprobar hora extra?',
        text: "Se aprobará esta hora extra",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'aprobar_comision',
                    id: id
                },
                success: function(res) {
                    Swal.close();
                    console.log('📦 Respuesta aprobar hora:', res);
                    if (res && res.toString().includes('Query Falló')) {
                        Swal.fire('Error', 'No se pudo aprobar la hora extra', 'error');
                    } else {
                        Swal.fire('Aprobada', 'Hora extra aprobada correctamente', 'success').then(() => {
                            listado_horas_pendientes();
                            listado_horas_autorizadas();
                        });
                    }
                },
                error: function(xhr, status, error) {
                    Swal.close();
                    console.error('❌ Error en aprobar hora:', status, error);
                    Swal.fire('Error', 'Error de conexión: ' + error, 'error');
                }
            });
        }
    });
}

function rechazar_hora(id) {
    Swal.fire({
        title: '¿Rechazar hora extra?',
        text: "Se rechazará esta hora extra",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'rechazar_comision',
                    id: id
                },
                success: function(res) {
                    Swal.close();
                    console.log('📦 Respuesta rechazar hora:', res);
                    if (res && res.toString().includes('Query Falló')) {
                        Swal.fire('Error', 'No se pudo rechazar la hora extra', 'error');
                    } else {
                        Swal.fire('Rechazada', 'Hora extra rechazada', 'success').then(() => {
                            listado_horas_pendientes();
                            listado_horas_rechazadas();
                        });
                    }
                },
                error: function(xhr, status, error) {
                    Swal.close();
                    console.error('❌ Error en rechazar hora:', status, error);
                    Swal.fire('Error', 'Error de conexión: ' + error, 'error');
                }
            });
        }
    });
}

function toggle_confirmar_hora(id, checked) {
    cargando();
    const quest = checked ? 'confirmar_comision' : 'desconfirmar_comision';
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: quest,
            id: id
        },
        success: function(res) {
            Swal.close();
            console.log('📦 Respuesta confirmar hora:', res);
            if (res && res.toString().includes('Query Falló')) {
                Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
                listado_horas_autorizadas();
            } else {
                console.log('✅ Hora extra ' + (checked ? 'confirmada' : 'desconfirmada'));
                // Mostrar notificación breve
                Swal.fire({
                    icon: 'success',
                    title: checked ? 'Confirmada' : 'Desconfirmada',
                    text: 'Hora extra ' + (checked ? 'confirmada' : 'desconfirmada') + ' correctamente',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        },
        error: function(xhr, status, error) {
            Swal.close();
            console.error('❌ Error en confirmar hora:', status, error);
            Swal.fire('Error', 'Error de conexión: ' + error, 'error');
            listado_horas_autorizadas();
        }
    });
}

function advertencia_anular_hora(id) {
    Swal.fire({
        title: '¿Anular hora extra?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, anular',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'anular_comision',
                    id: id
                },
                success: function(res) {
                    Swal.close();
                    console.log('📦 Respuesta anular hora:', res);
                    if (res && res.toString().includes('Query Falló')) {
                        Swal.fire('Error', 'No se pudo anular la hora extra', 'error');
                    } else {
                        Swal.fire('Anulada', 'Hora extra anulada correctamente', 'success').then(() => {
                            listado_horas_autorizadas();
                        });
                    }
                },
                error: function(xhr, status, error) {
                    Swal.close();
                    console.error('❌ Error en anular hora:', status, error);
                    Swal.fire('Error', 'Error de conexión: ' + error, 'error');
                }
            });
        }
    });
}

function reactivar_hora(id) {
    Swal.fire({
        title: '¿Reactivar hora extra?',
        text: "Se volverá a poner en estado pendiente",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, reactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'reactivar_comision',
                    id: id
                },
                success: function(res) {
                    Swal.close();
                    console.log('📦 Respuesta reactivar hora:', res);
                    if (res && res.toString().includes('Query Falló')) {
                        Swal.fire('Error', 'No se pudo reactivar la hora extra', 'error');
                    } else {
                        Swal.fire('Reactivada', 'Hora extra reactivada correctamente', 'success').then(() => {
                            listado_horas_pendientes();
                            listado_horas_rechazadas();
                        });
                    }
                },
                error: function(xhr, status, error) {
                    Swal.close();
                    console.error('❌ Error en reactivar hora:', status, error);
                    Swal.fire('Error', 'Error de conexión: ' + error, 'error');
                }
            });
        }
    });
}

function cargando() {
    Swal.fire({
        title: 'Procesando...',
        html: 'Esto puede demorar unos momentos',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}

// Funciones para seleccionar todos
function click_seleccionar_todos_pendientes_horas() {
    const checkbox = document.getElementById('customCheckPendientesHoras');
    const checkboxes = document.querySelectorAll('#cuerpo_tabla_pendientes_horas input[type="checkbox"]');
    checkboxes.forEach(function(cb) {
        cb.checked = checkbox.checked;
    });
}

function click_seleccionar_todos_autorizadas_horas() {
    const checkbox = document.getElementById('customCheckAutorizadasHoras');
    const checkboxes = document.querySelectorAll('#cuerpo_tabla_autorizadas_horas input[type="checkbox"]');
    checkboxes.forEach(function(cb) {
        cb.checked = checkbox.checked;
    });
}

function click_seleccionar_todos_rechazadas_horas() {
    const checkbox = document.getElementById('customCheckRechazadasHoras');
    const checkboxes = document.querySelectorAll('#cuerpo_tabla_rechazadas_horas input[type="checkbox"]');
    checkboxes.forEach(function(cb) {
        cb.checked = checkbox.checked;
    });
}
