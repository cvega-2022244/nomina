$(document).ready(function () {

    // Remover todas las restricciones de roles - Sistema sin roles activado
    $('.role-restricted').removeClass('role-restricted');
    $('.menu-item-restricted').removeClass('menu-item-restricted');
    
    // Primero verificar si hay un lote abierto antes de permitir crear bonos/horas extra
    verificarLoteAbierto().then(function(hayLoteAbierto) {
        if (!hayLoteAbierto) {
            // No hay lote abierto, mostrar mensaje y no permitir crear
            Swal.fire({
                icon: 'warning',
                title: 'Nómina cerrada',
                text: 'No hay un lote de nómina abierto. No es posible crear bonos u horas extra en este momento.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#e2a03f',
                allowOutsideClick: false
            }).then(function() {
                // Redirigir a la página de nómina o bonos
                window.location.href = 'nomina.html';
            });
            return;
        }
        
        // Hay lote abierto, continuar con la lógica normal
        // Verificar si viene un tipo en la URL (ej: crear-bono-variable.html?tipo=bono)
        const urlParams = new URLSearchParams(window.location.search);
        const tipoFromUrl = urlParams.get('tipo');
        
        if (tipoFromUrl && (tipoFromUrl === 'bono' || tipoFromUrl === 'hora_extra')) {
            // Si viene el tipo en la URL, ir directo al formulario
            aplicarTipoSeleccionado(tipoFromUrl);
            cargarDatosIniciales();
            configurarFormulario();
        } else {
            // Si no viene tipo, mostrar selector (modal) al entrar a la página
            mostrarSelectorTipo().then(function(tipo){
                if (tipo) { 
                    aplicarTipoSeleccionado(tipo);
                    cargarDatosIniciales();
                    configurarFormulario();
                }
            });
        }
    });

});

// Función para verificar si hay un lote abierto
function verificarLoteAbierto() {
    return new Promise(function(resolve) {
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: { quest: 'lote_activo' },
            dataType: 'json',
            success: function(res) {
                // Si hay resultado y tiene al menos un elemento, hay lote abierto
                if (res && Array.isArray(res) && res.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            error: function() {
                // En caso de error, asumir que no hay lote abierto por seguridad
                resolve(false);
            }
        });
    });
}

function cargarDatosIniciales() {

    cargarEmpresas();
    cargarEmpleados();
    cargarSolicitantes();
    cargarTiposBono();
    establecerFechaActual();

}

function cargarEmpresas() {

    $.ajax({
        url: 'servidor-bonos.php',
        type: 'GET',
        data: {
            quest: 'listado_empresas'
        },
        dataType: 'json',
        success: function (res) {

            console.log('Es array:', Array.isArray(res));
            
            try {
                let empresas = res;
                let options = '<option value="">Seleccione una empresa</option>';
                
                if (empresas && empresas.length > 0) {
                    empresas.forEach(empresa => {
                        options += `<option value="${empresa.id}">${empresa.nombre_comercial}</option>`;
                    });

                } else {

                }
                
                // Establecer valores por defecto para bonos según la empresa
                $('#empresa_trabajo').on('change', function() {
                    const areaTrabajo = $('#area_trabajo');
                    
                    // Limpiar el campo de tipo de bono y monto cuando cambia la empresa
                    areaTrabajo.val('');
                    $('#monto').val('');
                });
                
                // Manejar cambio de comisión/bono - ahora usa datos dinámicos
                $('#area_trabajo').on('change', function() {
                    const tipoBono = $(this).val();
                    const selectedOption = $(this).find('option:selected');
                    const monto = selectedOption.data('monto');
                    
                    // Establecer monto según el tipo de bono seleccionado
                    if (monto !== undefined && monto !== null && monto > 0) {
                        $('#monto').val(monto);
                    } else {
                        $('#monto').val('');
                    }
                });
                
                $('#empresa_trabajo').html(options);
                $('#empresa_trabajo_hora').html(options);

            } catch (error) {
                console.error('❌ Error al procesar empresas:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las empresas'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('❌ ERROR AJAX al cargar empresas:');
            console.error('Status:', status);
            console.error('Error:', error);
            console.error('Response Text:', xhr.responseText);
            console.error('Status Code:', xhr.status);
            
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Intenta nuevamente.'
            });
        }
    });
}

