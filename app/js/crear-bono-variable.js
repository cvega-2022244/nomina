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
        // Ir directo al formulario de bonos
        $('#tipo_registro_activo').val('bono');
        cargarDatosIniciales();
        configurarFormulario();
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

function getTipoRegistroActivo() {
    const v = ($('#tipo_registro_activo').val() || 'bono').toString();
    return (v === 'hora_extra') ? 'hora_extra' : 'bono';
}

function cargarDatosIniciales() {

    cargarEmpresas();
    cargarEmpleados();
    cargarSolicitantes();
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
                $('#empresa_trabajo').html(options);

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
                
                if (empleados && empleados.length > 0) {
                    window.listaEmpleadosCompleta = empleados;

                    empleados.forEach(empleado => {
                        let nombreCompleto = `${empleado.primer_nombre} ${empleado.segundo_nombre || ''} ${empleado.primer_apellido} ${empleado.segundo_apellido || ''}`.trim();
                        let empresaNombre = empleado.empresa || 'Sin empresa';
                        let idEmpresa = empleado.id_empresa || '';
                        let sueldo = empleado.sueldo_ordinario || 0;

                        htmlBono += `
                            <div class="empleado-item" data-nombre="${nombreCompleto.toLowerCase()}" data-id-empresa="${idEmpresa}" data-sueldo="${sueldo}" data-id-empleado="${empleado.id}">
                                <input class="empleado-radio" type="radio" name="empleado_registro" value="${empleado.id}" id="emp_reg_${empleado.id}">
                                <label for="emp_reg_${empleado.id}">${nombreCompleto} <span style="color: #888; font-size: 0.85em;">- ${empresaNombre}</span></label>
                            </div>`;
                    });
                } else {
                    htmlBono = '<p class="text-muted text-center">No hay empleados disponibles</p>';
                }

                $('#lista_empleados').html(htmlBono);

                $('#lista_empleados .empleado-radio').on('change', function () {
                    $('#lista_empleados .empleado-item').removeClass('selected');

                    if ($(this).is(':checked')) {
                        const item = $(this).closest('.empleado-item');
                        item.addClass('selected');

                        const idEmpresa = item.data('id-empresa');
                        if (idEmpresa) {
                            $('#empresa_trabajo').val(idEmpresa);
                        }

                        const idEmp = item.data('id-empleado');
                        const emp = window.listaEmpleadosCompleta.find(function (e) {
                            return String(e.id) === String(idEmp);
                        });
                        let puestoTxt = (emp && emp.puesto) ? String(emp.puesto).trim() : '';
                        if (!puestoTxt) {
                            puestoTxt = 'Sin puesto registrado';
                        }
                        $('#puesto_trabajo').val(puestoTxt);
                    }
                    actualizarContadorEmpleados();
                });

                $('#lista_empleados .empleado-item').on('click', function (e) {
                    if ($(e.target).is('input[type="radio"]')) {
                        return;
                    }
                    const radio = $(this).find('.empleado-radio');
                    radio.prop('checked', true).trigger('change');
                });

                $('#buscar_empleado').on('input', function () {
                    const filtro = $(this).val().toLowerCase();
                    $('#lista_empleados .empleado-item').each(function () {
                        const nombre = $(this).data('nombre');
                        $(this).toggle(nombre.indexOf(filtro) !== -1);
                    });
                });

            } catch (error) {
                console.error('❌ Error al procesar empleados:', error);
                $('#lista_empleados').html('<p class="text-danger text-center">Error al cargar empleados</p>');
            }
        },
        error: function (xhr, status, error) {
            console.error('❌ ERROR AJAX al cargar empleados:', error);
                $('#lista_empleados').html('<p class="text-danger text-center">Error de conexión</p>');
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

function nombreMesDesdeFechaStr(fechaStr) {
    if (!fechaStr) {
        return '';
    }
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const partes = fechaStr.split('-');
    if (partes.length !== 3) {
        return '';
    }
    const idx = parseInt(partes[1], 10) - 1;
    if (idx < 0 || idx > 11) {
        return '';
    }
    return meses[idx];
}

function syncMesTrabajoBono() {
    $('#mes_trabajado').val(nombreMesDesdeFechaStr($('#fecha_trabajado').val()));
}

function establecerFechaActual() {
    const hoy = new Date();
    const fecha = hoy.toISOString().split('T')[0];
    $('#fecha_trabajado').val(fecha);
    syncMesTrabajoBono();
}

function configurarFormulario() {

    $('#form_crear_bono_variable').on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    $('#form_registro_unificado').on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    $('#btn_guardar_registro').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        guardarBonoVariable();
        return false;
    });

    actualizarContadorEmpleados();



    $('#fecha_trabajado').off('change.syncMesBono').on('change.syncMesBono', syncMesTrabajoBono);
}

