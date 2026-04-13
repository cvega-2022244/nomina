var comisiones_confirmados = new Array();
var quincena = sessionStorage.getItem('quincena');

// Función para generar botones según el rol del usuario
function getActionButtons(comisionId, idEmpleado) {
    const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
    const userRole = userData ? userData.rol : null;
    const empleadoId = idEmpleado || 0;
    
    if (userRole === 'empleado' || userRole === 'capturador') {
        // Los empleados y capturadores solo pueden ver detalles
        return `
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalle(${comisionId}, ${empleadoId})" title="Ver Detalles">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        `;
    } else if (userRole === 'admin' || userRole === 'jefe' || userRole === 'gerente' || userRole === 'rh') {
        // Admin, Jefes, gerentes y RH pueden aprobar/rechazar
        return `
            <button type="button" class="btn btn-outline-success btn-sm" onclick="aprobar_comision(${comisionId})" title="Aprobar Comisión">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
            </button>
            <button type="button" class="btn btn-outline-warning btn-sm" onclick="rechazar_comision(${comisionId})" title="Rechazar Comisión">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </button>
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalle(${comisionId}, ${empleadoId})" title="Ver Detalles">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        `;
    } else if (userRole === 'operaciones') {
        // Operaciones solo puede ver detalles de sus bonos pendientes
        return `
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalle(${comisionId}, ${empleadoId})" title="Ver Detalles">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        `;
    } else {
        // Por defecto, solo ver detalles
        return `
            <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalle(${comisionId}, ${empleadoId})" title="Ver Detalles">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        `;
    }
}

$(document).ready(function () {
    console.log('🚀 Iniciando carga de comisiones con pestañas...');
    cargando();
    
    // Establecer fecha por defecto (último mes)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    $('#filtro_fecha_desde').val(haceUnMes.toISOString().split('T')[0]);
    $('#filtro_fecha_hasta').val(hoy.toISOString().split('T')[0]);
    
    // Cargar historial completo primero (es la pestaña principal)
    cargar_historial_completo();
    
    // Cargar las otras pestañas en segundo plano
    Promise.all([
        listado_comisiones_pendientes(),
        listado_comisiones_autorizadas()
    ]).then(() => {
        console.log('✅ Todas las pestañas cargadas correctamente');
        Swal.close();
    }).catch((error) => {
        console.error('❌ Error en la carga:', error);
        Swal.close();
    });
    
    // Cargar comisiones rechazadas cuando se hace clic en la pestaña
    $('#rechazadas-tab').on('click', function() {
        console.log('🔄 Cargando comisiones rechazadas...');
        listado_comisiones_rechazadas();
    });
    
    // Recargar historial completo cuando se hace clic en la pestaña
    $('#historial-tab').on('click', function() {
        console.log('🔄 Recargando historial completo...');
        cargar_historial_completo();
    });
})

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