function cargarTiposBono() {
    $.ajax({
        url: 'php/servidor.php',
        type: 'GET',
        data: {
            quest: 'listado_tipo_bono'
        },
        dataType: 'json',
        success: function (res) {
            try {
                let tiposBono = res;
                let options = '<option value="">Seleccionar...</option>';
                
                if (tiposBono && tiposBono.length > 0) {
                    // Guardar tipos de bono para acceso posterior
                    window.listaTiposBono = tiposBono;
                    
                    tiposBono.forEach(tipo => {
                        options += `<option value="${tipo.nombre}" data-monto="${tipo.monto}" data-id="${tipo.id}">${tipo.nombre}</option>`;
                    });
                }
                
                $('#area_trabajo').html(options);
                
            } catch (error) {
                console.error('Error al procesar tipos de bono:', error);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error AJAX al cargar tipos de bono:', error);
        }
    });
}

function cargarEmpleados() {

    // Obtener datos del usuario logueado para filtrar por departamento
    let id_departamento = 0;
    try {
        const usuarioData = JSON.parse(sessionStorage.getItem('usuario_principal'));
        console.log('🔍 Usuario logueado:', usuarioData);
        // Filtrar siempre que el usuario tenga un departamento asignado
        // Si id_departamento es NULL o 0 en la tabla usuario, se muestran TODOS los empleados
        if (usuarioData && usuarioData.id_departamento) {
            id_departamento = usuarioData.id_departamento;
            console.log('✅ Filtrando empleados por departamento:', id_departamento);
        } else {
            console.log('ℹ️ Sin filtro de departamento - se muestran todos los empleados');
        }
    } catch (e) {
        console.warn('No se pudo obtener departamento del usuario:', e);
    }

    $.ajax({
        url: 'servidor-bonos.php',
        type: 'GET',
        data: {
            quest: 'listado_empleados_activos',
            id_departamento: id_departamento
        },
        dataType: 'json',
        beforeSend: function() {
            $('#lista_empleados').html('<p class="text-muted text-center">Cargando empleados...</p>');
        },
        success: function (res) {
            try {
                let empleados = res;
                let htmlBono = '';
                let htmlHora = '';
                
                if (empleados && empleados.length > 0) {
                    // Guardar lista completa para el buscador y acceso a datos
                    window.listaEmpleadosCompleta = empleados;
                    
                    empleados.forEach(empleado => {
                        let nombreCompleto = `${empleado.primer_nombre} ${empleado.segundo_nombre || ''} ${empleado.primer_apellido} ${empleado.segundo_apellido || ''}`.trim();
                        let empresaNombre = empleado.empresa || 'Sin empresa';
                        let idEmpresa = empleado.id_empresa || '';
                        let sueldo = empleado.sueldo_ordinario || 0;
                        
                        // Radio buttons para BONO (solo una selección)
                        htmlBono += `
                            <div class="empleado-item" data-nombre="${nombreCompleto.toLowerCase()}" data-id-empresa="${idEmpresa}" data-sueldo="${sueldo}">
                                <input class="empleado-radio" type="radio" name="empleado_bono" value="${empleado.id}" id="emp_bono_${empleado.id}">
                                <label for="emp_bono_${empleado.id}">${nombreCompleto} <span style="color: #888; font-size: 0.85em;">- ${empresaNombre}</span></label>
                            </div>`;
                        
                        // Radio buttons para HORA EXTRA (solo una selección)
                        htmlHora += `
                            <div class="empleado-item" data-nombre="${nombreCompleto.toLowerCase()}" data-id-empresa="${idEmpresa}" data-sueldo="${sueldo}">
                                <input class="empleado-radio" type="radio" name="empleado_hora" value="${empleado.id}" id="emp_hora_${empleado.id}">
                                <label for="emp_hora_${empleado.id}">${nombreCompleto} <span style="color: #888; font-size: 0.85em;">- ${empresaNombre}</span></label>
                            </div>`;
                    });
                } else {
                    htmlBono = '<p class="text-muted text-center">No hay empleados disponibles</p>';
                    htmlHora = '<p class="text-muted text-center">No hay empleados disponibles</p>';
                }
                
                $('#lista_empleados').html(htmlBono);
                $('#lista_empleados_hora').html(htmlHora);
                
                // Evento para BONO: seleccionar empleado y su empresa
                $('#lista_empleados .empleado-radio').on('change', function(){
                    // Quitar clase selected de todos
                    $('#lista_empleados .empleado-item').removeClass('selected');
                    
                    if ($(this).is(':checked')) {
                        const item = $(this).closest('.empleado-item');
                        item.addClass('selected');
                        
                        // Seleccionar automáticamente la empresa del empleado
                        const idEmpresa = item.data('id-empresa');
                        if (idEmpresa) {
                            $('#empresa_trabajo').val(idEmpresa).trigger('change');
                        }
                    }
                    actualizarContadorEmpleados();
                });
                
                // Evento para HORA EXTRA: seleccionar empleado, su empresa y calcular monto
                $('#lista_empleados_hora .empleado-radio').on('change', function(){
                    // Quitar clase selected de todos
                    $('#lista_empleados_hora .empleado-item').removeClass('selected');
                    
                    if ($(this).is(':checked')) {
                        const item = $(this).closest('.empleado-item');
                        item.addClass('selected');
                        
                        // Seleccionar automáticamente la empresa del empleado
                        const idEmpresa = item.data('id-empresa');
                        if (idEmpresa) {
                            $('#empresa_trabajo_hora').val(idEmpresa);
                        }
                    }
                    actualizarContadorEmpleados();
                    // Recalcular monto
                    calcularMontoHoraExtra();
                });
                
                // Hacer clic en el item completo también selecciona
                $('.empleado-item').on('click', function(e){
                    // Si el clic fue directamente en el radio, no hacer nada extra
                    if ($(e.target).is('input[type="radio"]')) return;
                    
                    const radio = $(this).find('.empleado-radio');
                    radio.prop('checked', true).trigger('change');
                });
                
                // Buscador de empleados para ambos formularios
                $('#buscar_empleado').on('input', function(){
                    const filtro = $(this).val().toLowerCase();
                    $('#lista_empleados .empleado-item').each(function(){
                        const nombre = $(this).data('nombre');
                        $(this).toggle(nombre.indexOf(filtro) !== -1);
                    });
                });
                
                $('#buscar_empleado_hora').on('input', function(){
                    const filtro = $(this).val().toLowerCase();
                    $('#lista_empleados_hora .empleado-item').each(function(){
                        const nombre = $(this).data('nombre');
                        $(this).toggle(nombre.indexOf(filtro) !== -1);
                    });
                });

            } catch (error) {
                console.error('❌ Error al procesar empleados:', error);
                $('#lista_empleados').html('<p class="text-danger text-center">Error al cargar empleados</p>');
                $('#lista_empleados_hora').html('<p class="text-danger text-center">Error al cargar empleados</p>');
            }
        },
        error: function (xhr, status, error) {
            console.error('❌ ERROR AJAX al cargar empleados:', error);
            $('#lista_empleados').html('<p class="text-danger text-center">Error de conexión</p>');
            $('#lista_empleados_hora').html('<p class="text-danger text-center">Error de conexión</p>');
        }
    });
}

function cargarSolicitantes() {
    // Obtener el usuario logueado del sessionStorage y establecerlo como solicitante automáticamente
    try {
        const usuarioData = JSON.parse(sessionStorage.getItem('usuario_principal'));
        if (usuarioData && usuarioData.id) {
            $('#id_solicitante').val(usuarioData.id);
            $('#nombre_solicitante').val(usuarioData.nombre || 'Usuario');
            console.log('✅ Solicitante establecido automáticamente:', usuarioData.nombre, '(ID:', usuarioData.id, ')');
        } else {
            console.error('❌ No se encontró información del usuario logueado');
            Swal.fire({
                icon: 'error',
                title: 'Error de Sesión',
                text: 'No se pudo obtener el usuario logueado. Por favor, inicie sesión nuevamente.'
            }).then(() => {
                window.location.href = 'login.html';
            });
        }
    } catch (error) {
        console.error('❌ Error al obtener usuario logueado:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar información del usuario'
        });
    }
}

