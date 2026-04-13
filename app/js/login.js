function login() {
    return new Promise((resolve) => {
        let usuario = document.getElementById("user_name").value.trim();
        let contrasena = document.getElementById("password").value.trim();
        
        // Validar que los campos no estén vacíos
        if (!usuario || !contrasena) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Requeridos',
                text: 'Por favor, ingresa tu usuario y contraseña'
            });
            resolve(false);
            return;
        }
        
        cargando();
        
        
        $.ajax({
            url: 'php/servidor.php',
            type: 'GET',
            data: {
                quest: 'login',
                usuario: usuario,
                contrasena: contrasena
            },
            success: function (res) {
                try {
                    
                    let data;
                    
                    // Manejar tanto cadenas como objetos JSON
                    if (typeof res === 'string') {
                        // Verificar si contiene errores HTML
                        if (res.trim().startsWith('<') || res.includes('<br') || res.includes('Query Falló')) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error del Servidor',
                                text: 'El servidor devolvió una respuesta HTML en lugar de JSON'
                            });
                            resolve(false);
                            return;
                        }
                        
                        // Parsear JSON desde cadena
                        data = JSON.parse(res);
                    } else if (typeof res === 'object' && res !== null) {
                        // jQuery ya parseó el JSON automáticamente
                        data = res;
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error del Servidor',
                            text: 'El servidor devolvió una respuesta inválida'
                        });
                        resolve(false);
                        return;
                    }
                    
                    if (data.error) {
                        if (data.error === 'credenciales incorrectas') {
                            sessionStorage.setItem('usuario_principal', null);
                            sessionStorage.setItem('rol', '');
                            resolve(false);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: data.error
                            });
                            resolve(false);
                        }
                    } else if (Array.isArray(data) && data.length > 0) {
                        // Login exitoso
                        sessionStorage.setItem('usuario_principal', JSON.stringify(data[0]));
                        // Guardar rol directamente para fácil acceso
                        sessionStorage.setItem('rol', data[0].rol || '');
                        resolve(true);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Respuesta inesperada del servidor'
                        });
                        resolve(false);
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al procesar la respuesta del servidor'
                    });
                    resolve(false);
                }
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar con el servidor'
                });
                resolve(false);
            }
        });
    }).then((res) => {
        try {
            if (res) {
                // Obtener el rol del usuario del sessionStorage
                const userData = JSON.parse(sessionStorage.getItem('usuario_principal'));
                const userRole = userData ? userData.rol : null;
                
                // Redirigir según el nuevo sistema de roles
                if (userRole === 'admin') {
                    // Admin va al dashboard completo
                    window.location.href = 'index.html';
                } else if (userRole === 'operaciones') {
                    // Operaciones va directamente a nómina (bonos y horas extra)
                    window.location.href = 'nomina.html';
                } else if (userRole === 'capturador') {
                    // Capturador va solo a empleados
                    window.location.href = 'empleados.html';
                } else {
                    // Por defecto, ir al dashboard
                    window.location.href = 'index.html';
                }
            } else {
                Swal.fire({
                    title: '¡Acceso Denegado!',
                    text: "Su usuario o contraseña son incorrectos o no existen!",
                    icon: 'warning'
                });
            }
        } catch (error) {
        } finally {
            if (res) {
                Swal.close();
            }
        }
    })

}

function cargando() {
    Swal.fire({
        title: 'Autenticando',
        html: 'Verificando credenciales',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}

$("#user_name").keyup(function (event) {
    if (event.keyCode === 13) {
        login();
    }
});

$("#password").keyup(function (event) {
    if (event.keyCode === 13) {
        login();
    }
});