function listado_comisiones_pendientes() {
    return new Promise((resolve, reject) => {
        console.log('📊 Cargando comisiones pendientes...');
        
        // Obtener el ID del usuario actual
        const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
        const userId = userData ? userData.id : null;
        const userRole = userData ? userData.rol : null;
        
        // Enviar user_id y user_role para todos los usuarios
        const requestData = {
            quest: 'lista_comisiones_pendientes',
            user_id: userId,
            user_role: userRole
        };
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: requestData,
            dataType: 'text',
            success: function (res) {
                console.log('✅ Respuesta pendientes recibida:', res);
                
                try {
                    // Verificar si la respuesta es válida antes de procesar
                    if (!res || typeof res !== 'string') {
                        console.error('❌ Respuesta no válida:', res);
                        reject('Error: respuesta no válida');
                        return;
                    }
                    
                    // Verificar si la respuesta es HTML (error de PHP)
                    if (res.includes('<br />') || res.includes('<b>') || res.includes('<!DOCTYPE') || res.includes('Query Falló') || res.includes('Successfully') || res.trim() === 'No') {
                        console.error('❌ El servidor devolvió respuesta no válida:', res);
                        reject('Error del servidor: respuesta no válida');
                        return;
                    }
                    
                    let lista;
                    if (typeof res === 'string') {
                        try {
                            lista = JSON.parse(res);
                        } catch (error) {
                            console.error('❌ Error al parsear comisiones pendientes:', error);
                            reject('Error al parsear JSON');
                            return;
                        }
                    } else {
                        lista = res; // jQuery ya parseó el JSON
                    }
                    console.log('📋 Lista pendientes parseada:', lista);
                    
                    let template = '';
                    // Verificar si el usuario es operaciones para ocultar checkbox
                    const userRole = sessionStorage.getItem('rol') || '';
                    const isOperaciones = userRole === 'operaciones';
                    
                    if (lista != 0 && lista.length > 0) {
                        lista.forEach(item => {
                            template += `
                            <tr role="row">
                                ${isOperaciones ? '' : `<td class="text-center admin-only-aprobar"><input class="form-check-input" type="checkbox"
                                    id="pend-${item.id}" onchange="aprobar_comision(${item.id})"></td>`}
                                <td class="text-center">${item.id}</td>
                                <td class="text-center">${item.departamento}</td>
                                <td class="text-center">${item.empleado}</td>
                                <td class="text-center">${item.solicitante}</td>
                                <td class="text-center">${item.fecha_generado}</td>
                                <td class="text-center">${formatear_numeros(item.monto)}</td>
                                <td class="text-center"><span class="badge badge-warning">${item.estado}</span></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        ${getActionButtons(item.id, item.id_empleado)}
                                    </div>
                                </td>
                            </tr>
                            `;
                        });
                    } else {
                        const colSpan = isOperaciones ? 8 : 9;
                        template = `
                        <tr>
                            <td colspan="${colSpan}" class="text-center">No hay comisiones pendientes de aprobación</td>
                        </tr>
                        `;
                    }
                    
                    $('#cuerpo_tabla_pendientes').html(template);
                    console.log('✅ Comisiones pendientes cargadas en la tabla');
                    resolve();
                    
                } catch (error) {
                    console.error('❌ Error al parsear comisiones pendientes:', error);
                    console.error('Respuesta del servidor:', res);
                    reject(error);
                }
            },
            error: function (xhr, status, error) {
                console.error('❌ Error AJAX en comisiones pendientes:', error);
                console.error('Status:', status);
                console.error('XHR:', xhr);
                reject(error);
            }
        });
    });
}

function listado_comisiones_autorizadas() {
    return new Promise((resolve, reject) => {
        console.log('📊 Cargando comisiones autorizadas...');
        
        // Obtener el ID del usuario actual
        const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
        const userId = userData ? userData.id : null;
        const userRole = userData ? userData.rol : null;
        
        // Enviar user_id y user_role para todos los usuarios
        const requestData = {
            quest: 'lista_comisiones_autorizados',
            user_id: userId,
            user_role: userRole
        };
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: requestData,
            dataType: 'text',
            success: function (res) {
                console.log('✅ Respuesta autorizadas recibida:', res);
                
                try {
                    // Verificar si la respuesta es válida antes de procesar
                    if (!res || typeof res !== 'string') {
                        console.error('❌ Respuesta no válida:', res);
                        reject('Error: respuesta no válida');
                        return;
                    }
                    
                    // Verificar si la respuesta es HTML (error de PHP)
                    if (res.includes('<br />') || res.includes('<b>') || res.includes('<!DOCTYPE') || res.includes('Query Falló') || res.includes('Successfully') || res.trim() === 'No') {
                        console.error('❌ El servidor devolvió respuesta no válida:', res);
                        reject('Error del servidor: respuesta no válida');
                        return;
                    }
                    
                    let lista;
                    if (typeof res === 'string') {
                        try {
                            lista = JSON.parse(res);
                        } catch (error) {
                            console.error('❌ Error al parsear comisiones autorizadas:', error);
                            reject('Error al parsear JSON');
                            return;
                        }
                    } else {
                        lista = res; // jQuery ya parseó el JSON
                    }
                    console.log('📋 Lista autorizadas parseada:', lista);
                    
                    let template = '';
                    // Verificar si el usuario es operaciones para ocultar checkbox
                    const userRoleAut = sessionStorage.getItem('rol') || '';
                    const isOperacionesAut = userRoleAut === 'operaciones';
                    
                    if (lista != 0 && lista.length > 0) {
                        lista.forEach(item => {
                            const isChecked = item.seleccionado == 1 ? 'checked' : '';
                            template += `
                            <tr role="row">
                                ${isOperacionesAut ? '' : `<td class="text-center admin-only-confirmar"><input class="form-check-input" type="checkbox"
                                    id="aut-${item.id}" ${isChecked} onchange="toggle_confirmar_comision(${item.id}, this.checked)"></td>`}
                                <td class="text-center">${item.id}</td>
                                <td class="text-center">${item.departamento}</td>
                                <td class="text-center">${item.empleado}</td>
                                <td class="text-center">${item.solicitante}</td>
                                <td class="text-center">${item.fecha_generado}</td>
                                <td class="text-center">${formatear_numeros(item.monto)}</td>
                                <td class="text-center"><span class="badge badge-success">${item.estado}</span></td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalle(${item.id}, ${item.id_empleado})">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        </button>
                                        ${isOperacionesAut ? '' : `<button type="button" class="btn btn-outline-warning btn-sm" onclick="advertencia_desaprobar_comision(${item.id})">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
                                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                                <polyline points="12,19 5,12 12,5"></polyline>
                                            </svg>
                                        </button>
                                        <button type="button" class="btn btn-outline-danger btn-sm" onclick="advertencia_anular_comision(${item.id})">
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
                    } else {
                        const colSpanAut = isOperacionesAut ? 8 : 9;
                        template = `
                        <tr>
                            <td colspan="${colSpanAut}" class="text-center">No hay comisiones autorizadas</td>
                        </tr>
                        `;
                    }
                    
                    $('#cuerpo_tabla_autorizadas').html(template);
                    console.log('✅ Comisiones autorizadas cargadas en la tabla');
                    resolve();
                    
                } catch (error) {
                    console.error('❌ Error al parsear comisiones autorizadas:', error);
                    console.error('Respuesta del servidor:', res);
                    reject(error);
                }
            },
            error: function (xhr, status, error) {
                console.error('❌ Error AJAX en comisiones autorizadas:', error);
                console.error('Status:', status);
                console.error('XHR:', xhr);
                reject(error);
            }
        });
    });
}