function establecerFechaActual() {
    const hoy = new Date();
    const fecha = hoy.toISOString().split('T')[0];
    $('#fecha_trabajado').val(fecha);
    $('#fecha_trabajado_hora').val(fecha);
}

function configurarFormulario() {

    // Prevenir envío automático del formulario
    $('#form_crear_bono_variable').on('submit', function (e) {

        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    // Debug: Verificar si el formulario se está enviando automáticamente
    $('#form_bono, #form_hora_extra').on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    // Manejar clic en el botón Guardar Bono
    $('#btn_guardar_bono').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        guardarBonoVariable('bono');
        return false;
    });
    
    // Manejar clic en el botón Guardar Hora Extra
    $('#btn_guardar_hora').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        guardarBonoVariable('hora_extra');
        return false;
    });

    // Actualizar contador de empleados seleccionados al cargar
    actualizarContadorEmpleados();
    
    // Botón para cambiar el tipo: abre el modal
    $('#btn_cambiar_tipo').on('click', function(){
        mostrarSelectorTipo().then(function(tipo){
            if (tipo) { aplicarTipoSeleccionado(tipo); }
        });
    });
    
    // Configurar eventos para cálculo automático de monto en hora extra
    $('#horas_hora, #tipo_jornada_hora').on('input change', function() {
        calcularMontoHoraExtra();
    });
    
    // También calcular cuando se selecciona un empleado (ya está en cargarEmpleados)
}