function guardarBonoVariable() {
    const tipo = getTipoRegistroActivo();
    console.log('💾 guardarBonoVariable() tipo:', tipo);

    if (!validarFormulario()) {
        return;
    }

    Swal.fire({
        title: 'Guardando...',
        text: tipo === 'bono' ? 'Creando bono...' : 'Creando hora extra...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });

    const empleadosSeleccionados = [];
    const empleadoSeleccionado = $('#lista_empleados input.empleado-radio:checked').val();
    if (empleadoSeleccionado) {
        empleadosSeleccionados.push(empleadoSeleccionado);
    }

    const rolUsuario = sessionStorage.getItem('rol') || 'operaciones';

    let formData = {
        quest: 'crear_comision',
        empresa_trabajo: $('#empresa_trabajo').val(),
        area_trabajo: 'Bono variable',
        puesto_trabajo: $('#puesto_trabajo').val(),
        fecha_trabajado: $('#fecha_trabajado').val(),
        mes_trabajo: $('#mes_trabajado').val(),
        horas: $('#horas').val() === '' || $('#horas').val() == null ? '0' : $('#horas').val(),
        tipo_hora_dn: $('#tipo_hora_dn').val(),
        tipo_jornada: $('#tipo_jornada').val(),
        unidades_bono: $('#unidades_bono').val() || '1',
        origen_reporte: '',
        monto: $('#monto').val(),
        'id_empleado[]': empleadosSeleccionados,
        id_solicitante: $('#id_solicitante').val(),
        tarea: $('#tarea').val(),
        tipo_registro: 'bono',
        autorizado_cenas: $('#autorizado_cenas').is(':checked') ? 1 : 0,
        rol_usuario: rolUsuario
    };

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
                    text: tipo === 'bono' ? 'No se pudo crear el bono. Revisa los datos e intenta nuevamente.' : 'No se pudo crear la hora extra. Revisa los datos e intenta nuevamente.',
                    confirmButtonText: 'Entendido'
                });
                console.error('Error del servidor:', res.error);
            } else if (res.success) {
                const requiereAprobacion = res.pendiente_aprobacion === true;
                const mensajeAdicional = requiereAprobacion
                    ? ' Pendiente de aprobación por administrador.'
                    : ' Se ha agregado a la nómina activa.';

                Swal.fire({
                    icon: 'success',
                    title: tipo === 'bono' ? '¡Bono creado!' : '¡Hora extra creada!',
                    text: (tipo === 'bono' ? 'El bono se registró correctamente.' : 'La hora extra se registró correctamente.') + mensajeAdicional,
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    limpiarFormulario();
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

function validarFormulario() {
    const listaEmpleados = '#lista_empleados';

    let camposRequeridos = [
        'empresa_trabajo',
        'puesto_trabajo',
        'fecha_trabajado',
        'tipo_jornada',
        'monto',
        'id_empleado',
        'tarea'
    ];

    for (let campo of camposRequeridos) {
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

    const monto = parseFloat($('#monto').val());
    if (monto <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Monto inválido',
            text: 'El monto del bono debe ser mayor a 0.',
            confirmButtonText: 'Entendido'
        });
        $('#monto').focus();
        return false;
    }
    const unidades = parseFloat($('#unidades_bono').val());
    if (!unidades || unidades <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Unidades de bono inválidas',
            text: 'El campo BONO (unidades) debe ser mayor a 0.',
            confirmButtonText: 'Entendido'
        });
        $('#unidades_bono').focus();
        return false;
    }

    return true;
}

function getNombreCampo(campo) {
    const nombres = {
        'empresa_trabajo': 'Empresa de Trabajo',
        'puesto_trabajo': 'Puesto',
        'fecha_trabajado': 'Fecha',
        'horas': 'Horas',
        'tipo_jornada': 'Jornada de trabajo',
        'monto': 'Monto de bono',
        'monto_hora': 'Monto calculado',
        'id_empleado': 'Empleado',
        'id_solicitante': 'Solicitante',
        'tarea': 'Tarea / observaciones',
        'unidades_bono': 'BONO (unidades)',
        'mes_trabajado': 'MES',
        'tipo_hora_dn': 'Tipo de hora (D-N)'
    };
    return nombres[campo] || campo;
}

function limpiarFormulario() {
    $('#form_registro_unificado')[0].reset();
    $('#unidades_bono').val('1');
    $('#lista_empleados input.empleado-radio').prop('checked', false);
    $('#lista_empleados .empleado-item').removeClass('selected');
    $('#puesto_trabajo').val('');
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
        }
    });
}

// Actualiza el contador de empleados seleccionados (ahora solo 0 o 1)
function actualizarContadorEmpleados() {
    const count = $('#lista_empleados input.empleado-radio:checked').length;
    $('#contador_empleados').text(count);
}