function aprobar_comision(id) {
    console.log('✅ Aprobando comisión ID:', id);
    
    // Obtener el rol del usuario actual
    const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
    const userRole = userData ? userData.rol : 'rh';
    const userId = userData ? userData.id : 1;
    
    Swal.fire({
        title: '¿Aprobar comisión?',
        text: '¿Estás seguro de que quieres aprobar esta comisión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
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
                    id: id,
                    aprobador_id: userId,
                    rol_aprobador: userRole
                },
                success: function (respuesta) {
                    console.log('✅ Respuesta de aprobación recibida:', respuesta);
                    console.log('✅ Tipo de respuesta:', typeof respuesta);
                    Swal.close();
                    
                    // Intentar parsear la respuesta como JSON
                    let responseData;
                    try {
                        responseData = typeof respuesta === 'string' ? JSON.parse(respuesta) : respuesta;
                        console.log('✅ Respuesta parseada:', responseData);
                    } catch (e) {
                        console.log('⚠️ No se pudo parsear como JSON, usando como texto:', respuesta);
                        responseData = { message: respuesta };
                    }
                    
                    if (respuesta.includes('Query Falló') || (responseData.error)) {
                        console.error('❌ Error en la respuesta:', responseData.error || respuesta);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Aprobar la Comision',
                            text: responseData.error || 'Ah ocurrido un error al intentar aprobar la comision, por favor, intentalo de nuevo',
                            showcancelButton: false
                        });
                    } else {
                        console.log('✅ Aprobación exitosa, mostrando notificación');
                        Swal.fire({
                            icon: 'success',
                            title: 'Comisión Aprobada',
                            text: responseData.success || 'La comisión ha sido aprobada exitosamente.',
                            timer: 2000
                        }).then(() => {
                            console.log('✅ Recargando página...');
                            // Recargar la página para actualizar los datos
                            location.reload();
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error('❌ Error AJAX al aprobar comisión:', error);
                    console.error('❌ Status:', status);
                    console.error('❌ XHR:', xhr);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Conexión',
                        text: 'No se pudo conectar con el servidor. Intenta nuevamente.'
                    });
                }
            });
        } else {
            // Desmarcar el checkbox si se cancela
            document.getElementById('pend-' + id).checked = false;
        }
    });
}

// Función para manejar el toggle del checkbox de confirmación
function toggle_confirmar_comision(id, isChecked) {
    console.log('🔄 Toggle comisión ID:', id, 'Checked:', isChecked);
    
    if (isChecked) {
        // Confirmar la comisión
        confirmar_comision(id);
    } else {
        // Desconfirmar la comisión
        desconfirmar_comision(id);
    }
}