function guardarBonoVariable(tipo) {
    console.log('💾 guardarBonoVariable() ejecutada con tipo:', tipo);
    
    // Validar formulario
    if (!validarFormulario(tipo)) {
        return;
    }

    // Mostrar loading
    Swal.fire({
        title: 'Guardando...',
        text: tipo === 'bono' ? 'Creando bono variable...' : 'Creando hora extra...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });

    // Obtener empleado seleccionado desde los radio buttons del formulario correcto
    const empleadosSeleccionados = [];
    const listaSelector = tipo === 'bono' ? '#lista_empleados' : '#lista_empleados_hora';
    const empleadoSeleccionado = $(listaSelector + ' input.empleado-radio:checked').val();
    if (empleadoSeleccionado) {
        empleadosSeleccionados.push(empleadoSeleccionado);
    }

    // Obtener rol del usuario actual para determinar si necesita aprobación
    const rolUsuario = sessionStorage.getItem('rol') || 'operaciones';

    // Obtener datos del formulario según el tipo
    let formData;
    if (tipo === 'bono') {
        formData = {
            quest: 'crear_comision',
            empresa_trabajo: $('#empresa_trabajo').val(),
            area_trabajo: $('#area_trabajo').val(),
            puesto_trabajo: $('#puesto_trabajo').val(),
            fecha_trabajado: $('#fecha_trabajado').val(),
            horas: $('#horas').val(),
            tipo_jornada: $('#tipo_jornada').val(),
            monto: $('#monto').val(),
            'id_empleado[]': empleadosSeleccionados,
            id_solicitante: $('#id_solicitante').val(),
            tarea: $('#tarea').val(),
            tipo_registro: 'bono',
            autorizado_cenas: $('#autorizado_cenas').is(':checked') ? 1 : 0,
            rol_usuario: rolUsuario
        };
    } else {
        // Para hora extra, si el monto está vacío o es 0, enviar 0 para que el servidor lo calcule
        const montoHora = $('#monto_hora').val();
        const montoEnviar = (montoHora && parseFloat(montoHora) > 0) ? montoHora : 0;
        
        formData = {
            quest: 'crear_comision',
            empresa_trabajo: $('#empresa_trabajo_hora').val(),
            fecha_trabajado: $('#fecha_trabajado_hora').val(),
            horas: $('#horas_hora').val(),
            tipo_jornada: $('#tipo_jornada_hora').val(),
            monto: montoEnviar,
            'id_empleado[]': empleadosSeleccionados,
            id_solicitante: $('#id_solicitante').val(),
            tarea: $('#observaciones_hora').val(),
            tipo_registro: 'hora_extra',
            autorizado_cenas: $('#autorizado_cenas_hora').is(':checked') ? 1 : 0,
            area_trabajo: '',
            puesto_trabajo: 'Hora Extra',
            rol_usuario: rolUsuario
        };
    }

    // Enviar datos al servidor

    $.ajax({
        url: 'servidor-bonos.php',
        type: 'POST',
        data: formData,
        dataType: 'json',
        success: function (res) {

            Swal.close();
            
            if (res.error) {

                Swal.fire({
                    icon: 'error',
                    title: 'Error al Guardar',
                    text: tipo === 'bono' ? 'No se pudo crear el bono variable. Revisa los datos e intenta nuevamente.' : 'No se pudo crear la hora extra. Revisa los datos e intenta nuevamente.',
                    confirmButtonText: 'Entendido'
                });
                console.error('Error del servidor:', res.error);
            } else if (res.success) {
                // Verificar si requiere aprobación
                const requiereAprobacion = res.pendiente_aprobacion === true;
                const mensajeAdicional = requiereAprobacion 
                    ? ' Pendiente de aprobación por administrador.'
                    : ' Se ha agregado a la nómina activa.';

                Swal.fire({
                    icon: 'success',
                    title: tipo === 'bono' ? '¡Bono Variable Creado!' : '¡Hora Extra Creada!',
                    text: (tipo === 'bono' ? 'El bono variable se ha creado exitosamente.' : 'La hora extra se ha creado exitosamente.') + mensajeAdicional,
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    // Limpiar formulario
                    limpiarFormulario(tipo);
                    // Opcional: redirigir a la lista de bonos
                    // window.location.href = './seleccion_bonos.html';
                });
            } else {

                Swal.fire({
                    icon: 'warning',
                    title: 'Respuesta Inesperada',
                    text: 'El servidor devolvió una respuesta inesperada.',
                    confirmButtonText: 'Entendido'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('❌ ERROR AJAX al guardar bono:');
            console.error('Status:', status);
            console.error('Error:', error);
            console.error('Response Text:', xhr.responseText);
            console.error('Status Code:', xhr.status);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Intenta nuevamente.',
                confirmButtonText: 'Entendido'
            });
        }
    });
}

function validarFormulario(tipo) {
    let camposRequeridos;
    let prefijo = '';
    let listaEmpleados = '#lista_empleados';
    
    if (tipo === 'bono') {
        camposRequeridos = [
            'empresa_trabajo',
            'area_trabajo',
            'puesto_trabajo',
            'fecha_trabajado',
            'tipo_jornada',
            'monto',
            'id_empleado',
            'tarea'
        ];
        listaEmpleados = '#lista_empleados';
    } else {
        camposRequeridos = [
            'empresa_trabajo_hora',
            'fecha_trabajado_hora',
            'horas_hora',
            'tipo_jornada_hora',
            'id_empleado',
            'observaciones_hora'
        ];
        listaEmpleados = '#lista_empleados_hora';
    }

    for (let campo of camposRequeridos) {
        // Para empleados verificar radio button seleccionado
        if (campo === 'id_empleado') {
            const empleadoSeleccionado = $(listaEmpleados + ' input.empleado-radio:checked').length;
            if (empleadoSeleccionado === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo Requerido',
                    text: 'Debes seleccionar un empleado.',
                    confirmButtonText: 'Entendido'
                });
                return false;
            }
            continue;
        }
        
        const valor = $(`#${campo}`).val();
        if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Requerido',
                text: `El campo ${getNombreCampo(campo)} es obligatorio.`,
                confirmButtonText: 'Entendido'
            });
            $(`#${campo}`).focus();
            return false;
        }
    }

    // Validar que las horas sean positivas (solo para horas extra)
    if (tipo === 'hora_extra') {
        const horas = parseFloat($('#horas_hora').val());
        if (horas <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Horas Inválidas',
                text: 'Las horas trabajadas deben ser mayor a 0.',
                confirmButtonText: 'Entendido'
            });
            $('#horas_hora').focus();
            return false;
        }
    }

    // Validar que el monto sea positivo (solo para bonos, horas extra se calcula automático)
    if (tipo === 'bono') {
        const monto = parseFloat($('#monto').val());
        if (monto <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Monto Inválido',
                text: 'El monto debe ser mayor a 0.',
                confirmButtonText: 'Entendido'
            });
            $('#monto').focus();
            return false;
        }
    }

    return true;
}

function getNombreCampo(campo) {
    const nombres = {
        'empresa_trabajo': 'Empresa de Trabajo',
        'empresa_trabajo_hora': 'Empresa de Trabajo',
        'area_trabajo': 'Área de Trabajo',
        'puesto_trabajo': 'Puesto de Trabajo',
        'fecha_trabajado': 'Fecha Trabajado',
        'fecha_trabajado_hora': 'Fecha Trabajado',
        'horas': 'Horas Trabajadas',
        'horas_hora': 'Horas Trabajadas',
        'tipo_jornada': 'Tipo de Jornada',
        'tipo_jornada_hora': 'Tipo de Jornada',
        'monto': 'Monto',
        'monto_hora': 'Monto',
        'id_empleado': 'Empleado',
        'id_solicitante': 'Solicitante',
        'tarea': 'Descripción de la Tarea',
        'observaciones_hora': 'Observaciones'
    };
    return nombres[campo] || campo;
}

function limpiarFormulario(tipo) {
    if (tipo === 'bono') {
        $('#form_bono')[0].reset();
        $('#lista_empleados input.empleado-radio').prop('checked', false);
        $('#lista_empleados .empleado-item').removeClass('selected');
    } else {
        $('#form_hora_extra')[0].reset();
        $('#lista_empleados_hora input.empleado-radio').prop('checked', false);
        $('#lista_empleados_hora .empleado-item').removeClass('selected');
        $('#monto_hora').val(''); // Limpiar monto calculado
        $('#info_monto_empleados').remove(); // Eliminar info de cálculo
    }
    establecerFechaActual();
    actualizarContadorEmpleados();
}