function confirmar_comision(id) {
    console.log('✅ Confirmando comisión ID:', id);
    
    Swal.fire({
        title: '¿Confirmar comisión para pago?',
        text: 'Esta comisión se incluirá en el próximo cierre de nómina.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'confirmar_comision',
                    id: id
                },
                success: function (respuesta) {
                    console.log('Respuesta de confirmación:', respuesta);
                    Swal.close();
                    
                    if (respuesta.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error Al Confirmar la Comision',
                            text: 'Ah ocurrido un error al intentar confirmar la comision, por favor, intentalo de nuevo',
                            showcancelButton: false
                        });
                        document.getElementById('aut-' + id).checked = false;
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Comisión Confirmada',
                            text: 'La comisión ha sido confirmada y se sumará al pago del empleado.',
                            timer: 2000
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error al confirmar comisión:', error);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Conexión',
                        text: 'No se pudo conectar con el servidor. Intenta nuevamente.'
                    });
                    document.getElementById('aut-' + id).checked = false;
                }
            });
        } else {
            // Desmarcar el checkbox si se cancela
            document.getElementById('aut-' + id).checked = false;
        }
    });
}

// Función para desconfirmar una comisión (desmarcar checkbox)
function desconfirmar_comision(id) {
    console.log('❌ Desconfirmando comisión ID:', id);
    
    Swal.fire({
        title: '¿Quitar confirmación?',
        text: 'Esta comisión NO se incluirá en el próximo cierre de nómina.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, quitar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            cargando();
            
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'desconfirmar_comision',
                    id: id
                },
                success: function (respuesta) {
                    console.log('Respuesta de desconfirmación:', respuesta);
                    Swal.close();
                    
                    if (respuesta.includes('Query Falló')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo quitar la confirmación. Intenta nuevamente.',
                            showcancelButton: false
                        });
                        document.getElementById('aut-' + id).checked = true;
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Confirmación Removida',
                            text: 'La comisión ya no se incluirá en el cierre de nómina.',
                            timer: 2000
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error al desconfirmar comisión:', error);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Conexión',
                        text: 'No se pudo conectar con el servidor. Intenta nuevamente.'
                    });
                    document.getElementById('aut-' + id).checked = true;
                }
            });
        } else {
            // Volver a marcar el checkbox si se cancela
            document.getElementById('aut-' + id).checked = true;
        }
    });
}

function advertencia_desaprobar_comision(id) {
    Swal.fire({
        title: '¿Desaprobar comisión?',
        text: '¿Estás seguro de que quieres desaprobar esta comisión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ffc107',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, desaprobar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            desaprobar_comision(id);
        }
    })
}

function desaprobar_comision(id) {
    cargando();
    
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        dataType: 'text',
        data: {
            quest: 'desaprobar_comision',
            id: id
        },
        success: function (respuesta) {
            console.log('Respuesta de desaprobación:', respuesta);
            Swal.close();
            
            // Validar respuesta
            if (!respuesta || typeof respuesta !== 'string') {
                console.error('❌ Respuesta inválida para desaprobación:', respuesta);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Respuesta',
                    text: 'Respuesta inválida del servidor',
                    showcancelButton: false
                });
                return;
            }
            
            if (respuesta.includes('Query Falló')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Desaprobar la Comision',
                    text: 'Ah ocurrido un error al intentar desaprobar la comision, por favor, intentalo de nuevo',
                    showcancelButton: false
                });
            } else if (respuesta === 'Successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'Comisión Desaprobada',
                    text: 'La comisión ha sido desaprobada exitosamente.',
                    timer: 2000
                }).then(() => {
                    // Recargar las pestañas para actualizar los datos
                    listado_comisiones_pendientes();
                    listado_comisiones_autorizadas();
                    listado_comisiones_rechazadas();
                    
                    // Actualizar estadísticas
                    if (typeof updateStats === 'function') {
                        updateStats();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Desconocido',
                    text: 'Respuesta inesperada del servidor: ' + respuesta,
                    showcancelButton: false
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al desaprobar comisión:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Intenta nuevamente.'
            });
        }
    });
}