function cancelar() {
    Swal.fire({
        icon: 'question',
        title: '¿Cancelar?',
        text: '¿Estás seguro de que quieres cancelar? Se perderán los datos ingresados.',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, continuar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
    }).then((result) => {
        if (result.isConfirmed) {
            limpiarFormulario();
            // Opcional: redirigir a la lista de bonos
            // window.location.href = './seleccion_bonos.html';
        }
    });
}

// Actualiza el contador de empleados seleccionados (ahora solo 0 o 1)
function actualizarContadorEmpleados(){
    const countBono = $('#lista_empleados input.empleado-radio:checked').length;
    const countHora = $('#lista_empleados_hora input.empleado-radio:checked').length;
    $('#contador_empleados').text(countBono);
    $('#contador_empleados_hora').text(countHora);
}

// Mostrar modal para seleccionar tipo (Bono | Hora Extra)
function mostrarSelectorTipo() {
    return new Promise(function(resolve){
        var modalEl = document.getElementById('modalTipoRegistro');
        if (!modalEl) { resolve(null); return; }
        var modal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });

        function onSelectClick(e){
            // Buscar el card padre si se hizo clic en elemento hijo
            var card = e.target.closest('[data-select-tipo]');
            if (!card) return;
            const tipo = card.getAttribute('data-select-tipo');
            modal.hide();
            limpiarEventos();
            resolve(tipo);
        }
        function onHidden(){
            limpiarEventos();
            resolve(null);
        }
        function limpiarEventos(){
            modalEl.removeEventListener('hidden.bs.modal', onHidden);
            document.querySelectorAll('[data-select-tipo]').forEach(card => card.removeEventListener('click', onSelectClick));
        }

        document.querySelectorAll('[data-select-tipo]').forEach(card => card.addEventListener('click', onSelectClick));
        modalEl.addEventListener('hidden.bs.modal', onHidden);
        modal.show();
    });
}