function detalle(id, id_empleado) {
    window.location.href = './detalle_comision.html?id=' + id + '&id_empleado=' + id_empleado;
}

function advertencia_anular_comision(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, anular',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            anular_comision(id);
        }
    })
}

function anular_comision(id) {
    cargando();
    
    $.ajax({
        url: 'php/servidor.php',
        type: 'POST',
        data: {
            quest: 'anular_comision',
            id: id
        },
        dataType: 'text',
        success: function (respuesta) {
            console.log('Respuesta de anulación:', respuesta);
            Swal.close();
            
            // Validar respuesta
            if (!respuesta || typeof respuesta !== 'string') {
                console.error('❌ Respuesta inválida para anulación:', respuesta);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Respuesta',
                    text: 'Respuesta inválida del servidor',
                    showcancelButton: false
                });
                return;
            }
            
            if (respuesta.includes('Query Falló')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Al Anular la Comision',
                    text: 'Ah ocurrido un error al intentar anular la comision, por favor, intentalo de nuevo',
                    showcancelButton: false
                });
            } else if (respuesta === 'Successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'Comisión Anulada',
                    text: 'La comisión ha sido anulada exitosamente.',
                    timer: 2000
                }).then(() => {
                    // Recargar las pestañas para actualizar los datos
                    listado_comisiones_pendientes();
                    listado_comisiones_autorizadas();
                    listado_comisiones_rechazadas();
                    
                    // Actualizar estadísticas
                    if (typeof updateStats === 'function') {
                        updateStats();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Desconocido',
                    text: 'Respuesta inesperada del servidor: ' + respuesta,
                    showcancelButton: false
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al anular comisión:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Intenta nuevamente.'
            });
        }
    });
}

function click_seleccionar_todos_pendientes() {
    var checkboxes = document.querySelectorAll('#tabla_pendientes tbody input[type="checkbox"]');
    var todos_seleccionados = document.getElementById('customCheckPendientes').checked;
    
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = todos_seleccionados;
    });
}

function click_seleccionar_todos_autorizadas() {
    var checkboxes = document.querySelectorAll('#tabla_autorizadas tbody input[type="checkbox"]');
    var todos_seleccionados = document.getElementById('customCheckAutorizadas').checked;
    
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = todos_seleccionados;
    });
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

function listado_comisiones_rechazadas() {
    return new Promise((resolve, reject) => {
        console.log('📊 Cargando comisiones rechazadas...');
        
        // Obtener el ID del usuario actual
        const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
        const userId = userData ? userData.id : null;
        const userRole = userData ? userData.rol : null;
        
        // Enviar user_id y user_role para todos los usuarios
        const requestData = {
            quest: 'lista_comisiones_rechazadas',
            user_id: userId,
            user_role: userRole,
            t: Date.now()
        };
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: requestData,
            dataType: 'text',
            success: function(res) {
                console.log('📋 Respuesta recibida para rechazadas:', res);
                
                // Validar respuesta
                if (!res || typeof res !== 'string') {
                    console.error('❌ Respuesta inválida para rechazadas:', res);
                    document.getElementById('cuerpo_tabla_rechazadas').innerHTML = '<tr><td colspan="9" class="text-center">No hay datos disponibles</td></tr>';
                    resolve();
                    return;
                }
                
                // Verificar si es HTML o mensaje de error
                if (res.includes('<') || res.includes('Query Falló') || res.includes('Successfully') || res === 'No') {
                    console.error('❌ Respuesta no válida para rechazadas:', res);
                    document.getElementById('cuerpo_tabla_rechazadas').innerHTML = '<tr><td colspan="9" class="text-center">Error al cargar datos</td></tr>';
                    resolve();
                    return;
                }
                
                let lista;
                try {
                    lista = JSON.parse(res);
                } catch (e) {
                    console.error('❌ Error parseando JSON para rechazadas:', e);
                    document.getElementById('cuerpo_tabla_rechazadas').innerHTML = '<tr><td colspan="9" class="text-center">Error al procesar datos</td></tr>';
                    resolve();
                    return;
                }
                
                console.log('📋 Lista rechazadas parseada:', lista);
                
                let template = '';
                // Verificar si el usuario es operaciones para ocultar checkbox
                const userRoleRech = sessionStorage.getItem('rol') || '';
                const isOperacionesRech = userRoleRech === 'operaciones';
                
                if (lista != 0 && lista.length > 0) {
                    lista.forEach(item => {
                        template += `
                        <tr role="row">
                            ${isOperacionesRech ? '' : `<td class="text-center admin-only-reactivar"><input class="form-check-input" type="checkbox"
                                id="rech-${item.id}" onchange="reactivar_comision(${item.id})"></td>`}
                            <td class="text-center">${item.id}</td>
                            <td class="text-center">${item.departamento}</td>
                            <td class="text-center">${item.empleado}</td>
                            <td class="text-center">${item.solicitante}</td>
                            <td class="text-center">${item.fecha_generado}</td>
                            <td class="text-center">${formatear_numeros(item.monto)}</td>
                            <td class="text-center"><span class="badge badge-danger">${item.estado}</span></td>
                            <td class="text-center">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalle(${item.id}, ${item.id_empleado})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                    ${isOperacionesRech ? '' : `<button type="button" class="btn btn-outline-danger btn-sm" onclick="advertencia_eliminar_comision(${item.id})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    </button>`}
                                </div>
                            </td>
                        </tr>
                        `;
                    });
                } else {
                    const colSpanRech = isOperacionesRech ? 8 : 9;
                    template = `<tr><td colspan="${colSpanRech}" class="text-center">No hay comisiones rechazadas</td></tr>`;
                }
                
                document.getElementById('cuerpo_tabla_rechazadas').innerHTML = template;
                resolve();
            },
            error: function(xhr, status, error) {
                console.error('❌ Error AJAX al cargar rechazadas:', error);
                document.getElementById('cuerpo_tabla_rechazadas').innerHTML = '<tr><td colspan="9" class="text-center">Error al cargar datos</td></tr>';
                resolve();
            }
        });
    });
}

function click_seleccionar_todos_rechazadas() {
    const checkbox = document.getElementById('customCheckRechazadas');
    const checkboxes = document.querySelectorAll('#cuerpo_tabla_rechazadas input[type="checkbox"]');
    
    checkboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });
}

function reactivar_comision(id) {
    console.log('🔄 Reactivando comisión:', id);
    
    Swal.fire({
        title: '¿Reactivar comisión?',
        text: '¿Estás seguro de que quieres reactivar esta comisión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: { quest: 'reactivar_comision', id: id },
                dataType: 'text',
                success: function(res) {
                    if (res === 'Successfully') {
                        Swal.fire('¡Reactivada!', 'La comisión ha sido reactivada correctamente.', 'success');
                        listado_comisiones_rechazadas();
                    } else {
                        Swal.fire('Error', 'No se pudo reactivar la comisión.', 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'Error de conexión al reactivar la comisión.', 'error');
                }
            });
        }
    });
}

function advertencia_eliminar_comision(id) {
    Swal.fire({
        title: '¿Eliminar comisión?',
        text: 'Esta acción no se puede deshacer. La comisión será eliminada permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                data: { quest: 'eliminar_comision', id: id },
                dataType: 'text',
                success: function(res) {
                    if (res === 'Successfully') {
                        Swal.fire('¡Eliminada!', 'La comisión ha sido eliminada correctamente.', 'success');
                        listado_comisiones_rechazadas();
                    } else {
                        Swal.fire('Error', 'No se pudo eliminar la comisión.', 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'Error de conexión al eliminar la comisión.', 'error');
                }
            });
        }
    });
}

// Función duplicada eliminada - se usa la función aprobar_comision de la línea 319

// Función para rechazar una comisión
function rechazar_comision(id) {
    Swal.fire({
        title: '¿Rechazar comisión?',
        text: 'Esta comisión será rechazada y pasará al estado "Rechazada".',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'php/servidor.php',
                type: 'POST',
                dataType: 'text',
                data: {
                    quest: 'rechazar_comision',
                    id: id
                },
                success: function(res) {
                    if (res === 'Successfully') {
                        Swal.fire('¡Rechazada!', 'La comisión ha sido rechazada exitosamente.', 'success');
                        // Recargar las pestañas
                        listado_comisiones_pendientes();
                        listado_comisiones_rechazadas();
                        // Si estamos en historial, recargarlo también
                        if ($('#historial').hasClass('active')) {
                            cargar_historial_completo();
                        }
                    } else {
                        Swal.fire('Error', 'Error al rechazar la comisión: ' + res, 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'Error de conexión al rechazar la comisión.', 'error');
                }
            });
        }
    });
}

// Función para cargar el historial completo
function cargar_historial_completo() {
    console.log('📊 Cargando historial completo de bonos...');
    
    // Obtener el ID del usuario actual y su rol
    const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
    const userId = userData ? userData.id : null;
    const userRole = userData ? userData.rol : null;
    
    const filtros = {
        buscar: $('#filtro_buscar_historial').val() || '',
        estado: $('#filtro_estado_historial').val() || '',
        fecha_desde: $('#filtro_fecha_desde').val() || '',
        fecha_hasta: $('#filtro_fecha_hasta').val() || '',
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
            $('#cuerpo_tabla_historial').html('<tr><td colspan="13" class="text-center">Cargando historial...</td></tr>');
        },
        success: function(res) {
            console.log('✅ Historial recibido:', res);
            
            if (res.error) {
                $('#cuerpo_tabla_historial').html('<tr><td colspan="13" class="text-center text-danger">Error: ' + res.error + '</td></tr>');
                return;
            }
            
            let template = '';
            let totalMonto = 0;
            let totalPendientes = 0;
            let totalAutorizadas = 0;
            
            if (res && res.length > 0) {
                res.forEach(item => {
                    totalMonto += parseFloat(item.monto) || 0;
                    if (item.estado === 'Pendiente' || item.estado === 'Pendiente de Aprobación') {
                        totalPendientes++;
                    } else if (item.estado === 'Autorizada' || item.estado === 'Aprobado RH') {
                        totalAutorizadas++;
                    }
                    
                    const tipoTexto = item.tipo_registro === 'hora_extra' ? 'Hora Extra' : 'Bono';
                    const estadoBadge = item.estado === 'Autorizada' || item.estado === 'Aprobado RH' 
                        ? 'badge-success' 
                        : item.estado === 'Rechazada' 
                        ? 'badge-danger' 
                        : 'badge-warning';
                    
                    template += `
                        <tr role="row">
                            <td class="text-center">${item.id}</td>
                            <td class="text-center">${item.fecha_trabajado || 'N/A'}</td>
                            <td class="text-center">${item.fecha_generado || 'N/A'}</td>
                            <td class="text-center">${item.empleado || 'N/A'}</td>
                            <td class="text-center">${item.departamento || 'N/A'}</td>
                            <td class="text-center">${item.empresa || 'N/A'}</td>
                            <td class="text-center">${item.solicitante || 'N/A'}</td>
                            <td class="text-center"><span class="badge badge-info">${tipoTexto}</span></td>
                            <td class="text-center">${item.horas || 0}</td>
                            <td class="text-center">${item.jornada || 'N/A'}</td>
                            <td class="text-center">${formatear_numeros(item.monto)}</td>
                            <td class="text-center"><span class="badge ${estadoBadge}">${item.estado || 'N/A'}</span></td>
                            <td class="text-center">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-outline-primary btn-sm" onclick="detalle(${item.id}, ${item.id_empleado || 0})" title="Ver Detalles">
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
                
                // Actualizar estadísticas
                $('#total_bonos').text(res.length);
                $('#total_monto').text(formatear_numeros(totalMonto));
                $('#total_pendientes').text(totalPendientes);
                $('#total_autorizadas').text(totalAutorizadas);
                $('#resumen_estadisticas').show();
            } else {
                template = '<tr><td colspan="13" class="text-center">No hay registros en el historial</td></tr>';
                $('#resumen_estadisticas').hide();
            }
            
            $('#cuerpo_tabla_historial').html(template);
            console.log('✅ Historial cargado correctamente');
        },
        error: function(xhr, status, error) {
            console.error('❌ Error al cargar historial:', error);
            $('#cuerpo_tabla_historial').html('<tr><td colspan="13" class="text-center text-danger">Error al cargar el historial</td></tr>');
        }
    });
}

// Función para aplicar filtros
function aplicar_filtros_historial() {
    cargar_historial_completo();
}

// Función para limpiar filtros
function limpiar_filtros_historial() {
    $('#filtro_buscar_historial').val('');
    $('#filtro_estado_historial').val('');
    
    // Restablecer fechas al último mes
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    $('#filtro_fecha_desde').val(haceUnMes.toISOString().split('T')[0]);
    $('#filtro_fecha_hasta').val(hoy.toISOString().split('T')[0]);
    
    cargar_historial_completo();
}