// Aplicar elección en la UI y mostrar el formulario correspondiente
function aplicarTipoSeleccionado(tipo){
    const texto = (tipo === 'bono') ? 'Bono' : 'Hora Extra';
    $('#badge_tipo_texto').text(texto);
    $('#badge_tipo_registro').show();
    
    // Mostrar/ocultar formularios según el tipo
    if (tipo === 'bono') {
        $('#formulario_bono').show();
        $('#formulario_hora_extra').hide();
    } else {
        $('#formulario_bono').hide();
        $('#formulario_hora_extra').show();
        // Calcular monto cuando se muestra el formulario de hora extra
        setTimeout(function() {
            calcularMontoHoraExtra();
        }, 100);
    }
}

// Función para calcular el monto automáticamente para horas extra (un solo empleado)
function calcularMontoHoraExtra() {
    // Obtener valores del formulario
    const horas = parseFloat($('#horas_hora').val()) || 0;
    const tipoJornada = parseInt($('#tipo_jornada_hora').val()) || 0;
    
    // Obtener empleado seleccionado (solo uno con radio button)
    const empleadoSeleccionado = $('#lista_empleados_hora input.empleado-radio:checked');
    
    // Limpiar info anterior
    $('#info_monto_empleados').remove();
    
    // Si no hay empleado seleccionado, limpiar el monto
    if (empleadoSeleccionado.length === 0) {
        $('#monto_hora').val('');
        return;
    }
    
    // Si no hay horas o jornada, limpiar
    if (horas <= 0 || tipoJornada === 0) {
        $('#monto_hora').val('');
        return;
    }
    
    // Obtener el sueldo directamente del data attribute del item
    const item = empleadoSeleccionado.closest('.empleado-item');
    const sueldo = parseFloat(item.data('sueldo')) || 0;
    const nombreEmpleado = item.find('label').text().split(' - ')[0].trim();
    
    if (sueldo <= 0) {
        $('#monto_hora').val('');
        return;
    }
    
    // Calcular monto según la fórmula:
    // Valor hora = sueldo / 30 días / 8 horas
    // Factor: Diurna (1) = 1.5x, Nocturna (2) = 2x
    const valorHora = sueldo / 30 / 8;
    const factor = (tipoJornada == 2) ? 2 : 1.5;
    const jornadaTexto = (tipoJornada == 2) ? 'Nocturna (2x)' : 'Diurna (1.5x)';
    const monto = Math.round(valorHora * factor * horas * 100) / 100;
    
    // Mostrar monto calculado
    $('#monto_hora').val(monto.toFixed(2));
    
    // Mostrar info del cálculo
    const infoHtml = `
        <div id="info_monto_empleados" style="margin-top: 8px; font-size: 12px; color: #888; background: #1b2e4b; padding: 8px 12px; border-radius: 4px;">
            <strong style="color: #4361ee;">${nombreEmpleado}</strong><br>
            Sueldo: Q${sueldo.toFixed(2)} | Factor: ${jornadaTexto} | Valor hora: Q${valorHora.toFixed(2)}
        </div>`;
    $('#monto_hora').closest('.form-group').append(infoHtml);
}
